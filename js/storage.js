/**
 * storage.js - LocalStorage CRUD operations
 */

const DB_KEYS = {
    SUBJECTS: 'ssp_subjects',
    PLANNER: 'ssp_planner',
    TASKS: 'ssp_tasks',
    SESSIONS: 'ssp_sessions',
    SETTINGS: 'ssp_settings',
    TIMER_STATE: 'ssp_timer_state'
};

const Storage = {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    get(key, defaultValue = []) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    },

    // Specific Subject CRUD
    getSubjects() {
        return this.get(DB_KEYS.SUBJECTS);
    },

    addSubject(subject) {
        const subjects = this.getSubjects();
        subjects.push({
            id: Date.now(),
            ...subject
        });
        this.save(DB_KEYS.SUBJECTS, subjects);
    },

    deleteSubject(id) {
        const subjects = this.getSubjects().filter(s => s.id !== id);
        this.save(DB_KEYS.SUBJECTS, subjects);
    },

    // Specific Task CRUD
    getTasks() {
        return this.get(DB_KEYS.TASKS);
    },

    addTask(task) {
        const tasks = this.getTasks();
        tasks.push({
            id: Date.now(),
            completed: false,
            ...task
        });
        this.save(DB_KEYS.TASKS, tasks);
    },

    // Performance tracking
    logSession(session) {
        const sessions = this.get(DB_KEYS.SESSIONS);
        sessions.push({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...session
        });
        this.save(DB_KEYS.SESSIONS, sessions);
    }
};
