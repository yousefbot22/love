// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

const Toast = {
    show: function(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-item ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success: function(message, duration = 3000) {
        this.show(message, 'success', duration);
    },

    error: function(message, duration = 3000) {
        this.show(message, 'error', duration);
    },

    warning: function(message, duration = 3000) {
        this.show(message, 'warning', duration);
    },

    info: function(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Toast;
}
