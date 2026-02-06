import { Sidebar } from './Sidebar.js';
import { Navbar } from './Navbar.js';
import { AuthService } from '../modules/auth/authService.js';
import { config } from '../core/config.js';
import { router } from '../router.js'; // Use direct import

export class ProtectedLayout {
    constructor() {
        this.sidebar = new Sidebar();
        this.navbar = new Navbar();
    }

    /**
     * Renders the shell and injects the specific page content.
     * @param {HTMLElement} content - The DOM node from the router's handler.
     */
    render(content) {
        const container = document.createElement('div');
        container.className = 'd-flex vh-100 overflow-hidden'; // Full height, no body scroll
        
        // 1. Sidebar (Left)
        const sidebarElement = this.sidebar.render();
        
        // 2. Main Area (Right)
        const mainArea = document.createElement('main');
        mainArea.className = 'd-flex flex-column flex-grow-1 bg-light overflow-auto';
        
        // 3. Navbar (Top of Main)
        const navbarElement = this.navbar.render();
        
        // 4. Content Area (Below Navbar)
        const pageContainer = document.createElement('div');
        pageContainer.className = 'container-fluid p-4 fade-in'; // Added animation class
        pageContainer.appendChild(content);
        
        // Assemble
        mainArea.appendChild(navbarElement);
        mainArea.appendChild(pageContainer);
        
        container.appendChild(sidebarElement);
        container.appendChild(mainArea);
        
        this.attachGlobalEventListeners(container);
        
        return container;
    }

    attachGlobalEventListeners(container) {
        // Logout Logic: Search specifically for the link in the newly rendered Navbar
        container.querySelectorAll('[data-action="logout"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to sign out?')) {
                    AuthService.logout();
                    router.navigate(config.ROUTES.LOGIN);
                }
            });
        });

        // Mobile Sidebar Toggle Logic
        const toggleBtn = container.querySelector('#sidebar-toggle');
        const sidebar = container.querySelector('.sidebar');
        
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active-mobile');
                // Optional: Add an [Aria-Expanded](https://developer.mozilla.org) for accessibility
                toggleBtn.setAttribute('aria-expanded', sidebar.classList.contains('active-mobile'));
            });
        }
    }
}
