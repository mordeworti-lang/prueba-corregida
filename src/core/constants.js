/**
 * Global Constants & Application State Strings
 * Use these to maintain consistency across the entire SPA.
 */

export const CONFIG = {
    APP_NAME: 'CRUDZASO',
    API_URL: 'http://localhost:3000', // Default for [JSON Server](https://www.npmjs.com)
};

export const TASK_STATUS = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed'
};

export const TASK_PRIORITY = {
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low'
};

export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user'
};

export const STORAGE_KEYS = {
    USER: 'crudzaso_user',
    TOKEN: 'crudzaso_token',
    EXPIRY: 'crudzaso_expiry'
};

export const ERROR_MESSAGES = {
    LOGIN_FAILED: 'Invalid email or password',
    REGISTER_FAILED: 'Failed to create account',
    USER_EXISTS: 'User with this email already exists',
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NOT_FOUND: 'Resource not found',
    DELETE_CONFIRM: 'Are you sure you want to delete this item?'
};

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Account created successfully',
    TASK_CREATED: 'Task created successfully',
    TASK_UPDATED: 'Task updated successfully',
    TASK_DELETED: 'Task deleted successfully',
    PROFILE_UPDATED: 'Profile updated successfully'
};
