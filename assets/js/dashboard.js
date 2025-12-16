/**
 * Student Dashboard - Central hub for all student tools
 * Features: Quick stats, recent activity, shortcuts to tools
 */

class StudentDashboard {
    constructor() {
        this.stats = {
            semesterAverage: 0,
            coursesEnrolled: 0,
            resourcesAccessed: 0,
            upcomingDeadlines: 0
        };
        this.initDashboard();
    }

    initDashboard() {
        this.loadStats();
        this.renderDashboard();
        this.setupEventListeners();
    }

    loadStats() {
        // Load from localStorage if available
        const savedStats = localStorage.getItem('studentStats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        }
    }

    renderDashboard() {
        const dashboard = document.getElementById('dashboard');
        if (!dashboard) return;

        const statsHTML = `
            <div class="dashboard-grid">
                <div class="stat-card" data-stat="average">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Moyenne Générale</h3>
                        <p class="stat-value">${this.stats.semesterAverage.toFixed(2)}</p>
                        <small>Dernière mise à jour: Aujourd'hui</small>
                    </div>
                </div>

                <div class="stat-card" data-stat="courses">
                    <div class="stat-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Cours Actifs</h3>
                        <p class="stat-value">${this.stats.coursesEnrolled}</p>
                        <small>Ce semestre</small>
                    </div>
                </div>

                <div class="stat-card" data-stat="resources">
                    <div class="stat-icon">
                        <i class="fas fa-download"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Ressources Trouvées</h3>
                        <p class="stat-value">${this.stats.resourcesAccessed}</p>
                        <small>Depuis le début</small>
                    </div>
                </div>

                <div class="stat-card" data-stat="deadlines">
                    <div class="stat-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="stat-content">
                        <h3>Échéances Prochaines</h3>
                        <p class="stat-value">${this.stats.upcomingDeadlines}</p>
                        <small>À venir</small>
                    </div>
                </div>
            </div>

            <div class="quick-actions mt-8">
                <h3 class="text-xl font-bold mb-4">Accès Rapide</h3>
                <div class="action-buttons-grid">
                    <a href="index.html" class="action-btn" title="Calculer votre moyenne">
                        <i class="fas fa-calculator"></i>
                        <span>Calculateur</span>
                    </a>
                    <a href="bib.html" class="action-btn" title="Accéder à la bibliothèque">
                        <i class="fas fa-library"></i>
                        <span>Ressources</span>
                    </a>
                    <a href="guide.html" class="action-btn" title="Voir le guide des départements">
                        <i class="fas fa-map"></i>
                        <span>Campus & Guide</span>
                    </a>
                    <a href="#schedule" class="action-btn" title="Afficher votre emploi du temps">
                        <i class="fas fa-clock"></i>
                        <span>Emploi du Temps</span>
                    </a>
                </div>
            </div>
        `;

        dashboard.innerHTML = statsHTML;
    }

    setupEventListeners() {
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleStatClick(e));
        });
    }

    handleStatClick(event) {
        const stat = event.currentTarget.dataset.stat;
        console.log(`Clicked on: ${stat}`);
        // Add analytics tracking here
    }

    updateStats(newStats) {
        this.stats = { ...this.stats, ...newStats };
        localStorage.setItem('studentStats', JSON.stringify(this.stats));
        this.renderDashboard();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dashboard')) {
        new StudentDashboard();
    }
});
