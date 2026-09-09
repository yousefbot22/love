// ============================================================
// MAIN APPLICATION
// ============================================================

// Make AppData available globally
window.AppData = AppData;
window.Utils = Utils;
window.Toast = Toast;

// Initialize all components
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================================
    // STATE
    // ============================================================
    let currentPage = 'home';
    let isLoggedIn = false;
    let sessionTimer = null;
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

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
    const themeBtn = document.getElementById('themeBtn');
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
    // PARTICLES BACKGROUND
    // ============================================================
    function createParticles() {
        const container = document.getElementById('particles-bg');
        if (!container) return;

        const count = Math.min(50, Math.floor(window.innerWidth / 8));
        const colors = ['#ff4d6d', '#ff6b8a', '#ff8fa3', '#ffb3c6', '#ff4d6d'];

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (15 + Math.random() * 30) + 's';
            p.style.animationDelay = Math.random() * 20 + 's';
            const size = 2 + Math.random() * 4;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(p);
        }
    }

    // ============================================================
    // FLOATING HEARTS
    // ============================================================
    function createHearts() {
        const container = document.getElementById('hearts-container');
        if (!container) return;

        const symbols = ['❤️', '💕', '♥️', '💗', '💖', '💝', '💞', '💟'];
        const count = Math.min(30, Math.floor(window.innerWidth / 20));

        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
            heart.style.animationDuration = (12 + Math.random() * 20) + 's';
            heart.style.animationDelay = (Math.random() * 25) + 's';
            container.appendChild(heart);
        }
    }

    // ============================================================
    // THEME
    // ============================================================
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        Utils.storage.set('theme', newTheme);
        
        if (themeBtn) {
            themeBtn.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        }
        Toast.success(newTheme === 'light' ? '☀️ تم التبديل للوضع النهاري' : '🌙 تم التبديل للوضع الليلي');
    }

    function loadTheme() {
        const saved = Utils.storage.get('theme', 'dark');
        document.documentElement.setAttribute('data-theme', saved);
        if (themeBtn) {
            themeBtn.innerHTML = saved === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        }
    }

    // ============================================================
    // AUTH
    // ============================================================
    function checkSiteAuth() {
        const stored = Utils.storage.get('siteAuth', false);
        if (stored === true) {
            isLoggedIn = true;
            if (loginOverlay) loginOverlay.classList.add('hidden');
            if (adminBtn) adminBtn.style.display = 'inline-block';
            resetSessionTimer();
            return true;
        }
        return false;
    }

    function siteLogin(password) {
        const data = window.AppData || AppData;
        if (data && data.settings && password === data.settings.sitePassword) {
            isLoggedIn = true;
            Utils.storage.set('siteAuth', true);
            if (loginOverlay) loginOverlay.classList.add('hidden');
            if (adminBtn) adminBtn.style.display = 'inline-block';
            if (loginError) loginError.textContent = '';
            if (loginPassword) loginPassword.value = '';
            resetSessionTimer();
            Toast.success('✅ مرحباً بك! ❤️');
            
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

    function resetSessionTimer() {
        clearTimeout(sessionTimer);
        sessionTimer = setTimeout(() => {
            if (isLoggedIn) {
                Utils.storage.remove('siteAuth');
                isLoggedIn = false;
                if (loginOverlay) loginOverlay.classList.remove('hidden');
                if (adminBtn) adminBtn.style.display = 'none';
                Toast.warning('⏰ انتهت الجلسة، يرجى إعادة الدخول');
            }
        }, SESSION_TIMEOUT);
    }

    function extendSession() {
        if (isLoggedIn) resetSessionTimer();
    }

    // ============================================================
    // NAVIGATION
    // ============================================================
    function navigateTo(page) {
        currentPage = page;

        Object.keys(pages).forEach(key => {
            if (pages[key]) pages[key].classList.remove('active');
        });

        if (pages[page]) pages[page].classList.add('active');

        if (page === 'admin') {
            navBtns.forEach(btn => btn.classList.remove('active'));
        } else {
            navBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.page === page);
            });
        }

        const components = {
            home: HomeComponent,
            memories: MemoriesComponent,
            messages: MessagesComponent,
            chat: ChatComponent,
            admin: AdminComponent
        };

        const comp = components[page];
        if (comp) {
            if (!comp.initialized) {
                comp.init();
                comp.initialized = true;
            } else {
                comp.render();
                if (comp.bindEvents) comp.bindEvents();
                if (comp.startCounter) comp.startCounter();
                if (comp.updateMusic) comp.updateMusic();
            }
        }

        extendSession();
    }

    // ============================================================
    // EVENTS
    // ============================================================
    function initEvents() {
        navBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                navigateTo(this.dataset.page);
            });
        });

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                siteLogin(loginPassword.value);
            });
        }
        if (loginPassword) {
            loginPassword.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') siteLogin(loginPassword.value);
            });
        }

        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                if (isLoggedIn) {
                    navigateTo('admin');
                    navBtns.forEach(btn => btn.classList.remove('active'));
                }
            });
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', toggleTheme);
        }

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === this) this.classList.remove('active');
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox) {
                lightbox.classList.remove('active');
            }
        });

        ['click', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, extendSession);
        });
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
        createParticles();
        createHearts();
        loadTheme();
        checkSiteAuth();
        initEvents();

        if (window.HomeComponent) {
            window.HomeComponent.init();
            window.HomeComponent.initialized = true;
        }

        navigateTo('home');

        if (isLoggedIn && window.AdminComponent) {
            window.AdminComponent.init();
            window.AdminComponent.initialized = true;
        }

        setTimeout(() => {
            Toast.success('💕 مرحباً بك في ذكرياتنا!');
        }, 1000);
    }

    init();
});
