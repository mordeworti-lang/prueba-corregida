import { router } from './router.js';
import { config } from './core/config.js';

/**
 * PUBLIC ROUTES
 */
router.addRoute(config.ROUTES.LOGIN, async () => {
    const { Login } = await import('./modules/auth/Login.js');
    return await new Login().render();
}, { requiresAuth: false, layout: false, title: 'Login' });

router.addRoute(config.ROUTES.REGISTER, async () => {
    const { Register } = await import('./modules/auth/Register.js');
    return await new Register().render();
}, { requiresAuth: false, layout: false, title: 'Register' });

/**
 * USER ROUTES (Including Create & Edit)
 */
router.addRoute(config.ROUTES.DASHBOARD, async () => {
    const { UserDashboard } = await import('./modules/user/UserDashboard.js');
    return await new UserDashboard().render();
}, { requiresAuth: true, requiresRole: config.ROLES.USER, layout: true, title: 'Dashboard' });

router.addRoute(config.ROUTES.TASKS, async () => {
    const { TasksList } = await import('./modules/user/TasksList.js');
    return await new TasksList().render();
}, { requiresAuth: true, requiresRole: config.ROLES.USER, layout: true, title: 'My Tasks' });

// --- FIXED: Added Task Creation Route ---
router.addRoute(config.ROUTES.TASKS_CREATE, async (params) => {
    const { TaskForm } = await import('./modules/user/TaskForm.js');
    return await new TaskForm(params).render();
}, { requiresAuth: true, requiresRole: config.ROLES.USER, layout: true, title: 'New Task' });

// --- FIXED: Added Dynamic Task Edit Route ---
router.addRoute('/tasks/edit/:id', async (params) => {
    const { TaskForm } = await import('./modules/user/TaskForm.js');
    return await new TaskForm(params).render();
}, { requiresAuth: true, requiresRole: config.ROLES.USER, layout: true, title: 'Edit Task' });

router.addRoute(config.ROUTES.PROFILE, async () => {
    const { Profile } = await import('./modules/user/Profile.js');
    return await new Profile().render();
}, { requiresAuth: true, layout: true, title: 'Profile' });

/**
 * ADMIN ROUTES
 */
router.addRoute(config.ROUTES.ADMIN_DASHBOARD, async () => {
    const { AdminDashboard } = await import('./modules/admin/AdminDashboard.js');
    return await new AdminDashboard().render();
}, { requiresAuth: true, requiresRole: config.ROLES.ADMIN, layout: true, title: 'Admin Dashboard' });

// ✅ AGREGADO: Ruta para ver todas las tareas del sistema
router.addRoute(config.ROUTES.ADMIN_TASKS, async () => {
    const { AdminTasks } = await import('./modules/admin/AdminTasks.js');
    return await new AdminTasks().render();
}, { requiresAuth: true, requiresRole: config.ROLES.ADMIN, layout: true, title: 'Global Tasks' });

router.addRoute(config.ROUTES.ADMIN_USERS, async () => {
    const { AdminUsers } = await import('./modules/admin/AdminUsers.js');
    return await new AdminUsers().render();
}, { requiresAuth: true, requiresRole: config.ROLES.ADMIN, layout: true, title: 'Manage Users' });

// Globalize and Start
window.router = router;

document.addEventListener('DOMContentLoaded', () => {
    router.init();
});
