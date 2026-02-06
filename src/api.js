// api.js
import { config } from './core/config.js';

class API {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
        
        // Obtenemos el token desde localStorage usando la llave definida en tu config
        const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN); 

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, { ...options, headers });

            if (response.status === 401) {
                window.dispatchEvent(new CustomEvent('unauthorized'));
                throw new Error('Session expired');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error.message);
            throw error;
        }
    }

    // Métodos Base
    async get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
    async post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }); }
    async put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }); }
    async delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }

    /* --- MÉTODOS DE USUARIOS --- */
    async getUsers() { return this.get('users'); }
    async getUserById(id) { return this.get(`users/${id}`); }
    async createUser(userData) { return this.post('users', userData); }

    /* --- MÉTODOS DE TAREAS (CRUD) --- */
    
    // Obtener todas las tareas (Admin)
    async getTasks() { return this.get('tasks'); }

    // Obtener una tarea por ID (Edición)
    async getTaskById(id) { return this.get(`tasks/${id}`); }

    // Crear nueva tarea
    async createTask(taskData) { 
        return this.post('tasks', taskData); 
    }

    // Actualizar tarea existente
    async updateTask(id, taskData) { 
        return this.put(`tasks/${id}`, taskData); 
    }

    // Eliminar tarea
    async deleteTask(id) { 
        return this.delete(`tasks/${id}`); 
    }

    // Tareas por usuario (Dashboard)
    async getTasksByUserId(userId) {
        const query = new URLSearchParams({ userId }).toString();
        return this.get(`tasks?${query}`);
    }

    /* --- ESTADÍSTICAS --- */

    async getTaskStats() {
        try {
            const tasks = await this.getTasks();
            return this._calculateStats(tasks);
        } catch (error) {
            return { total: 0, pending: 0, inProgress: 0, completed: 0 };
        }
    }

    async getUserTaskStats(userId) {
        try {
            const tasks = await this.getTasksByUserId(userId);
            return this._calculateStats(tasks);
        } catch (error) {
            return { total: 0, pending: 0, inProgress: 0, completed: 0 };
        }
    }

    _calculateStats(tasks) {
        return {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'Pending').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            completed: tasks.filter(t => t.status === 'Completed').length,
        };
    }
}

export const api = new API(config.API_URL);
