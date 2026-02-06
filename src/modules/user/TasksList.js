// modules/user/TasksList.js
import { api } from '../../api.js';
import { AuthGuard } from '../auth/authGuard.js';
import { config } from '../../core/config.js';
import { Alert } from '../../components/Alert.js';

export class TasksList {
    constructor() {
        this.user = AuthGuard.getCurrentUser();
        this.tasks = [];
    }

    async render() {
        const container = document.createElement('div');
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        // Cargar tareas del usuario actual
        try {
            this.tasks = await api.getTasksByUserId(this.user.id);
        } catch (error) {
            Alert.error('Could not load tasks');
            this.tasks = [];
        }

        container.innerHTML = `
            <div class="container py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="h3 fw-bold mb-0">
                        <i class="bi bi-list-task me-2"></i>My Tasks
                    </h2>
                    <a href="${config.ROUTES.TASKS_CREATE}" class="btn btn-primary" data-link>
                        <i class="bi bi-plus-circle me-2"></i>New Task
                    </a>
                </div>

                ${this.tasks.length === 0 ? this.renderEmptyState() : this.renderTasksTable()}
            </div>
        `;

        this.attachEventListeners(container);
        return container;
    }

    renderEmptyState() {
        return `
            <div class="card text-center py-5">
                <div class="card-body">
                    <i class="bi bi-inbox text-muted" style="font-size: 4rem;"></i>
                    <h3 class="h5 mt-3 mb-2">No tasks yet</h3>
                    <p class="text-muted mb-4">Create your first task to get started</p>
                    <a href="${config.ROUTES.TASKS_CREATE}" class="btn btn-primary" data-link>
                        <i class="bi bi-plus-circle me-2"></i>Create Task
                    </a>
                </div>
            </div>
        `;
    }

    renderTasksTable() {
        return `
            <div class="card">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Task</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.tasks.map(task => this.renderTaskRow(task)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderTaskRow(task) {
        const priorityColors = {
            'High': 'danger',
            'Medium': 'warning',
            'Low': 'success'
        };

        const statusBadges = {
            'Pending': 'warning',
            'In Progress': 'info',
            'Completed': 'success'
        };

        return `
            <tr>
                <td>
                    <div class="fw-semibold">${task.name}</div>
                </td>
                <td>
                    <span class="badge bg-secondary">${task.category}</span>
                </td>
                <td>
                    <span class="badge bg-${priorityColors[task.priority]}">${task.priority}</span>
                </td>
                <td>${this.formatDate(task.dueDate)}</td>
                <td>
                    <span class="badge bg-${statusBadges[task.status]}">${task.status}</span>
                </td>
                <td class="text-end">
                    <div class="btn-group btn-group-sm" role="group">
                        ${this.renderStatusButtons(task)}
                        <a href="/tasks/edit/${task.id}" class="btn btn-outline-primary" data-link>
                            <i class="bi bi-pencil"></i>
                        </a>
                        <button class="btn btn-outline-danger delete-btn" data-id="${task.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    renderStatusButtons(task) {
        if (task.status === 'Completed') return '';
        
        const nextStatus = task.status === 'Pending' ? 'In Progress' : 'Completed';
        const icon = task.status === 'Pending' ? 'play' : 'check-circle';
        
        return `
            <button class="btn btn-outline-success status-btn" 
                    data-id="${task.id}" 
                    data-status="${nextStatus}">
                <i class="bi bi-${icon}"></i>
            </button>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    attachEventListeners(container) {
        // Cambiar estado de tarea
        container.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = e.currentTarget.dataset.id;
                const newStatus = e.currentTarget.dataset.status;
                await this.updateTaskStatus(taskId, newStatus);
            });
        });

        // Eliminar tarea
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = e.currentTarget.dataset.id;
                await this.deleteTask(taskId);
            });
        });
    }

    async updateTaskStatus(taskId, newStatus) {
        try {
            await api.updateTask(taskId, { status: newStatus });
            Alert.success(`Task marked as ${newStatus}`);
            window.router.navigate(config.ROUTES.TASKS);
        } catch (error) {
            Alert.error('Could not update task status');
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await api.deleteTask(taskId);
            Alert.success('Task deleted successfully');
            window.router.navigate(config.ROUTES.TASKS);
        } catch (error) {
            Alert.error('Could not delete task');
        }
    }
}
