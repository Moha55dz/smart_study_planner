/**
 * Smart Study Planner — i18n (English / Arabic)
 * Usage: t("key") or t("key", { n: 3 })
 * Mark static strings in HTML with data-i18n="key"
 */
(function () {
  const STORAGE_KEY = "ssp_lang";
  const DEFAULT_LANG = "en";

  const TRANSLATIONS = {
    en: {
      ariaLanguageSwitcher: "Language",
      langEn: "English",
      langAr: "Arabic",

      brandTitle: "Smart Study",
      brandSubtitle: "Planner",
      navDashboard: "Dashboard",
      navTasks: "Tasks",
      navSubjects: "Subjects",
      navPlanner: "Planner",
      navTimer: "Timer",
      navProgress: "Progress",

      sidebarFooterDashboard: "Stay consistent. Study smarter.",
      sidebarFooterTasks: "Tasks keep priorities visible.",
      sidebarFooterSubjects: "Color-code your courses.",
      sidebarFooterPlanner: "Click a cell to schedule.",
      sidebarFooterTimer: "One focused block at a time.",
      sidebarFooterProgress: "Consistency beats intensity.",
      sidebarFooterNotes: "Notes · scratchpad",

      ariaMainNav: "Main navigation",
      openMenu: "Open menu",
      welcomeLine: "Welcome back — let’s focus on what matters.",
      notifications: "Notifications",
      ariaNotifications: "Notifications",
      ariaNotificationsList: "Notifications list",
      markAllRead: "Mark all read",
      ariaToggleTheme: "Toggle theme",
      ariaSwitchToLight: "Switch to light mode",
      ariaSwitchToDark: "Switch to dark mode",
      userName: "Student",
      userRole: "Learner",

      topbarDashboard: "Dashboard",
      topbarTasks: "Tasks",
      topbarSubjects: "Subjects",
      topbarPlanner: "Weekly planner",
      topbarTimer: "Focus timer",
      topbarProgress: "Progress",
      topbarNotes: "Study notes",

      descDashboard: "Track subjects, tasks, and sessions at a glance.",
      descTasks: "Assignments and to-dos in one place.",
      descSubjects: "Tags for planner and timer.",
      descPlanner: "Mon–Sun grid, aligned with your week.",
      descTimer: "Pomodoro with logged sessions.",
      descProgress: "Hours and trends from your sessions.",
      descNotes: "Quick capture while you learn.",

      pageOverview: "Overview",
      pageOverviewDesc: "Track subjects, tasks, and sessions at a glance.",
      pageTasksH1: "Task management",
      pageTasksDesc: "Capture work, set optional due dates, and track status at a glance.",
      pageSubjectsH1: "My subjects",
      pageSubjectsDesc: "Group work by course for scheduling and analytics.",
      pagePlannerH1: "Weekly schedule",
      pagePlannerDesc: "Tap an empty slot to assign a subject. Today’s column is highlighted.",
      pageTimerH1: "Pomodoro",
      pageTimerDesc: "Optional: tag sessions with a subject for progress charts.",
      pageProgressH1: "Progress tracking",
      pageProgressDesc: "Visualize study hours and subject balance from logged Pomodoro sessions.",
      pageNotesH1: "Notes",
      pageNotesDesc: "Lightweight cards — edit inline. Not persisted (browser session only).",

      statTotalSubjects: "Total Subjects",
      statOrganizeCourses: "Organize courses",
      statTasksDone: "Tasks Done",
      statMomentum: "Momentum",
      statStudyStreak: "Study Streak",
      statKeepGoing: "Keep going",
      statDays: "days",
      statStreakValue: "{n} days",
      statHoursToday: "Today’s Hours",
      statFocusTime: "Focus time",
      statHoursValue: "{h}h",

      upcomingSessions: "Upcoming sessions",
      openPlanner: "Open planner",
      noSessionsToday: "No sessions scheduled for today.",
      noSessionsTitle: "No sessions today",
      noSessionsDesc: "Block time in the planner to see it here.",
      quickTasks: "Quick tasks",
      clearTasks: "Clear",
      btnPending: "Pending",
      btnShowAll: "Show all",
      btnAdd: "Add",
      titleClearTasks: "Clear all tasks",
      titleToggleTasks: "Show pending or all",

      quickTasksEmptyTitle: "No tasks yet",
      quickTasksEmptyDesc: "Add a quick task to build momentum for your day.",
      btnAddTaskEmpty: "Add task",

      newQuickTask: "New quick task",
      taskNameLabel: "Task name",
      taskNamePlaceholder: "What needs to be done?",
      cancel: "Cancel",
      addTask: "Add task",

      deleteTaskTitle: "Delete task?",
      deleteTaskMsg: "This task will be removed from your list.",
      delete: "Delete",
      clearAllTasksTitle: "Clear all tasks?",
      clearAllTasksMsg: "This removes every task from your list. This cannot be undone.",
      clearAll: "Clear all",

      toastTaskAdded: "Task added",
      toastTasksCleared: "Tasks cleared",
      toastTasksClearedBody: "Your task list is empty.",
      toastFocusComplete: "Focus session complete",
      toastFocusCompleteBody: "Time for a break.",
      notifTaskDeleted: "Task deleted.",
      notifTasksCleared: "All tasks were cleared.",
      notifPomodoroLogged: "Pomodoro session logged.",
      notifNewTask: "New task: {name}",

      sessionFallback: "Study",

      subjectGeneral: "General",
      addTaskBtn: "Add task",
      taskNameAria: "Task name",
      subjectAria: "Subject",
      dueDateAria: "Due date (optional)",
      dueDateTitle: "Due date (optional)",

      statusDone: "Done",
      statusOverdue: "Overdue",
      statusPending: "Pending",

      tasksEmptyTitle: "No tasks yet",
      tasksEmptyDesc: "Break work into steps and add your first task above.",

      deleteTaskConfirmTitle: "Delete this task?",
      deleteTaskConfirmMsg: "You can always add it again later.",
      toastTaskRemoved: "Task removed",
      notifTaskDeleted2: "A task was deleted.",
      toastNeedTaskName: "Add a task name",
      toastNeedTaskNameBody: "Enter what you need to do.",
      toastTaskCreated: "Task created: {name}",

      subjectsEmptyTitle: "No subjects yet",
      subjectsEmptyDesc: "Add your courses to unlock the planner and richer progress stats.",
      addSubject: "Add subject",
      addSubjectModalTitle: "Add subject",
      subjectNameLabel: "Subject name",
      subjectNamePlaceholder: "e.g. Linear algebra",
      colorTag: "Color tag",
      saveSubject: "Save subject",
      deleteSubjectTitle: "Delete subject?",
      deleteSubjectMsg: "Planner slots using this subject may need to be reassigned.",
      subjectActive: "Active",
      toastSubjectSaved: "Subject saved",
      toastSubjectRemoved: "Subject removed",
      notifSubjectAdded: "Subject added: {name}",

      plannerWeeklyH1: "Weekly schedule",
      plannerTimeCol: "Time",
      plannerDayMon: "Mon",
      plannerDayTue: "Tue",
      plannerDayWed: "Wed",
      plannerDayThu: "Thu",
      plannerDayFri: "Fri",
      plannerDaySat: "Sat",
      plannerDaySun: "Sun",
      plannerGridAria: "Weekly study schedule",
      plannerClearWeek: "Clear week",
      plannerSelectSubject: "Select subject",
      plannerRemove: "Remove",
      toastAddSubjectsFirst: "Add subjects first",
      toastAddSubjectsFirstBody: "Create a subject on the Subjects page, then return here.",
      notifScheduled: "Scheduled: {name}",
      toastSessionRemoved: "Session removed",
      clearWeekTitle: "Clear entire week?",
      clearWeekMsg: "All scheduled sessions in this grid will be removed.",
      clearWeekConfirm: "Clear week",
      toastPlannerCleared: "Planner cleared",

      progressChartTitle: "Study hours (last 7 days)",
      progressBadgeOverview: "Overview",
      progressTopSubjects: "Top subjects",
      progressTotals: "Totals",
      totalHours: "Total hours",
      sessions: "Sessions",
      progressEmptyTitle: "No study data yet",
      progressEmptyDesc: "Complete focus sessions with the timer to populate this chart.",
      openTimer: "Open timer",

      timerSubjectLabel: "Subject",
      timerSessionsToday: "Sessions completed today: {n}",
      timerSettingsTitle: "Timer settings (minutes)",
      timerPomodoro: "Pomodoro",
      timerShortBreak: "Short break",
      timerLongBreak: "Long break",
      timerSave: "Save",
      timerSwitchModeTitle: "Switch mode?",
      timerSwitchModeMsg: "This will stop the running timer.",
      timerStopSwitch: "Stop & switch",
      timerKeepRunning: "Keep running",
      toastTimerSettingsSaved: "Settings saved",
      toastTimerSettingsBody: "Durations updated.",
      toastFocusRoundDone: "Focus round complete",
      toastFocusRoundBody: "Take a short break.",
      toastBreakOver: "Break finished",
      toastBreakOverBody: "Ready for another focus block.",
      notifPomodoroProgress: "Pomodoro session logged to progress.",
      timerPageTitle: "{time} · Study timer",
      timerResetAria: "Reset timer",
      timerStartAria: "Start or pause",
      timerSettingsAria: "Timer settings",

      notesNewNote: "New note",
      notesSampleTitle: "Quick idea",
      notesSampleBody: "Click to edit. Jot formulas, links, or reminders between sessions.",
      notesJustNow: "Just now",
      toastNoteAdded: "Note added",
      toastNoteAddedBody: "You can edit the title and body inline.",

      noNotifications: "No notifications yet.",
      welcomeNotification: "Welcome to Smart Study Planner. Add tasks, plan sessions, and track progress.",
      toastNotifClearedTitle: "Notifications cleared",
      toastNotifClearedBody: "All marked as read.",

      docTitleDashboard: "Smart Study Planner — Dashboard",
      docTitleTasks: "Tasks — Smart Study Planner",
      docTitleSubjects: "Subjects — Smart Study Planner",
      docTitlePlanner: "Planner — Smart Study Planner",
      docTitleTimer: "Timer — Smart Study Planner",
      docTitleProgress: "Progress — Smart Study Planner",
      docTitleNotes: "Notes — Smart Study Planner",

      confirmDefault: "Confirm",
      ok: "OK",
    },
    ar: {
      ariaLanguageSwitcher: "اللغة",
      langEn: "English",
      langAr: "العربية",

      brandTitle: "الدراسة الذكية",
      brandSubtitle: "المخطط",
      navDashboard: "لوحة التحكم",
      navTasks: "المهام",
      navSubjects: "المواد",
      navPlanner: "المخطط الزمني",
      navTimer: "المؤقت",
      navProgress: "التقدم",

      sidebarFooterDashboard: "ثابر.ادرس بذكاء.",
      sidebarFooterTasks: "المهام تجعل أولوياتك واضحة.",
      sidebarFooterSubjects: "لوّن موادك الدراسية.",
      sidebarFooterPlanner: "انقر على خلية للجدولة.",
      sidebarFooterTimer: "كتلة تركيز واحدة في كل مرة.",
      sidebarFooterProgress: "الانتظام يتفوق على العنف.",
      sidebarFooterNotes: "ملاحظات · مسودة",

      ariaMainNav: "التنقل الرئيسي",
      openMenu: "فتح القائمة",
      welcomeLine: "مرحبًا بعودتك — لنركز على ما يهم.",
      notifications: "الإشعارات",
      ariaNotifications: "الإشعارات",
      ariaNotificationsList: "قائمة الإشعارات",
      markAllRead: "تعليم الكل كمقروء",
      ariaToggleTheme: "تبديل المظهر",
      ariaSwitchToLight: "التبديل إلى الوضع الفاتح",
      ariaSwitchToDark: "التبديل إلى الوضع الداكن",
      userName: "طالب",
      userRole: "متعلم",

      topbarDashboard: "لوحة التحكم",
      topbarTasks: "المهام",
      topbarSubjects: "المواد",
      topbarPlanner: "المخطط الأسبوعي",
      topbarTimer: "مؤقت التركيز",
      topbarProgress: "التقدم",
      topbarNotes: "ملاحظات الدراسة",

      descDashboard: "تابع المواد والمهام والجلسات في لمحة.",
      descTasks: "الواجبات والمهام في مكان واحد.",
      descSubjects: "وسوم للمخطط والمؤقت.",
      descPlanner: "شبكة من الإثنين إلى الأحد.",
      descTimer: "بومودورو مع تسجيل الجلسات.",
      descProgress: "الساعات والاتجاهات من جلساتك.",
      descNotes: "التقاط سريع أثناء التعلم.",

      pageOverview: "نظرة عامة",
      pageOverviewDesc: "تابع المواد والمهام والجلسات في لمحة.",
      pageTasksH1: "إدارة المهام",
      pageTasksDesc: "سجّل العمل واختر مواعيد نهائية اختيارية وتابع الحالة.",
      pageSubjectsH1: "موادي الدراسية",
      pageSubjectsDesc: "جمّع العمل حسب المادة للجدولة والتحليلات.",
      pagePlannerH1: "الجدول الأسبوعي",
      pagePlannerDesc: "انقر على فراغ لتعيين مادة. عمود اليوم مميز.",
      pageTimerH1: "بومودورو",
      pageTimerDesc: "اختياري: اربط الجلسات بمادة لرسوم التقدم.",
      pageProgressH1: "تتبع التقدم",
      pageProgressDesc: "تصوّر ساعات الدراسة وتوازن المواد من جلسات بومودورو.",
      pageNotesH1: "ملاحظات",
      pageNotesDesc: "بطاقات خفيفة — تعديل مباشر. لا يُحفظ (جلسة المتصفح فقط).",

      statTotalSubjects: "إجمالي المواد",
      statOrganizeCourses: "نظّم المواد",
      statTasksDone: "مهام منجزة",
      statMomentum: "زخم",
      statStudyStreak: "سلسلة الدراسة",
      statKeepGoing: "واصل",
      statDays: "أيام",
      statStreakValue: "{n} أيام",
      statHoursToday: "ساعات اليوم",
      statFocusTime: "وقت تركيز",
      statHoursValue: "{h} س",

      upcomingSessions: "الجلسات القادمة",
      openPlanner: "فتح المخطط",
      noSessionsToday: "لا جلسات مجدولة اليوم.",
      noSessionsTitle: "لا جلسات اليوم",
      noSessionsDesc: "احجز وقتًا في المخطط ليظهر هنا.",
      quickTasks: "مهام سريعة",
      clearTasks: "مسح",
      btnPending: "معلّقة",
      btnShowAll: "عرض الكل",
      btnAdd: "إضافة",
      titleClearTasks: "مسح كل المهام",
      titleToggleTasks: "عرض المعلّقة أو الكل",

      quickTasksEmptyTitle: "لا مهام بعد",
      quickTasksEmptyDesc: "أضف مهمة سريعة لبناء زخم يومك.",
      btnAddTaskEmpty: "إضافة مهمة",

      newQuickTask: "مهمة سريعة جديدة",
      taskNameLabel: "اسم المهمة",
      taskNamePlaceholder: "ماذا يجب إنجازه؟",
      cancel: "إلغاء",
      addTask: "إضافة مهمة",

      deleteTaskTitle: "حذف المهمة؟",
      deleteTaskMsg: "ستُزال المهمة من قائمتك.",
      delete: "حذف",
      clearAllTasksTitle: "مسح كل المهام؟",
      clearAllTasksMsg: "سيُزال كل المهام. لا يمكن التراجع.",
      clearAll: "مسح الكل",

      toastTaskAdded: "تمت إضافة المهمة",
      toastTasksCleared: "تم مسح المهام",
      toastTasksClearedBody: "قائمة المهام فارغة.",
      toastFocusComplete: "اكتملت جلسة التركيز",
      toastFocusCompleteBody: "حان وقت الاستراحة.",
      notifTaskDeleted: "تم حذف المهمة.",
      notifTasksCleared: "تم مسح كل المهام.",
      notifPomodoroLogged: "تم تسجيل جلسة بومودورو.",
      notifNewTask: "مهمة جديدة: {name}",

      sessionFallback: "دراسة",

      subjectGeneral: "عام",
      addTaskBtn: "إضافة مهمة",
      taskNameAria: "اسم المهمة",
      subjectAria: "المادة",
      dueDateAria: "تاريخ الاستحقاق (اختياري)",
      dueDateTitle: "تاريخ الاستحقاق (اختياري)",

      statusDone: "مكتمل",
      statusOverdue: "متأخر",
      statusPending: "معلّق",

      tasksEmptyTitle: "لا مهام بعد",
      tasksEmptyDesc: "قسّم العمل إلى خطوات وأضف أول مهمة أعلاه.",

      deleteTaskConfirmTitle: "حذف هذه المهمة؟",
      deleteTaskConfirmMsg: "يمكنك إضافتها لاحقًا مرة أخرى.",
      toastTaskRemoved: "أُزيلت المهمة",
      notifTaskDeleted2: "حُذفت مهمة.",
      toastNeedTaskName: "أدخل اسم المهمة",
      toastNeedTaskNameBody: "اكتب ما تريد إنجازه.",
      toastTaskCreated: "تم إنشاء المهمة: {name}",

      subjectsEmptyTitle: "لا مواد بعد",
      subjectsEmptyDesc: "أضف موادك لاستخدام المخطط وإحصاءات أوضح.",
      addSubject: "إضافة مادة",
      addSubjectModalTitle: "إضافة مادة",
      subjectNameLabel: "اسم المادة",
      subjectNamePlaceholder: "مثال: الجبر الخطي",
      colorTag: "لون التمييز",
      saveSubject: "حفظ المادة",
      deleteSubjectTitle: "حذف المادة؟",
      deleteSubjectMsg: "قد تحتاج لإعادة تعيين الجلسات في المخطط.",
      subjectActive: "نشط",
      toastSubjectSaved: "تم حفظ المادة",
      toastSubjectRemoved: "أُزيلت المادة",
      notifSubjectAdded: "أُضيفت مادة: {name}",

      plannerWeeklyH1: "الجدول الأسبوعي",
      plannerTimeCol: "الوقت",
      plannerDayMon: "الإثنين",
      plannerDayTue: "الثلاثاء",
      plannerDayWed: "الأربعاء",
      plannerDayThu: "الخميس",
      plannerDayFri: "الجمعة",
      plannerDaySat: "السبت",
      plannerDaySun: "الأحد",
      plannerGridAria: "جدول الدراسة الأسبوعي",
      plannerClearWeek: "مسح الأسبوع",
      plannerSelectSubject: "اختر المادة",
      plannerRemove: "إزالة",
      toastAddSubjectsFirst: "أضف موادًا أولًا",
      toastAddSubjectsFirstBody: "أنشئ مادة من صفحة المواد ثم عد هنا.",
      notifScheduled: "مجدول: {name}",
      toastSessionRemoved: "أُزيلت الجلسة",
      clearWeekTitle: "مسح الأسبوع بالكامل؟",
      clearWeekMsg: "ستُزال كل الجلسات من الشبكة.",
      clearWeekConfirm: "مسح الأسبوع",
      toastPlannerCleared: "تم مسح المخطط",

      progressChartTitle: "ساعات الدراسة (آخر 7 أيام)",
      progressBadgeOverview: "نظرة عامة",
      progressTopSubjects: "أهم المواد",
      progressTotals: "الإجماليات",
      totalHours: "إجمالي الساعات",
      sessions: "الجلسات",
      progressEmptyTitle: "لا بيانات بعد",
      progressEmptyDesc: "أكمل جلسات التركيز بالمؤقت لملء هذا الرسم.",
      openTimer: "فتح المؤقت",

      timerSubjectLabel: "المادة",
      timerSessionsToday: "جلسات مكتملة اليوم: {n}",
      timerSettingsTitle: "إعدادات المؤقت (دقائق)",
      timerPomodoro: "بومودورو",
      timerShortBreak: "استراحة قصيرة",
      timerLongBreak: "استراحة طويلة",
      timerSave: "حفظ",
      timerSwitchModeTitle: "تبديل الوضع؟",
      timerSwitchModeMsg: "سيتوقف المؤقت الحالي.",
      timerStopSwitch: "إيقاف وتبديل",
      timerKeepRunning: "الإبقاء على التشغيل",
      toastTimerSettingsSaved: "تم حفظ الإعدادات",
      toastTimerSettingsBody: "عُدّلت المدد.",
      toastFocusRoundDone: "اكتملت جولة التركيز",
      toastFocusRoundBody: "خذ استراحة قصيرة.",
      toastBreakOver: "انتهت الاستراحة",
      toastBreakOverBody: "جاهز لجولة تركيز أخرى.",
      notifPomodoroProgress: "سُجّلت جلسة بومودورو في التقدم.",
      timerPageTitle: "{time} · مؤقت الدراسة",
      timerResetAria: "إعادة ضبط المؤقت",
      timerStartAria: "تشغيل أو إيقاف مؤقت",
      timerSettingsAria: "إعدادات المؤقت",

      notesNewNote: "ملاحظة جديدة",
      notesSampleTitle: "فكرة سريعة",
      notesSampleBody: "انقر للتعديل. سجّل الصيغ والروابط والتذكيرات بين الجلسات.",
      notesJustNow: "الآن",
      toastNoteAdded: "أُضيفت ملاحظة",
      toastNoteAddedBody: "يمكنك تعديل العنوان والنص مباشرة.",

      noNotifications: "لا إشعارات بعد.",
      welcomeNotification: "مرحبًا بك في مخطط الدراسة الذكية. أضف المهام والجلسات وتابع تقدمك.",
      toastNotifClearedTitle: "تم مسح الإشعارات",
      toastNotifClearedBody: "عُلّمت الكل كمقروء.",

      docTitleDashboard: "مخطط الدراسة الذكية — لوحة التحكم",
      docTitleTasks: "المهام — مخطط الدراسة الذكية",
      docTitleSubjects: "المواد — مخطط الدراسة الذكية",
      docTitlePlanner: "المخطط — مخطط الدراسة الذكية",
      docTitleTimer: "المؤقت — مخطط الدراسة الذكية",
      docTitleProgress: "التقدم — مخطط الدراسة الذكية",
      docTitleNotes: "الملاحظات — مخطط الدراسة الذكية",

      confirmDefault: "تأكيد",
      ok: "حسنًا",
    },
  };

  let currentLang = DEFAULT_LANG;

  function getLang() {
    return currentLang;
  }

  function interpolate(str, vars) {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
  }

  function t(key, vars) {
    const table = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    const fallback = TRANSLATIONS.en[key] !== undefined ? TRANSLATIONS.en[key] : key;
    const raw = table[key] !== undefined ? table[key] : fallback;
    return interpolate(raw, vars);
  }

  function applyDomTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key || !el.setAttribute) return;
      el.setAttribute("placeholder", t(key));
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      el.setAttribute("title", t(key));
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      el.setAttribute("aria-label", t(key));
    });

    const titleKey = document.body && document.body.getAttribute("data-page-title-key");
    if (titleKey) {
      document.title = t(titleKey);
    }

    document.querySelectorAll(".lang-switcher__btn").forEach((btn) => {
      const lang = btn.getAttribute("data-lang");
      btn.classList.toggle("is-active", lang === currentLang);
      btn.setAttribute("aria-pressed", lang === currentLang ? "true" : "false");
    });
  }

  function setLang(lang, skipEvent) {
    if (lang !== "en" && lang !== "ar") lang = DEFAULT_LANG;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    const root = document.documentElement;
    root.setAttribute("lang", lang === "ar" ? "ar" : "en");
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.body && document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    root.classList.add("i18n-transition");
    window.setTimeout(() => root.classList.remove("i18n-transition"), 320);

    applyDomTranslations();

    if (!skipEvent) {
      document.dispatchEvent(new CustomEvent("ssp-lang-change", { detail: { lang } }));
    }
  }

  function loadStoredLang() {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s === "en" || s === "ar") return s;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function bindLangSwitcher() {
    document.querySelectorAll(".lang-switcher__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang) setLang(lang);
      });
    });
  }

  function init() {
    currentLang = loadStoredLang();
    setLang(currentLang, true);
    bindLangSwitcher();
    document.dispatchEvent(new CustomEvent("ssp-lang-change", { detail: { lang: currentLang } }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.t = t;
  window.getLang = getLang;
  window.SSP_I18N = {
    t,
    getLang,
    setLang,
    applyDomTranslations,
    getLocale: () => (currentLang === "ar" ? "ar" : "en"),
  };
})();
