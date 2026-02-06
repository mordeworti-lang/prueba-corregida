import { AuthGuard } from '../modules/auth/authGuard.js';
import { AuthService } from '../modules/auth/authService.js';
import { config } from '../core/config.js';
import { router } from '../router.js'; // Importar instancia directamente

export class Sidebar {
    render() {
        const container = document.createElement('div');
        const user = AuthGuard.getCurrentUser();
        const isAdmin = AuthGuard.isAdmin();
        const currentPath = window.location.pathname;
        
        // Fallback dinámico para avatar usando [UI Avatars](https://ui-avatars.com)
        const avatarUrl = user?.avatar || `https://ui-avatars.comapi/?name=${encodeURIComponent(user?.fullName || 'U')}&background=0D6EFD&color=fff`;

        container.className = 'sidebar bg-white border-end h-100';
        container.innerHTML = `
            <div class="d-flex flex-column h-100">
                <!-- Header -->
                <div class="p-4 border-bottom">
                    <h4 class="h5 mb-0 fw-bold text-primary d-flex align-items-center">
                        <i class="bi bi-check2-square fs-4 me-2"></i>
                        <span>CRUDZASO</span>
                    </h4>
                    <small class="text-muted text-uppercase fw-bold" style="font-size: 0.65rem; letter-spacing: 1px;">
                        ${isAdmin ? 'System Administrator' : 'Student Panel'}
                    </small>
                </div>
                
                <!-- Navigation -->
                <nav class="flex-grow-1 px-3 py-4 overflow-auto">
                    <ul class="nav nav-pills flex-column gap-2">
                        ${isAdmin ? this.renderAdminMenu(currentPath) : this.renderUserMenu(currentPath)}
                    </ul>
                </nav>
                
                <!-- Footer -->
                <div class="p-3 border-top bg-light bg-opacity-50">
                    <div class="d-flex align-items-center p-2 mb-3">
                        <img src="${avatarUrl}" 
                             alt="User" 
                             class="rounded-circle border border-2 border-white shadow-sm me-3" 
                             style="width: 42px; height: 42px; object-fit: cover;">
                        <div class="flex-grow-1 text-truncate">
                            <div class="fw-bold small text-dark mb-0">${user?.fullName || 'User'}</div>
                            <div class="text-muted extra-small" style="font-size: 0.7rem;">${user?.email || ''}</div>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm w-100 rounded-pill" id="logout-btn">
                        <i class="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                </div>
            </div>
        `;
        
        this.attachEventListeners(container);
        return container;
    }
    
    // Método genérico para evitar duplicidad de lógica en menús
    _generateLinks(items, currentPath) {
        return items.map(item => {
            // Verifica si es la ruta activa o una sub-ruta (ej: /tasks/create activa el link /tasks)
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            
            return `
                <li class="nav-item">
                    <a class="nav-link d-flex align-items-center py-2 px-3 rounded-3 transition-all ${isActive ? 'active shadow-sm' : 'text-secondary'}" 
                       href="${item.path}" 
                       data-link>
                        <i class="bi bi-${item.icon} fs-5 me-3"></i>
                        <span class="fw-medium">${item.label}</span>
                    </a>
                </li>
            `;
        }).join('');
    }

    renderAdminMenu(currentPath) {
        const menuItems = [
            { icon: 'grid-1x2-fill', label: 'Dashboard', path: config.ROUTES.ADMIN_DASHBOARD },
            { icon: 'journal-text', label: 'Global Tasks', path: config.ROUTES.ADMIN_TASKS },
            { icon: 'people-fill', label: 'User Directory', path: config.ROUTES.ADMIN_USERS },
            { icon: 'person-bounding-box', label: 'My Profile', path: config.ROUTES.PROFILE },
        ];
        return this._generateLinks(menuItems, currentPath);
    }
    
    renderUserMenu(currentPath) {
        const menuItems = [
            { icon: 'house-door-fill', label: 'Dashboard', path: config.ROUTES.DASHBOARD },
            { icon: 'card-checklist', label: 'My Tasks List', path: config.ROUTES.TASKS },
            { icon: 'plus-square-fill', label: 'Create Task', path: config.ROUTES.TASKS_CREATE },
            { icon: 'person-lines-fill', label: 'Account', path: config.ROUTES.PROFILE },
        ];
        return this._generateLinks(menuItems, currentPath);
    }
    
    attachEventListeners(container) {
        container.querySelector('#logout-btn')?.addEventListener('click', () => {
            if (confirm('Close session and return to login?')) {
                AuthService.logout();
                router.navigate(config.ROUTES.LOGIN); // Uso de la instancia importada
            }
        });
    }
}
