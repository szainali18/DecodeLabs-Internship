/**
 * DecodeLabs – Project 2: Backend API Development
 * Express REST API with GET/POST/PUT/DELETE endpoints,
 * input validation and proper HTTP status codes.
 */

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

const path = require('path');
const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
// Serve static files from project root (where index.html and other pages live)
app.use(express.static(path.join(__dirname)));

// ─── In-memory data store (replaced by DB in Project 3) ──────
let tasks = [
  { id: 1, title: 'Build responsive frontend',    priority: 'high',   done: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Set up Express API endpoints', priority: 'medium', done: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Design database schema',        priority: 'low',    done: false, createdAt: new Date().toISOString() },
];
let nextId = 4;

// ─── Validation helper ────────────────────────────────────────
function validateTask(body) {
  const errors = [];
  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('title is required and must be a non-empty string.');
  }
  if (body.title && body.title.length > 200) {
    errors.push('title must be under 200 characters.');
  }
  const validPriorities = ['low', 'medium', 'high'];
  if (body.priority && !validPriorities.includes(body.priority)) {
    errors.push(`priority must be one of: ${validPriorities.join(', ')}.`);
  }
  return errors;
}

// ─── Routes ──────────────────────────────────────────────────

// GET /api  — health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'DecodeLabs API running', version: '1.0' });
});

// GET /api/tasks  — list all tasks (optional ?priority filter)
app.get('/api/tasks', (req, res) => {
  let result = [...tasks];
  const { priority, done } = req.query;

  if (priority) result = result.filter(t => t.priority === priority);
  if (done !== undefined) result = result.filter(t => t.done === (done === 'true'));

  res.status(200).json({ success: true, count: result.length, data: result });
});

// GET /api/tasks/:id  — get single task
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
  res.status(200).json({ success: true, data: task });
});

// POST /api/tasks  — create task
app.post('/api/tasks', (req, res) => {
  const errors = validateTask(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });

  const task = {
    id:        nextId++,
    title:     req.body.title.trim(),
    priority:  req.body.priority || 'medium',
    done:      false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  res.status(201).json({ success: true, message: 'Task created.', data: task });
});

// PUT /api/tasks/:id  — update task
app.put('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Task not found.' });

  const errors = validateTask({ title: req.body.title ?? tasks[idx].title, ...req.body });
  if (errors.length) return res.status(400).json({ success: false, errors });

  tasks[idx] = {
    ...tasks[idx],
    title:    req.body.title    !== undefined ? req.body.title.trim()  : tasks[idx].title,
    priority: req.body.priority !== undefined ? req.body.priority      : tasks[idx].priority,
    done:     req.body.done     !== undefined ? Boolean(req.body.done) : tasks[idx].done,
    updatedAt: new Date().toISOString(),
  };
  res.status(200).json({ success: true, message: 'Task updated.', data: tasks[idx] });
});

// DELETE /api/tasks/:id  — delete task
app.delete('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Task not found.' });

  tasks.splice(idx, 1);
  res.status(204).send(); // No Content
});

// ─── 404 catch-all ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error.' });
});

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  DecodeLabs API running → http://localhost:${PORT}/api`);
});

module.exports = app;
