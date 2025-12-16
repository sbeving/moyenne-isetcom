/**
 * Advanced Utilities & Helpers
 * Date/Time utilities, LocalStorage helpers, Format utilities
 */

class DateTimeUtils {
    static getCurrentSemester() {
        const month = new Date().getMonth();
        return month >= 8 || month < 2 ? 1 : 2;
    }

    static getAcademicYear() {
        const now = new Date();
        const year = now.getFullYear();
        return now.getMonth() >= 8 ? year : year - 1;
    }

    static formatDate(date, format = 'DD/MM/YYYY') {
        const d = new Date(date);
        const pad = (n) => n < 10 ? '0' + n : n;
        
        const formats = {
            'DD/MM/YYYY': `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
            'MM/DD/YYYY': `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`,
            'YYYY-MM-DD': `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
            'relative': this.getRelativeTime(d)
        };
        
        return formats[format] || formats['DD/MM/YYYY'];
    }

    static getRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes}m`;
        if (hours < 24) return `Il y a ${hours}h`;
        if (days < 7) return `Il y a ${days}j`;
        return this.formatDate(date);
    }

    static getDaysUntil(date) {
        const now = new Date();
        const target = new Date(date);
        const diff = target - now;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}

class StorageManager {
    static set(key, value, ttl = null) {
        const data = {
            value,
            timestamp: Date.now(),
            ttl
        };
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }

    static get(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const data = JSON.parse(item);
            
            // Check TTL
            if (data.ttl && Date.now() - data.timestamp > data.ttl) {
                localStorage.removeItem(key);
                return null;
            }

            return data.value;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }

    static getAllKeys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }
        return keys;
    }

    static export() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        return JSON.stringify(data, null, 2);
    }

    static import(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            Object.entries(data).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    }
}

class FormatUtils {
    static gradeToLetter(grade) {
        if (grade >= 18) return 'A+';
        if (grade >= 16) return 'A';
        if (grade >= 14) return 'B+';
        if (grade >= 12) return 'B';
        if (grade >= 10) return 'C';
        if (grade >= 8) return 'D';
        return 'F';
    }

    static letterToGrade(letter) {
        const scale = {
            'A+': 20,
            'A': 18,
            'B+': 16,
            'B': 14,
            'B-': 12,
            'C': 10,
            'D': 8,
            'F': 0
        };
        return scale[letter] || 0;
    }

    static formatNumber(num, decimals = 2) {
        return Number(num).toFixed(decimals);
    }

    static formatCurrency(amount, currency = 'TND') {
        return new Intl.NumberFormat('fr-TN', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    static formatFileSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    static truncate(text, length = 100) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    static capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    static slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    }
}

class ValidationUtils {
    static isEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static isPhone(phone) {
        return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone);
    }

    static isURL(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    static isStrongPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    }

    static isValidGrade(grade) {
        const num = parseFloat(grade);
        return !isNaN(num) && num >= 0 && num <= 20;
    }

    static isEmpty(value) {
        return value === null || value === undefined || value === '';
    }

    static isValidCredits(credits) {
        return Number.isInteger(credits) && credits > 0 && credits <= 10;
    }
}

class NotificationCenter {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <i class="fas fa-${this.getIcon(type)}"></i>
            <span>${message}</span>
            <button class="close-btn" aria-label="Fermer">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        notification.querySelector('.close-btn').addEventListener('click', () => {
            notification.remove();
        });

        if (duration > 0) {
            setTimeout(() => notification.remove(), duration);
        }

        return notification;
    }

    static success(message) {
        return this.show(message, 'success', 3000);
    }

    static error(message) {
        return this.show(message, 'error', 5000);
    }

    static warning(message) {
        return this.show(message, 'warning', 4000);
    }

    static info(message) {
        return this.show(message, 'info', 3000);
    }

    static getIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

class AnalyticsTracker {
    static track(event, data = {}) {
        const timestamp = new Date().toISOString();
        const eventData = {
            event,
            data,
            timestamp,
            userAgent: navigator.userAgent
        };

        // Store locally
        const events = StorageManager.get('analytics_events') || [];
        events.push(eventData);
        StorageManager.set('analytics_events', events.slice(-100)); // Keep last 100

        console.log('Event tracked:', event, data);
    }

    static trackPageView(page) {
        this.track('page_view', { page });
    }

    static trackFeatureUsage(feature) {
        this.track('feature_usage', { feature });
    }

    static trackCalculation(data) {
        this.track('calculation', data);
    }

    static trackResourceAccess(resourceId) {
        this.track('resource_access', { resourceId });
    }

    static getReport() {
        return StorageManager.get('analytics_events') || [];
    }
}

// Export utilities globally
window.DateTimeUtils = DateTimeUtils;
window.StorageManager = StorageManager;
window.FormatUtils = FormatUtils;
window.ValidationUtils = ValidationUtils;
window.NotificationCenter = NotificationCenter;
window.AnalyticsTracker = AnalyticsTracker;

// Initialize tracking
document.addEventListener('DOMContentLoaded', () => {
    AnalyticsTracker.trackPageView(document.title);
});
