export class Validators {
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static minLength(value, length) {
        return value && value.length >= length;
    }

    static maxLength(value, length) {
        return value && value.length <= length;
    }

    static isRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    static isDate(value) {
        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
    }

    static isFutureDate(value) {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }

    static validateEmail(email) {
        const errors = [];
        
        if (!this.isRequired(email)) {
            errors.push('Email is required');
        } else if (!this.isEmail(email)) {
            errors.push('Please enter a valid email address');
        }
        
        return errors;
    }

    static validatePassword(password) {
        const errors = [];
        
        if (!this.isRequired(password)) {
            errors.push('Password is required');
        } else if (!this.minLength(password, 6)) {
            errors.push('Password must be at least 6 characters');
        }
        
        return errors;
    }

    static validateTaskForm(formData) {
        const errors = {};
        
        if (!this.isRequired(formData.name)) {
            errors.name = 'Task name is required';
        } else if (!this.minLength(formData.name, 3)) {
            errors.name = 'Task name must be at least 3 characters';
        }
        
        if (!this.isRequired(formData.dueDate)) {
            errors.dueDate = 'Due date is required';
        } else if (!this.isDate(formData.dueDate)) {
            errors.dueDate = 'Please enter a valid date';
        }
        
        if (!this.isRequired(formData.priority)) {
            errors.priority = 'Priority is required';
        }
        
        if (!this.isRequired(formData.status)) {
            errors.status = 'Status is required';
        }
        
        if (!this.isRequired(formData.category)) {
            errors.category = 'Category is required';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static validateUserForm(formData) {
        const errors = {};
        
        if (!this.isRequired(formData.fullName)) {
            errors.fullName = 'Full name is required';
        } else if (!this.minLength(formData.fullName, 3)) {
            errors.fullName = 'Full name must be at least 3 characters';
        }
        
        const emailErrors = this.validateEmail(formData.email);
        if (emailErrors.length > 0) {
            errors.email = emailErrors[0];
        }
        
        if (formData.password !== undefined) {
            const passwordErrors = this.validatePassword(formData.password);
            if (passwordErrors.length > 0) {
                errors.password = passwordErrors[0];
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}
