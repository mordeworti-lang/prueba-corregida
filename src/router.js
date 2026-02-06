// router.js
import { config } from './core/config.js';
import { AuthGuard } from './modules/auth/authGuard.js';
import { ProtectedLayout } from './components/ProtectedLayout.js';

class Router {
    constructor() {
        this.routes = new Map();
        this.layout = new ProtectedLayout();
        
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) this.navigate(href);
            }
        });
    }

    addRoute(path, handler, options = {}) {
        this.routes.set(path, {
            handler,
            requiresAuth: options.requiresAuth ?? true,
            requiresRole: options.requiresRole || null,
            layout: options.layout ?? true,
            title: options.title || 'Page'
        });
    }

    navigate(path) {
        if (window.location.pathname === path) return;
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    /**
     * Lógica de manejo de rutas con soporte para parámetros dinámicos
     */
    async handleRoute() {
        const path = window.location.pathname;
        if (path === '/') {
            this.navigate(config.ROUTES.HOME);
            return;
        }
        let route = null;
        let params = {};

        // --- INICIO DE FRAGMENTO CRÍTICO CORREGIDO ---
        // Buscamos coincidencia dinámica recorriendo el mapa de rutas
        for (const [key, value] of this.routes) {
            // ✅ MEJORADO: Regex más robusta que captura cualquier carácter excepto /
            const keyRegex = key.replace(/\/:[^\s/]+/g, '/([^/]+)');
            const match = path.match(new RegExp(`^${keyRegex}$`));
            
            if (match) {
                route = value;
                // Si el Regex capturó un grupo (el ID), lo guardamos en params.id
                // match[0] es la URL completa, match[1] es el primer grupo capturado
                if (match[1]) {
                    params.id = match[1];
                }
                break;
            }
        }

        if (!route) {
            this.render404();
            return;
        }
        // --- FIN DE FRAGMENTO CRÍTICO ---

        // Verificación de Seguridad
        if (route.requiresAuth && !AuthGuard.canActivate()) {
            this.navigate(config.ROUTES.LOGIN);
            return;
        }

        if (route.requiresRole && !AuthGuard.hasRole(route.requiresRole)) {
            this.renderForbidden();
            return;
        }

        // IMPORTANTE: Se pasan los params detectados (ej: {id: "123"}) al renderRoute
        await this.renderRoute(route, params);
    }

    async renderRoute(route, params) {
        const app = document.getElementById('app');
        try {
            // El handler del componente recibe los params para saber si debe cargar datos
            const content = await route.handler(params);
            
            app.innerHTML = '';
            
            if (route.layout) {
                const layoutElement = this.layout.render(content, route.title);
                app.appendChild(layoutElement);
            } else {
                app.appendChild(content);
            }

            document.title = `${route.title} - ${config.APP_NAME}`;
        } catch (error) {
            console.error('Routing Error:', error);
            this.renderError();
        }
    }

    render404() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container text-center py-5">
                <h1 class="display-1 fw-bold">404</h1>
                <p class="lead">Oops! The page you are looking for doesn't exist.</p>
                <a href="/" class="btn btn-primary rounded-pill px-4" data-link>Return Home</a>
            </div>`;
    }

    renderForbidden() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container text-center py-5">
                <h1 class="display-1 fw-bold text-danger">403</h1>
                <p class="lead">Access Denied. You don't have permissions for this page.</p>
                <a href="/" class="btn btn-outline-secondary rounded-pill px-4" data-link>Go Back</a>
            </div>`;
    }

    renderError() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container text-center py-5">
                <h1 class="h3">System Error</h1>
                <p class="text-muted">An error occurred while loading this module.</p>
            </div>`;
    }

    init() {
        this.handleRoute();
    }
}

export const router = new Router();
