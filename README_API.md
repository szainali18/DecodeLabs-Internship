Backend API (Project 2)
=======================

Quick start

1. Install dependencies

```powershell
npm install
```

2. Start server

```powershell
npm start
```

The API will run on `http://localhost:3000` by default.

Endpoints

- `GET /api/status` — health/status information
- `GET /api/users` — list users (in-memory)
- `GET /api/users/:id` — get a user by id
- `POST /api/users` — create user; payload: `{ "name": "Alice", "email": "alice@example.com" }`

Example curl

```powershell
curl http://localhost:3000/api/status

curl -H "Content-Type: application/json" -d '{"name":"Bob","email":"bob@example.com"}' http://localhost:3000/api/users
```

Notes

- Users are stored in-memory for this exercise (no DB).
- Basic validation checks `name` and `email` format.
