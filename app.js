// ===== HAMBURGER NAV =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ===== TASK MANAGER (only initialize on pages that have the task form) =====
if (document.getElementById('taskInput')) {
  let tasks = JSON.parse(localStorage.getItem('dl_tasks') || '[]');
  let activeFilter = 'all';

  const taskInput     = document.getElementById('taskInput');
  const prioritySelect= document.getElementById('prioritySelect');
  const addTaskBtn    = document.getElementById('addTaskBtn');
  const taskList      = document.getElementById('taskList');
  const emptyMsg      = document.getElementById('emptyMsg');
  const filterBtns    = document.querySelectorAll('.filter-btn');

  function saveTasks() { localStorage.setItem('dl_tasks', JSON.stringify(tasks)); }

  function escapeHtml(str) { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderTasks() {
    taskList.innerHTML = '';
    const filtered = tasks.filter(t => activeFilter === 'all' || t.priority === activeFilter);

    if (filtered.length === 0) {
      emptyMsg.classList.remove('hidden');
    } else {
      emptyMsg.classList.add('hidden');
      filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.priority}${task.done ? ' done' : ''}`;
        li.dataset.id = task.id;
        li.innerHTML = `
          <input class="task-check" type="checkbox" aria-label="Mark done" ${task.done ? 'checked' : ''} />
          <span class="task-text">${escapeHtml(task.text)}</span>
          <span class="task-badge badge-${task.priority}">${task.priority}</span>
          <button class="delete-btn" aria-label="Delete task">✕</button>
        `;
        taskList.appendChild(li);
      });
    }
  }

  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text) { taskInput.focus(); return; }
    tasks.unshift({ id: Date.now(), text, priority: prioritySelect.value, done: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
  });

  taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTaskBtn.click(); });

  taskList.addEventListener('click', e => {
    const item = e.target.closest('.task-item');
    if (!item) return;
    const id = Number(item.dataset.id);

    if (e.target.classList.contains('delete-btn')) {
      tasks = tasks.filter(t => t.id !== id);
    } else if (e.target.classList.contains('task-check')) {
      const task = tasks.find(t => t.id === id);
      if (task) task.done = e.target.checked;
    }
    saveTasks();
    renderTasks();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Seed sample tasks if empty
  if (tasks.length === 0) {
    tasks = [
      { id: 1, text: 'Build responsive frontend (Project 1)', priority: 'high',   done: false },
      { id: 2, text: 'Set up Express API endpoints (Project 2)', priority: 'medium', done: false },
      { id: 3, text: 'Design database schema (Project 3)', priority: 'low', done: false },
    ];
    saveTasks();
  }

  renderTasks();
}

// ===== CONTACT FORM (only if present) =====
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const nameEl  = document.getElementById('nameInput');
    const emailEl = document.getElementById('emailInput');
    const msgEl   = document.getElementById('msgInput');
    const fb      = document.getElementById('formFeedback');

    const name  = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const msg   = msgEl ? msgEl.value.trim() : '';

    if (!name || !email || !msg) {
      fb.style.color = '#e74c3c';
      fb.textContent = 'Please fill in all fields.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fb.style.color = '#e74c3c';
      fb.textContent = 'Please enter a valid email.';
      return;
    }
    fb.style.color = '#27ae60';
    fb.textContent = `Message sent! Thanks, ${name} 🎉`;
    if (nameEl) nameEl.value = '';
    if (emailEl) emailEl.value = '';
    if (msgEl) msgEl.value = '';
  });
}

// ===== SITE-WIDE INTERACTIONS: THEME TOGGLE, SUBSCRIBE, SCROLL TOP =====
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const applyTheme = (mode) => {
    if (mode === 'alt') document.body.classList.add('alt-theme'); else document.body.classList.remove('alt-theme');
    localStorage.setItem('dl_theme', mode);
  };
  const saved = localStorage.getItem('dl_theme') || 'default';
  applyTheme(saved === 'alt' ? 'alt' : 'default');

  themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('alt-theme') ? 'default' : 'alt';
    applyTheme(next);
  });
}

const subscribeForm = document.getElementById('subscribeForm');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('subscribeEmail').value.trim();
    const msgEl = document.getElementById('subscribeMsg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msgEl.textContent = 'Please enter a valid email.';
      msgEl.style.color = '#e74c3c';
      return;
    }
    msgEl.textContent = 'Thanks — you are subscribed!';
    msgEl.style.color = '#27ae60';
    subscribeForm.reset();
  });
}

const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
