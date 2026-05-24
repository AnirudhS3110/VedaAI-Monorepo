# VedaAI Backend System — Full Implementation Prompt (Gemini Version)

You are a senior backend engineer building a production-quality backend for an AI-powered Assessment Creator platform.

The backend must be implemented using:

* Node.js
* Express.js
* TypeScript

The architecture should be scalable, modular, clean, and production-oriented.

The system uses:

* MongoDB
* Redis
* BullMQ
* Socket.IO
* Gemini API

The backend must support:

* assignment creation
* AI-based question generation
* realtime websocket updates
* queue-based async processing
* PDF generation
* section regeneration

IMPORTANT:
Do NOT generate AI content synchronously inside API routes.

The architecture MUST use:

* queues
* workers
* realtime events
* structured AI parsing

---

# TECH STACK

Core:

* Node.js
* Express.js
* TypeScript

Database:

* MongoDB with Mongoose

Queue System:

* BullMQ

Redis:

* ioredis

Realtime:

* Socket.IO

Validation:

* Zod

AI:

* Google Gemini API
* @google/generative-ai

PDF:

* Puppeteer

Logging:

* Pino

Environment:

* dotenv

---

# REQUIRED NPM PACKAGES

Runtime Dependencies:

* express
* cors
* dotenv
* mongoose
* zod
* socket.io
* bullmq
* ioredis
* @google/generative-ai
* helmet
* compression
* cookie-parser
* pino
* pino-pretty
* express-async-errors
* puppeteer

Dev Dependencies:

* typescript
* tsx
* nodemon
* @types/node
* @types/express
* @types/cors
* @types/cookie-parser

  everything is installed by the way

---

# HIGH LEVEL ARCHITECTURE

Frontend sends:
POST /api/assignments

Backend:

1. validates request
2. stores assignment in MongoDB
3. creates BullMQ generation job
4. returns assignmentId + jobId

Worker:

1. consumes generation job
2. builds structured Gemini prompt
3. calls Gemini API
4. parses structured JSON
5. validates output using Zod
6. stores generated paper
7. emits websocket updates

Frontend listens for:

* generation_started
* generation_progress
* generation_completed
* generation_failed

---

# PROJECT STRUCTURE

Create the following structure:

src/
│
├── config/
│   ├── db.ts
│   ├── redis.ts
│   └── env.ts
│
├── api/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   └── validators/
│
├── models/
│   ├── assignment.model.ts
│   └── generatedPaper.model.ts
│
├── queues/
│   ├── assessment.queue.ts
│   └── pdf.queue.ts
│
├── workers/
│   ├── assessment.worker.ts
│   └── pdf.worker.ts
│
├── services/
│   ├── ai/
│   │   ├── promptBuilder.ts
│   │   ├── gemini.service.ts
│   │   ├── parser.ts
│   │   └── schema.ts
│   │
│   ├── pdf/
│   │   └── pdf.service.ts
│   │
│   └── websocket/
│       └── socket.service.ts
│
├── types/
│
├── utils/
│
├── app.ts
├── server.ts
└── worker.ts

---

# TYPESCRIPT REQUIREMENTS

Use:

* strict TypeScript
* reusable interfaces
* DTOs
* modular services

Avoid:

* any
* giant files
* business logic inside controllers

---

# EXPRESS SERVER REQUIREMENTS

Configure:

* helmet
* cors
* compression
* JSON middleware
* centralized error handling

Create:
app.ts
server.ts

Socket.IO should integrate cleanly with Express HTTP server.

---

# MONGODB MODELS

# Assignment Model

Fields:

* title
* subject
* dueDate
* questionTypes
* numQuestions
* totalMarks
* instructions
* uploadedContent
* status
* createdAt

Status enum:

* pending
* generating
* completed
* failed

---

# Generated Paper Model

Fields:

* assignmentId
* sections
* createdAt

Each section:
{
title,
instruction,
questions
}

Each question:
{
text,
difficulty,
marks,
type
}

---

# REDIS + BULLMQ

Use Redis for:

* BullMQ backend
* generation state
* progress tracking

Create BullMQ queues:

1. assessment-generation
2. pdf-generation

Worker must run separately from Express server.

---

# SOCKET.IO REQUIREMENTS

