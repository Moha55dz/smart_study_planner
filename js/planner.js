/**
 * planner.js — Weekly planner grid and subject assignment
 */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8);

let selectedCell = null;

function tr(key, vars) {
  return typeof window.t === "function" ? window.t(key, vars) : key;
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  highlightTodayColumn();
  loadPlanner();

  const clearBtn = document.getElementById("clear-week-btn");
  if (clearBtn) clearBtn.addEventListener("click", clearPlanner);

  const selector = document.getElementById("subject-selector");
  if (selector) {
    selector.addEventListener("click", (e) => {
      if (e.target === selector) closeSelector();
    });
  }
});

/** Marks the current weekday column (Mon=0 … Sun=6). */
function highlightTodayColumn() {
  const jsDay = new Date().getDay();
  const monIndex = (jsDay + 6) % 7;
  document.querySelectorAll("[data-day-head]").forEach((el) => {
    const idx = parseInt(el.getAttribute("data-day-head"), 10);
    if (idx === monIndex) el.classList.add("is-today");
  });
}

function renderGrid() {
  const grid = document.getElementById("planner-grid");

  HOURS.forEach((hour) => {
    const timeLabel = document.createElement("div");
    timeLabel.className = "time-col";
    timeLabel.textContent = `${hour}:00`;
    grid.appendChild(timeLabel);

    DAYS.forEach((day, index) => {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.dataset.day = String(index);
      cell.dataset.hour = String(hour);
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `${day} ${hour}:00`);
      cell.addEventListener("click", () => openSelector(cell));
      grid.appendChild(cell);
    });
  });
}

function openSelector(cell) {
  selectedCell = cell;
  const selector = document.getElementById("subject-selector");
  const list = document.getElementById("subject-list");
  const subjects = Storage.getSubjects();

  if (subjects.length === 0) {
    window.SSP.showToast("info", tr("toastAddSubjectsFirst"), tr("toastAddSubjectsFirstBody"));
    return;
  }

  list.innerHTML = subjects
    .map(
      (s) => `
        <button type="button" class="btn btn-outline" style="justify-content:flex-start;border-inline-start:4px solid ${s.color};" onclick="assignSubject(${s.id})">
            ${escapeHtml(s.name)}
        </button>`
    )
    .join("");

  selector.classList.add("is-open");
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function closeSelector() {
  const selector = document.getElementById("subject-selector");
  selector.classList.remove("is-open");
  selectedCell = null;
}

function assignSubject(subjectId) {
  const subjects = Storage.getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);

  const day = selectedCell.dataset.day;
  const hour = selectedCell.dataset.hour;

  const plannerData = Storage.get(DB_KEYS.PLANNER, {});
  if (!plannerData[day]) plannerData[day] = {};
  plannerData[day][hour] = subjectId;
  Storage.save(DB_KEYS.PLANNER, plannerData);

  renderSessionBlock(selectedCell, subject);
  window.SSP.addNotification("notifScheduled", { name: subject.name }, "fa-calendar-check");
  closeSelector();
}

function removeSession() {
  if (!selectedCell) return;

  const day = selectedCell.dataset.day;
  const hour = selectedCell.dataset.hour;

  const plannerData = Storage.get(DB_KEYS.PLANNER, {});
  if (plannerData[day]) {
    delete plannerData[day][hour];
    Storage.save(DB_KEYS.PLANNER, plannerData);
  }

  selectedCell.innerHTML = "";
  window.SSP.showToast("success", tr("toastSessionRemoved"), "");
  closeSelector();
}

function renderSessionBlock(cell, subject) {
  cell.innerHTML = `
        <div class="session-block" style="background-color: ${subject.color}">
            ${escapeHtml(subject.name)}
        </div>
    `;
}

function loadPlanner() {
  const plannerData = Storage.get(DB_KEYS.PLANNER, {});
  const subjects = Storage.getSubjects();

  Object.keys(plannerData).forEach((day) => {
    Object.keys(plannerData[day]).forEach((hour) => {
      const subjectId = plannerData[day][hour];
      const subject = subjects.find((s) => s.id == subjectId);
      if (subject) {
        const cell = document.querySelector(`.grid-cell[data-day="${day}"][data-hour="${hour}"]`);
        if (cell) renderSessionBlock(cell, subject);
      }
    });
  });
}

async function clearPlanner() {
  const ok = await window.SSP.showConfirm({
    title: tr("clearWeekTitle"),
    message: tr("clearWeekMsg"),
    confirmText: tr("clearWeekConfirm"),
    cancelText: tr("cancel"),
  });
  if (!ok) return;
  Storage.save(DB_KEYS.PLANNER, {});
  document.querySelectorAll(".grid-cell").forEach((cell) => {
    cell.innerHTML = "";
  });
  window.SSP.showToast("success", tr("toastPlannerCleared"), "");
}
