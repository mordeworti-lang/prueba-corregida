import { AuthService } from './authService.js';
import { config } from '../../core/config.js';
import { Validators } from '../../utils/validators.js';
import { router } from '../../router.js'; // Importación directa más segura

export class Login {
    constructor() {
        this.isLoading = false;
    }

    async render() {
        const container = document.createElement('div');
        // Centrado profesional usando utilidades de [Bootstrap 5](https://getbootstrap.com)
        container.className = 'auth-container d-flex align-items-center justify-content-center min-vh-100 bg-light';
        
        container.innerHTML = `
            <div class="auth-card p-4 shadow bg-white rounded-3" style="max-width: 400px; width: 100%;">
                <div class="text-center mb-4">
                    <div class="mb-3 d-inline-block p-3 bg-primary bg-opacity-10 rounded-circle">
                        <i class="bi bi-shield-lock text-primary fs-1"></i>
                    </div>
                    <h2 class="h3 fw-bold mb-1">Welcome Back</h2>
                    <p class="text-muted small">Sign in to your ${config.APP_NAME} account</p>
                </div>

                <div id="alert-container"></div>

                <form id="login-form" novalidate>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Email Address</label>
                        <input type="email" class="form-control" id="email" placeholder="name@example.com" required>
                        <div class="invalid-feedback"></div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small fw-bold">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="••••••••" required>
                        <div class="invalid-feedback"></div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-2 mb-3" id="login-btn">
                        <span class="btn-text">Sign In</span>
                        <span class="spinner-border spinner-border-sm d-none"></span>
                    </button>

                    <div class="text-center border-top pt-3">
                        <p class="text-muted small mb-0">Don't have an account? 
                            <a href="${config.ROUTES.REGISTER}" class="text-primary fw-bold text-decoration-none" data-link>Create Account</a>
                        </p>
                    </div>
                </form>

                <!-- Demo Credentials Section -->
                <div class="mt-4 p-3 bg-light rounded-2 border border-dashed">
                    <p class="text-muted extra-small fw-bold text-uppercase mb-2" style="font-size: 0.7rem;">Demo Access</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-sm btn-outline-secondary text-start quick-fill" data-email="admin@crudzaso.edu" data-pass="admin123">
                            <code class="small text-dark">Admin: admin@crudzaso.edu</code>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary text-start quick-fill" data-email="user@crudzaso.edu" data-pass="user123">
                            <code class="small text-dark">User: user@crudzaso.edu</code>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners(container);
        return container;
    }

    attachEventListeners(container) {
        const form = container.querySelector('#login-form');
        
        // Función para autocompletar (Mejora de UX para demos)
        container.querySelectorAll('.quick-fill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                form.querySelector('#email').value = e.currentTarget.dataset.email;
                form.querySelector('#password').value = e.currentTarget.dataset.pass;
                // Limpiar validaciones previas
                form.querySelectorAll('.form-control').forEach(i => i.classList.remove('is-invalid'));
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(container);
        });
    }

    async handleLogin(container) {
        if (this.isLoading) return;

        const emailInput = container.querySelector('#email');
        const passwordInput = container.querySelector('#password');
        const loginBtn = container.querySelector('#login-btn');

        // Validación usando tu clase [Validators](https://developer.mozilla.org)
        const emailErrors = Validators.validateEmail(emailInput.value.trim());
        const passwordErrors = Validators.validatePassword(passwordInput.value);

        if (emailErrors.length > 0 || passwordErrors.length > 0) {
            this.validateField(emailInput, emailErrors);
            this.validateField(passwordInput, passwordErrors);
            return;
        }

        this.setLoading(loginBtn, true);

        try {
            const result = await AuthService.login(emailInput.value.trim(), passwordInput.value);
            
            if (result.success) {
                this.showAlert(container, 'Access granted! Redirecting...', 'success');
                
                // Redirección basada en rol centralizada
                setTimeout(() => {
                    const dest = result.user.role === config.ROLES.ADMIN 
                        ? config.ROUTES.ADMIN_DASHBOARD 
                        : config.ROUTES.DASHBOARD;
                    router.navigate(dest);
                }, 600);
            }
        } catch (error) {
            this.showAlert(container, error.message || 'Invalid credentials', 'danger');
            passwordInput.value = '';
            this.setLoading(loginBtn, false);
        }
    }

    // Helpers de UI
    setLoading(btn, state) {
        this.isLoading = state;
        btn.disabled = state;
        btn.querySelector('.btn-text').classList.toggle('d-none', state);
        btn.querySelector('.spinner-border').classList.toggle('d-none', !state);
    }

    validateField(input, errors) {
        const feedback = input.nextElementSibling;
        const isValid = errors.length === 0;
        input.classList.toggle('is-invalid', !isValid);
        input.classList.toggle('is-valid', isValid);
        if (feedback) feedback.textContent = errors[0] || '';
    }

    showAlert(container, message, type) {
        const alertContainer = container.querySelector('#alert-container');
        alertContainer.innerHTML = `
            <div class="alert alert-${type} py-2 small shadow-sm" role="alert">
                <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
            </div>`;
    }
}
