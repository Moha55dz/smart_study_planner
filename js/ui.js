/**
 * Shared UI: theme, mobile sidebar, toasts, confirm dialog, notifications panel.
 */
(function () {
  const THEME_KEY = "ssp_theme";
  const NOTIF_KEY = "ssp_notifications";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function ensureToastRoot() {
    let el = $("#toast-container");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast-container";
      el.className = "toast-container";
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    return el;
  }

  function ensureConfirmRoot() {
    let overlay = $("#ssp-confirm-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "ssp-confirm-overlay";
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="card modal-card" role="dialog" aria-modal="true" aria-labelledby="ssp-confirm-title">
        <h3 id="ssp-confirm-title" style="margin-bottom:0.75rem;font-size:1.1rem;"></h3>
        <p id="ssp-confirm-message" style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;line-height:1.5;"></p>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
          <button type="button" class="btn btn-outline" id="ssp-confirm-cancel"></button>
          <button type="button" class="btn btn-primary" id="ssp-confirm-ok"></button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    return overlay;
  }

  /**
   * Show a toast notification.
   * @param {"success"|"error"|"info"} type
   * @param {string} title
   * @param {string} [body]
   */
  function showToast(type, title, body) {
    const root = ensureToastRoot();
    const icons = {
      success: "fa-circle-check",
      error: "fa-circle-xmark",
      info: "fa-circle-info",
    };
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__icon" aria-hidden="true"><i class="fas ${icons[type] || icons.info}"></i></span>
      <div>
        <div class="toast__title"></div>
        ${body ? `<div class="toast__body"></div>` : ""}
      </div>`;
    toast.querySelector(".toast__title").textContent = title;
    if (body) toast.querySelector(".toast__body").textContent = body;
    root.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      setTimeout(() => toast.remove(), 320);
    }, 3800);
  }

  /**
   * Promise-based confirm dialog (replaces window.confirm).
   */
  function showConfirm(options) {
    const overlay = ensureConfirmRoot();
    const titleEl = $("#ssp-confirm-title", overlay);
    const msgEl = $("#ssp-confirm-message", overlay);
    const cancelBtn = $("#ssp-confirm-cancel", overlay);
    const okBtn = $("#ssp-confirm-ok", overlay);

    const tr = typeof window.t === "function" ? window.t : null;
    titleEl.textContent = options.title || (tr ? tr("confirmDefault") : "Confirm");
    msgEl.textContent = options.message || "";
    cancelBtn.textContent = options.cancelText || (tr ? tr("cancel") : "Cancel");
    okBtn.textContent = options.confirmText || (tr ? tr("ok") : "OK");

    return new Promise((resolve) => {
      function cleanup() {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        cancelBtn.onclick = null;
        okBtn.onclick = null;
        overlay.onclick = null;
        window.removeEventListener("keydown", onKey);
      }

      function onOk() {
        cleanup();
        resolve(true);
      }
      function onCancel() {
        cleanup();
        resolve(false);
      }

      function onKey(e) {
        if (e.key === "Escape") onCancel();
      }

      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");

      cancelBtn.onclick = onCancel;
      okBtn.onclick = onOk;
      overlay.onclick = (e) => {
        if (e.target === overlay) onCancel();
      };
      window.addEventListener("keydown", onKey);
    });
  }

  function parseNotifications() {
    try {
      const raw = localStorage.getItem(NOTIF_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function saveNotifications(items) {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(items.slice(0, 50)));
  }

  function addNotification(msgKey, msgVars, iconClass) {
    const items = parseNotifications();
    items.unshift({
      id: Date.now(),
      msgKey,
      msgVars,
      time: new Date().toISOString(),
      read: false,
      icon: iconClass || "fa-bell",
    });
    saveNotifications(items);
    renderNotificationBadge();
    renderNotificationList();
  }

  function markAllRead() {
    const items = parseNotifications().map((n) => ({ ...n, read: true }));
    saveNotifications(items);
    renderNotificationBadge();
    renderNotificationList();
  }

  function renderNotificationBadge() {
    const badge = $("#notifications-badge");
    if (!badge) return;
    const unread = parseNotifications().filter((n) => !n.read).length;
    badge.textContent = unread > 9 ? "9+" : String(unread);
    badge.dataset.count = String(unread);
  }

  function renderNotificationList() {
    const list = $("#notifications-list");
    if (!list) return;
    const items = parseNotifications();
    const tr = typeof window.t === "function" ? window.t : null;
    
    if (items.length === 0) {
      const msg = tr ? tr("noNotifications") : "No notifications yet.";
      list.innerHTML = `
        <div class="empty-state" style="border:none;background:transparent;padding:2rem 1rem;">
          <p style="color:var(--text-muted);font-size:0.9rem;margin:0;">${escapeHtml(msg)}</p>
        </div>`;
      return;
    }
    
    list.innerHTML = items
      .map(
        (n) => {
          let displayText = n.text || "";
          if (n.msgKey) {
             displayText = tr ? tr(n.msgKey, n.msgVars) : n.msgKey;
          }
          return `
          <div class="notification-item ${n.read ? "" : "unread"}" data-id="${n.id}" style="display:flex; gap:0.75rem; align-items:center;">
            <div class="notification-item__icon"><i class="fas ${n.icon || "fa-bell"}"></i></div>
            <div style="flex:1; min-width:0;">
              <div class="notification-item__text">${escapeHtml(displayText)}</div>
              <div class="notification-item__time">${formatTime(n.time)}</div>
            </div>
            <a href="#" class="delete-notif-btn" data-id="${n.id}" style="color:var(--danger); opacity:0.7; padding:0.25rem;" aria-label="Delete">
              <i class="fas fa-xmark"></i>
            </a>
          </div>`;
        }
      )
      .join("");
      
    // Bind delete buttons
    list.querySelectorAll(".delete-notif-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.getAttribute("data-id"), 10);
        let updated = parseNotifications().filter(n => n.id !== id);
        saveNotifications(updated);
        renderNotificationBadge();
        renderNotificationList();
      });
    });
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function formatTime(iso) {
    try {
      const d = new Date(iso);
      const loc =
        window.SSP_I18N && typeof window.SSP_I18N.getLocale === "function"
          ? window.SSP_I18N.getLocale() === "ar"
            ? "ar"
            : "en"
          : undefined;
      return d.toLocaleString(loc || undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  }

  function updateThemeIcons(theme) {
    const tr = typeof window.t === "function" ? window.t : null;
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
      const label =
        theme === "dark"
          ? tr
            ? tr("ariaSwitchToLight")
            : "Switch to light mode"
          : tr
            ? tr("ariaSwitchToDark")
            : "Switch to dark mode";
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", tr ? tr("ariaToggleTheme") : "Toggle theme");
    });
  }

  function applyThemeFromStorage() {
    const t = localStorage.getItem(THEME_KEY) || "light";
    document.body.setAttribute("data-theme", t);
    updateThemeIcons(t);
  }

  function bindThemeToggles() {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cur = document.body.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const next = cur === "light" ? "dark" : "light";
        document.body.setAttribute("data-theme", next);
        localStorage.setItem(THEME_KEY, next);
        updateThemeIcons(next);
      });
    });
  }

  function bindMobileNav() {
    const openBtn = $("#sidebar-open");
    const sidebar = $("#app-sidebar");
    const backdrop = $("#sidebar-backdrop");

    function open() {
      if (sidebar) sidebar.classList.add("is-open");
      if (backdrop) {
        backdrop.classList.add("is-visible");
        backdrop.setAttribute("aria-hidden", "false");
      }
    }
    function close() {
      if (sidebar) sidebar.classList.remove("is-open");
      if (backdrop) {
        backdrop.classList.remove("is-visible");
        backdrop.setAttribute("aria-hidden", "true");
      }
    }

    if (openBtn) openBtn.addEventListener("click", open);
    if (backdrop) backdrop.addEventListener("click", close);

    document.querySelectorAll(".nav-link").forEach((a) => {
      a.addEventListener("click", () => {
        if (window.innerWidth <= 900) close();
      });
    });
  }

  function bindNotifications() {
    const btn = $("#notifications-toggle");
    const panel = $("#notifications-panel");
    const markRead = $("#notifications-mark-read");

    if (btn && panel) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        panel.classList.toggle("is-open");
        renderNotificationList();
      });
      document.addEventListener("click", () => panel.classList.remove("is-open"));
      panel.addEventListener("click", (e) => e.stopPropagation());
    }
    if (markRead) {
      markRead.addEventListener("click", () => {
        markAllRead();
        const tr = typeof window.t === "function" ? window.t : null;
        showToast(
          "success",
          tr ? tr("toastNotifClearedTitle") : "Notifications cleared",
          tr ? tr("toastNotifClearedBody") : "All marked as read."
        );
      });
    }
    renderNotificationBadge();
    renderNotificationList();
  }

  function seedWelcomeNotification() {
    const items = parseNotifications();
    if (items.length === 0) {
      saveNotifications([
        {
          id: Date.now(),
          msgKey: "welcomeNotification",
          msgVars: null,
          time: new Date().toISOString(),
          read: true,
          icon: "fa-graduation-cap",
        },
      ]);
      renderNotificationBadge();
      renderNotificationList();
    }
  }

  function onLangChange() {
    renderNotificationList();
    renderNotificationBadge();
    const theme = document.body.getAttribute("data-theme") || "light";
    updateThemeIcons(theme);
  }

  function init() {
    applyThemeFromStorage();
    bindThemeToggles();
    bindMobileNav();
    bindNotifications();
    seedWelcomeNotification();
    document.addEventListener("ssp-lang-change", onLangChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.SSP = {
    showToast,
    showConfirm,
    addNotification,
    parseNotifications,
    applyThemeFromStorage,
  };
})();
