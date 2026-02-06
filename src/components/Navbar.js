import { AuthGuard } from '../modules/auth/authGuard.js';
import { config } from '../core/config.js';

export class Navbar {
    render() {
        const user = AuthGuard.getCurrentUser();
        const container = document.createElement('nav');
        
        container.className = 'navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top px-3 py-2';
        
        container.innerHTML = `
            <div class="container-fluid">
                <div class="d-flex align-items-center">
                    <!-- Mobile Toggle -->
                    <button class="btn btn-light d-lg-none me-3 rounded-circle shadow-sm" type="button" id="sidebar-toggle">
                        <i class="bi bi-list fs-5"></i>
                    </button>
                    <span class="d-none d-sm-inline text-muted">
                        Welcome, <span class="fw-bold text-dark">${user?.fullName?.split(' ')[0] || 'User'}</span>
                    </span>
                </div>
                
                <div class="d-flex align-items-center gap-2">
                    <!-- Notifications -->
                    <div class="dropdown">
                        <button class="btn btn-icon btn-light rounded-circle position-relative me-2" id="notifications-btn">
                            <i class="bi bi-bell fs-5"></i>
                            <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                <span class="visually-hidden">New notifications</span>
                            </span>
                        </button>
                    </div>
                    
                    <div class="vr mx-2 text-muted opacity-25"></div>

                    <!-- User Account Dropdown -->
                    <div class="dropdown">
                        <button class="btn btn-link text-decoration-none d-flex align-items-center gap-2 p-1" 
                                type="button" 
                                id="userDropdown" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false">
                            <img src="${user?.avatar || 'https://ui-avatars.com'}" 
                                 alt="User" 
                                 class="rounded-circle border"
                                 style="width: 35px; height: 35px; object-fit: cover;">
                            <div class="d-none d-md-block text-start me-1">
                                <p class="mb-0 small fw-bold text-dark line-height-1">${user?.fullName || 'User'}</p>
                                <p class="mb-0 extra-small text-muted" style="font-size: 0.7rem;">${user?.role?.toUpperCase()}</p>
                            </div>
                            <i class="bi bi-chevron-down extra-small text-muted"></i>
                        </button>
                        
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 py-2" aria-labelledby="userDropdown">
                            <li class="px-3 py-2 d-md-none">
                                <div class="fw-bold">${user?.fullName}</div>
                                <div class="small text-muted">${user?.email}</div>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item py-2" href="${config.ROUTES.PROFILE}" data-link>
                                <i class="bi bi-person me-2 text-muted"></i> My Profile</a>
                            </li>
                            <li><a class="dropdown-item py-2" href="#">
                                <i class="bi bi-gear me-2 text-muted"></i> Settings</a>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li><button class="dropdown-item py-2 text-danger" data-action="logout">
                                <i class="bi bi-box-arrow-right me-2"></i> Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        this.initBootstrapComponents(container);
        return container;
    }

    /**
     * Re-initializes Bootstrap Dropdowns after they enter the DOM.
     * This is required in SPAs because Bootstrap's automatic [Data API](https://getbootstrap.com)
     * looks for elements once during initial page load.
     */
    initBootstrapComponents(container) {
        // We use a small delay to ensure the element is appended by the Router/Layout
        setTimeout(() => {
            const dropdownElementList = container.querySelectorAll('[data-bs-toggle="dropdown"]');
            [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));
        }, 0);
    }
}
