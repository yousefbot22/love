// ============================================================
// MAIN APPLICATION
// ============================================================

// Make AppData available globally
window.AppData = AppData;

// Make Utils available globally
window.Utils = Utils;

// Initialize all components
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================================
    // STATE
    // ============================================================
    let currentPage = 'home';
    let isLoggedIn = false;

    // ============================================================
    // DOM REFS
    // ============================================================
    const pages = {
        home: document.getElementById('page-home'),
        memories: document.getElementById('page-memories'),
        messages: document.getElementById('page-messages'),
        chat: document.getElementById('page-chat'),
        admin: document.getElementById('page-admin')
    };

    const navBtns = document.querySelectorAll('.bottom-nav button');
    const loginOverlay = document.getElementById('loginOverlay');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const adminBtn = document.getElementById('adminBtn');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightbox = document.getElementById('lightbox');

    // ============================================================
    // COMPONENTS
    // ============================================================
    window.HomeComponent = HomeComponent;
    window.MemoriesComponent = MemoriesComponent;
    window.MessagesComponent = MessagesComponent;
    window.ChatComponent = ChatComponent;
    window.AdminComponent = AdminComponent;

    // ============================================================
    // FLOATING HEARTS
    // ============================================================
    function createHearts() {
        const container = document.getElementById('hearts-container');

        if (!container) return;

        const symbols = [
            '❤️',
            '💕',
            '♥️',
            '💗',
            '💖',
            '💝',
            '💞',
            '💟'
        ];

        const count = Math.min(30, Math.floor(window.innerWidth / 20));

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');

            heart.className = 'heart';
            heart.textContent =
                symbols[Math.floor(Math.random() * symbols.length)];

            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize =
                (0.8 + Math.random() * 1.4) + 'rem';

            heart.style.animationDuration =
                (12 + Math.random() * 20) + 's';

            heart.style.animationDelay =
                (Math.random() * 25) + 's';

            container.appendChild(heart);
        }
    }

    // ============================================================
    // AUTH
    // ============================================================
    function checkSiteAuth() {
        const stored = Utils.storage.get('siteAuth', false);

        if (stored === true) {
            isLoggedIn = true;

            if (loginOverlay) {
                loginOverlay.classList.add('hidden');
            }

            if (adminBtn) {
                adminBtn.style.display = 'inline-block';
            }

            return true;
        }

        return false;
    }

    function siteLogin(password) {
        const data = window.AppData || AppData;

        if (
            data &&
            data.settings &&
            password === data.settings.sitePassword
        ) {
            isLoggedIn = true;

            Utils.storage.set('siteAuth', true);

            if (loginOverlay) {
                loginOverlay.classList.add('hidden');
            }

            if (adminBtn) {
                adminBtn.style.display = 'inline-block';
            }

            if (loginError) {
                loginError.textContent = '';
            }

            if (loginPassword) {
                loginPassword.value = '';
            }

            // Initialize admin
            if (window.AdminComponent) {
                window.AdminComponent.init();
                window.AdminComponent.initialized = true;
            }

            return true;
        }

        if (loginError) {
            loginError.textContent = '❌ كلمة المرور غير صحيحة';
        }

        return false;
    }

    // ============================================================
    // NAVIGATION
    // ============================================================
    function navigateTo(page) {
        currentPage = page;

        // Hide all pages
        Object.keys(pages).forEach(key => {
            if (pages[key]) {
                pages[key].classList.remove('active');
            }
        });

        // Show target page
        if (pages[page]) {
            pages[page].classList.add('active');
        }

        // Update navigation
        if (page === 'admin') {
            navBtns.forEach(btn => {
                btn.classList.remove('active');
            });
        } else {
            navBtns.forEach(btn => {
                btn.classList.toggle(
                    'active',
                    btn.dataset.page === page
                );
            });
        }

        // ========================================================
        // HOME
        // ========================================================
        if (
            page === 'home' &&
            window.HomeComponent
        ) {
            if (!window.HomeComponent.initialized) {
                window.HomeComponent.init();
                window.HomeComponent.initialized = true;
            } else {
                window.HomeComponent.render();
                window.HomeComponent.startCounter();
                window.HomeComponent.bindEvents();
                window.HomeComponent.updateMusic();
            }
        }

        // ========================================================
        // MEMORIES
        // ========================================================
        if (
            page === 'memories' &&
            window.MemoriesComponent
        ) {
            if (!window.MemoriesComponent.initialized) {
                window.MemoriesComponent.init();
                window.MemoriesComponent.initialized = true;
            } else {
                window.MemoriesComponent.render();
                window.MemoriesComponent.bindEvents();
            }
        }

        // ========================================================
        // MESSAGES
        // ========================================================
        if (
            page === 'messages' &&
            window.MessagesComponent
        ) {
            if (!window.MessagesComponent.initialized) {
                window.MessagesComponent.init();
                window.MessagesComponent.initialized = true;
            } else {
                window.MessagesComponent.render();
                window.MessagesComponent.bindEvents();
            }
        }

        // ========================================================
        // CHAT
        // ========================================================
        if (
            page === 'chat' &&
            window.ChatComponent
        ) {
            if (!window.ChatComponent.initialized) {
                window.ChatComponent.init();
                window.ChatComponent.initialized = true;
            } else {
                window.ChatComponent.render();
                window.ChatComponent.bindEvents();
            }
        }

        // ========================================================
        // ADMIN
        // ========================================================
        if (
            page === 'admin' &&
            window.AdminComponent
        ) {
            if (!window.AdminComponent.initialized) {
                window.AdminComponent.init();
                window.AdminComponent.initialized = true;
            } else {
                window.AdminComponent.render();
                window.AdminComponent.bindEvents();
            }
        }
    }

    // ============================================================
    // EVENTS
    // ============================================================
    function initEvents() {

        // Navigation buttons
        navBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const page = this.dataset.page;

                navigateTo(page);
            });
        });

        // Site login
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                siteLogin(loginPassword.value);
            });
        }

        if (loginPassword) {
            loginPassword.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    siteLogin(loginPassword.value);
                }
            });
        }

        // Admin button
        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                if (isLoggedIn) {
                    navigateTo('admin');

                    navBtns.forEach(btn => {
                        btn.classList.remove('active');
                    });
                }
            });
        }

        // Lightbox close
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }

        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {

        // Create floating hearts
        createHearts();

        // Check site authentication
        checkSiteAuth();

        // Initialize events
        initEvents();

        // Initialize home page
        if (window.HomeComponent) {
            window.HomeComponent.init();
            window.HomeComponent.initialized = true;
        }

        // Navigate to home
        navigateTo('home');

        // Make admin available if logged in
        if (
            isLoggedIn &&
            window.AdminComponent
        ) {
            window.AdminComponent.init();
            window.AdminComponent.initialized = true;
        }
    }

    // ============================================================
    // START APPLICATION
    // ============================================================
    init();
});
