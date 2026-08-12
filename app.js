/**
 * InternTrack Dashboard — JavaScript Application Entry Point
 * Phase 3: Frontend State, Interactivity & LocalStorage Persistence
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. CONSTANTS & SELECTORS
     ========================================================================== */
  const STORAGE_KEY = 'interntrack_tasks';
  const CURRENT_WEEK = 8;
  const TOTAL_WEEKS = 12;

  // Initial Seed Dataset (loaded when localStorage is empty or unparseable)
  const INITIAL_TASKS = [
    {
      id: 'seed-task-1',
      title: 'Implement Responsive Dashboard',
      internship: 'DecodeLabs',
      role: 'Full Stack Intern',
      dueDate: '2026-08-15',
      status: 'in-progress',
      createdAt: '2026-08-12T00:00:00.000Z'
    },
    {
      id: 'seed-task-2',
      title: 'Build Product Listing Page',
      internship: 'CodeAlpha',
      role: 'Full Stack Intern',
      dueDate: '2026-08-18',
      status: 'todo',
      createdAt: '2026-08-12T00:00:00.000Z'
    },
    {
      id: 'seed-task-3',
      title: 'Accessibility Audit',
      internship: 'DecodeLabs',
      role: 'Full Stack Intern',
      dueDate: '2026-08-20',
      status: 'completed',
      createdAt: '2026-08-12T00:00:00.000Z'
    },
    {
      id: 'seed-task-4',
      title: 'Improve Mobile Navigation',
      internship: 'CodeAlpha',
      role: 'Full Stack Intern',
      dueDate: '2026-08-22',
      status: 'in-progress',
      createdAt: '2026-08-12T00:00:00.000Z'
    }
  ];

  /* DOM Element Selectors */
  const elements = {
    tasksGrid: document.getElementById('tasks-grid'),
    statActiveCount: document.getElementById('stat-active-count'),
    statCompletedCount: document.getElementById('stat-completed-count'),
    statProgressCount: document.getElementById('stat-progress-count'),
    progressPercentageText: document.getElementById('progress-percentage-text'),
    progressBar: document.getElementById('internship-progress-bar'),
    filterButtons: document.querySelectorAll('.filter-chip'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    mobileNav: document.getElementById('mobile-nav'),
    addTaskBtnDesktop: document.getElementById('add-task-btn'),
    addTaskBtnMobile: document.getElementById('add-task-btn-mobile'),
    addTaskDialog: document.getElementById('add-task-dialog'),
    addTaskForm: document.getElementById('add-task-form'),
    cancelTaskBtn: document.getElementById('cancel-task-btn'),
    closeDialogBtn: document.getElementById('close-dialog-btn'),
    formErrorMsg: document.getElementById('form-error-msg'),
    titleInput: document.getElementById('task-title-input'),
    companyInput: document.getElementById('task-company-input'),
    roleInput: document.getElementById('task-role-input'),
    dateInput: document.getElementById('task-date-input'),
    statusSelect: document.getElementById('task-status-select'),
    navLinks: document.querySelectorAll('a[href^="#"]')
  };

  /* ==========================================================================
     2. APPLICATION STATE
     ========================================================================== */
  let tasks = [];
  let currentFilter = 'all';
  let openMenuTaskId = null;

  /* ==========================================================================
     3. LOCALSTORAGE HELPERS
     ========================================================================== */
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        saveTasks(INITIAL_TASKS);
        return [...INITIAL_TASKS];
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      saveTasks(INITIAL_TASKS);
      return [...INITIAL_TASKS];
    } catch (error) {
      console.warn('LocalStorage error or malformed JSON, resetting to initial tasks:', error);
      saveTasks(INITIAL_TASKS);
      return [...INITIAL_TASKS];
    }
  }

  function saveTasks(tasksToSave = tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Failed to save tasks to LocalStorage:', error);
    }
  }

  /* ==========================================================================
     4. FORMATTING & DATE HELPERS
     ========================================================================== */
  function formatDueDate(dateString) {
    if (!dateString) return 'No date';
    // Parse YYYY-MM-DD cleanly to avoid timezone shifting
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, monthIndex, day);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return dateString;
  }

  function isOverdue(dateString, status) {
    if (status === 'completed' || !dateString) return false;
    const parts = dateString.split('-');
    if (parts.length !== 3) return false;
    
    const taskDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 23, 59, 59);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return taskDate < today;
  }

  function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'task-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  }

  /* ==========================================================================
     5. RENDERING TASKS & DOM CARDS
     ========================================================================== */
  function renderTasks() {
    if (!elements.tasksGrid) return;

    // Filter task collection
    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'all') return true;
      return task.status === currentFilter;
    });

    // Clear grid
    elements.tasksGrid.innerHTML = '';
    closeOpenMenu();

    // Render Empty State if no tasks match
    if (filteredTasks.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';

      const emptyTitle = document.createElement('p');
      emptyTitle.className = 'empty-state-title';
      emptyTitle.textContent = 'No tasks found for this status.';

      emptyState.appendChild(emptyTitle);
      elements.tasksGrid.appendChild(emptyState);
      return;
    }

    // Render Task Cards safely using DOM APIs
    filteredTasks.forEach(task => {
      const card = createTaskCard(task);
      elements.tasksGrid.appendChild(card);
    });
  }

  function createTaskCard(task) {
    const card = document.createElement('article');
    card.className = 'task-card';
    card.setAttribute('data-status', task.status);
    card.setAttribute('data-task-id', task.id);

    /* --- Card Header --- */
    const header = document.createElement('div');
    header.className = 'task-card-header';

    // Status Badge
    const badge = document.createElement('span');
    const overdue = isOverdue(task.dueDate, task.status);

    if (overdue) {
      badge.className = 'status-badge status-overdue status--overdue';
      const dot = document.createElement('span');
      dot.className = 'status-dot';
      badge.appendChild(dot);
      badge.appendChild(document.createTextNode(' Overdue'));
    } else if (task.status === 'in-progress') {
      badge.className = 'status-badge status-in-progress status--progress';
      const dot = document.createElement('span');
      dot.className = 'status-dot';
      badge.appendChild(dot);
      badge.appendChild(document.createTextNode(' In Progress'));
    } else if (task.status === 'todo') {
      badge.className = 'status-badge status-todo status--todo';
      const dot = document.createElement('span');
      dot.className = 'status-dot';
      badge.appendChild(dot);
      badge.appendChild(document.createTextNode(' To Do'));
    } else if (task.status === 'completed') {
      badge.className = 'status-badge status-completed status--completed';
      badge.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg> Completed`;
    }

    // Task Options Menu Button
    const menuBtn = document.createElement('button');
    menuBtn.type = 'button';
    menuBtn.className = 'task-menu-btn';
    menuBtn.setAttribute('aria-label', `More options for ${task.title}`);
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('data-action', 'toggle-menu');
    menuBtn.setAttribute('data-task-id', task.id);
    menuBtn.innerHTML = '&#8942;';

    header.appendChild(badge);
    header.appendChild(menuBtn);

    /* --- Task Body --- */
    const title = document.createElement('h3');
    title.className = 'task-title';
    title.textContent = task.title;

    const internship = document.createElement('p');
    internship.className = 'task-internship';
    internship.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
    const companyText = document.createTextNode(` ${task.internship} \u00B7 ${task.role || 'Full Stack Intern'}`);
    internship.appendChild(companyText);

    /* --- Card Footer --- */
    const footer = document.createElement('div');
    footer.className = 'task-card-footer';

    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'task-due-date';
    dueDateSpan.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Due: `;
    
    const timeElem = document.createElement('time');
    timeElem.setAttribute('datetime', task.dueDate);
    timeElem.textContent = formatDueDate(task.dueDate);
    dueDateSpan.appendChild(timeElem);

    footer.appendChild(dueDateSpan);

    // Assemble Card
    card.appendChild(header);
    card.appendChild(title);
    card.appendChild(internship);
    card.appendChild(footer);

    return card;
  }

  /* ==========================================================================
     6. STATISTICS CALCULATION & UPDATE
     ========================================================================== */
  function updateStatistics() {
    const activeCount = tasks.filter(t => t.status !== 'completed').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;

    // Timeline calculation (Week 8 of 12)
    const progressPercent = Math.round((CURRENT_WEEK / TOTAL_WEEKS) * 100);

    if (elements.statActiveCount) {
      elements.statActiveCount.textContent = activeCount;
    }
    if (elements.statCompletedCount) {
      elements.statCompletedCount.textContent = completedCount;
    }
    if (elements.statProgressCount) {
      elements.statProgressCount.textContent = `${progressPercent}%`;
    }
    if (elements.progressPercentageText) {
      elements.progressPercentageText.textContent = `${progressPercent}%`;
    }
    if (elements.progressBar) {
      elements.progressBar.value = progressPercent;
      elements.progressBar.textContent = `${progressPercent}%`;
    }
  }

  /* ==========================================================================
     7. FILTERING HANDLERS
     ========================================================================== */
  function setFilter(filterValue) {
    currentFilter = filterValue;

    elements.filterButtons.forEach(btn => {
      const isSelected = btn.getAttribute('data-filter') === filterValue;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    renderTasks();
  }

  /* ==========================================================================
     8. ADD TASK DIALOG & FORM HANDLERS
     ========================================================================== */
  function openAddTaskDialog() {
    if (!elements.addTaskDialog) return;

    // Clear previous errors and reset form
    if (elements.formErrorMsg) {
      elements.formErrorMsg.textContent = '';
    }
    if (elements.addTaskForm) {
      elements.addTaskForm.reset();
    }

    // Set default values
    if (elements.roleInput) {
      elements.roleInput.value = 'Full Stack Intern';
    }
    if (elements.statusSelect) {
      elements.statusSelect.value = 'in-progress';
    }
    if (elements.dateInput) {
      // Default to 7 days from today
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const dd = String(targetDate.getDate()).padStart(2, '0');
      elements.dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Open modal via native HTML5 dialog API
    if (typeof elements.addTaskDialog.showModal === 'function') {
      elements.addTaskDialog.showModal();
    } else {
      elements.addTaskDialog.setAttribute('open', '');
    }

    if (elements.titleInput) {
      elements.titleInput.focus();
    }
  }

  function closeAddTaskDialog() {
    if (!elements.addTaskDialog) return;

    if (typeof elements.addTaskDialog.close === 'function') {
      elements.addTaskDialog.close();
    } else {
      elements.addTaskDialog.removeAttribute('open');
    }

    if (elements.formErrorMsg) {
      elements.formErrorMsg.textContent = '';
    }
  }

  function handleAddTaskSubmit(e) {
    e.preventDefault();

    const titleVal = elements.titleInput ? elements.titleInput.value.trim() : '';
    const companyVal = elements.companyInput ? elements.companyInput.value.trim() : '';
    const roleVal = elements.roleInput ? elements.roleInput.value.trim() : 'Full Stack Intern';
    const dateVal = elements.dateInput ? elements.dateInput.value.trim() : '';
    const statusVal = elements.statusSelect ? elements.statusSelect.value : 'in-progress';

    // Form Validation
    if (!titleVal) {
      showFormError('Please enter a task title.', elements.titleInput);
      return;
    }
    if (!companyVal) {
      showFormError('Please enter an internship / company name.', elements.companyInput);
      return;
    }
    if (!dateVal) {
      showFormError('Please select a valid due date.', elements.dateInput);
      return;
    }

    // Create new task object
    const newTask = {
      id: generateUUID(),
      title: titleVal,
      internship: companyVal,
      role: roleVal || 'Full Stack Intern',
      dueDate: dateVal,
      status: statusVal,
      createdAt: new Date().toISOString()
    };

    // Update state and save
    tasks.unshift(newTask);
    saveTasks();
    updateStatistics();
    renderTasks();
    closeAddTaskDialog();
  }

  function showFormError(msg, focusInput) {
    if (elements.formErrorMsg) {
      elements.formErrorMsg.textContent = msg;
    }
    if (focusInput && typeof focusInput.focus === 'function') {
      focusInput.focus();
    }
  }

  /* ==========================================================================
     9. TASK ACTION MENU & STATUS CHANGE HANDLERS
     ========================================================================== */
  function toggleTaskMenu(taskId, buttonElem) {
    if (openMenuTaskId === taskId) {
      closeOpenMenu();
      return;
    }

    closeOpenMenu();
    openMenuTaskId = taskId;

    const card = buttonElem.closest('.task-card');
    if (!card) return;

    buttonElem.setAttribute('aria-expanded', 'true');

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Build popover menu
    const popover = document.createElement('div');
    popover.className = 'task-menu-popover';
    popover.id = `menu-popover-${taskId}`;

    // Add status transition options
    if (task.status !== 'todo') {
      const item = createMenuItem('Mark as To Do', () => updateTaskStatus(taskId, 'todo'));
      popover.appendChild(item);
    }
    if (task.status !== 'in-progress') {
      const item = createMenuItem('Mark as In Progress', () => updateTaskStatus(taskId, 'in-progress'));
      popover.appendChild(item);
    }
    if (task.status !== 'completed') {
      const item = createMenuItem('Mark as Completed', () => updateTaskStatus(taskId, 'completed'));
      popover.appendChild(item);
    }

    // Delete Option
    const deleteItem = createMenuItem('Delete Task', () => deleteTask(taskId), true);
    popover.appendChild(deleteItem);

    card.appendChild(popover);

    // Focus first menu item for keyboard accessibility
    const firstItem = popover.querySelector('button');
    if (firstItem) {
      firstItem.focus();
    }
  }

  function createMenuItem(label, callback, isDanger = false) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = isDanger ? 'task-menu-item task-menu-item-danger' : 'task-menu-item';
    btn.textContent = label;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeOpenMenu();
      callback();
    });
    return btn;
  }

  function closeOpenMenu() {
    if (!openMenuTaskId) return;

    const existingPopover = document.querySelector('.task-menu-popover');
    if (existingPopover) {
      existingPopover.remove();
    }

    const activeBtn = document.querySelector(`.task-menu-btn[aria-expanded="true"]`);
    if (activeBtn) {
      activeBtn.setAttribute('aria-expanded', 'false');
    }

    openMenuTaskId = null;
  }

  function updateTaskStatus(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = newStatus;
    saveTasks();
    updateStatistics();
    renderTasks();
  }

  function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const confirmed = confirm(`Delete "${task.title}"?`);
    if (confirmed) {
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasks();
      updateStatistics();
      renderTasks();
    }
  }

  /* ==========================================================================
     10. MOBILE NAVIGATION HANDLERS
     ========================================================================== */
  function toggleMobileMenu() {
    if (!elements.mobileNav || !elements.mobileMenuToggle) return;

    const isHidden = elements.mobileNav.hasAttribute('hidden');
    if (isHidden) {
      elements.mobileNav.removeAttribute('hidden');
      elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
    } else {
      closeMobileMenu();
    }
  }

  function closeMobileMenu() {
    if (elements.mobileNav) {
      elements.mobileNav.setAttribute('hidden', '');
    }
    if (elements.mobileMenuToggle) {
      elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  /* ==========================================================================
     11. EVENT DELEGATION & LISTENERS
     ========================================================================== */
  function setupEventListeners() {
    // Add Task CTAs (Desktop & Mobile)
    if (elements.addTaskBtnDesktop) {
      elements.addTaskBtnDesktop.addEventListener('click', openAddTaskDialog);
    }
    if (elements.addTaskBtnMobile) {
      elements.addTaskBtnMobile.addEventListener('click', openAddTaskDialog);
    }

    // Modal Close / Cancel Buttons
    if (elements.cancelTaskBtn) {
      elements.cancelTaskBtn.addEventListener('click', closeAddTaskDialog);
    }
    if (elements.closeDialogBtn) {
      elements.closeDialogBtn.addEventListener('click', closeAddTaskDialog);
    }

    // Modal Form Submission
    if (elements.addTaskForm) {
      elements.addTaskForm.addEventListener('submit', handleAddTaskSubmit);
    }

    // Filter Chips Click Handling
    elements.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        setFilter(filter);
      });
    });

    // Mobile Hamburger Menu Toggle
    if (elements.mobileMenuToggle) {
      elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Navigation Links (close mobile nav on click)
    elements.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Task Card Menu Button Delegation on Grid
    if (elements.tasksGrid) {
      elements.tasksGrid.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('[data-action="toggle-menu"]');
        if (toggleBtn) {
          e.stopPropagation();
          const taskId = toggleBtn.getAttribute('data-task-id');
          toggleTaskMenu(taskId, toggleBtn);
        }
      });
    }

    // Close task popover menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.task-menu-popover') && !e.target.closest('[data-action="toggle-menu"]')) {
        closeOpenMenu();
      }
    });

    // Keyboard navigation (Escape key closes popover or dialog)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeOpenMenu();
      }
    });
  }

  /* ==========================================================================
     12. INITIALIZATION
     ========================================================================== */
  function initializeApp() {
    tasks = loadTasks();
    updateStatistics();
    renderTasks();
    setupEventListeners();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();
