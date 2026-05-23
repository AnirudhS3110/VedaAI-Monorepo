# VedaAI Backend

AI-powered assessment creator API with async job processing and realtime updates.

## Stack

- Node.js, Express, TypeScript
- MongoDB, Redis, BullMQ
- Socket.IO, Google Gemini, Puppeteer

## Setup

1. Copy environment file:

```bash
cp .env.example .env
```

2. Configure `.env`:

```env
ENABLE_MONGODB=true
ENABLE_REDIS=true
GEMINI_API_KEY=your_key
```

3. Start dependencies (MongoDB + Redis).

4. Run API and worker in separate terminals:

```bash
npm run dev
npm run worker
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/assignments` | Create assignment + enqueue generation |
| GET | `/api/assignments/:id` | Get assignment + generated paper |
| POST | `/api/assignments/:id/regenerate-section` | Regenerate one section |
| POST | `/api/assignments/:id/generate-pdf` | Enqueue PDF generation |
| GET | `/api/assignments/:id/pdf` | Download generated PDF |

## WebSocket Events

Subscribe: `subscribe:assignment` with `{ assignmentId }`

Events: `generation_started`, `generation_progress`, `generation_completed`, `generation_failed`

## Scripts

- `npm run dev` — API server with hot reload
- `npm run worker` — Background job processor
- `npm run build` — Compile TypeScript
- `npm start` — Run compiled API
