/**
 * charts.js - Progress Charts via Canvas API
 */

document.addEventListener('DOMContentLoaded', () => {
    // Apply theme
    const savedTheme = localStorage.getItem('ssp_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    initCharts();
});

function initCharts() {
    const sessions = Storage.get(DB_KEYS.SESSIONS);
    drawBarChart(sessions);
    renderStats(sessions);
}

function drawBarChart(sessions) {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    // Set canvas size to match container
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const days = 7;
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Get last 7 days labels
    const labels = [];
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
        
        // Calculate minutes for that day
        const dayStr = d.toLocaleDateString();
        const mins = sessions
            .filter(s => new Date(s.timestamp).toLocaleDateString() === dayStr)
            .reduce((acc, s) => acc + (s.duration || 0), 0);
        data.push(mins / 60); // Convert to hours
    }

    const maxVal = Math.max(...data, 4); // Min 4h scale
    const barWidth = (chartWidth / days) * 0.6;
    const spacing = (chartWidth / days);

    // Get theme colors
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#E0DEFF' : '#1E1B4B';
    const gridColor = isDark ? '#2D2B4E' : '#E5E7EB';
    const barColor = '#6C63FF';

    // Draw Grid & Axes
    ctx.strokeStyle = gridColor;
    ctx.fillStyle = textColor;
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';

    for (let i = 0; i <= 4; i++) {
        const y = padding + chartHeight - (i / 4) * chartHeight;
        const val = ((i / 4) * maxVal).toFixed(1);
        
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
        
        ctx.fillText(`${val}h`, padding - 20, y + 4);
    }

    // Draw Bars
    data.forEach((val, i) => {
        const x = padding + (i * spacing) + (spacing - barWidth) / 2;
        const h = (val / maxVal) * chartHeight;
        const y = padding + chartHeight - h;

        // Bar shadow
        ctx.shadowColor = 'rgba(108, 99, 255, 0.2)';
        ctx.shadowBlur = 10;
        
        // Gradient
        const grad = ctx.createLinearGradient(0, y, 0, y + h);
        grad.addColorStop(0, barColor);
        grad.addColorStop(1, '#8B5CF6');
        
        ctx.fillStyle = grad;
        // Rounded corner bar (manual)
        const radius = 6;
        ctx.beginPath();
        if (h > radius) {
            ctx.moveTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.lineTo(x + barWidth - radius, y);
            ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
            ctx.lineTo(x + barWidth, y + h);
            ctx.lineTo(x, y + h);
        } else {
            ctx.rect(x, y, barWidth, h);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = textColor;
        ctx.fillText(labels[i], x + barWidth / 2, padding + chartHeight + 20);
    });
}

function renderStats(sessions) {
    const totalMins = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    document.getElementById('total-hours').textContent = `${(totalMins / 60).toFixed(1)}h`;
    document.getElementById('total-sessions').textContent = sessions.length;

    // Top Subjects
    const subjects = Storage.getSubjects();
    const subStats = subjects.map(sub => {
        const mins = sessions
            .filter(s => parseInt(s.subjectId) === sub.id)
            .reduce((acc, s) => acc + (s.duration || 0), 0);
        return { name: sub.name, color: sub.color, hours: (mins / 60).toFixed(1) };
    }).sort((a, b) => b.hours - a.hours).slice(0, 3);

    const list = document.getElementById('top-subjects-list');
    if (subStats.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No data yet.</p>';
    } else {
        list.innerHTML = subStats.map(s => `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${s.color};"></div>
                    <span style="font-weight: 600;">${s.name}</span>
                </div>
                <span style="font-weight: 700; color: var(--primary);">${s.hours}h</span>
            </div>
        `).join('');
    }
}
