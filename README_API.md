Backend API (Project 2)
=======================

Quick start

1. Install dependencies

```powershell
npm install
```

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


Deploy to Replit (no card required)

Quick steps to run the API on Replit:

1. Go to https://replit.com and sign in or create a free account.
2. Click **Create** → **Import from GitHub**.
3. Paste the repo URL: `https://github.com/szainali18/DecodeLabs-Internship` and import.
4. Replit will detect Node, run `npm install`, and start the app using `npm start`.
5. When the project is running, Replit shows a public URL you can use to call the endpoints.

Notes

- Replit provides a public HTTPS URL for your running app. The server reads `process.env.PORT` so it works out of the box.
- For a persistent always-on instance, consider Replit paid plans; the free tier is suitable for demos but may sleep when idle.

Live demo

- Public URL (Replit): https://replit.com/@szainali/DecodeLabs-Internship

