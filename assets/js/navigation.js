/**
 * Enhanced Navigation & Header
 * Features: Sticky header, search, quick links, mobile menu
 */

class EnhancedNavigation {
    constructor() {
        this.initializeHeader();
        this.setupSearch();
        this.setupMobileMenu();
    }

    initializeHeader() {
        const header = document.querySelector('header') || this.createHeader();
        
        if (!header.classList.contains('enhanced-header')) {
            header.classList.add('enhanced-header', 'sticky-top', 'z-50');
        }
    }

    createHeader() {
        const header = document.createElement('header');
        header.className = 'enhanced-header sticky-top z-50';
        header.innerHTML = `
            <nav class="navbar-enhanced">
                <div class="nav-container">
                    <div class="nav-brand">
                        <a href="index.html" class="brand-logo">
                            <i class="fas fa-graduation-cap"></i>
                            <span>ISET'COM</span>
                        </a>
                    </div>

                    <div class="nav-center">
                        <div class="search-container">
                            <input 
                                type="text" 
                                placeholder="Rechercher ressources, cours..." 
                                class="search-input" 
                                aria-label="Rechercher sur le site"
                            >
                            <i class="fas fa-search search-icon"></i>
                        </div>
                    </div>

                    <div class="nav-menu">
                        <a href="index.html" class="nav-link">Calculateur</a>
                        <a href="bib.html" class="nav-link">Ressources</a>
                        <a href="guide.html" class="nav-link">Guide</a>
                        <button class="theme-toggle" id="themeToggle" aria-label="Basculer le thème">
                            <i class="fas fa-moon"></i>
                        </button>
                    </div>

                    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menu mobile">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </nav>
        `;
        document.body.insertBefore(header, document.body.firstChild);
        return header;
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch(e.target.value);
            });
        }
    }

    handleSearch(event) {
        const query = event.target.value.toLowerCase();
        // Implement search functionality
        if (query.length > 2) {
            this.showSearchResults(query);
        }
    }

    performSearch(query) {
        // Navigate to search results
        window.location.href = `bib.html?search=${encodeURIComponent(query)}`;
    }

    showSearchResults(query) {
        // Show dropdown with suggestions
        console.log('Searching for:', query);
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    toggleMobileMenu() {
        const menu = document.querySelector('.nav-menu');
        if (menu) {
            menu.classList.toggle('active');
        }
    }
}

// Theme Toggle
class ThemeManager {
    constructor() {
        this.loadTheme();
        this.setupThemeToggle();
    }

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        this.setTheme(theme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    setupThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const newTheme = current === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
                this.updateToggleIcon(newTheme);
            });
        }
    }

    updateToggleIcon(theme) {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.innerHTML = theme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedNavigation();
    new ThemeManager();
});
