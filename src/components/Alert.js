export class Alert {
    static show(message, type = 'info', duration = 4000) {
        const alertContainer = document.getElementById('alert-container') || this.createContainer();
        
        const alert = document.createElement('div');
        // Usamos clases de [Bootstrap 5](https://getbootstrap.com) para el diseño
        alert.className = `alert alert-${type} alert-dismissible fade show shadow-sm border-0 mb-2`;
        alert.role = 'alert';
        alert.style.transition = 'all 0.5s ease';
        
        alert.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${this._getIcon(type)} me-2 fs-5"></i>
                <div>${message}</div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer.appendChild(alert);
        
        if (duration > 0) {
            setTimeout(() => {
                alert.classList.replace('show', 'hide'); // Trigger fade out
                setTimeout(() => alert.remove(), 500);   // Remove after fade
            }, duration);
        }
    }

    static createContainer() {
        const container = document.createElement('div');
        container.id = 'alert-container';
        // Posicionamiento tipo "Toast" para no interrumpir el flujo visual
        container.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            min-width: 300px; max-width: 400px;
        `;
        document.body.appendChild(container);
        return container;
    }

    static _getIcon(type) {
        const icons = { success: 'check-circle', danger: 'exclamation-triangle', warning: 'exclamation-circle', info: 'info-circle' };
        return icons[type] || icons.info;
    }

    static success(message, duration) { this.show(message, 'success', duration); }
    static error(message, duration) { this.show(message, 'danger', duration); }
}

export class Loader {
    /**
     * Blocks the UI during critical async operations like [Authentication](https://developer.mozilla.org)
     */
    static show() {
        if (document.getElementById('global-loader')) return;

        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'd-flex justify-content-center align-items-center';
        loader.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255, 255, 255, 0.8); z-index: 10001;
            backdrop-filter: blur(4px); transition: opacity 0.3s ease;
        `;
        loader.innerHTML = `
            <div class="text-center animate__animated animate__fadeIn">
                <div class="spinner-grow text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
                <div class="mt-3 fw-bold text-primary">CRUDZASO</div>
            </div>`;
        document.body.appendChild(loader);
    }

    static hide() {
        const loader = document.getElementById('global-loader');
        if (loader) loader.remove();
    }
}
