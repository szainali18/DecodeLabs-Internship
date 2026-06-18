/**
 * DecodeLabs – Project 3: Database Integration
 * Express API + NeDB (embedded, file-persisted database)
 * Full CRUD with schema validation, constraints, and security.
 *
 * CRUD ↔ HTTP ↔ DB mapping:
 *   CREATE → POST   → db.insert()
 *   READ   → GET    → db.find()
 *   UPDATE → PUT    → db.update()
 *   DELETE → DELETE → db.remove()
 */

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const Datastore  = require('nedb-promises');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Database setup ───────────────────────────────────────────
const db = Datastore.create({
  filename: path.join(__dirname, 'tasks.db'),
  autoload: true,
});

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend'));

// ─── Validation ───────────────────────────────────────────────
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validateTask(body, requireTitle = true) {
  const errors = [];

  if (requireTitle) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push('title is required (non-empty string).');
    }
  }
  if (body.title && body.title.length > 200) {
    errors.push('title must be under 200 characters.');
  }
  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be: ${VALID_PRIORITIES.join(' | ')}.`);
  }
  if (body.done !== undefined && typeof body.done !== 'boolean') {
    errors.push('done must be a boolean.');
  }
  return errors;
}

// ─── ROUTES ──────────────────────────────────────────────────

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'DecodeLabs DB API running', db: 'NeDB (persistent)', version: '3.0' });
});

// ── CREATE: POST /api/tasks ───────────────────────────────────
app.post('/api/tasks', async (req, res) => {
  try {
    const errors = validateTask(req.body);
    if (errors.length) return res.status(400).json({ success: false, errors });

    const newTask = {
      title:     req.body.title.trim(),
      priority:  req.body.priority || 'medium',
      done:      false,
      createdAt: new Date().toISOString(),
    };

    const saved = await db.insert(newTask);
    res.status(201).json({ success: true, message: 'Task created.', data: saved });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', detail: err.message });
  }
});

// ── READ ALL: GET /api/tasks ──────────────────────────────────
app.get('/api/tasks', async (req, res) => {
  try {
    const query = {};
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.done !== undefined) query.done = req.query.done === 'true';

    const tasks = await db.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', detail: err.message });
  }
});

// ── READ ONE: GET /api/tasks/:id ──────────────────────────────
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await db.findOne({ _id: req.params.id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.status(200).json({ success: true, data: task });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', detail: err.message });
  }
});

// ── UPDATE: PUT /api/tasks/:id ────────────────────────────────
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const existing = await db.findOne({ _id: req.params.id });
    if (!existing) return res.status(404).json({ success: false, message: 'Task not found.' });

    const errors = validateTask(req.body, false); // title optional on update
    if (errors.length) return res.status(400).json({ success: false, errors });

    const update = { updatedAt: new Date().toISOString() };
    if (req.body.title    !== undefined) update.title    = req.body.title.trim();
    if (req.body.priority !== undefined) update.priority = req.body.priority;
    if (req.body.done     !== undefined) update.done     = req.body.done;

    await db.update({ _id: req.params.id }, { $set: update });
    const updated = await db.findOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'Task updated.', data: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', detail: err.message });
  }
});

// ── DELETE: DELETE /api/tasks/:id ────────────────────────────
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const removed = await db.remove({ _id: req.params.id }, {});
    if (removed === 0) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.status(204).send();

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', detail: err.message });
  }
});

// ─── 404 / Error handlers ─────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error.' });
});

// ─── Seed data on first run ───────────────────────────────────
async function seedIfEmpty() {
  const count = await db.count({});
  if (count === 0) {
    await db.insert([
      { title: 'Build responsive frontend (P1)', priority: 'high',   done: true,  createdAt: new Date().toISOString() },
      { title: 'Create REST API endpoints (P2)', priority: 'medium', done: true,  createdAt: new Date().toISOString() },
      { title: 'Integrate database (P3)',         priority: 'high',   done: false, createdAt: new Date().toISOString() },
    ]);
    console.log('🌱  Seeded initial tasks.');
  }
}

// ─── Start ────────────────────────────────────────────────────
app.listen(PORT, async () => {
  await seedIfEmpty();
  console.log(`✅  DecodeLabs DB API → http://localhost:${PORT}/api`);
  console.log(`📂  Database file    → ${path.join(__dirname, 'tasks.db')}`);
});

module.exports = app;
