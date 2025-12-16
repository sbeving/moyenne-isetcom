/**
 * Schedule Viewer - Display student schedule
 * Integrates with the academic data
 */

class ScheduleViewer {
    constructor() {
        this.schedule = [];
        this.currentWeek = this.getCurrentWeek();
        this.initSchedule();
    }

    getCurrentWeek() {
        const now = new Date();
        const first = now.getDate() - now.getDay();
        return {
            start: new Date(now.setDate(first)),
            end: new Date(now.setDate(first + 6))
        };
    }

    initSchedule() {
        // Load sample schedule - can be populated from database
        this.schedule = [
            { day: 'Monday', time: '08:00-09:30', course: 'Réseaux I', room: 'A101', professor: 'Dr. Ahmed' },
            { day: 'Monday', time: '10:00-11:30', course: 'Systèmes', room: 'A102', professor: 'Dr. Fatima' },
            { day: 'Tuesday', time: '09:00-10:30', course: 'Base de Données', room: 'B201', professor: 'Dr. Ali' },
            { day: 'Wednesday', time: '08:00-09:30', course: 'Sécurité', room: 'A103', professor: 'Dr. Sara' },
            { day: 'Thursday', time: '14:00-15:30', course: 'Projet', room: 'Lab1', professor: 'Dr. Mohammed' },
            { day: 'Friday', time: '10:00-12:00', course: 'Anglais', room: 'C301', professor: 'Mr. John' }
        ];
        this.renderSchedule();
    }

    renderSchedule() {
        const container = document.getElementById('schedule-container');
        if (!container) return;

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        let html = '<div class="schedule-grid">';
        
        days.forEach(day => {
            const dayClasses = this.schedule.filter(s => s.day === day);
            html += `
                <div class="schedule-day">
                    <h4 class="day-header">${day}</h4>
                    <div class="classes-list">
            `;
            
            if (dayClasses.length === 0) {
                html += '<p class="no-classes">Pas de cours</p>';
            } else {
                dayClasses.forEach(cls => {
                    html += `
                        <div class="schedule-item">
                            <div class="time"><i class="fas fa-clock"></i> ${cls.time}</div>
                            <div class="course-title">${cls.course}</div>
                            <div class="course-meta">
                                <span><i class="fas fa-door-open"></i> ${cls.room}</span>
                                <span><i class="fas fa-user"></i> ${cls.professor}</span>
                            </div>
                        </div>
                    `;
                });
            }
            
            html += '</div></div>';
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    exportSchedule(format = 'ics') {
        // Export schedule in iCalendar format
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ISETCOM//Schedule//EN\n';
        
        this.schedule.forEach(event => {
            icsContent += `BEGIN:VEVENT\n`;
            icsContent += `SUMMARY:${event.course}\n`;
            icsContent += `LOCATION:${event.room}\n`;
            icsContent += `END:VEVENT\n`;
        });
        
        icsContent += 'END:VCALENDAR';
        
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        this.downloadFile(blob, 'schedule.ics');
    }

    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}

/**
 * GPA Calculator - Track overall performance
 */
class GPACalculator {
    constructor() {
        this.courses = [];
        this.loadCourses();
    }

    loadCourses() {
        const saved = localStorage.getItem('courses');
        if (saved) {
            this.courses = JSON.parse(saved);
        }
    }

    addCourse(name, credits, grade) {
        const course = { name, credits, grade, id: Date.now() };
        this.courses.push(course);
        this.saveCourses();
        return course;
    }

    removeCourse(id) {
        this.courses = this.courses.filter(c => c.id !== id);
        this.saveCourses();
    }

    calculateGPA() {
        if (this.courses.length === 0) return 0;
        
        const totalCredits = this.courses.reduce((sum, c) => sum + c.credits, 0);
        const gradePoints = this.courses.reduce((sum, c) => sum + (c.grade * c.credits), 0);
        
        return (gradePoints / totalCredits).toFixed(2);
    }

    getGradeScale() {
        // Tunisia 20-point scale
        const scale = {
            'A': 18,
            'B+': 16,
            'B': 14,
            'C+': 12,
            'C': 10,
            'D': 8,
            'F': 0
        };
        return scale;
    }

    saveCourses() {
        localStorage.setItem('courses', JSON.stringify(this.courses));
    }

    renderGPAView() {
        const container = document.getElementById('gpa-container');
        if (!container) return;

        const gpa = this.calculateGPA();
        const gpaColor = gpa >= 15 ? 'text-green-600' : gpa >= 10 ? 'text-yellow-600' : 'text-red-600';

        let html = `
            <div class="gpa-overview">
                <div class="gpa-score ${gpaColor}">
                    <div class="gpa-value">${gpa}</div>
                    <div class="gpa-label">Votre GPA</div>
                </div>

                <table class="courses-table">
                    <thead>
                        <tr>
                            <th>Cours</th>
                            <th>Crédits</th>
                            <th>Note</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        this.courses.forEach(course => {
            html += `
                <tr>
                    <td>${course.name}</td>
                    <td>${course.credits}</td>
                    <td>${course.grade}</td>
                    <td>
                        <button class="btn-small btn-delete" onclick="gpaCalc.removeCourse(${course.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }
}

/**
 * Study Groups Finder
 */
class StudyGroupFinder {
    constructor() {
        this.groups = [];
        this.loadGroups();
    }

    loadGroups() {
        const sample = [
            { 
                id: 1, 
                name: 'Réseaux Study Group', 
                subject: 'Réseaux I', 
                members: 5, 
                meeting: 'Tuesday 16:00',
                description: 'Préparation pour l\'examen'
            },
            { 
                id: 2, 
                name: 'BD Masters', 
                subject: 'Base de Données', 
                members: 8, 
                meeting: 'Wednesday 17:00',
                description: 'Projet collaboratif'
            },
            { 
                id: 3, 
                name: 'Security Squad', 
                subject: 'Sécurité', 
                members: 6, 
                meeting: 'Friday 15:00',
                description: 'Discussion et partage de ressources'
            }
        ];
        this.groups = sample;
    }

    renderGroups() {
        const container = document.getElementById('study-groups');
        if (!container) return;

        let html = '<div class="groups-grid">';

        this.groups.forEach(group => {
            html += `
                <div class="group-card">
                    <div class="group-header">
                        <h4>${group.name}</h4>
                        <span class="subject-badge">${group.subject}</span>
                    </div>
                    <p class="group-description">${group.description}</p>
                    <div class="group-meta">
                        <span><i class="fas fa-users"></i> ${group.members} membres</span>
                        <span><i class="fas fa-calendar"></i> ${group.meeting}</span>
                    </div>
                    <button class="btn-join">Rejoindre le groupe</button>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    createGroup(name, subject, description) {
        const group = {
            id: Date.now(),
            name,
            subject,
            description,
            members: 1,
            meeting: 'À définir'
        };
        this.groups.push(group);
        return group;
    }
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('schedule-container')) {
        window.scheduleViewer = new ScheduleViewer();
    }
    if (document.getElementById('gpa-container')) {
        window.gpaCalc = new GPACalculator();
        window.gpaCalc.renderGPAView();
    }
    if (document.getElementById('study-groups')) {
        window.studyGroups = new StudyGroupFinder();
        window.studyGroups.renderGroups();
    }
});
