export const config = {
    APP_NAME: 'CRUDZASO',
    API_URL: 'http://localhost:3000',
    
    ROUTES: {
        // ✅ AGREGADO: Ruta HOME
        HOME: '/login',
        
        // Auth
        LOGIN: '/login',
        REGISTER: '/register',
        
        // User Routes
        DASHBOARD: '/dashboard',
        TASKS: '/tasks',
        TASKS_CREATE: '/tasks/create',
        TASKS_EDIT: '/tasks/edit',
        PROFILE: '/profile',
        
        // Admin Routes
        ADMIN_DASHBOARD: '/admin/dashboard',
        ADMIN_TASKS: '/admin/tasks',
        ADMIN_TASKS_CREATE: '/admin/tasks/create',
        ADMIN_TASKS_EDIT: '/admin/tasks/edit',
        ADMIN_USERS: '/admin/users',
        
        // Error Pages
        FORBIDDEN: '/forbidden',
        NOT_FOUND: '/404',
    },
    
    STORAGE_KEYS: {
        USER: 'crudzaso_user',
        TOKEN: 'crudzaso_token',
        TOKEN_EXPIRY: 'crudzaso_token_expiry',
    },
    
    ROLES: {
        ADMIN: 'admin',
        USER: 'user',
    },
    
    TASK_STATUS: {
        PENDING: 'Pending',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
    },
    
    TASK_PRIORITY: {
        HIGH: 'High',
        MEDIUM: 'Medium',
        LOW: 'Low',
    },
};
