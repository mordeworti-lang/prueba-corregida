import { api } from '../../api.js';
import { AuthGuard } from '../auth/authGuard.js';

export class AdminUsers {
    async render() {
        const container = document.createElement('div');
        const currentUser = AuthGuard.getCurrentUser();
        
        // Show loading state while fetching from [JSON Server](https://www.npmjs.com)
        container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div></div>';

        try {
            const users = await api.getUsers();
            
            container.innerHTML = `
                <div class="mb-4">
                    <h1 class="h2 fw-bold mb-1">User Management</h1>
                    <p class="text-muted">Total users registered: ${users.length}</p>
                </div>

                <div class="card border-0 shadow-sm">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4">User</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Employee ID</th>
                                    <th>Join Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.length === 0 ? '<tr><td colspan="5" class="text-center py-4">No users found.</td></tr>' : 
                                    users.map(u => this.renderUserRow(u, currentUser)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } catch (error) {
            container.innerHTML = '<div class="alert alert-danger">Error loading users.</div>';
        }

        return container;
    }

    renderUserRow(user, currentUser) {
        const isMe = user.id === currentUser.id;
        const roleClass = user.role === 'admin' ? 'bg-danger' : 'bg-primary';
        
        return `
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <img src="${user.avatar}" class="rounded-circle me-3 border" width="38" height="38" style="object-fit: cover;">
                        <div>
                            <div class="fw-bold">${user.fullName} ${isMe ? '<span class="badge bg-secondary ms-1" style="font-size: 0.6rem;">YOU</span>' : ''}</div>
                            <div class="text-muted small">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge ${roleClass} bg-opacity-10 text-${user.role === 'admin' ? 'danger' : 'primary'} border border-${user.role === 'admin' ? 'danger' : 'primary'}">
                        ${user.role.toUpperCase()}
                    </span>
                </td>
                <td><span class="text-dark">${user.department || 'N/A'}</span></td>
                <td><code class="text-muted">${user.employeeId || 'N/A'}</code></td>
                <td class="text-muted small">${new Date(user.joinDate).toLocaleDateString()}</td>
            </tr>
        `;
    }
}
