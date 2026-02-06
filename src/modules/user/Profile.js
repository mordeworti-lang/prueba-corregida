import { AuthGuard } from '../auth/authGuard.js';
import { AuthService } from '../auth/authService.js';
import { config } from '../../core/config.js';
import { router } from '../../router.js'; // Direct import is safer

export class Profile {
    async render() {
        const container = document.createElement('div');
        const user = AuthGuard.getCurrentUser();

        // Fallback for avatar if it's missing
        const avatarUrl = user.avatar || `https://ui-avatars.com{encodeURIComponent(user.fullName)}&background=random`;

        container.innerHTML = `
            <div class="mb-4">
                <h1 class="h2 fw-bold mb-1">My Profile</h1>
                <p class="text-muted">View and manage your profile information</p>
            </div>

            <div class="row">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-4">
                                <img src="${avatarUrl}" class="rounded-circle shadow-sm me-3" width="80" height="80" style="object-fit: cover;">
                                <div>
                                    <h4 class="mb-1">${user.fullName}</h4>
                                    <p class="text-muted mb-1">${user.email}</p>
                                    <span class="badge rounded-pill bg-${user.role === 'admin' ? 'danger' : 'primary'}">
                                        ${user.role.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div class="row g-4">
                                <div class="col-md-6">
                                    <label class="text-muted small d-block mb-1">Phone Number</label>
                                    <div class="fw-semibold">${user.phone || '<span class="text-muted fw-normal">Not provided</span>'}</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small d-block mb-1">Department</label>
                                    <div class="fw-semibold">${user.department || 'General'}</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small d-block mb-1">Employee ID</label>
                                    <div class="fw-semibold font-monospace">${user.employeeId}</div>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small d-block mb-1">Join Date</label>
                                    <div class="fw-semibold">${new Date(user.joinDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm border-start border-danger border-4">
                        <div class="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-0">Sign Out</h5>
                                <small class="text-muted">Terminate your current session</small>
                            </div>
                            <button class="btn btn-danger px-4" id="logout-btn">
                                <i class="bi bi-box-arrow-right me-2"></i>Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEvents(container);
        return container;
    }

    attachEvents(container) {
        container.querySelector('#logout-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                AuthService.logout();
                // Navigate using the imported [router instance](https://developer.mozilla.org)
                router.navigate(config.ROUTES.LOGIN);
            }
        });
    }
}
