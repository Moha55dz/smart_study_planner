/**
 * timer.js — Pomodoro timer with persistent state
 */

let timeLeft;
let timerId = null;
let currentMode = 25;
let isRunning = false;

const display = document.getElementById("display");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const settingsBtn = document.getElementById("settings-btn");
const modeBtns = document.querySelectorAll(".mode-btn");
const subjectSelect = document.getElementById("timer-subject");

const settingsModal = document.getElementById("settings-modal");
const closeSettingsBtn = document.getElementById("close-settings");
const saveSettingsBtn = document.getElementById("save-settings");
const pomoInput = document.getElementById("pref-pomo");
const shortInput = document.getElementById("pref-short");
const longInput = document.getElementById("pref-long");

function tr(key, vars) {
  return typeof window.t === "function" ? window.t(key, vars) : key;
}

document.addEventListener("DOMContentLoaded", () => {
  loadSubjects();
  loadSettings();
  syncWithStorage();
  updateSessionCount();
});

document.addEventListener("ssp-lang-change", () => {
  loadSubjects();
  loadSettings();
  updateDisplay();
  updateSessionCount();
});

function loadSubjects() {
  const subjects = Storage.getSubjects();
  const gen = tr("subjectGeneral");
  subjectSelect.innerHTML =
    `<option value="">${escapeHtml(gen)}</option>` +
    subjects.map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("");
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function loadSettings() {
  const settings = Storage.get(DB_KEYS.SETTINGS, { pomo: 25, short: 5, long: 15 });
  pomoInput.value = settings.pomo;
  shortInput.value = settings.short;
  longInput.value = settings.long;

  modeBtns.forEach((btn) => {
    const mode = btn.dataset.mode;
    if (mode === "pomodoro") btn.dataset.time = settings.pomo;
    if (mode === "short") btn.dataset.time = settings.short;
    if (mode === "long") btn.dataset.time = settings.long;
  });

  const activeBtn = document.querySelector(".mode-btn.active");
  if (activeBtn && !isRunning && !Storage.get(DB_KEYS.TIMER_STATE, null)) {
    currentMode = parseInt(activeBtn.dataset.time, 10);
    timeLeft = currentMode * 60;
    updateDisplay();
  }
}

function syncWithStorage() {
  const state = Storage.get(DB_KEYS.TIMER_STATE, null);
  if (state && state.endTime > Date.now()) {
    currentMode = state.duration;
    timeLeft = Math.floor((state.endTime - Date.now()) / 1000);
    isRunning = true;
    startBtn.innerHTML = '<i class="fas fa-pause"></i>';

    modeBtns.forEach((btn) => {
      if (parseInt(btn.dataset.time, 10) === currentMode) btn.classList.add("active");
      else btn.classList.remove("active");
    });

    if (state.subjectId) subjectSelect.value = state.subjectId;

    startTicking();
  } else {
    const activeBtn = document.querySelector(".mode-btn.active");
    if (activeBtn) {
      currentMode = parseInt(activeBtn.dataset.time, 10);
      timeLeft = currentMode * 60;
    }
    updateDisplay();
  }
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  display.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  document.title = tr("timerPageTitle", { time: display.textContent });
}

function startTimer() {
  if (isRunning) {
    clearInterval(timerId);
    localStorage.removeItem(DB_KEYS.TIMER_STATE);
    startBtn.innerHTML = '<i class="fas fa-play"></i>';
    isRunning = false;
  } else {
    const durationSeconds = timeLeft || currentMode * 60;
    const endTime = Date.now() + durationSeconds * 1000;

    Storage.save(DB_KEYS.TIMER_STATE, {
      endTime: endTime,
      duration: currentMode,
      subjectId: subjectSelect.value || null,
      mode: currentMode === parseInt(pomoInput.value, 10) ? "pomodoro" : "break",
    });

    startTicking();
    startBtn.innerHTML = '<i class="fas fa-pause"></i>';
    isRunning = true;
  }
}

function startTicking() {
  clearInterval(timerId);
  updateDisplay();
  timerId = setInterval(() => {
    const state = Storage.get(DB_KEYS.TIMER_STATE, null);
    if (!state) {
      clearInterval(timerId);
      syncWithStorage();
      return;
    }

    timeLeft = Math.floor((state.endTime - Date.now()) / 1000);
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimerComplete();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerId);
  localStorage.removeItem(DB_KEYS.TIMER_STATE);
  const activeBtn = document.querySelector(".mode-btn.active");
  if (activeBtn) currentMode = parseInt(activeBtn.dataset.time, 10);
  timeLeft = currentMode * 60;
  isRunning = false;
  startBtn.innerHTML = '<i class="fas fa-play"></i>';
  updateDisplay();
}

function handleTimerComplete() {
  isRunning = false;
  startBtn.innerHTML = '<i class="fas fa-play"></i>';

  try {
    const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3");
    audio.play();
  } catch (e) {}

  const state = Storage.get(DB_KEYS.TIMER_STATE, null);
  if (state && state.mode === "pomodoro") {
    Storage.logSession({
      subjectId: subjectSelect.value || null,
      duration: state.duration,
      mode: "pomodoro",
    });
    updateSessionCount();
    if (window.SSP) {
      window.SSP.showToast("success", tr("toastFocusRoundDone"), tr("toastFocusRoundBody"));
      window.SSP.addNotification("notifPomodoroProgress", null, "fa-stopwatch");
    }
  } else if (state && window.SSP) {
    window.SSP.showToast("info", tr("toastBreakOver"), tr("toastBreakOverBody"));
  }

  localStorage.removeItem(DB_KEYS.TIMER_STATE);
}

function updateSessionCount() {
  const sessions = Storage.get(DB_KEYS.SESSIONS);
  const today = new Date().toLocaleDateString();
  const count = sessions.filter((s) => new Date(s.timestamp).toLocaleDateString() === today && s.mode === "pomodoro").length;
  const el = document.getElementById("session-count");
  if (el) {
    el.innerHTML = `<i class="fas fa-seedling" style="color:var(--success);margin-inline-end:0.35rem;"></i> ${escapeHtml(tr("timerSessionsToday", { n: count }))}`;
  }
}

startBtn.onclick = startTimer;
resetBtn.onclick = resetTimer;

settingsBtn.onclick = () => {
  settingsModal.classList.add("is-open");
};

closeSettingsBtn.onclick = () => {
  settingsModal.classList.remove("is-open");
};

settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) settingsModal.classList.remove("is-open");
});

saveSettingsBtn.onclick = () => {
  const newSettings = {
    pomo: parseInt(pomoInput.value, 10),
    short: parseInt(shortInput.value, 10),
    long: parseInt(longInput.value, 10),
  };
  Storage.save(DB_KEYS.SETTINGS, newSettings);
  loadSettings();
  settingsModal.classList.remove("is-open");
  if (window.SSP) window.SSP.showToast("success", tr("toastTimerSettingsSaved"), tr("toastTimerSettingsBody"));
};

modeBtns.forEach((btn) => {
  btn.onclick = async () => {
    if (isRunning) {
      const ok = await window.SSP.showConfirm({
        title: tr("timerSwitchModeTitle"),
        message: tr("timerSwitchModeMsg"),
        confirmText: tr("timerStopSwitch"),
        cancelText: tr("timerKeepRunning"),
      });
      if (!ok) return;
      resetTimer();
    }
    modeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = parseInt(btn.dataset.time, 10);
    resetTimer();
  };
});
