import { api } from '../../api.js';
import { storage } from '../../utils/storage.js';
import { config } from '../../core/config.js';

export class AuthService {
    /**
     * Authenticates user against JSON Server
     */
    static async login(email, password) {
        try {
            // Simulated network latency
            await new Promise(resolve => setTimeout(resolve, 600));

            const users = await api.getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                throw new Error('Invalid credentials. Please try again.');
            }

            return this._persistSession(user);
        } catch (error) {
            console.error('Login Error:', error.message);
            throw error;
        }
    }

    /**
     * Creates a new user with default student metadata
     */
    static async register(userData) {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const users = await api.getUsers();
            if (users.some(u => u.email === userData.email)) {
                throw new Error('An account with this email already exists.');
            }

            const newUser = {
                ...userData,
                role: config.ROLES.USER,
                roleLevel: 'Student',
                employeeId: `CZ-${Math.floor(100000 + Math.random() * 900000)}`,
                joinDate: new Date().toISOString(),
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=random`,
                phone: userData.phone || '',
                department: userData.department || 'Academic'
            };

            const savedUser = await api.createUser(newUser);
            return this._persistSession(savedUser);
        } catch (error) {
            console.error('Registration Error:', error.message);
            throw error;
        }
    }

    /**
     * Private helper to handle storage and token generation
     */
    static _persistSession(user) {
        // Strip password for security [Object Rest Spread](https://developer.mozilla.org)
        const { password, ...userProfile } = user;
        
        const token = `mock-jwt-${crypto.randomUUID()}`; // More secure unique ID
        const expiry = Date.now() + (config.AUTH_EXPIRY_MS || 86400000); // 24h default
        
        storage.set(config.STORAGE_KEYS.USER, userProfile);
        storage.set(config.STORAGE_KEYS.TOKEN, token);
        storage.set(config.STORAGE_KEYS.TOKEN_EXPIRY, expiry);
        
        return { success: true, user: userProfile };
    }

    static logout() {
        storage.remove(config.STORAGE_KEYS.USER);
        storage.remove(config.STORAGE_KEYS.TOKEN);
        storage.remove(config.STORAGE_KEYS.TOKEN_EXPIRY);
    }

    static isAuthenticated() {
        const token = storage.get(config.STORAGE_KEYS.TOKEN);
        const expiry = storage.get(config.STORAGE_KEYS.TOKEN_EXPIRY);
        
        if (!token || !expiry) return false;

        // Auto-logout if expired [Date.now() check](https://developer.mozilla.org)
        if (Date.now() > Number(expiry)) {
            this.logout();
            return false;
        }
        
        return true;
    }

    static getCurrentUser() {
        return storage.get(config.STORAGE_KEYS.USER);
    }

    static hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    }

    static isAdmin() { return this.hasRole(config.ROLES.ADMIN); }
}
