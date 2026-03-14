/**
 * planner.js - Weekly Planner Logic
 */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM

let selectedCell = null;

document.addEventListener('DOMContentLoaded', () => {
    // Apply theme
    const savedTheme = localStorage.getItem('ssp_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    renderGrid();
    loadPlanner();
});

function renderGrid() {
    const grid = document.getElementById('planner-grid');
    
    HOURS.forEach(hour => {
        // Time Label
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-col';
        timeLabel.textContent = `${hour}:00`;
        grid.appendChild(timeLabel);

        // Day Cells
        DAYS.forEach((day, index) => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.day = index;
            cell.dataset.hour = hour;
            cell.onclick = () => openSelector(cell);
            grid.appendChild(cell);
        });
    });
}

function openSelector(cell) {
    selectedCell = cell;
    const selector = document.getElementById('subject-selector');
    const list = document.getElementById('subject-list');
    const subjects = Storage.getSubjects();

    if (subjects.length === 0) {
        alert('Please add some subjects first!');
        window.location.href = 'subjects.html';
        return;
    }

    list.innerHTML = subjects.map(s => `
        <button class="btn btn-outline" style="justify-content: flex-start; border-left: 4px solid ${s.color};" onclick="assignSubject(${s.id})">
            ${s.name}
        </button>
    `).join('');

    selector.style.display = 'flex';
}

function closeSelector() {
    document.getElementById('subject-selector').style.display = 'none';
    selectedCell = null;
}

function assignSubject(subjectId) {
    const subjects = Storage.getSubjects();
    const subject = subjects.find(s => s.id === subjectId);
    
    const day = selectedCell.dataset.day;
    const hour = selectedCell.dataset.hour;

    // Save to LocalStorage
    const plannerData = Storage.get(DB_KEYS.PLANNER, {});
    if (!plannerData[day]) plannerData[day] = {};
    plannerData[day][hour] = subjectId;
    Storage.save(DB_KEYS.PLANNER, plannerData);

    renderSessionBlock(selectedCell, subject);
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

    selectedCell.innerHTML = '';
    closeSelector();
}

function renderSessionBlock(cell, subject) {
    cell.innerHTML = `
        <div class="session-block" style="background-color: ${subject.color}">
            ${subject.name}
        </div>
    `;
}

function loadPlanner() {
    const plannerData = Storage.get(DB_KEYS.PLANNER, {});
    const subjects = Storage.getSubjects();

    Object.keys(plannerData).forEach(day => {
        Object.keys(plannerData[day]).forEach(hour => {
            const subjectId = plannerData[day][hour];
            const subject = subjects.find(s => s.id === subjectId);
            if (subject) {
                const cell = document.querySelector(`.grid-cell[data-day="${day}"][data-hour="${hour}"]`);
                if (cell) renderSessionBlock(cell, subject);
            }
        });
    });
}

function clearPlanner() {
    if (confirm('Clear all scheduled sessions for this week?')) {
        Storage.save(DB_KEYS.PLANNER, {});
        document.querySelectorAll('.grid-cell').forEach(cell => cell.innerHTML = '');
    }
}
