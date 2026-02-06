import { api } from '../../api.js';
import { formatDate } from '../../utils/helpers.js';
import { Alert } from '../../components/Alert.js';
import { router } from '../../router.js';

export class AdminTasks {
    constructor() {
        this.container = document.createElement('div');
    }

    async render() {
        this.container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';
        
        try {
            const tasks = await api.getTasks();
            this.renderUI(tasks);
        } catch (error) {
            this.container.innerHTML = '<div class="alert alert-danger">Error loading global tasks.</div>';
        }

        return this.container;
    }

    renderUI(tasks) {
        this.container.innerHTML = `
            <div class="mb-4">
                <h1 class="h2 fw-bold mb-1">System Task Management</h1>
                <p class="text-muted">Monitoring ${tasks.length} total tasks across all users</p>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4">Task Name</th>
                                <th>Assigned To</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th class="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tasks.length === 0 ? '<tr><td colspan="6" class="text-center py-4">No tasks found in the system.</td></tr>' : 
                                tasks.map(t => this.renderTaskRow(t)).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    renderTaskRow(t) {
        // Priority styling logic
        const priorityColor = { 'High': 'danger', 'Medium': 'warning', 'Low': 'info' }[t.priority] || 'secondary';
        
        return `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-dark">${t.name}</div>
                    <small class="text-muted">${t.category || 'No Category'}</small>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-person-circle me-2 text-muted"></i>
                        <span>${t.assignee || 'Unknown'}</span>
                    </div>
                </td>
                <td>
                    <span class="badge rounded-pill bg-opacity-10 text-dark border ${this.getStatusClass(t.status)}">
                        ${t.status}
                    </span>
                </td>
                <td>
                    <span class="text-${priorityColor} small fw-bold">
                        <i class="bi bi-flag-fill me-1"></i>${t.priority}
                    </span>
                </td>
                <td class="text-muted small">${formatDate(t.dueDate)}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${t.id}" title="Delete Task">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    getStatusClass(status) {
        const s = status.toLowerCase();
        if (s.includes('pending')) return 'bg-warning border-warning';
        if (s.includes('progress')) return 'bg-primary border-primary';
        if (s.includes('completed')) return 'bg-success border-success';
        return 'bg-secondary border-secondary';
    }

    attachEvents() {
        this.container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('Are you sure you want to delete this task globally? This action cannot be undone.')) {
                    try {
                        await api.deleteTask(id);
                        Alert.success('Task removed from system');
                        // Refresh the UI by re-rendering
                        await this.render();
                    } catch (error) {
                        Alert.error('Failed to delete task');
                    }
                }
            });
        });
    }
}
