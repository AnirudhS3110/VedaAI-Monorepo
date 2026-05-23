# VedaAI Backend — Complete Infrastructure Walkthrough

This document explains **how the current backend actually runs**, with file references and code paths. It is written for a developer who must manually run, debug, deploy, and extend the system.

---

## Table of Contents

1. [Overall Backend Architecture](#1-overall-backend-architecture)
2. [Runtime Architecture](#2-runtime-architecture)
3. [MongoDB Setup](#3-mongodb-setup)
4. [Redis + BullMQ](#4-redis--bullmq)
5. [Worker System](#5-worker-system)
6. [WebSocket Architecture](#6-websocket-architecture)
7. [Gemini AI Flow](#7-gemini-ai-flow)
8. [Full End-to-End Flow (POST /api/assignments)](#8-full-end-to-end-flow-post-apiassignments)
9. [Local Development Setup](#9-local-development-setup)
10. [Deployment Architecture (Railway)](#10-deployment-architecture-railway)
11. [Important Files Breakdown](#11-important-files-breakdown)
12. [Suggested Improvements](#12-suggested-improvements)

---

## 1. Overall Backend Architecture

### 1.1 High-level diagram

```mermaid
flowchart TB
    subgraph Frontend
        FE[React Frontend]
    end

    subgraph API_Process["API Process (npm run dev)"]
        HTTP[Express HTTP Server]
        SIO[Socket.IO Server]
        Q_PROD[BullMQ Queue Producers]
        SUB[Redis Pub/Sub Subscriber]
        HTTP --> SIO
        SUB --> SIO
    end

    subgraph Worker_Process["Worker Process (npm run worker)"]
        AW[Assessment Worker]
        PW[PDF Worker]
        PUB[Redis Pub/Sub Publisher]
        AW --> PUB
    end

    subgraph Data
        MONGO[(MongoDB)]
        REDIS[(Redis)]
        DISK[PDF Files on Disk]
    end

    GEMINI[Google Gemini API]

    FE -->|REST| HTTP
    FE -->|WebSocket| SIO
    HTTP --> Q_PROD
    Q_PROD --> REDIS
    AW --> REDIS
    PW --> REDIS
    AW --> MONGO
    AW --> GEMINI
    PW --> MONGO
    PW --> DISK
    PUB --> REDIS
    REDIS --> SUB
    HTTP --> MONGO
```

### 1.2 Two separate Node.js processes

This backend is **not** a single monolithic process. It deliberately splits:

| Process | Entry file | Command | Responsibility |
|---------|------------|---------|----------------|
| **API server** | `src/server.ts` | `npm run dev` / `npm start` | HTTP routes, Socket.IO, enqueue jobs, subscribe to realtime events |
| **Worker** | `src/worker.ts` | `npm run worker` | Consume BullMQ jobs, call Gemini, write MongoDB, publish WebSocket events |

If you only start the API server, jobs will sit in Redis queues forever. If you only start the worker, there is no HTTP API.

### 1.3 Layered code structure

```
src/
├── config/          # env, MongoDB, Redis connections
├── api/             # routes, controllers, middlewares, validators
├── models/          # Mongoose schemas
├── queues/          # BullMQ queue producers (API-side)
├── workers/         # BullMQ workers (worker-side)
├── services/        # Business logic (AI, PDF, assignment, websocket)
├── types/           # Shared TypeScript types
├── utils/           # logger, validation helpers, infrastructure guards
├── app.ts           # Express app factory
├── server.ts        # API bootstrap
└── worker.ts        # Worker bootstrap
```

**Rule:** Controllers are thin. All business logic lives in `services/`.

### 1.4 Server flow (API process)

Boot sequence in `src/server.ts`:

```63:88:src/server.ts
const bootstrap = async (): Promise<void> => {
  try {
    if (env.ENABLE_MONGODB) {
      logger.info('Connecting to MongoDB...');
      await connectDatabase();
    } else {
      logger.info('MongoDB connection skipped (ENABLE_MONGODB=false)');
    }

    if (env.ENABLE_REDIS) {
      logger.info('Connecting to Redis...');
      await connectRedis();
      initializeQueues();
      subscribeToGenerationEvents((event) => {
        socketService.dispatchGenerationEvent(event);
      });
    } else {
      logger.info('Redis connection skipped (ENABLE_REDIS=false)');
    }

    socketService.initialize(httpServer);
    startHttpServer();
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to initialize application');
    process.exit(1);
  }
};
```

Order matters:

1. Load env (`dotenv` + Zod in `src/config/env.ts`)
2. Create Express app + raw HTTP server
3. Optionally connect MongoDB
4. Optionally connect Redis, initialize BullMQ **queues** (producers only), subscribe to generation pub/sub channel
5. Attach Socket.IO to HTTP server
6. Listen on `PORT`

### 1.5 Worker flow

Boot sequence in `src/worker.ts`:

```33:54:src/worker.ts
const bootstrap = async (): Promise<void> => {
  if (!env.ENABLE_MONGODB) {
    logger.fatal('Worker requires ENABLE_MONGODB=true');
    process.exit(1);
  }

  if (!env.ENABLE_REDIS) {
    logger.fatal('Worker requires ENABLE_REDIS=true');
    process.exit(1);
  }

  try {
    logger.info('Starting worker process...');
    await connectDatabase();
    await connectRedis();
    createAssessmentWorker();
    createPdfWorker();
    logger.info('Worker process running (assessment + PDF)');
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start worker process');
    process.exit(1);
  }
};
```

Workers **require** MongoDB and Redis. The API can start with both disabled (health-only mode).

### 1.6 Queue flow

1. API receives `POST /api/assignments`
2. Assignment saved to MongoDB (`status: pending`)
3. API calls `enqueueAssessmentGeneration(assignmentId)` → job written to Redis via BullMQ
4. API returns `{ assignmentId, jobId }` immediately (**no AI in the request thread**)
5. Assessment worker picks up job from Redis
6. Worker runs `processAssessmentGeneration()` → Gemini → validate → save paper → publish WebSocket events via Redis pub/sub
7. API subscriber receives pub/sub message → forwards to Socket.IO room
8. Frontend polling or `GET /api/assignments/:id` retrieves final data

### 1.7 WebSocket flow (cross-process)

Workers do **not** have a Socket.IO server. They publish events to Redis channel `vedaai:generation-events`. The API process subscribes and calls `socketService.dispatchGenerationEvent()`.

```mermaid
sequenceDiagram
    participant W as Worker
    participant R as Redis Pub/Sub
    participant A as API Server
    participant S as Socket.IO
    participant F as Frontend

    W->>R: PUBLISH vedaai:generation-events
    R->>A: message received
    A->>S: io.to(room).emit(event, payload)
    S->>F: generation_progress / completed / failed
```

### 1.8 AI generation lifecycle

| Stage | Assignment `status` | WebSocket event | Progress |
|-------|---------------------|-----------------|----------|
| Job queued | `pending` | — | — |
| Worker starts | `generating` | `generation_started` | 0 |
| Calling Gemini | `generating` | `generation_progress` | 20 |
| After Gemini returns | `generating` | `generation_progress` | 50, 75 |
| Saving to DB | `generating` | `generation_progress` | 90 |
| Success | `completed` | `generation_completed` | 100 |
| Failure | `failed` | `generation_failed` | 0 |

---

## 2. Runtime Architecture

### 2.1 `npm run dev`

From `package.json`:

```json
"dev": "tsx watch src/server.ts"
```

This runs **only** the API process:

- `tsx watch` recompiles/restarts on file changes
- Executes `src/server.ts`
- Stays alive listening on `PORT` (default `3000`)
- Does **not** start BullMQ workers

### 2.2 `npm run worker`

```json
"worker": "tsx src/worker.ts"
```

This runs **only** the worker process:

- Connects MongoDB + Redis
- Registers BullMQ `Worker` instances for `assessment-generation` and `pdf-generation`
- Workers poll Redis continuously (blocking Redis commands managed by BullMQ)
- Stays alive until `SIGINT` / `SIGTERM`

### 2.3 `npm run build` + `npm start`

- `build` → `tsc` compiles `src/` → `dist/`
- `start` → `node dist/server.js` (production API, no watch)

There is no compiled worker script in `package.json` for production; you would run `node dist/worker.js` after adding it or use `tsx src/worker.ts` on Railway as a second service.

### 2.4 Which services are API-only, worker-only, or shared

| Component | API | Worker | Notes |
|-----------|-----|--------|-------|
| Express HTTP | ✓ | ✗ | `src/app.ts`, `src/server.ts` |
| Socket.IO server | ✓ | ✗ | Attached to HTTP server |
| Redis pub/sub **subscriber** | ✓ | ✗ | `generation.subscriber.ts` |
| Redis pub/sub **publisher** | ✗ | ✓ | `generation.publisher.ts` |
| BullMQ **Queue** (producer) | ✓ | ✗ | `assessment.queue.ts`, `pdf.queue.ts` |
| BullMQ **Worker** (consumer) | ✗ | ✓ | `assessment.worker.ts`, `pdf.worker.ts` |
| Mongoose models | ✓ | ✓ | Both read/write MongoDB |
| Gemini service | ✗ | ✓ | Only called from worker/generation services |
| Puppeteer PDF | ✗ | ✓ | PDF worker only |
| Assignment create API | ✓ | ✗ | Enqueues only |

### 2.5 How BullMQ workers stay alive

A `Worker` instance from BullMQ opens persistent Redis connections and internally loops:

1. Wait for jobs in queue (Redis sorted sets / lists)
2. Claim job (atomic Redis operation)
3. Run handler function
4. Mark completed or failed
5. Repeat

The Node event loop stays active because BullMQ maintains open Redis connections and timers. You do not write your own `while(true)` loop.

Assessment worker concurrency: **2** (two jobs can run in parallel).

PDF worker concurrency: **1** (Puppeteer is heavy).

---

## 3. MongoDB Setup

### 3.1 Connection

File: `src/config/db.ts`

- Uses Mongoose `mongoose.connect(env.MONGODB_URI)`
- `serverSelectionTimeoutMS: 5000` — fails fast if MongoDB is down
- Connection is a **singleton** per process (default Mongoose connection pool)

### 3.2 Collections (actual MongoDB collection names)

Mongoose model names map to collections automatically:

| Mongoose Model | MongoDB Collection | File |
|----------------|-------------------|------|
| `Assignment` | **`assignments`** | `src/models/assignment.model.ts` |
| `GeneratedPaper` | **`generatedpapers`** | `src/models/generatedPaper.model.ts` |

You do **not** need to manually create collections. MongoDB creates them on first `insert`.

Database name comes from the URI path, e.g. `mongodb://127.0.0.1:27017/vedaai` → database `vedaai`.

### 3.3 Assignment schema

```25:86:src/models/assignment.model.ts
const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    questionTypes: {
      type: [String],
      enum: QUESTION_TYPES,
      required: true,
      // ...
    },
    numQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    instructions: { type: String, default: '', trim: true },
    uploadedContent: { type: String, default: '' },
    status: {
      type: String,
      enum: ASSIGNMENT_STATUSES,
      default: 'pending',
    },
  },
  { timestamps: true, versionKey: false },
);

assignmentSchema.index({ status: 1, createdAt: -1 });
```

**Status enum:** `pending` | `generating` | `completed` | `failed`

**Index:** compound on `status` + `createdAt` (descending) for listing/filtering.

### 3.4 GeneratedPaper schema

```68:96:src/models/generatedPaper.model.ts
const generatedPaperSchema = new Schema<IGeneratedPaper>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      unique: true,  // ONE paper per assignment
    },
    sections: { type: [sectionSchema], required: true },
  },
  { timestamps: true, versionKey: false },
);

generatedPaperSchema.index({ assignmentId: 1 });
```

**Relationship:** `GeneratedPaper.assignmentId` → `Assignment._id` (1:1).

Nested subdocuments (no `_id` on sections/questions):

- Section: `title`, `instruction`, `questions[]`
- Question: `text`, `difficulty`, `marks`, `type`

### 3.5 Sample documents

**Assignment (after POST /api/assignments):**

```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0d",
  "title": "Midterm Physics",
  "subject": "Physics",
  "dueDate": "2026-06-15T00:00:00.000Z",
  "questionTypes": ["mcq", "short"],
  "numQuestions": 10,
  "totalMarks": 50,
  "instructions": "No calculators allowed",
  "uploadedContent": "Chapter 4-6 notes...",
  "status": "pending",
  "createdAt": "2026-05-22T10:00:00.000Z",
  "updatedAt": "2026-05-22T10:00:00.000Z"
}
```

**GeneratedPaper (after worker completes):**

```json
{
  "_id": "665f1a2b3c4d5e6f7a8b9c0e",
  "assignmentId": "665f1a2b3c4d5e6f7a8b9c0d",
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "text": "Define velocity.",
          "difficulty": "easy",
          "marks": 2,
          "type": "short"
        }
      ]
    }
  ],
  "createdAt": "2026-05-22T10:01:30.000Z",
  "updatedAt": "2026-05-22T10:01:30.000Z"
}
```

### 3.6 Document updates during generation

| Step | Collection | Update |
|------|------------|--------|
| POST /api/assignments | `assignments` | `insert`, `status: pending` |
| Worker starts | `assignments` | `status → generating` |
| Worker succeeds | `generatedpapers` | `upsert` sections |
| Worker succeeds | `assignments` | `status → completed` |
| Worker fails | `assignments` | `status → failed` |
| Regenerate section | `generatedpapers` | replace one section in array, `save()` |
| POST generate-pdf | (no DB change) | job enqueued only |
| PDF worker done | filesystem | writes `./storage/pdfs/{assignmentId}.pdf` |

### 3.7 Model initialization

Models are registered when first imported:

```typescript
export const Assignment = model<IAssignment>('Assignment', assignmentSchema);
```

No separate "init" step. Importing `assignment.model.ts` registers the model on the default Mongoose connection (after `connectDatabase()`).

---

## 4. Redis + BullMQ

### 4.1 Redis connection (application)

File: `src/config/redis.ts`

- Single `ioredis` client stored in module-level `redisClient`
- `maxRetriesPerRequest: null` — **required** for BullMQ compatibility
- `connectRedis()` pings Redis before marking ready
- `getRedisClient()` throws if not connected

**Note:** BullMQ queues/workers use **separate** connection config via `getQueueConnection()` in `src/queues/queue.config.ts` (parsed from `REDIS_URL`). The app also has its own `redisClient` for health checks. The pub/sub publisher/subscriber create **additional** Redis connections.

### 4.2 Where queues are initialized

File: `src/queues/index.ts` — called from API `server.ts` when `ENABLE_REDIS=true`:

```typescript
export const initializeQueues = (): void => {
  getAssessmentQueue();
  getPdfQueue();
};
```

Lazy singleton pattern in `assessment.queue.ts` / `pdf.queue.ts` — first call creates the `Queue` instance.

### 4.3 Queue names and job structure

File: `src/types/queue.types.ts`

| Queue name (Redis key prefix) | Job name | Payload |
|------------------------------|----------|---------|
| `assessment-generation` | `generate` | `{ assignmentId: string }` |
| `pdf-generation` | `generate-pdf` | `{ assignmentId: string }` |

### 4.4 How jobs are added

```58:80:src/queues/assessment.queue.ts
export const enqueueAssessmentGeneration = async (
  assignmentId: string,
): Promise<string> => {
  const queue = getAssessmentQueue();

  const job = await queue.add(
    'generate',
    { assignmentId },
    {
      jobId: `assessment-${assignmentId}`,
    },
  );
  // ...
  return job.id;
};
```

**Dedup behavior:** Fixed `jobId: assessment-{assignmentId}` means BullMQ will reject duplicate enqueue for the same assignment ID while an old job id still exists.

PDF jobs use timestamp suffix: `pdf-{assignmentId}-{timestamp}` — allows multiple PDF generations.

### 4.5 Default job options (retries)

```20:32:src/queues/queue.config.ts
export const DEFAULT_JOB_OPTIONS: JobsOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2_000 },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 200 },
};
```

- **3 attempts** with exponential backoff starting at 2s
- Keeps last 100 completed / 200 failed job records in Redis

### 4.6 How jobs are consumed

```26:44:src/workers/assessment.worker.ts
assessmentWorker = new Worker(
  QUEUE_NAMES.ASSESSMENT_GENERATION,
  async (job) => {
    const { assignmentId } = job.data;
    await processAssessmentGeneration(assignmentId);
  },
  {
    connection: getQueueConnection(),
    concurrency: 2,
  },
);
```

Worker events logged: `ready`, `active`, `completed`, `failed`, `error`.

### 4.7 How Redis stores BullMQ state (internal)

BullMQ uses Redis keys such as (simplified):

- `{prefix}:wait` — jobs waiting
- `{prefix}:active` — jobs being processed
- `{prefix}:completed` / `{prefix}:failed` — job history
- `{prefix}:{jobId}` — job data hash

You normally **do not** manipulate these keys manually. Use BullMQ APIs or Redis CLI for inspection.

### 4.8 Progress updates

BullMQ **job progress** is not used in this project. Progress shown to the frontend comes from **custom WebSocket events** (`generation_progress` with `progress: 20 | 50 | 75 | 90`), not from `job.updateProgress()`.

---

## 5. Worker System

### 5.1 `src/worker.ts` responsibilities

- Validates `ENABLE_MONGODB` and `ENABLE_REDIS` are true
- Connects infrastructure
- Starts both workers
- Handles graceful shutdown (close workers → close publisher → disconnect DB/Redis)

### 5.2 Assessment worker

- File: `src/workers/assessment.worker.ts`
- Queue: `assessment-generation`
- Handler: `processAssessmentGeneration(assignmentId)` in `src/services/generation/assessmentGeneration.service.ts`
- Concurrency: 2

### 5.3 PDF worker

- File: `src/workers/pdf.worker.ts`
- Queue: `pdf-generation`
- Handler: `processPdfGeneration(assignmentId)` in `src/services/pdf/pdfGeneration.service.ts`
- Concurrency: 1
- Output: `{PDF_OUTPUT_DIR}/{assignmentId}.pdf`

### 5.4 Failure handling

1. **Inside `processAssessmentGeneration`:** catch → set assignment `failed` → emit `generation_failed` → rethrow
2. **BullMQ:** marks job failed, retries up to 3 attempts
3. **Worker `failed` event:** logs error with job id

If Gemini fails on attempt 1, user may see `failed` websocket event, then worker retries (assignment may flip status again).

### 5.5 Worker lifecycle diagram

```mermaid
stateDiagram-v2
    [*] --> Ready: Worker created
    Ready --> Active: Job dequeued
    Active --> Completed: Handler succeeds
    Active --> Failed: Handler throws
    Failed --> Active: Retry (attempts < 3)
    Failed --> [*]: Max attempts reached
    Completed --> Ready: Wait for next job
```

---

## 6. WebSocket Architecture

### 6.1 Socket.IO initialization

File: `src/services/websocket/socket.service.ts`

Attached to the **same** HTTP server as Express:

```29:47:src/services/websocket/socket.service.ts
initialize(httpServer: HttpServer): void {
  this.io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  this.io.on('connection', (socket: Socket) => {
    this.registerAssignmentHandlers(socket);
  });
}
```

Called from `server.ts` **after** Redis subscriber is set up, **before** `listen()`.

### 6.2 Frontend subscription

**Client → Server events:**

| Event name | Payload | Action |
|------------|---------|--------|
| `subscribe:assignment` | `{ assignmentId: string }` | Join room `assignment:{assignmentId}` |
| `unsubscribe:assignment` | `{ assignmentId: string }` | Leave room |

Room naming:

```23:24:src/services/websocket/socket.service.ts
export const getAssignmentRoom = (assignmentId: string): string =>
  `assignment:${assignmentId}`;
```

### 6.3 Server → Client events

File: `src/types/websocket.types.ts`

| Event | When emitted |
|-------|----------------|
| `generation_started` | Worker begins processing |
| `generation_progress` | Stage updates (20, 50, 75, 90) |
| `generation_completed` | Paper saved successfully |
| `generation_failed` | Error during generation |

**Payload structure (all events):**

```typescript
{
  assignmentId: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  progress: number;   // 0-100
  message: string;    // human-readable stage message
}
```

### 6.4 Cross-process emission path

Worker never calls `socketService` directly.

1. `generationEvents.service.ts` → `publishGenerationEvent()`
2. Redis channel `vedaai:generation-events`
3. API `subscribeToGenerationEvents()` → `socketService.dispatchGenerationEvent()`
4. `io.to('assignment:{id}').emit(eventName, payload)`

---

## 7. Gemini AI Flow

### 7.1 Initialization

File: `src/services/ai/gemini.service.ts`

- Singleton `GoogleGenerativeAI` client created on first use
- Requires `GEMINI_API_KEY` in environment
- Model from `GEMINI_MODEL` (default `gemini-1.5-flash`)

### 7.2 Generation config

```48:54:src/services/ai/gemini.service.ts
const model = client.getGenerativeModel({
  model: env.GEMINI_MODEL,
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.7,
  },
});
```

`responseMimeType: 'application/json'` asks Gemini to return JSON (still validated — never trusted blindly).

### 7.3 Prompt builder

File: `src/services/ai/promptBuilder.ts`

- `buildAssessmentPrompt(assignment)` — full paper
- `buildRegenerateSectionPrompt(assignment, sectionTitle, existingSections)` — single section

Both end with: **"Return ONLY valid JSON."**

### 7.4 Parser + validation

File: `src/services/ai/parser.ts`

Pipeline:

1. `stripMarkdownJson()` — removes ` ```json ` fences if present
2. `JSON.parse()` — with fallback extracting `{...}` substring
3. Zod validation:
   - Full paper → `generatedPaperOutputSchema` (`src/api/validators/schemas/generatedPaper.schema.ts`)
   - Section → `regeneratedSectionOutputSchema` (`sectionOutput.schema.ts`)

**Raw Gemini text is never written to MongoDB.** Only `validation.data` after Zod passes.

### 7.5 Error types

File: `src/services/ai/errors.ts`

- `AiGenerationError` — API failures, missing API key, empty response
- `AiParseError` — JSON parse failure or Zod validation failure

---

## 8. Full End-to-End Flow (POST /api/assignments)

### Step-by-step lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Express API
    participant M as MongoDB
    participant Q as BullMQ Queue
    participant R as Redis
    participant W as Assessment Worker
    participant G as Gemini
    participant P as Redis Pub/Sub
    participant SIO as Socket.IO

    C->>API: POST /api/assignments
    API->>API: Zod validate body
    API->>M: Insert assignment (pending)
    API->>Q: enqueueAssessmentGeneration
    Q->>R: Store job
    API-->>C: 201 { assignmentId, jobId }

    W->>R: Poll & claim job
    W->>M: status → generating
    W->>P: generation_started
    P->>SIO: dispatch event
    SIO-->>C: WebSocket event

    W->>G: generateContent(prompt)
    G-->>W: JSON text
    W->>W: parse + Zod validate
    W->>M: upsert GeneratedPaper
    W->>M: status → completed
    W->>P: generation_completed
    P->>SIO: dispatch event
    SIO-->>C: WebSocket event

    C->>API: GET /api/assignments/:id
    API->>M: fetch assignment + paper
    API-->>C: 200 { assignment, generatedPaper, status }
```

### Detailed step list

| # | Location | Action |
|---|----------|--------|
| 1 | `assignment.routes.ts` | Route `POST /` → `validateCreateAssignment` middleware |
| 2 | `validate.ts` | Zod parses body → `req.validated.body` |
| 3 | `assignment.controller.ts` | `createAssignmentHandler` |
| 4 | `assignment.service.ts` | `assertMongoAvailable()`, `assertRedisAvailable()` |
| 5 | `assignment.service.ts` | `Assignment.create({... status: 'pending'})` |
| 6 | `assessment.queue.ts` | `queue.add('generate', { assignmentId })` |
| 7 | On enqueue failure | Delete assignment (rollback) |
| 8 | Response | `{ assignmentId, jobId }` HTTP 201 |
| 9 | `assessment.worker.ts` | Worker picks job |
| 10 | `assessmentGeneration.service.ts` | `status → generating`, emit started |
| 11 | `gemini.service.ts` | `generateValidatedPaper()` |
| 12 | `parser.ts` | Validate JSON structure |
| 13 | `assessmentGeneration.service.ts` | `GeneratedPaper.findOneAndUpdate` upsert |
| 14 | `assessmentGeneration.service.ts` | `status → completed`, emit completed |
| 15 | `generation.publisher.ts` | Redis PUBLISH |
| 16 | `server.ts` subscriber | `socketService.dispatchGenerationEvent` |
| 17 | Frontend | `GET /api/assignments/:id` for full data |

---

## 9. Local Development Setup

### 9.1 Required services

| Service | Default port | Purpose |
|---------|--------------|---------|
| MongoDB | `27017` | Document storage |
| Redis | `6379` | BullMQ + pub/sub |
| API server | `3000` | HTTP + WebSocket |
| Worker | — | Background jobs |

### 9.2 Docker commands (example)

```bash
docker run -d --name vedaai-mongo -p 27017:27017 mongo:7
docker run -d --name vedaai-redis -p 6379:6379 redis:7-alpine
```

### 9.3 Environment variables

Copy `.env.example` → `.env`:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/vedaai
REDIS_URL=redis://127.0.0.1:6379
ENABLE_MONGODB=true
ENABLE_REDIS=true
GEMINI_API_KEY=your_actual_key
GEMINI_MODEL=gemini-1.5-flash
CLIENT_URL=http://localhost:5173
PDF_OUTPUT_DIR=./storage/pdfs
```

**Critical:** With `ENABLE_MONGODB=false` or `ENABLE_REDIS=false`, assignment creation returns **503**.

### 9.4 Startup order

1. Start MongoDB
2. Start Redis
3. Configure `.env`
4. Terminal 1: `npm run dev` (API)
5. Terminal 2: `npm run worker` (workers)

### 9.5 Verification checklist

| Check | Command / URL |
|-------|----------------|
| API health | `GET http://localhost:3000/api/health` |
| Mongo connected | health response `services.mongodb.connected: true` |
| Redis connected | health response `services.redis.connected: true` |
| Worker logs | "Assessment worker ready", "PDF worker ready" |
| Create assignment | `POST http://localhost:3000/api/assignments` |
| Worker processes | Logs "Processing assessment generation job" |
| WebSocket | Connect, emit `subscribe:assignment` |

### 9.6 Inspect MongoDB

```bash
mongosh "mongodb://127.0.0.1:27017/vedaai"
db.assignments.find().pretty()
db.generatedpapers.find().pretty()
```

### 9.7 Inspect Redis / BullMQ

```bash
redis-cli
KEYS bull:assessment-generation:*
KEYS bull:pdf-generation:*
```

Or use [Bull Board](https://github.com/felixmosh/bull-board) (not included — suggested improvement).

### 9.8 Debug workers

- Run worker in foreground: `npm run worker`
- Watch for `Assessment job active` / `failed` logs
- If jobs stuck: Redis running? Worker running? `ENABLE_REDIS=true`?
- Gemini errors: check `GEMINI_API_KEY`, model name, API quota

---

## 10. Deployment Architecture (Railway)

### 10.1 Recommended: three services

| Railway Service | Start command | Notes |
|-----------------|---------------|-------|
| **vedaai-api** | `npm run build && npm start` | Public HTTP + WebSocket |
| **vedaai-worker** | `npm run build && node dist/worker.js` | Add worker to build output; no HTTP port needed |
| **Redis** | Railway Redis plugin | BullMQ + pub/sub |
| **MongoDB** | MongoDB Atlas (external) | Set `MONGODB_URI` |

### 10.2 Why separate API and worker

- API scales with HTTP traffic
- Workers scale with queue depth (CPU-heavy: Gemini + Puppeteer)
- A crashed PDF job does not take down the API
- Railway can scale instances independently

### 10.3 Environment variables (production)

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vedaai
REDIS_URL=redis://default:pass@redis.railway.internal:6379
ENABLE_MONGODB=true
ENABLE_REDIS=true
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-flash
CLIENT_URL=https://your-frontend.railway.app
PDF_OUTPUT_DIR=/tmp/pdfs
```

**PDF storage:** Local disk on Railway is ephemeral. For production, upload PDFs to S3/R2 and store URLs in MongoDB (not implemented yet).

### 10.4 WebSocket on Railway

- Ensure WebSocket support is enabled on the public domain
- `CLIENT_URL` must match the frontend origin for CORS
- Frontend connects to same API host: `wss://vedaai-api.up.railway.app`

### 10.5 MongoDB Atlas

- Whitelist Railway IP or use `0.0.0.0/0` for development
- Connection string in `MONGODB_URI`
- Collections auto-create on first write

---

## 11. Important Files Breakdown

### 11.1 `src/app.ts`

- **Role:** Express middleware stack + route mounting
- **Initializes:** Nothing persistent — pure factory `createApp()`
- **Dependencies:** `env`, `apiRouter`, error middleware
- **Does not:** Connect DB, Redis, or Socket.IO

### 11.2 `src/server.ts`

- **Role:** API process entry point
- **Initializes:** HTTP server, MongoDB, Redis, queues, pub/sub subscriber, Socket.IO, listen
- **Dependencies:** `app.ts`, all config modules, `socketService`, `queues/index`

### 11.3 `src/worker.ts`

- **Role:** Worker process entry point
- **Initializes:** MongoDB, Redis, assessment + PDF workers
- **Dependencies:** `workers/assessment.worker`, `workers/pdf.worker`, `generation.publisher`
- **Does not:** Start HTTP or Socket.IO server

### 11.4 `src/config/redis.ts`

- **Role:** Application-level Redis singleton (`getRedisClient`)
- **Used by:** Health check, queue availability guards
- **Note:** BullMQ uses separate connections from `queue.config.ts`

### 11.5 `src/config/db.ts`

- **Role:** Mongoose connect/disconnect/health
- **Used by:** API (optional), Worker (required)

### 11.6 `src/config/env.ts`

- **Role:** Zod-validated environment variables
- **Exits process** on invalid env at import time

### 11.7 `src/queues/assessment.queue.ts`

- **Role:** Producer for assessment jobs
- **Initializes:** BullMQ `Queue` singleton
- **Called from:** `assignment.service.ts` on create

### 11.8 `src/workers/assessment.worker.ts`

- **Role:** Consumer for assessment jobs
- **Runs in:** Worker process only
- **Calls:** `processAssessmentGeneration()`

### 11.9 `src/services/ai/gemini.service.ts`

- **Role:** Gemini API + orchestration of prompt → parse → validate
- **Never persists raw responses**

### 11.10 `src/services/websocket/socket.service.ts`

- **Role:** Socket.IO server, room management, direct emit helpers
- **API only** — workers use pub/sub instead

### 11.11 `src/services/generation/assessmentGeneration.service.ts`

- **Role:** Core generation orchestration (status updates + AI + DB + events)

### 11.12 `src/services/assignment/assignment.service.ts`

- **Role:** All assignment business logic (CRUD, enqueue, PDF request, section regen)

### 11.13 `src/api/routes/assignment.routes.ts`

| Method | Path | Handler |
|--------|------|---------|
| POST | `/` | createAssignment |
| GET | `/:id` | getAssignment |
| POST | `/:id/regenerate-section` | regenerateSection |
| POST | `/:id/generate-pdf` | enqueue PDF |
| GET | `/:id/pdf` | download PDF file |

### 11.14 Complete `src/` tree (reference)

```
src/
├── api/
│   ├── controllers/
│   │   ├── assignment.controller.ts
│   │   └── health.controller.ts
│   ├── middlewares/
│   │   ├── asyncHandler.ts
│   │   ├── errorHandler.ts
│   │   ├── notFound.ts
│   │   └── validate.ts
│   ├── routes/
│   │   ├── assignment.routes.ts
│   │   ├── health.routes.ts
│   │   └── index.ts
│   └── validators/
│       ├── assignment.validator.ts
│       ├── schemas/
│       └── index.ts
├── config/
│   ├── db.ts
│   ├── env.ts
│   └── redis.ts
├── models/
│   ├── assignment.model.ts
│   ├── generatedPaper.model.ts
│   └── index.ts
├── queues/
│   ├── assessment.queue.ts
│   ├── pdf.queue.ts
│   ├── queue.config.ts
│   ├── queue.events.ts
│   └── index.ts
├── services/
│   ├── ai/
│   ├── assignment/
│   ├── generation/
│   ├── pdf/
│   └── websocket/
├── types/
├── utils/
├── workers/
│   ├── assessment.worker.ts
│   └── pdf.worker.ts
├── app.ts
├── server.ts
└── worker.ts
```

---

## 12. Suggested Improvements

### 12.1 Production gaps (weak areas)

| Area | Current state | Risk |
|------|---------------|------|
| PDF storage | Local filesystem | Lost on Railway redeploy |
| Bull Board / queue UI | Not included | Harder to debug stuck jobs |
| Rate limiting | None | API abuse possible |
| Auth | None | Anyone can call APIs |
| Idempotency | Partial (`jobId` dedup on assessment only) | Edge cases on retry |
| Gemini cost control | None | Runaway token usage |
| Worker crash recovery | BullMQ retries only | Long failures leave assignment `failed` |
| Separate pub/sub connections | 3+ Redis connections per system | Connection overhead at scale |
| `npm run build` | No `dist/worker.js` script in package.json | Manual worker deploy command |
| Section regeneration | Synchronous in API | Long request timeout risk |

### 12.2 Recommended production improvements

1. **Object storage for PDFs** (S3/R2) + `pdfUrl` field on assignment
2. **Authentication** (JWT/session) on all assignment routes
3. **Bull Board** mounted on admin route for queue visibility
4. **Socket.IO Redis adapter** instead of custom pub/sub (cleaner multi-instance API scaling)
5. **Structured job progress** via `job.updateProgress()` + map to websocket
6. **Dead letter queue** for jobs failing 3 times
7. **Health check worker** heartbeat in Redis
8. **Integration tests** for full POST → worker → GET flow
9. **Add `"worker:prod": "node dist/worker.js"`** to package.json

### 12.3 Architectural tradeoffs

| Decision | Benefit | Cost |
|----------|---------|------|
| Separate API + worker processes | True async, scalable | Two deployables to manage |
| Redis pub/sub for websockets | Workers don't need HTTP | Extra Redis connections, custom protocol |
| Zod validation on AI output | Never stores malformed AI data | Extra latency, may fail on creative outputs |
| Skip DB/Redis flags | Easy local dev without Docker | Easy to misconfigure |
| Sync section regeneration | Simpler code | Blocks API request thread |
| Puppeteer in worker | Non-blocking API | Heavy worker memory |

### 12.4 Simplified for assignment scope

- No user accounts / multi-tenancy
- No versioning of generated papers
- No job cancellation API
- No webhook callbacks (WebSocket only)
- No caching layer
- No OpenAI fallback (Gemini only)
- PDF styling is static HTML template (not configurable templates)

---

## Quick Reference — Environment Flags

| Variable | Default | Effect when `false` |
|----------|---------|---------------------|
| `ENABLE_MONGODB` | `false` | API skips Mongo; assignment routes return 503 |
| `ENABLE_REDIS` | `false` | API skips Redis/queues; create assignment returns 503 |
| Worker | N/A | Always requires both `true` |

For full functionality locally, **both must be `true`**, plus valid `GEMINI_API_KEY`.

---

## Quick Reference — All API Endpoints

```
GET    /api/health
POST   /api/assignments
GET    /api/assignments/:id
POST   /api/assignments/:id/regenerate-section   { sectionTitle }
POST   /api/assignments/:id/generate-pdf
GET    /api/assignments/:id/pdf
GET    /health  → redirects to /api/health
```

---

*Document generated from the implemented codebase. Last aligned with phases 1–13 of the VedaAI backend build.*
