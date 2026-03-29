/**
 * app.js — Dashboard logic, quick tasks (theme in ui.js, copy in i18n.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

document.addEventListener("ssp-lang-change", () => {
  updateDashboardStats();
});

let showAllTasks = false;

function tr(key, vars) {
  return typeof window.t === "function" ? window.t(key, vars) : key;
}

function initApp() {
  const statGrid = document.getElementById("stat-grid");
  if (statGrid) {
    statGrid.classList.add("stat-grid--loading");
    statGrid.setAttribute("aria-busy", "true");
    window.setTimeout(() => {
      statGrid.classList.remove("stat-grid--loading");
      statGrid.setAttribute("aria-busy", "false");
    }, 420);
  }

  window.setTimeout(() => {
    updateDashboardStats();
  }, 100);

  setupEventListeners();
  checkPersistentTimer();
}

function updateDashboardStats() {
  const subjects = Storage.getSubjects();
  const tasks = Storage.getTasks();
  const sessions = Storage.get(DB_KEYS.SESSIONS);
  const planner = Storage.get(DB_KEYS.PLANNER, {});

  const subElement = document.getElementById("stat-subjects");
  const taskElement = document.getElementById("stat-tasks");
  const hourElement = document.getElementById("stat-hours");
  const streakElement = document.getElementById("stat-streak");

  if (subElement) subElement.textContent = subjects.length;
  if (taskElement) taskElement.textContent = tasks.filter((t) => t.completed).length;

  const today = new Date().toLocaleDateString();
  const todayMinutes = sessions
    .filter((s) => new Date(s.timestamp).toLocaleDateString() === today)
    .reduce((acc, s) => acc + (s.duration || 0), 0);

  if (hourElement) hourElement.textContent = tr("statHoursValue", { h: (todayMinutes / 60).toFixed(1) });

  const sessionDates = [...new Set(sessions.map((s) => new Date(s.timestamp).toLocaleDateString()))];
  if (streakElement) streakElement.textContent = tr("statStreakValue", { n: sessionDates.length });

  const upcomingList = document.getElementById("upcoming-list");
  if (upcomingList) {
    const todayIdx = (new Date().getDay() + 6) % 7;
    const todaySchedule = planner[todayIdx];
    if (todaySchedule && Object.keys(todaySchedule).length > 0) {
      upcomingList.innerHTML = Object.entries(todaySchedule)
        .sort((a, b) => a[0] - b[0])
        .map(([hour, subId]) => {
          const sub = subjects.find((s) => s.id == subId);
          const accent = sub?.color || "var(--primary)";
          return `
            <div class="session-pill" style="border-inline-start:4px solid ${accent};">
              <span class="session-pill__time">${hour}:00</span>
              <span style="font-weight:600;">${escapeHtml(sub?.name || tr("sessionFallback"))}</span>
            </div>`;
        })
        .join("");
    } else {
      upcomingList.innerHTML = `
        <div class="empty-state" style="padding:2rem 1rem;border-style:solid;">
          <div class="empty-state__icon"><i class="fas fa-calendar-xmark"></i></div>
          <h3>${escapeHtml(tr("noSessionsTitle"))}</h3>
          <p>${escapeHtml(tr("noSessionsDesc"))}</p>
          <a class="btn btn-primary btn-sm" href="pages/planner.html">${escapeHtml(tr("openPlanner"))}</a>
        </div>`;
    }
  }

  const taskList = document.getElementById("quick-tasks-list");
  if (taskList) {
    const filtered = showAllTasks ? tasks : tasks.filter((t) => !t.completed);
    if (filtered.length > 0) {
      taskList.innerHTML = filtered
        .map(
          (t) => `
        <div class="dashboard-task ${t.completed ? "completed" : ""}" style="display:flex;align-items:center;gap:0.75rem;font-size:0.9rem;cursor:pointer;transition:var(--transition);" onclick="toggleTaskDashboard(${t.id}, this)">
          <div class="checkbox ${t.completed ? "checked" : ""}">
            ${t.completed ? '<i class="fas fa-check" style="font-size:0.65rem;"></i>' : ""}
          </div>
          <span style="flex-grow:1;">${escapeHtml(t.name)}</span>
          <button type="button" class="delete-task-btn" onclick="deleteQuickTask(${t.id}, event)" title="${escapeHtml(tr("delete"))}" aria-label="${escapeHtml(tr("delete"))}">
            <i class="fas fa-trash-can"></i>
          </button>
        </div>`
        )
        .join("");
    } else {
      taskList.innerHTML = `
        <div class="empty-state" style="padding:2rem 1rem;border-style:solid;">
          <div class="empty-state__icon"><i class="fas fa-clipboard-check"></i></div>
          <h3>${escapeHtml(tr("quickTasksEmptyTitle"))}</h3>
          <p>${escapeHtml(tr("quickTasksEmptyDesc"))}</p>
          <button type="button" class="btn btn-primary btn-sm" id="empty-add-task">${escapeHtml(tr("btnAddTaskEmpty"))}</button>
        </div>`;
      const emptyBtn = document.getElementById("empty-add-task");
      if (emptyBtn) {
        emptyBtn.onclick = () => document.getElementById("open-task-modal")?.click();
      }
    }
  }

  const toggleBtn = document.getElementById("toggle-all-tasks");
  if (toggleBtn) {
    toggleBtn.innerHTML = showAllTasks
      ? `<i class="fas fa-eye-slash"></i> ${escapeHtml(tr("btnPending"))}`
      : `<i class="fas fa-eye"></i> ${escapeHtml(tr("btnShowAll"))}`;
    toggleBtn.classList.toggle("btn-active", showAllTasks);
  }
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

window.deleteQuickTask = async (id, event) => {
  event.stopPropagation();
  const ok = await window.SSP.showConfirm({
    title: tr("deleteTaskTitle"),
    message: tr("deleteTaskMsg"),
    confirmText: tr("delete"),
    cancelText: tr("cancel"),
  });
  if (!ok) return;
  const tasks = Storage.getTasks().filter((t) => t.id !== id);
  Storage.save(DB_KEYS.TASKS, tasks);
  window.SSP.addNotification("notifTaskDeleted", null, "fa-trash-can");
  updateDashboardStats();
};

window.toggleTaskDashboard = (id, element) => {
  const tasks = Storage.getTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const checkbox = element.querySelector(".checkbox");

  if (!task.completed) {
    checkbox.classList.add("checked");
    checkbox.innerHTML = '<i class="fas fa-check" style="font-size:0.65rem;"></i>';

    if (!showAllTasks) {
      element.classList.add("task-item-exit");
    } else {
      element.classList.add("completed");
    }

    window.setTimeout(() => {
      task.completed = true;
      Storage.save(DB_KEYS.TASKS, tasks);
      updateDashboardStats();
    }, 400);
  } else {
    checkbox.classList.remove("checked");
    checkbox.innerHTML = "";
    element.classList.remove("completed");

    window.setTimeout(() => {
      task.completed = false;
      Storage.save(DB_KEYS.TASKS, tasks);
      updateDashboardStats();
    }, 400);
  }
};

function setupEventListeners() {
  const taskModal = document.getElementById("task-modal");
  const openBtn = document.getElementById("open-task-modal");
  const closeBtn = document.getElementById("close-task-modal");
  const saveBtn = document.getElementById("save-quick-task");
  const taskInput = document.getElementById("quick-task-name");
  const toggleTasksBtn = document.getElementById("toggle-all-tasks");
  const clearTasksBtn = document.getElementById("clear-all-tasks");

  function openModal() {
    if (!taskModal) return;
    taskModal.classList.add("is-open");
    taskInput?.focus();
  }

  function closeModal() {
    if (!taskModal) return;
    taskModal.classList.remove("is-open");
  }

  if (openBtn) openBtn.onclick = openModal;

  if (toggleTasksBtn) {
    toggleTasksBtn.onclick = () => {
      showAllTasks = !showAllTasks;
      updateDashboardStats();
    };
  }

  if (clearTasksBtn) {
    clearTasksBtn.onclick = async () => {
      const ok = await window.SSP.showConfirm({
        title: tr("clearAllTasksTitle"),
        message: tr("clearAllTasksMsg"),
        confirmText: tr("clearAll"),
        cancelText: tr("cancel"),
      });
      if (!ok) return;
      Storage.save(DB_KEYS.TASKS, []);
      window.SSP.showToast("success", tr("toastTasksCleared"), tr("toastTasksClearedBody"));
      window.SSP.addNotification("notifTasksCleared", null, "fa-broom");
      updateDashboardStats();
    };
  }

  if (closeBtn) closeBtn.onclick = closeModal;

  if (saveBtn) {
    saveBtn.onclick = () => {
      const name = taskInput?.value.trim();
      if (name) {
        Storage.addTask({ name });
        taskInput.value = "";
        closeModal();
        window.SSP.showToast("success", tr("toastTaskAdded"), name);
        window.SSP.addNotification("notifNewTask", { name }, "fa-plus");
        updateDashboardStats();
      }
    };
  }

  if (taskModal) {
    taskModal.addEventListener("click", (e) => {
      if (e.target === taskModal) closeModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && taskModal?.classList.contains("is-open")) closeModal();
  });
}

function checkPersistentTimer() {
  const state = Storage.get(DB_KEYS.TIMER_STATE, null);
  if (!state || !state.endTime) return;

  const now = Date.now();
  const endTime = state.endTime;

  if (now < endTime) {
    const remaining = endTime - now;
    window.setTimeout(() => {
      const latestState = Storage.get(DB_KEYS.TIMER_STATE, null);
      if (latestState && latestState.endTime === endTime) {
        handleGlobalTimerComplete(latestState);
      }
    }, remaining);
  } else {
    handleGlobalTimerComplete(state);
  }
}

function handleGlobalTimerComplete(state) {
  if (state.mode === "pomodoro") {
    Storage.logSession({
      subjectId: state.subjectId,
      duration: state.duration,
      mode: "pomodoro",
    });

    if (!window.location.pathname.includes("timer.html")) {
      if (window.SSP) {
        window.SSP.showToast("info", tr("toastFocusComplete"), tr("toastFocusCompleteBody"));
        window.SSP.addNotification("notifPomodoroLogged", null, "fa-stopwatch");
      }
      updateDashboardStats();
    }
  }

  localStorage.removeItem(DB_KEYS.TIMER_STATE);
}
