/**
 * app.js - Main Application Logic & UI Updates
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupTheme();
    updateDashboardStats();
    setupEventListeners();
    checkPersistentTimer();
}

function setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('ssp_theme') || 'light';
    
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('ssp_theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

let showAllTasks = false;

function updateDashboardStats() {
    const subjects = Storage.getSubjects();
    const tasks = Storage.getTasks();
    const sessions = Storage.get(DB_KEYS.SESSIONS);
    const planner = Storage.get(DB_KEYS.PLANNER, {});

    // Update UI elements if they exist
    const subElement = document.getElementById('stat-subjects');
    const taskElement = document.getElementById('stat-tasks');
    const hourElement = document.getElementById('stat-hours');
    const streakElement = document.getElementById('stat-streak');

    if (subElement) subElement.textContent = subjects.length;
    if (taskElement) taskElement.textContent = tasks.filter(t => t.completed).length;
    
    // Calculate today's hours
    const today = new Date().toLocaleDateString();
    const todayMinutes = sessions
        .filter(s => new Date(s.timestamp).toLocaleDateString() === today)
        .reduce((acc, s) => acc + (s.duration || 0), 0);
    
    if (hourElement) hourElement.textContent = `${(todayMinutes / 60).toFixed(1)}h`;
    
    // Calculate streak (simple version)
    const sessionDates = [...new Set(sessions.map(s => new Date(s.timestamp).toLocaleDateString()))];
    if (streakElement) streakElement.textContent = `${sessionDates.length} days`;

    // Populate Upcoming Sessions
    const upcomingList = document.getElementById('upcoming-list');
    if (upcomingList) {
        const todayIdx = (new Date().getDay() + 6) % 7; // Mon is 0
        const todaySchedule = planner[todayIdx];
        if (todaySchedule && Object.keys(todaySchedule).length > 0) {
            upcomingList.innerHTML = Object.entries(todaySchedule)
                .sort((a, b) => a[0] - b[0])
                .map(([hour, subId]) => {
                    const sub = subjects.find(s => s.id == subId);
                    return `
                        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem; border-left: 3px solid ${sub?.color || 'var(--primary)'}; background: var(--secondary); border-radius: 4px;">
                            <span style="font-weight: 700; font-size: 0.8rem;">${hour}:00</span>
                            <span style="font-weight: 500;">${sub?.name || 'Study'}</span>
                        </div>
                    `;
                }).join('');
        }
    }

    // Populate Quick Tasks
    const taskList = document.getElementById('quick-tasks-list');
    if (taskList) {
        const filtered = showAllTasks ? tasks : tasks.filter(t => !t.completed);
        if (filtered.length > 0) {
            taskList.innerHTML = filtered.map(t => `
                <div class="dashboard-task ${t.completed ? 'completed' : ''}" style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; cursor: pointer; transition: 0.3s;" onclick="toggleTaskDashboard(${t.id}, this)">
                    <div class="checkbox ${t.completed ? 'checked' : ''}">
                        ${t.completed ? '<i class="fas fa-check" style="font-size: 0.6rem;"></i>' : ''}
                    </div>
                    <span style="flex-grow: 1;">${t.name}</span>
                    <i class="fas fa-trash-alt delete-task-btn" onclick="deleteQuickTask(${t.id}, event)" title="Delete Task"></i>
                </div>
            `).join('');
        } else {
            taskList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Clean desk, clear mind.</p>';
        }
    }

    // Update toggle button text/icon
    const toggleBtn = document.getElementById('toggle-all-tasks');
    if (toggleBtn) {
        toggleBtn.innerHTML = showAllTasks ? '<i class="fas fa-eye-slash"></i> View Pending' : '<i class="fas fa-eye"></i> Show All';
        toggleBtn.classList.toggle('btn-active', showAllTasks);
    }
}

// Global delete for individual tasks
window.deleteQuickTask = (id, event) => {
    event.stopPropagation();
    const tasks = Storage.getTasks();
    const updatedTasks = tasks.filter(t => t.id !== id);
    Storage.save(DB_KEYS.TASKS, updatedTasks);
    updateDashboardStats();
};

// Global toggle for dashboard with animation
window.toggleTaskDashboard = (id, element) => {
    const tasks = Storage.getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Add animation classes
    const checkbox = element.querySelector('.checkbox');
    
    if (!task.completed) {
        checkbox.classList.add('checked');
        checkbox.innerHTML = '<i class="fas fa-check" style="font-size: 0.6rem;"></i>';
        
        if (!showAllTasks) {
            element.classList.add('task-item-exit');
        } else {
            element.classList.add('completed');
        }

        // Wait for animation to finish before updating storage and UI
        setTimeout(() => {
            task.completed = true;
            Storage.save(DB_KEYS.TASKS, tasks);
            updateDashboardStats();
        }, 400); // Matches animation duration
    } else {
        // Un-complete task if clicked while in "Show All" mode
        checkbox.classList.remove('checked');
        checkbox.innerHTML = '';
        element.classList.remove('completed');
        
        setTimeout(() => {
            task.completed = false;
            Storage.save(DB_KEYS.TASKS, tasks);
            updateDashboardStats();
        }, 400);
    }
};


function setupEventListeners() {
    const taskModal = document.getElementById('task-modal');
    const openBtn = document.getElementById('open-task-modal');
    const closeBtn = document.getElementById('close-task-modal');
    const saveBtn = document.getElementById('save-quick-task');
    const taskInput = document.getElementById('quick-task-name');
    const toggleTasksBtn = document.getElementById('toggle-all-tasks');
    const clearTasksBtn = document.getElementById('clear-all-tasks');

    if (openBtn) {
        openBtn.onclick = () => {
            taskModal.style.display = 'flex';
            taskInput.focus();
        };
    }

    if (toggleTasksBtn) {
        toggleTasksBtn.onclick = () => {
            showAllTasks = !showAllTasks;
            updateDashboardStats();
        };
    }

    if (clearTasksBtn) {
        clearTasksBtn.onclick = () => {
            if (confirm('Are you sure you want to clear all tasks?')) {
                Storage.save(DB_KEYS.TASKS, []);
                updateDashboardStats();
            }
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            taskModal.style.display = 'none';
        };
    }

    if (saveBtn) {
        saveBtn.onclick = () => {
            const name = taskInput.value.trim();
            if (name) {
                Storage.addTask({ name });
                taskInput.value = '';
                taskModal.style.display = 'none';
                updateDashboardStats();
            }
        };
    }

    // Close on escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && taskModal.style.display === 'flex') {
            taskModal.style.display = 'none';
        }
    });
}

/**
 * Global Timer Sync - Ensures timer completes even if user navigates away
 */
