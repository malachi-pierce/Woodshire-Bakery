// Climate Education Website JavaScript
// Smooth scrolling, interactive elements, survey functionality, and data visualizations

// Website state management
let websiteState = {
    currentSection: 'home',
    surveyCompleted: false,
    chartData: null,
    animationsActive: true
};

// DOM Elements
const elements = {
    // Navigation
    navbar: document.querySelector('.navbar'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    // Survey elements
    climateSurvey: document.getElementById('climateSurvey'),
    surveyResults: document.getElementById('surveyResults'),
    resultsContent: document.getElementById('resultsContent'),
    
    // Chart canvas
    emissionsChart: document.getElementById('emissionsChart'),
    
    // Action buttons
    actionButtons: document.querySelectorAll('[onclick]'),
    
    // Form elements (will be added dynamically)
    pledgeForm: null
};

// Initialize website when page loads
function initWebsite() {
    setupSmoothScrolling();
    setupNavigation();
    setupSurvey();
    setupCharts();
    setupAnimations();
    loadWebsiteState();
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active navigation state
                updateActiveNav(link);
                websiteState.currentSection = targetId;
                saveWebsiteState();
            }
        });
    });
}

// Navigation setup and scroll effects
function setupNavigation() {
    // Add scroll shadow to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            elements.navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            elements.navbar.style.boxShadow = 'none';
        }
        
        // Update active section based on scroll position
        updateActiveSection();
    });
}

// Update active navigation link based on scroll position
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
            websiteState.currentSection = sectionId;
        }
    });
}

// Update active navigation state
function updateActiveNav(activeLink) {
    elements.navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Survey functionality
function setupSurvey() {
    if (elements.climateSurvey) {
        elements.climateSurvey.addEventListener('submit', handleSurveySubmit);
    }
}

// Handle survey submission
function handleSurveySubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.climateSurvey);
    const answers = {
        q1: formData.get('q1'),
        q2: formData.get('q2'),
        q3: formData.get('q3')
    };
    
    // Calculate score and provide feedback
    const results = calculateSurveyResults(answers);
    displaySurveyResults(results);
    
    websiteState.surveyCompleted = true;
    saveWebsiteState();
}

// Calculate survey results and provide personalized feedback
function calculateSurveyResults(answers) {
    let score = 0;
    let feedback = [];
    
    // Question 1: Primary cause of climate change
    if (answers.q1 === 'human') {
        score += 33;
        feedback.push('✅ Correct! Human greenhouse gas emissions are the primary cause of current climate change.');
    } else {
        feedback.push('❌ The primary cause is human greenhouse gas emissions, not natural cycles.');
    }
    
    // Question 2: Biggest emissions sector
    if (answers.q2 === 'energy') {
        score += 33;
        feedback.push('✅ Correct! Energy production (electricity and heat) is the largest source of global emissions.');
    } else {
        feedback.push('❌ Energy production is actually the largest source, contributing about 73% of global emissions.');
    }
    
    // Question 3: Most impactful personal action
    if (answers.q3 === 'diet') {
        score += 34;
        feedback.push('✅ Correct! Changing to a plant-rich diet can reduce your carbon footprint by up to 73%.');
    } else {
        feedback.push('❌ While all actions help, dietary changes have the biggest individual impact on emissions.');
    }
    
    return {
        score: score,
        feedback: feedback,
        grade: score >= 80 ? 'Expert' : score >= 60 ? 'Good' : 'Learning',
        recommendations: getPersonalizedRecommendations(answers)
    };
}

// Get personalized recommendations based on answers
function getPersonalizedRecommendations(answers) {
    const recommendations = [];
    
    if (answers.q1 !== 'human') {
        recommendations.push('Start with learning the basic science of climate change from reliable sources like NASA Climate.');
    }
    
    if (answers.q2 !== 'energy') {
        recommendations.push('Focus on understanding how energy production impacts climate and renewable energy solutions.');
    }
    
    if (answers.q3 !== 'diet') {
        recommendations.push('Explore how dietary changes can significantly reduce your environmental impact.');
    }
    
    recommendations.push('Take immediate action by calculating your carbon footprint and setting reduction goals.');
    
    return recommendations;
}

