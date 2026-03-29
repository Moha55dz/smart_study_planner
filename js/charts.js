/**
 * charts.js — Progress chart (canvas) and summary stats
 */

document.addEventListener("DOMContentLoaded", () => {
  initCharts();
  window.addEventListener("resize", debounce(initCharts, 200));
});

document.addEventListener("ssp-lang-change", () => {
  initCharts();
});

function debounce(fn, ms) {
  let t;
  return function () {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, arguments), ms);
  };
}

function tr(key, vars) {
  return typeof window.t === "function" ? window.t(key, vars) : key;
}

function chartLocale() {
  return window.SSP_I18N && typeof window.SSP_I18N.getLocale === "function" && window.SSP_I18N.getLocale() === "ar"
    ? "ar"
    : "en";
}

function initCharts() {
  const sessions = Storage.get(DB_KEYS.SESSIONS);
  drawBarChart(sessions);
  renderStats(sessions);
}

function drawBarChart(sessions) {
  const canvas = document.getElementById("progressChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const container = canvas.parentElement;

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  const days = 7;
  const padding = 44;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;

  const loc = chartLocale();
  const labels = [];
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString(loc === "ar" ? "ar" : "en", { weekday: "short" }));

    const dayStr = d.toLocaleDateString();
    const mins = sessions
      .filter((s) => new Date(s.timestamp).toLocaleDateString() === dayStr)
      .reduce((acc, s) => acc + (s.duration || 0), 0);
    data.push(mins / 60);
  }

  const maxVal = Math.max(...data, 4);
  const barWidth = (chartWidth / days) * 0.55;
  const spacing = chartWidth / days;

  const isDark = document.body.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#E0DEFF" : "#1E1B4B";
  const gridColor = isDark ? "#2D2B4E" : "#E5E7EB";
  const barColor = "#6366f1";

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = gridColor;
  ctx.fillStyle = textColor;
  ctx.font = '12px Poppins, "Tajawal", sans-serif';
  ctx.textAlign = "center";

  for (let i = 0; i <= 4; i++) {
    const y = padding + chartHeight - (i / 4) * chartHeight;
    const val = ((i / 4) * maxVal).toFixed(1);

    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + chartWidth, y);
    ctx.stroke();

    ctx.fillText(`${val}h`, padding - 22, y + 4);
  }

  data.forEach((val, i) => {
    const x = padding + i * spacing + (spacing - barWidth) / 2;
    const h = (val / maxVal) * chartHeight;
    const y = padding + chartHeight - h;

    ctx.shadowColor = "rgba(99, 102, 241, 0.25)";
    ctx.shadowBlur = 12;

    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, barColor);
    grad.addColorStop(1, "#8b5cf6");

    ctx.fillStyle = grad;
    const radius = 8;
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

    ctx.fillStyle = textColor;
    ctx.fillText(labels[i], x + barWidth / 2, padding + chartHeight + 18);
  });
}

function renderStats(sessions) {
  const totalMins = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const th = document.getElementById("total-hours");
  const ts = document.getElementById("total-sessions");
  if (th) th.textContent = `${(totalMins / 60).toFixed(1)}h`;
  if (ts) ts.textContent = sessions.length;

  const subjects = Storage.getSubjects();
  const subStats = subjects
    .map((sub) => {
      const mins = sessions
        .filter((s) => String(s.subjectId) === String(sub.id))
        .reduce((acc, s) => acc + (s.duration || 0), 0);
      return { name: sub.name, color: sub.color, hours: mins / 60 };
    })
    .sort((a, b) => b.hours - a.hours);

  const maxHours = Math.max(...subStats.map((s) => s.hours), 0.01);
  const top = subStats.slice(0, 5);

  const list = document.getElementById("top-subjects-list");
  if (!list) return;

  if (top.length === 0 || top.every((s) => s.hours === 0)) {
    list.innerHTML = `
            <div class="empty-state" style="padding:2rem 1rem;border-style:solid;">
                <div class="empty-state__icon"><i class="fas fa-chart-simple"></i></div>
                <h3>${escapeHtml(tr("progressEmptyTitle"))}</h3>
                <p>${escapeHtml(tr("progressEmptyDesc"))}</p>
                <a class="btn btn-primary btn-sm" href="timer.html">${escapeHtml(tr("openTimer"))}</a>
            </div>`;
    return;
  }

  list.innerHTML = top
    .map((s) => {
      const pct = Math.round((s.hours / maxHours) * 100);
      return `
            <div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:0.75rem;">
                    <div style="display:flex;align-items:center;gap:0.75rem;min-width:0;">
                        <span style="width:10px;height:10px;border-radius:50%;background:${s.color};flex-shrink:0;"></span>
                        <span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(s.name)}</span>
                    </div>
                    <span style="font-weight:700;color:var(--primary);font-variant-numeric:tabular-nums;">${s.hours.toFixed(1)}h</span>
                </div>
                <div class="progress-bar" aria-hidden="true">
                    <div class="progress-bar__fill" style="width:${pct}%;background:linear-gradient(90deg,${s.color},${s.color}cc);"></div>
                </div>
            </div>`;
    })
    .join("");
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}
