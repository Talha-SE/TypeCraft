// Main JavaScript file for the Typing Practice Website

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    const themeSelector = document.getElementById('theme');
    
    // Apply initial theme
    applyTheme(themeSelector.value);
    
    // Listen for theme changes
    themeSelector.addEventListener('change', function() {
        applyTheme(this.value);
    });
});

function initializeApp() {
    // Initialize global settings and event listeners
    setupNavigation();
    setupModals();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetPage = this.getAttribute('href');
            loadPage(targetPage);
        });
    });
}

function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            // Re-initialize scripts for the new page
            if (page === 'practice.html') {
                initializeTypingTest();
            } else if (page === 'stats.html') {
                loadStats();
            }
        })
        .catch(error => console.error('Error loading page:', error));
}

function setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('is-active');
        modal.querySelector('.modal-close').addEventListener('click', function() {
            modal.classList.remove('is-active');
        });
    }
}

function applyTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('light-theme', 'dark-theme', 'solarized-theme');
    
    // Add selected theme class
    document.body.classList.add(`${theme}-theme`);
}

// Additional functions can be added here for other global functionalities
