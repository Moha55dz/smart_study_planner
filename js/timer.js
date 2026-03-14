/**
 * timer.js - Persistent & Customizable Pomodoro Logic
 */

let timeLeft;
let timerId = null;
let currentMode = 25; // default 25 mins
let isRunning = false;

// DOM Elements
const display = document.getElementById('display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const settingsBtn = document.getElementById('settings-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const subjectSelect = document.getElementById('timer-subject');

// Settings Modal Elements
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');
const pomoInput = document.getElementById('pref-pomo');
const shortInput = document.getElementById('pref-short');
const longInput = document.getElementById('pref-long');

document.addEventListener('DOMContentLoaded', () => {
    // Apply theme
    const savedTheme = localStorage.getItem('ssp_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    loadSubjects();
    loadSettings();
    syncWithStorage();
    updateSessionCount();
});

function loadSubjects() {
    const subjects = Storage.getSubjects();
    subjectSelect.innerHTML += subjects.map(s => `
        <option value="${s.id}">${s.name}</option>
    `).join('');
}

function loadSettings() {
    const settings = Storage.get(DB_KEYS.SETTINGS, { pomo: 25, short: 5, long: 15 });
    pomoInput.value = settings.pomo;
    shortInput.value = settings.short;
    longInput.value = settings.long;

    // Update active button dataset values if they exist
    modeBtns.forEach(btn => {
        if (btn.textContent === 'Pomodoro') btn.dataset.time = settings.pomo;
        if (btn.textContent === 'Short Break') btn.dataset.time = settings.short;
        if (btn.textContent === 'Long Break') btn.dataset.time = settings.long;
    });

    // If not running, update currentMode to follow active button
    const activeBtn = document.querySelector('.mode-btn.active');
    if (activeBtn && !isRunning && !Storage.get(DB_KEYS.TIMER_STATE, null)) {
        currentMode = parseInt(activeBtn.dataset.time);
        timeLeft = currentMode * 60;
        updateDisplay();
    }
}

function syncWithStorage() {
    const state = Storage.get(DB_KEYS.TIMER_STATE, null);
    if (state && state.endTime > Date.now()) {
        // Timer is running
        currentMode = state.duration;
        timeLeft = Math.floor((state.endTime - Date.now()) / 1000);
        isRunning = true;
        startBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Select the right mode button based on duration (or name if we had it)
        modeBtns.forEach(btn => {
            if (parseInt(btn.dataset.time) === currentMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Set subject if saved
        if (state.subjectId) subjectSelect.value = state.subjectId;

        startTicking();
    } else {
        // If it finished while away, app.js already handled logging.
        // Just reset to current active mode's set time.
        const activeBtn = document.querySelector('.mode-btn.active');
        if (activeBtn) {
            currentMode = parseInt(activeBtn.dataset.time);
            timeLeft = currentMode * 60;
        }
        updateDisplay();
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${display.textContent} - Study Timer`;
}

function startTimer() {
    if (isRunning) {
        clearInterval(timerId);
        localStorage.removeItem(DB_KEYS.TIMER_STATE);
        startBtn.innerHTML = '<i class="fas fa-play"></i>';
        isRunning = false;
    } else {
        const durationSeconds = (timeLeft || currentMode * 60);
        const endTime = Date.now() + (durationSeconds * 1000);
        
        Storage.save(DB_KEYS.TIMER_STATE, {
            endTime: endTime,
            duration: currentMode,
            subjectId: subjectSelect.value || null,
            mode: currentMode === parseInt(pomoInput.value) ? 'pomodoro' : 'break'
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
            syncWithStorage(); // Reset to current settings
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
    const activeBtn = document.querySelector('.mode-btn.active');
    if (activeBtn) currentMode = parseInt(activeBtn.dataset.time);
    timeLeft = currentMode * 60;
    isRunning = false;
    startBtn.innerHTML = '<i class="fas fa-play"></i>';
    updateDisplay();
}

function handleTimerComplete() {
    isRunning = false;
    startBtn.innerHTML = '<i class="fas fa-play"></i>';
    
    // Play sound if possible
    try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play();
    } catch(e) {}

    const state = Storage.get(DB_KEYS.TIMER_STATE, null);
    if (state && state.mode === 'pomodoro') {
        Storage.logSession({
            subjectId: subjectSelect.value || null,
            duration: state.duration,
            mode: 'pomodoro'
        });
        updateSessionCount();
        alert('Time for a break!');
    } else if (state) {
        alert('Break is over! Time to focus.');
    }
    
    localStorage.removeItem(DB_KEYS.TIMER_STATE);
}

function updateSessionCount() {
    const sessions = Storage.get(DB_KEYS.SESSIONS);
    const today = new Date().toLocaleDateString();
    const count = sessions.filter(s => new Date(s.timestamp).toLocaleDateString() === today && s.mode === 'pomodoro').length;
    const el = document.getElementById('session-count');
    if (el) el.textContent = `Sessions completed today: ${count}`;
}

// Event Listeners
startBtn.onclick = startTimer;
resetBtn.onclick = resetTimer;

settingsBtn.onclick = () => {
    settingsModal.style.display = 'flex';
};

closeSettingsBtn.onclick = () => {
    settingsModal.style.display = 'none';
};

saveSettingsBtn.onclick = () => {
    const newSettings = {
        pomo: parseInt(pomoInput.value),
        short: parseInt(shortInput.value),
        long: parseInt(longInput.value)
    };
    Storage.save(DB_KEYS.SETTINGS, newSettings);
    loadSettings();
    settingsModal.style.display = 'none';
};

modeBtns.forEach(btn => {
    btn.onclick = () => {
        if (isRunning && !confirm('Stop currently running timer?')) return;
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = parseInt(btn.dataset.time);
        resetTimer();
    };
});
