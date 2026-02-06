export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

export function truncateText(text, maxLength = 50) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export function getStatusClass(status) {
    const statusMap = {
        'Pending': 'pending',
        'In Progress': 'in-progress',
        'Completed': 'completed'
    };
    return statusMap[status] || 'pending';
}

export function getPriorityClass(priority) {
    const priorityMap = {
        'High': 'high',
        'Medium': 'medium',
        'Low': 'low'
    };
    return priorityMap[priority] || 'medium';
}

export function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function generateId() {
    return Math.random().toString(36).substr(2, 9);
}