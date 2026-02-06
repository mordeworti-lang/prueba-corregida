import { storage } from '../../utils/storage.js';
import { config } from '../../core/config.js';

export class AuthGuard {
    /**
     * Main gatekeeper for routes.
     * Checks for session existence and [token expiration](https://developer.mozilla.org).
     */
    static canActivate() {
        const token = storage.get(config.STORAGE_KEYS.TOKEN);
        const expiry = storage.get(config.STORAGE_KEYS.TOKEN_EXPIRY);
        
        if (!token || !expiry) return false;

        // Auto-cleanup if the session is stale
        if (Date.now() > Number(expiry)) {
            this.clearAuth();
            return false;
        }
        
        return !!storage.get(config.STORAGE_KEYS.USER);
    }
    
    static hasRole(role) {
        const user = this.getCurrentUser();
        // Returns true if the user role matches, providing [Role-Based Access Control (RBAC)](https://en.wikipedia.org)
        return user && user.role === role;
    }
    
    static isAdmin() {
        return this.hasRole(config.ROLES.ADMIN);
    }
    
    static getCurrentUser() {
        return storage.get(config.STORAGE_KEYS.USER);
    }
    
    static clearAuth() {
        storage.remove(config.STORAGE_KEYS.USER);
        storage.remove(config.STORAGE_KEYS.TOKEN);
        storage.remove(config.STORAGE_KEYS.TOKEN_EXPIRY);
    }
}
