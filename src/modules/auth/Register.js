import { AuthService } from './authService.js';
import { config } from '../../core/config.js';
import { router } from '../../router.js'; // Use direct import

export class Register {
    constructor() {
        this.isLoading = false;
    }

    async render() {
        const container = document.createElement('div');
        container.className = 'auth-container d-flex align-items-center justify-content-center min-vh-100 bg-light';
        
        container.innerHTML = `
            <div class="auth-card p-4 shadow-sm bg-white rounded-3" style="max-width: 400px; width: 100%;">
                <div class="text-center mb-4">
                    <div class="mb-3 d-inline-block p-3 bg-primary bg-opacity-10 rounded-circle">
                        <i class="bi bi-person-plus text-primary fs-1"></i>
                    </div>
                    <h2 class="h3 fw-bold mb-1">Create Account</h2>
                    <p class="text-muted small">Join ${config.APP_NAME} to manage your tasks</p>
                </div>

                <div id="alert-container"></div>

                <form id="register-form" novalidate>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Full Name</label>
                        <input type="text" class="form-control" id="fullName" placeholder="John Doe" required>
                        <div class="invalid-feedback"></div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small fw-bold">Email Address</label>
                        <input type="email" class="form-control" id="email" placeholder="name@example.com" required>
                        <div class="invalid-feedback"></div>
                    </div>

                    <div class="row">
                        <div class="col-md-12 mb-3">
                            <label class="form-label small fw-bold">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Min. 6 characters" required>
                            <div class="invalid-feedback"></div>
                        </div>
                        <div class="col-md-12 mb-3">
                            <label class="form-label small fw-bold">Confirm Password</label>
                            <input type="password" class="form-control" id="confirmPassword" placeholder="Repeat password" required>
                            <div class="invalid-feedback"></div>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-2 mb-3" id="register-btn">
                        <span class="btn-text">Create Account</span>
                        <span class="spinner-border spinner-border-sm d-none" role="status"></span>
                    </button>

                    <div class="text-center border-top pt-3">
                        <p class="text-muted small mb-0">Already have an account? 
                            <a href="${config.ROUTES.LOGIN}" class="text-primary fw-bold text-decoration-none" data-link>Sign In</a>
                        </p>
                    </div>
                </form>
            </div>
        `;

        this.attachEventListeners(container);
        return container;
    }

    // ... validateField and showAlert helper methods ...

    async handleRegister(container) {
        if (this.isLoading) return;

        const form = container.querySelector('#register-form');
        const registerBtn = container.querySelector('#register-btn');
        
        // Extract values
        const userData = {
            fullName: form.querySelector('#fullName').value.trim(),
            email: form.querySelector('#email').value.trim(),
            password: form.querySelector('#password').value,
            confirmPassword: form.querySelector('#confirmPassword').value
        };

        // 1. Logic check: Ensure business rules are met before calling Service
        if (userData.password !== userData.confirmPassword) {
            this.validateField(form.querySelector('#confirmPassword'), ['Passwords do not match']);
            return;
        }

        this.setLoading(registerBtn, true);

        try {
            // 2. Data Enrichment: Set defaults for new users
            const result = await AuthService.register(userData);
            
            if (result.success) {
                this.showAlert(container, 'Registration successful! Redirecting...', 'success');
                setTimeout(() => router.navigate(config.ROUTES.DASHBOARD), 1500);
            }
        } catch (error) {
            this.showAlert(container, error.message || 'Error creating account', 'danger');
            this.setLoading(registerBtn, false);
        }
    }

    attachEventListeners(container){
        const from = container.querySelector(`#register-form`);
        from.addEventListener(`submit`, (e) => {
            e.preventDefault();
            this.handleRegister(container);
        });
    }


    setLoading(btn, isLoading) {
        this.isLoading = isLoading;
        btn.disabled = isLoading;
        btn.querySelector('.btn-text').classList.toggle('d-none', isLoading);
        btn.querySelector('.spinner-border').classList.toggle('d-none', !isLoading);
    }
}
