import { api } from '../../api.js';
import { config } from '../../core/config.js';
import { formatDate } from '../../utils/helpers.js';
import { Alert } from '../../components/Alert.js';

export class AdminDashboard {
    constructor() {
        this.tasks = [];
        this.filteredTasks = [];
        this.stats = {};
        this.container = document.createElement('div');
    }

    async render() {
        await this.refreshData();
        return this.container;
    }

    async refreshData() {
        // Cargar datos desde la API
        try {
            const [tasks, stats] = await Promise.all([
                api.getTasks(),
                api.getTaskStats()
            ]);
            this.tasks = tasks;
            this.filteredTasks = tasks;
            this.stats = stats;
            
            this.updateUI();
        } catch (error) {
            Alert.error('Could not sync with server.');
        }
    }

    updateUI() {
        this.container.innerHTML = this.getHTML();
        this.attachEventListeners();
    }

    getHTML() {
        return `
            <div class="mb-4">
                <h1 class="h2 fw-bold mb-1">Admin Dashboard</h1>
                <p class="text-muted">General monitoring of all user activities</p>
            </div>

            <!-- Statistics -->
            <div class="row g-3 mb-4">
                ${this.renderStatCards()}
            </div>

            <!-- Actions & Filters -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="btn-group shadow-sm">
                    <button class="btn btn-sm btn-white border filter-btn active" data-status="all">All</button>
                    <button class="btn btn-sm btn-white border filter-btn" data-status="Pending">Pending</button>
                    <button class="btn btn-sm btn-white border filter-btn" data-status="In Progress">In Progress</button>
                    <button class="btn btn-sm btn-white border filter-btn" data-status="Completed">Completed</button>
                </div>
                <button class="btn btn-sm btn-primary rounded-pill px-3" id="refresh-btn">
                    <i class="bi bi-arrow-clockwise me-1"></i> Sync Data
                </button>
            </div>

            <!-- Tasks Table -->
            <div class="card border-0 shadow-sm overflow-hidden">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4 py-3">Task Detail</th>
                                <th>Assignee</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th class="text-end pe-4">Manage</th>
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

    // ✅ AGREGADO: Método faltante renderStatCards
    renderStatCards() {
        const cards = [
            {
                title: 'Total Tasks',
                value: this.stats.total || 0,
                icon: 'clipboard-check',
                color: 'blue',
                bgClass: 'bg-primary bg-opacity-10'
            },
            {
                title: 'Pending',
                value: this.stats.pending || 0,
                icon: 'hourglass-split',
                color: 'yellow',
                bgClass: 'bg-warning bg-opacity-10'
            },
            {
                title: 'In Progress',
                value: this.stats.inProgress || 0,
                icon: 'arrow-repeat',
                color: 'blue',
                bgClass: 'bg-info bg-opacity-10'
            },
            {
                title: 'Completed',
                value: this.stats.completed || 0,
                icon: 'check-circle',
                color: 'green',
                bgClass: 'bg-success bg-opacity-10'
            }
        ];

        return cards.map(card => `
            <div class="col-md-3">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <p class="text-muted small mb-1 text-uppercase fw-bold" style="font-size: 0.7rem;">${card.title}</p>
                                <h3 class="h2 fw-bold mb-0">${card.value}</h3>
                            </div>
                            <div class="stat-icon ${card.color}">
                                <i class="bi bi-${card.icon} fs-4"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderTaskRows() {
        if (this.filteredTasks.length === 0) {
            return `<tr><td colspan="6" class="text-center py-5 text-muted">No tasks match your filter.</td></tr>`;
        }

        return this.filteredTasks.map(task => `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold">${task.name}</div>
                    <span class="badge bg-light text-dark extra-small">${task.category || 'General'}</span>
                </td>
                <td><i class="bi bi-person-circle me-1 text-muted"></i> ${task.assignee}</td>
                <td>
                    <span class="badge rounded-pill bg-opacity-10 text-dark border ${this.getStatusBorder(task.status)}">
                        ${task.status}
                    </span>
                </td>
                <td><span class="priority-dot ${task.priority.toLowerCase()}"></span> ${task.priority}</td>
                <td class="small">${formatDate(task.dueDate)}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-light text-danger btn-delete" data-id="${task.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getStatusBorder(status) {
        if (status === 'Pending') return 'border-warning';
        if (status === 'In Progress') return 'border-primary';
        return 'border-success';
    }

    attachEventListeners() {
        // Filtrado dinámico
        this.container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const status = e.target.dataset.status;
                
                // Actualizar UI de botones
                this.container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('btn-primary', 'active'));
                btn.classList.add('btn-primary', 'active');

                // Filtrar array
                this.filteredTasks = status === 'all' 
                    ? this.tasks 
                    : this.tasks.filter(t => t.status === status);
                
                // Actualizar solo el cuerpo de la tabla
                this.container.querySelector('tbody').innerHTML = this.renderTaskRows();
                this.attachDeleteEvents();
            });
        });

        // Botón Refresh
        this.container.querySelector('#refresh-btn').addEventListener('click', () => this.refreshData());
        
        this.attachDeleteEvents();
    }

    attachDeleteEvents() {
        this.container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('Permanently delete this task across the entire system?')) {
                    try {
                        await api.deleteTask(id);
                        Alert.success('Task purged successfully');
                        await this.refreshData();
                    } catch (error) {
                        Alert.error('Server error during deletion');
                    }
                }
            });
        });
    }
}
