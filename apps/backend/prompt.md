I want a complete infrastructure walkthrough of the current backend implementation.

Do NOT give a high-level summary only.

I need detailed explanations so I can fully understand:

* how the backend is running
* how queues/workers are configured
* how MongoDB is structured
* how Redis/BullMQ works in this project
* how WebSockets are connected
* how data flows end-to-end

Assume I am the developer who now needs to manually run, debug, deploy, and extend this backend.

Please explain EVERYTHING clearly with file references and code references where relevant.

---

# Explain These In Detail

## 1. Overall Backend Architecture

Explain:

* server flow
* worker flow
* queue flow
* websocket flow
* AI generation lifecycle

Show:

* how request moves through the system
* how queues interact with workers
* how websocket updates are emitted

---

## 2. Runtime Architecture

Explain:

* what runs in `npm run dev`
* what runs in `npm run worker`
* which processes stay alive
* how BullMQ workers listen continuously
* how Redis is involved

Explain which services are:

* API-only
* worker-only
* shared

---

## 3. MongoDB Setup

Explain:

* all MongoDB collections
* schemas
* indexes
* relationships
* how Mongoose models are initialized

Show:

* actual collection names
* sample stored documents
* how documents are updated during generation

Explain:

* whether collections auto-create
* whether manual creation is needed
* how MongoDB behaves when first assignment is created

---

## 4. Redis + BullMQ

Explain:

* how Redis is connected
* where BullMQ queues are initialized
* queue names
* job payload structure
* worker registration flow

Show:

* how jobs are added
* how jobs are consumed
* how retries/errors work
* how progress updates work

Explain:

* how Redis stores BullMQ state internally

---

## 5. Worker System

Explain:

* how worker.ts works
* how assessment worker is registered
* how PDF worker is registered
* whether workers run concurrently
* how workers remain alive

Explain:

* worker lifecycle
* worker events
* failure handling

---

## 6. WebSocket Architecture

Explain:

* how Socket.IO server is initialized
* how frontend subscribes
* how assignment rooms work
* how events are emitted

Show:

* actual websocket event names
* payload structures
* realtime update lifecycle

---

## 7. Gemini AI Flow

Explain:

* how Gemini service initializes
* which model is used
* how prompts are generated
* how parsing works
* how malformed AI output is handled

Show:

* prompt builder flow
* parser flow
* validation flow

---

## 8. Full End-to-End Flow

Explain step-by-step what happens when:

POST /api/assignments

is called.

I want the FULL lifecycle:

* validation
* DB insert
* queue insertion
* worker pickup
* Gemini generation
* parser validation
* DB update
* websocket emission
* final frontend retrieval

---

## 9. Local Development Setup

Explain:

* required Docker containers
* expected ports
* required environment variables
* startup order
* how to verify all systems are connected

Explain:

* how to inspect MongoDB data
* how to inspect Redis/BullMQ jobs
* how to debug workers

---

## 10. Deployment Architecture

Explain:

* how this backend should be deployed on Railway
* whether API and workers should be separate services
* how Redis connects in production
* how Mongo Atlas integrates
* environment variable requirements

---

## 11. Important Files Breakdown

For every important file:

* explain its role
* explain what initializes there
* explain dependencies

Especially:

* app.ts
* server.ts
* worker.ts
* redis.ts
* assessment.queue.ts
* assessment.worker.ts
* gemini.service.ts
* socket.service.ts

---

## 12. Suggested Improvements

Finally:

* identify weak areas
* mention possible production improvements
* mention architectural tradeoffs
* mention what is simplified for assignment scope

Be extremely detailed and technical.
