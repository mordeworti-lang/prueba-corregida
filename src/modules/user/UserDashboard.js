import { api } from '../../api.js';
import { AuthGuard } from '../auth/authGuard.js';
import { formatDate } from '../../utils/helpers.js';
import { Alert } from '../../components/Alert.js';

export class UserDashboard {
    constructor() {
        this.tasks = [];
        this.stats = {};
        this.container = document.createElement('div');
    }

    async render() {
        // 1. Mostrar estado de carga inmediatamente
        this.container.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Loading your dashboard...</p>
            </div>`;
        
        try {
            // 2. Cargar datos de forma asíncrona (el Router esperará esto)
            await this.loadData();
            
            // 3. Renderizar contenido final
            this.updateUI();
            
        } catch (error) {
            this.container.innerHTML = `
                <div class="alert alert-danger m-5">
                    <h5>Error loading dashboard</h5>
                    <p>Please ensure the API server is running.</p>
                    <button class="btn btn-outline-danger btn-sm" onclick="location.reload()">Retry</button>
                </div>`;
        }
        
        return this.container;
    }

    async loadData() {
        const user = AuthGuard.getCurrentUser();
        if (!user) throw new Error("No user found");

        // Ejecutamos ambas peticiones en paralelo para ganar velocidad
        const [tasks, stats] = await Promise.all([
            api.getTasksByUserId(user.id),
            api.getUserTaskStats(user.id)
        ]);
        
        this.tasks = tasks;
        this.stats = stats;
    }

    updateUI() {
        this.container.innerHTML = this.getHTML();
        this.attachEventListeners();
    }

    getHTML() {
        return `
            <div class="mb-4">
                <h1 class="h2 fw-bold mb-1">My Dashboard</h1>
                <p class="text-muted">Overview of your academic tasks</p>
            </div>

            <div class="d-flex justify-content-end mb-4">
                <a href="/tasks/create" class="btn btn-primary" data-link>
                    <i class="bi bi-plus-lg"></i> New Task
                </a>
            </div>

            <div class="row g-3 mb-4">
                ${this.renderStatCards()}
            </div>

            <div class="card border-0 rounded-3 shadow-sm">
                <div class="card-header bg-white py-3">
                    <h5 class="mb-0">My Tasks</h5>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th>Task</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderTaskRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ... (renderStatCards y renderTaskRows se mantienen igual que tu código original)

    attachEventListeners() {
        // Cambio de estado
        this.container.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', async (e) => {
                const id = e.target.dataset.id;
                const newStatus = e.target.value;
                try {
                    // Solo actualizamos el status usando un PATCH (más eficiente que PUT)
                    await api.updateTask(id, { status: newStatus });
                    Alert.success('Task updated');
                    
                    // Recargar datos y refrescar UI
                    await this.loadData();
                    this.updateUI();
                } catch (error) {
                    Alert.error('Could not update task');
                }
            });
        });

        // Botón eliminar
        this.container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('Are you sure you want to delete this task?')) {
                    try {
                        await api.deleteTask(id);
                        Alert.success('Task deleted');
                        await this.loadData();
                        this.updateUI();
                    } catch (error) {
                        Alert.error('Error deleting task');
                    }
                }
            });
        });
    }
}