function checkPersistentTimer() {
    const state = Storage.get(DB_KEYS.TIMER_STATE, null);
    if (!state || !state.endTime) return;

    const now = Date.now();
    const endTime = state.endTime;

    // Use a small interval to check for completion if it's still running
    if (now < endTime) {
        const remaining = endTime - now;
        setTimeout(() => {
            // Re-check once time is up
            const latestState = Storage.get(DB_KEYS.TIMER_STATE, null);
            if (latestState && latestState.endTime === endTime) {
                handleGlobalTimerComplete(latestState);
            }
        }, remaining);
    } else {
        // Already finished while user was away
        handleGlobalTimerComplete(state);
    }
}

function handleGlobalTimerComplete(state) {
    // Log the session if it was a focus session (pomodoro)
    if (state.mode === 'pomodoro') {
        Storage.logSession({
            subjectId: state.subjectId,
            duration: state.duration,
            mode: 'pomodoro'
        });
        
        // Notify user if possible (simple alert for now)
        // Only alert if we're not currently on the timer page (since timer.js handles its own)
        if (!window.location.pathname.includes('timer.html')) {
            alert(`Focus session complete! Time for a break.`);
            updateDashboardStats();
        }
    }
    
    // Clear state
    localStorage.removeItem(DB_KEYS.TIMER_STATE);
}

