# DecodeLabs – Full Stack Industrial Training (Batch 2026)

## Projects Overview

| Project | Track | Goal |
|---------|-------|------|
| **P1** | Responsive Frontend Interface | HTML + CSS + JS responsive UI |
| **P2** | Backend API Development | Express REST API (GET/POST/PUT/DELETE) |
| **P3** | Database Integration | NeDB persistent CRUD + schema validation |

---

## Project 1 — Responsive Frontend
**Files:** `frontend/index.html`, `frontend/style.css`, `frontend/app.js`

### Features
- Mobile-first responsive layout (768px tablet, 1024px desktop breakpoints)
- Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Task Manager: add / filter / complete / delete tasks (persisted via localStorage)
- Contact form with client-side validation
- CSS Grid + Flexbox layout system
- 2025 aesthetic: Mocha Mousse `#A5856E`, Ethereal Blue `#A0D4E0`, Moonlit Grey `#F2F0EA`

### Run
Open `frontend/index.html` directly in any browser. No server needed.

---

## Project 2 — Backend API (In-Memory)
**File:** `backend/server.js`

### Endpoints

| Method | Route | Description | Status |
|--------|-------|-------------|--------|
| GET | `/api` | Health check | 200 |
| GET | `/api/tasks` | List all tasks | 200 |
| GET | `/api/tasks/:id` | Get single task | 200 / 404 |
| POST | `/api/tasks` | Create task | 201 / 400 |
| PUT | `/api/tasks/:id` | Update task | 200 / 400 / 404 |
| DELETE | `/api/tasks/:id` | Delete task | 204 / 404 |

### Run
```bash
cd backend
npm install
npm start          # → http://localhost:3000/api
```

### Test with curl
```bash
# GET all tasks
curl http://localhost:3000/api/tasks

# POST create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My new task","priority":"high"}'

# PUT update task
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'

# DELETE task
curl -X DELETE http://localhost:3000/api/tasks/1
```

---

## Project 3 — Database Integration (NeDB)
**File:** `backend/server_db.js`

### Architecture
```
Frontend (HTML/CSS/JS)
     ↕ HTTP JSON
Express API (server_db.js)
     ↕ NeDB Queries
tasks.db (file-persisted, auto-loaded)
```

### CRUD → HTTP → DB Mapping
```
CREATE → HTTP POST   → db.insert()
READ   → HTTP GET    → db.find() / db.findOne()
UPDATE → HTTP PUT    → db.update({ $set })
DELETE → HTTP DELETE → db.remove()
```

### Database Constraints (Schema-level)
- `title`: required, string, max 200 chars
- `priority`: enum – `low | medium | high`
- `done`: boolean
- `createdAt` / `updatedAt`: auto-set ISO timestamps
- `_id`: auto-generated unique identifier

### Run
```bash
cd backend
npm run start:db   # → http://localhost:3001/api
```

Same endpoints as Project 2, now with file persistence.

---

## Status Codes Used
| Code | Meaning |
|------|---------|
| 200 | OK – successful GET / PUT |
| 201 | Created – successful POST |
| 204 | No Content – successful DELETE |
| 400 | Bad Request – validation failed |
| 404 | Not Found – resource missing |
| 500 | Internal Server Error |
