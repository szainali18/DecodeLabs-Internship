const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let users = [];
let nextId = 1;

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), time: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

function validateUser(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    errors.push('Invalid payload');
    return errors;
  }
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 1) {
    errors.push('Name is required');
  }
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }
  return errors;
}

app.post('/api/users', (req, res) => {
  const errors = validateUser(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const user = { id: nextId++, name: req.body.name.trim(), email: req.body.email.toLowerCase() };
  users.push(user);
  res.status(201).json(user);
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(port, () => console.log(`API server running on http://localhost:${port}`));
