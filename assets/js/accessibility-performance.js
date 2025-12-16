/**
 * Accessibility & Performance Utilities
 * Features: ARIA labels, keyboard nav, lazy loading, error handling
 */

class AccessibilityManager {
    static initializeAriaLabels() {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('button:not([aria-label])').forEach(btn => {
            const text = btn.textContent.trim();
            if (text) btn.setAttribute('aria-label', text);
        });

        document.querySelectorAll('a:not([aria-label])').forEach(link => {
            const text = link.textContent.trim();
            if (text) link.setAttribute('aria-label', text);
        });

        // Add role to custom elements
        document.querySelectorAll('[role="alert"]').forEach(el => {
            if (!el.getAttribute('aria-live')) {
                el.setAttribute('aria-live', 'polite');
            }
        });
    }

    static enableKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Skip links (press 's')
            if (e.key === 's' && e.ctrlKey) {
                this.showSkipLinks();
                e.preventDefault();
            }
            // Focus search (press '/')
            if (e.key === '/' && !e.target.matches('input, textarea')) {
                document.querySelector('.search-input')?.focus();
                e.preventDefault();
            }
        });
    }

    static showSkipLinks() {
        let skipLinks = document.querySelector('.skip-links');
        if (!skipLinks) {
            skipLinks = document.createElement('div');
            skipLinks.className = 'skip-links';
            skipLinks.innerHTML = `
                <a href="#main-content">Passer au contenu principal</a>
                <a href="#footer">Passer au pied de page</a>
            `;
            document.body.prepend(skipLinks);
        }
        skipLinks.classList.toggle('visible');
    }

    static improveColorContrast() {
        // Ensure text elements have sufficient contrast
        const checkContrast = (text, bg) => {
            const getLuminance = (r, g, b) => {
                const [rs, gs, bs] = [r, g, b].map(x => {
                    x = x / 255;
                    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
            };
            // Implement WCAG contrast checking
            return true; // Placeholder
        };
    }
}

class PerformanceOptimizer {
    static lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    static cacheAssets() {
        if ('caches' in window) {
            const cacheVersion = 'v1';
            const urlsToCache = [
                '/',
                '/index.html',
                '/bib.html',
                '/guide.html',
                '/assets/css/style.css',
                '/assets/js/main.js'
            ];
            
            // Cache on load
            caches.open(cacheVersion).then(cache => {
                urlsToCache.forEach(url => {
                    cache.add(url).catch(e => console.log('Cache failed for:', url));
                });
            });
        }
    }

    static minifyAndBundle() {
        // Defer non-critical scripts
        const scripts = document.querySelectorAll('script[defer-load]');
        scripts.forEach(script => {
            script.async = true;
            script.defer = true;
        });
    }

    static optimizeImages() {
        document.querySelectorAll('img').forEach(img => {
            // Add loading="lazy" if not present
            if (!img.hasAttribute('loading')) {
                img.loading = 'lazy';
            }
            // Ensure alt text exists
            if (!img.alt) {
                img.alt = 'Image';
            }
        });
    }
}

class ErrorHandler {
    static setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Error:', e.error);
            this.showErrorNotification('Une erreur est survenue');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled rejection:', e.reason);
            this.showErrorNotification('Une erreur est survenue');
        });
    }

    static showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }

    static validateForms() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    this.showErrorNotification('Veuillez remplir tous les champs requis');
                }
            });
        });
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    AccessibilityManager.initializeAriaLabels();
    AccessibilityManager.enableKeyboardNavigation();
    PerformanceOptimizer.lazyLoadImages();
    PerformanceOptimizer.cacheAssets();
    PerformanceOptimizer.optimizeImages();
    ErrorHandler.setupGlobalErrorHandling();
    ErrorHandler.validateForms();
});