// Display survey results
function displaySurveyResults(results) {
    const resultsHTML = `
        <div class="results-summary">
            <h4>Your Score: ${results.score}/100</h4>
            <p class="grade">Grade: ${results.grade}</p>
        </div>
        <div class="feedback-list">
            ${results.feedback.map(item => `<p>${item}</p>`).join('')}
        </div>
        <div class="recommendations">
            <h4>Personalized Recommendations:</h4>
            <ul>
                ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        <button class="btn btn-primary" onclick="scrollToSection('action')">Take Action Now</button>
    `;
    
    elements.resultsContent.innerHTML = resultsHTML;
    elements.surveyResults.style.display = 'block';
    elements.climateSurvey.style.display = 'none';
    
    // Smooth scroll to results
    elements.surveyResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Chart setup and data visualization
function setupCharts() {
    if (elements.emissionsChart) {
        drawEmissionsChart();
    }
}

// Draw emissions chart
function drawEmissionsChart() {
    const ctx = elements.emissionsChart.getContext('2d');
    const data = {
        labels: ['Energy', 'Agriculture', 'Industry', 'Transport', 'Buildings', 'Other'],
        values: [73, 24, 21, 16, 6, 10]
    };
    
    // Simple bar chart implementation
    const canvas = elements.emissionsChart;
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / data.labels.length * 0.7;
    const spacing = width / data.labels.length * 0.3;
    const maxValue = Math.max(...data.values);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw bars
    data.values.forEach((value, index) => {
        const barHeight = (value / maxValue) * (height - 40);
        const x = index * (barWidth + spacing) + spacing/2;
        const y = height - barHeight - 20;
        
        // Draw bar
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value label
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value + '%', x + barWidth/2, y - 5);
        
        // Draw category label
        ctx.fillText(data.labels[index], x + barWidth/2, height - 5);
    });
    
    // Draw title
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Global Greenhouse Gas Emissions by Sector (%)', width/2, 15);
}

// Animation setup
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.cause-card, .solution-category, .video-card, .action-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Action button handlers
window.showActionDetails = function(type) {
    const actionDetails = {
        immediate: [
            'Use a carbon footprint calculator to understand your impact',
            'Switch to LED bulbs and unplug unused electronics',
            'Try meatless meals 3 times this week',
            'Find local climate groups through 350.org or Climate Reality Project'
        ],
        political: [
            'Find your representatives at usa.gov/elected-officials',
            'Call or email them about climate policies',
            'Vote for candidates with strong climate platforms',
            'Share climate science on social media with friends and family'
        ],
        community: [
            'Organize a neighborhood cleanup event',
            'Start a community garden or farmers market',
            'Advocate for bike lanes and public transit',
            'Present climate solutions at local community meetings'
        ]
    };
    
    const details = actionDetails[type] || [];
    const message = details.length > 0 
        ? details.join('\n\n')
        : 'Action details coming soon!';
    
    showNotification(message, 'info');
};

// Pledge form handler
window.showPledgeForm = function() {
    const pledgeHTML = `
        <div class="pledge-form">
            <h3>Take the Climate Action Pledge</h3>
            <p>Commit to making a difference for our planet's future.</p>
            <form id="pledgeForm">
                <div class="form-group">
                    <label>Your Name:</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>I pledge to:</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" name="actions" value="energy"> Reduce energy consumption</label>
                        <label><input type="checkbox" name="actions" value="transport"> Use sustainable transportation</label>
                        <label><input type="checkbox" name="actions" value="diet"> Adopt plant-rich meals</label>
                        <label><input type="checkbox" name="actions" value="advocacy"> Advocate for climate policies</label>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Submit Pledge</button>
            </form>
        </div>
    `;
    
    showNotification(pledgeHTML, 'pledge');
    
    // Handle pledge form submission
    setTimeout(() => {
        const pledgeForm = document.getElementById('pledgeForm');
        if (pledgeForm) {
            pledgeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showNotification('Thank you for taking the Climate Action Pledge! Check your email for next steps.', 'success');
            });
        }
    }, 100);
};

// Utility functions
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${type === 'pledge' ? message : `<p>${message}</p>`}
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                padding: 20px;
                max-width: 400px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            .notification-info { border-left: 4px solid #3498db; }
            .notification-success { border-left: 4px solid #2ecc71; }
            .notification-pledge { 
                border-left: 4px solid #2ecc71; 
                max-width: 500px;
            }
            .notification-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #7f8c8d;
            }
            .form-group { margin-bottom: 15px; }
            .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
            .form-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            .checkbox-group label { display: block; margin-bottom: 5px; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds for info notifications
    if (type !== 'pledge') {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }
}

// State management functions
function saveWebsiteState() {
    localStorage.setItem('climateEducationState', JSON.stringify(websiteState));
}

function loadWebsiteState() {
    const saved = localStorage.getItem('climateEducationState');
    if (saved) {
        websiteState = { ...websiteState, ...JSON.parse(saved) };
    }
}

// Event listeners setup
function attachEventListeners() {
    // Add any additional event listeners here
    window.addEventListener('resize', () => {
        if (elements.emissionsChart) {
            drawEmissionsChart();
        }
    });
}

// Initialize website when page loads
window.addEventListener('load', () => {
    initWebsite();
    attachEventListeners();
});