Frontend subscribes using assignmentId.

Emit events:

* generation_started
* generation_progress
* generation_completed
* generation_failed

Payload example:
{
assignmentId,
status,
progress,
message
}

Implement reusable websocket service.

---

# API ENDPOINTS

# POST /api/assignments

Creates assignment and queue job.

Validate body using Zod.

Body:
{
title,
subject,
dueDate,
questionTypes,
numQuestions,
totalMarks,
instructions,
uploadedContent
}

Return:
{
assignmentId,
jobId
}

---

# GET /api/assignments/:id

Return:

* assignment
* generated paper
* status

---

# POST /api/assignments/:id/regenerate-section

Input:
{
sectionTitle
}

Only regenerate requested section.

---

# POST /api/assignments/:id/generate-pdf

Creates PDF generation queue job.

---

# GEMINI AI IMPLEMENTATION

Use:
@google/generative-ai

Create:
services/ai/gemini.service.ts

Initialize Gemini model cleanly using environment variables.

Environment variable:
GEMINI_API_KEY=

Use:
gemini-1.5-flash

OR
gemini-1.5-pro

The AI layer MUST:

1. build structured prompts
2. request ONLY JSON output
3. parse safely
4. validate using Zod

Never directly store raw Gemini responses.

---

# PROMPT BUILDER

Create:
services/ai/promptBuilder.ts

Convert assignment input into structured prompt.

Prompt must:

* create sections
* distribute marks
* include difficulty levels
* include question types
* follow instructions

Prompt MUST explicitly say:
"Return ONLY valid JSON."

Expected AI output format:
{
"sections": [
{
"title": "Section A",
"instruction": "Attempt all questions",
"questions": [
{
"text": "What is...",
"difficulty": "easy",
"marks": 2,
"type": "mcq"
}
]
}
]
}

---

# AI RESPONSE PARSER

Create:
services/ai/parser.ts

Requirements:

* safely parse JSON
* remove markdown wrappers if Gemini returns ```json
* validate using Zod
* sanitize malformed outputs
* throw structured errors

---

# ZOD SCHEMAS

Create reusable schemas for:

* assignment validation
* question schema
* section schema
* generated paper schema

---

# WORKER FLOW

Assessment Worker stages:

1. generation_started
2. generating_questions
3. structuring_sections
4. validating_output
5. saving_results
6. generation_completed

Emit websocket updates during every stage.

Update assignment status in MongoDB.

---

# PDF GENERATION

Use Puppeteer.

Generate professional exam-paper-style PDFs.

PDF should include:

* title
* student info section
* sections
* questions
* marks
* difficulty badges

Do NOT generate ugly raw HTML print pages.

PDF generation should happen via BullMQ worker.

---

# ERROR HANDLING

Implement:

* centralized Express error middleware
* async error handling
* structured API responses

Use proper status codes:
400
404
500

---

# LOGGING

Use Pino logger.

Log:

* queue events
* worker lifecycle
* Gemini generation failures
* Redis connection
* Mongo connection

---

# ENVIRONMENT VARIABLES

PORT=
MONGODB_URI=
REDIS_URL=
GEMINI_API_KEY=
CLIENT_URL=

---

# PACKAGE.JSON SCRIPTS

{
"scripts": {
"dev": "tsx watch src/server.ts",
"build": "tsc",
"start": "node dist/server.js",
"worker": "tsx src/worker.ts"
}
}

---

# IMPORTANT IMPLEMENTATION RULES

1. Keep business logic outside controllers

2. Use services for:

* AI
* PDF
* websocket
* queue logic

3. Use async/await everywhere

4. Keep workers independent from API server

5. Validate ALL AI outputs before DB insertion

6. Use reusable utility functions

7. Write scalable and modular code

8. Avoid tight coupling

9. Follow clean architecture principles

10. Code should feel production-grade

---

# FINAL EXPECTATION

The backend should feel like a mini AI generation platform.

The implementation should demonstrate:

* async architecture
* scalable queue processing
* realtime communication
* structured AI orchestration
* clean TypeScript architecture
* production-quality backend engineering

Prioritize:

1. architecture clarity
2. maintainability
3. realtime processing
4. modularity
5. clean AI parsing
6. proper separation of concerns
