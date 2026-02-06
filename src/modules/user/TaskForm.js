// modules/user/TaskForm.js
import { api } from '../../api.js';
import { AuthGuard } from '../auth/authGuard.js';
import { config } from '../../core/config.js';
import { Alert } from '../../components/Alert.js';

export class TaskForm {
    constructor(params = {}) {
        // Extraemos el ID si viene de una ruta dinámica (/tasks/edit/:id)
        this.taskId = params.id || null;
        this.user = AuthGuard.getCurrentUser();
    }

    async render() {
        const container = document.createElement('div');
        let task = null;

        // Si existe taskId, es modo edición: cargamos la tarea desde la API
        if (this.taskId) {
            try {
                task = await api.getTaskById(this.taskId);
            } catch (error) {
                Alert.error('Task not found');
                window.router.navigate(config.ROUTES.TASKS);
                return container;
            }
        }

        container.innerHTML = `
            <div class="container py-4">
                <form id="task-form" class="p-4 shadow-sm bg-white rounded border">
                    <h2 class="h4 fw-bold mb-4">${this.taskId ? 'Edit Task' : 'Create New Task'}</h2>
                    
                    <div class="mb-3">
                        <label class="form-label fw-bold">Task Name</label>
                        <input type="text" id="name" class="form-control" value="${task?.name || ''}" placeholder="Enter task name" required>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Category</label>
                            <select id="category" class="form-select">
                                <option value="Work" ${task?.category === 'Work' ? 'selected' : ''}>Work</option>
                                <option value="Study" ${task?.category === 'Study' ? 'selected' : ''}>Study</option>
                                <option value="Personal" ${task?.category === 'Personal' ? 'selected' : ''}>Personal</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Priority</label>
                            <select id="priority" class="form-select">
                                <option value="High" ${task?.priority === 'High' ? 'selected' : ''}>High</option>
                                <option value="Medium" ${task?.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                                <option value="Low" ${task?.priority === 'Low' ? 'selected' : ''}>Low</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-bold">Due Date</label>
                        <input type="date" id="dueDate" class="form-control" value="${task?.dueDate || ''}" required>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary px-4">
                            ${this.taskId ? 'Save Changes' : 'Create Task'}
                        </button>
                        <a href="${config.ROUTES.TASKS}" class="btn btn-light px-4" data-link>Cancel</a>
                    </div>
                </form>
            </div>
        `;

        container.querySelector('#task-form').addEventListener('submit', (e) => this.handleSubmit(e));
        return container;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        // Estructura de datos para enviar a JSON Server
        const taskData = {
            userId: this.user.id, // ID del dueño de la tarea
            assignee: this.user.fullName,
            name: form.querySelector('#name').value.trim(),
            category: form.querySelector('#category').value,
            priority: form.querySelector('#priority').value,
            dueDate: form.querySelector('#dueDate').value,
            status: this.taskId ? undefined : 'Pending' // Solo asigna Pending si es nueva
        };

        // Si es edición, no queremos sobreescribir el status a 'Pending' si ya estaba en otro estado
        if (this.taskId) delete taskData.status;

        try {
            if (this.taskId) {
                await api.updateTask(this.taskId, taskData);
                Alert.success('Task successfully updated');
            } else {
                await api.createTask(taskData);
                Alert.success('Task successfully created');
            }
            // Navegación de vuelta a la lista usando el Router global
            window.router.navigate(config.ROUTES.TASKS);
        } catch (error) {
            console.error('Submit error:', error);
            Alert.error('Could not save task. Please try again.');
        }
    }
}
