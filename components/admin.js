// ============================================================
// ADMIN PAGE COMPONENT - WITH CHARTS & EXPORT
// ============================================================

const AdminComponent = {
    container: null,
    isLoggedIn: false,
    currentSection: 'dashboard',
    editingSongId: null,
    chartInstance: null,
    
    ADMIN_USERNAME: 'love',
    ADMIN_PASSWORD: 'my life',

    init: function() {
        this.container = document.getElementById('page-admin');
        this.isLoggedIn = this.checkAuth();
        this.render();
        this.bindEvents();
    },

    checkAuth: function() {
        const stored = Utils.storage.get('adminAuth', null);
        return stored && stored.username === this.ADMIN_USERNAME;
    },

    render: function() {
        if (!this.isLoggedIn) {
            this.container.innerHTML = this.renderLoginForm();
            return;
        }
        this.container.innerHTML = this.renderDashboard();
        this.showSection('dashboard');
    },

    renderLoginForm: function() {
        return `
            <div class="admin-login" style="padding:30px 0;">
                <div class="glass" style="max-width:360px;margin:0 auto;padding:30px 24px;text-align:center;">
                    <div style="font-size:3rem;margin-bottom:8px;">🔐</div>
                    <h2 style="font-size:1.4rem;margin-bottom:4px;">لوحة التحكم</h2>
                    <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:20px;">أدخل بيانات الدخول</p>
                    <form id="adminLoginForm">
                        <div class="form-group">
                            <label style="text-align:right;display:block;font-size:0.8rem;color:var(--text-secondary);margin-bottom:4px;">اسم المستخدم</label>
                            <input type="text" id="adminUsername" placeholder="love" value="love" style="text-align:center;" />
                        </div>
                        <div class="form-group">
                            <label style="text-align:right;display:block;font-size:0.8rem;color:var(--text-secondary);margin-bottom:4px;">كلمة المرور</label>
                            <input type="password" id="adminPassword" placeholder="••••••••" style="text-align:center;" />
                        </div>
                        <div id="adminLoginError" style="color:#e74c3c;font-size:0.85rem;min-height:24px;margin-bottom:10px;"></div>
                        <button type="submit" style="width:100%;padding:12px;border:none;border-radius:30px;background:var(--accent);color:#fff;font-family:var(--font);font-weight:700;cursor:pointer;transition:var(--transition);font-size:1rem;">
                            دخول
                        </button>
                    </form>
                </div>
            </div>
        `;
    },

    renderDashboard: function() {
        const data = window.AppData || AppData;
        return `
            <div class="admin-panel">
                <div class="admin-header">
                    <h2>📊 لوحة التحكم</h2>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                        <button id="exportDataBtn" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:0.85rem;font-family:var(--font);padding:4px 12px;border-radius:20px;transition:var(--transition);">
                            <i class="fas fa-download"></i> تصدير
                        </button>
                        <button id="importDataBtn" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:0.85rem;font-family:var(--font);padding:4px 12px;border-radius:20px;transition:var(--transition);">
                            <i class="fas fa-upload"></i> استيراد
                        </button>
                        <input type="file" id="importFileInput" accept=".json" style="display:none;" />
                        <span style="font-size:0.8rem;color:var(--text-secondary);">
                            <i class="fas fa-user"></i> ${this.ADMIN_USERNAME}
                        </span>
                        <button id="adminLogoutBtn" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:0.85rem;font-family:var(--font);padding:4px 12px;border-radius:20px;transition:var(--transition);">
                            <i class="fas fa-sign-out-alt"></i> خروج
                        </button>
                    </div>
                </div>

                <div class="admin-grid">
                    <div class="admin-card" data-section="dashboard">
                        <div class="admin-icon">📊</div>
                        <div class="admin-label">نظرة عامة</div>
                        <div class="admin-count">إحصائيات</div>
                    </div>
                    <div class="admin-card" data-section="memories">
                        <div class="admin-icon">🖼</div>
                        <div class="admin-label">الذكريات</div>
                        <div class="admin-count">${data.memories.length}</div>
                    </div>
                    <div class="admin-card" data-section="messages">
                        <div class="admin-icon">💌</div>
                        <div class="admin-label">الرسائل</div>
                        <div class="admin-count">${data.messages.length}</div>
                    </div>
                    <div class="admin-card" data-section="songs">
                        <div class="admin-icon">🎵</div>
                        <div class="admin-label">الأغاني</div>
                        <div class="admin-count">${data.songs.length}</div>
                    </div>
                    <div class="admin-card" data-section="timeline">
                        <div class="admin-icon">📅</div>
                        <div class="admin-label">الجدول الزمني</div>
                        <div class="admin-count">${data.timeline.length}</div>
                    </div>
                    <div class="admin-card" data-section="settings">
                        <div class="admin-icon">⚙️</div>
                        <div class="admin-label">الإعدادات</div>
                        <div class="admin-count">تعديل</div>
                    </div>
                    <div class="admin-card" data-section="security">
                        <div class="admin-icon">🔐</div>
                        <div class="admin-label">الأمان</div>
                        <div class="admin-count">تغيير</div>
                    </div>
                    <div class="admin-card" data-section="music">
                        <div class="admin-icon">🎶</div>
                        <div class="admin-label">الموسيقى</div>
                        <div class="admin-count">إدارة</div>
                    </div>
                </div>

                <div id="adminContent"></div>
            </div>
        `;
    },

    showSection: function(section) {
        const content = document.getElementById('adminContent');
        if (!content) return;

        // Destroy chart if exists
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }

        switch(section) {
            case 'dashboard':
                content.innerHTML = this.renderDashboardStats();
                break;
            case 'memories':
                content.innerHTML = this.renderMemoriesManager();
                break;
            case 'messages':
                content.innerHTML = this.renderMessagesManager();
                break;
            case 'songs':
                content.innerHTML = this.renderSongsManager();
                break;
            case 'timeline':
                content.innerHTML = this.renderTimelineManager();
                break;
            case 'settings':
                content.innerHTML = this.renderSettingsManager();
                break;
            case 'security':
                content.innerHTML = this.renderSecurityManager();
                break;
            case 'music':
                content.innerHTML = this.renderMusicManager();
                break;
            default:
                content.innerHTML = '';
        }

        this.currentSection = section;
        this.bindSectionEvents(section);
    },

    renderDashboardStats: function() {
        const data = window.AppData || AppData;
        const totalItems = data.memories.length + data.messages.length + data.songs.length + data.timeline.length;
        
        setTimeout(() => this.renderChart(), 100);

        return `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
                <div class="glass-sm" style="padding:16px;text-align:center;">
                    <div style="font-size:2rem;">🖼</div>
                    <div style="font-size:1.6rem;font-weight:700;">${data.memories.length}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);">ذكريات</div>
                </div>
                <div class="glass-sm" style="padding:16px;text-align:center;">
                    <div style="font-size:2rem;">💌</div>
                    <div style="font-size:1.6rem;font-weight:700;">${data.messages.length}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);">رسائل</div>
                </div>
                <div class="glass-sm" style="padding:16px;text-align:center;">
                    <div style="font-size:2rem;">🎵</div>
                    <div style="font-size:1.6rem;font-weight:700;">${data.songs.length}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);">أغاني</div>
                </div>
                <div class="glass-sm" style="padding:16px;text-align:center;">
                    <div style="font-size:2rem;">📅</div>
                    <div style="font-size:1.6rem;font-weight:700;">${data.timeline.length}</div>
                    <div style="font-size:0.8rem;color:var(--text-secondary);">أحداث</div>
                </div>
            </div>
            <div class="stats-chart">
                <canvas id="statsChart"></canvas>
            </div>
            <div class="glass-sm" style="padding:16px;text-align:center;color:var(--text-secondary);font-size:0.85rem;margin-top:12px;">
                <i class="fas fa-clock"></i> تاريخ البداية: ${Utils.formatDate(data.settings.startDate)}
                <br />
                <span style="font-size:0.7rem;">📊 إجمالي العناصر: ${totalItems}</span>
            </div>
        `;
    },

    renderChart: function() {
        const ctx = document.getElementById('statsChart')?.getContext('2d');
        if (!ctx) return;

        const data = window.AppData || AppData;
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const textColor = isDark ? '#f5e6e6' : '#2d1a1a';

        this.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['🖼 ذكريات', '💌 رسائل', '🎵 أغاني', '📅 أحداث'],
                datasets: [{
                    data: [
                        data.memories.length || 1,
                        data.messages.length || 1,
                        data.songs.length || 1,
                        data.timeline.length || 1
                    ],
                    backgroundColor: ['#ff4d6d', '#ff6b8a', '#ff8fa3', '#ffb3c6'],
                    borderColor: isDark ? '#1a1015' : '#faf0f0',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            font: { family: 'Tajawal', size: 11 },
                            padding: 12
                        }
                    }
                },
                cutout: '65%'
            }
        });
    },

    // ============================================================
    // EXPORT / IMPORT DATA
    // ============================================================
    exportData: function() {
        const data = window.AppData || AppData;
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ذكرياتنا_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Toast.success('✅ تم تصدير البيانات بنجاح');
    },

    importData: function(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.settings && data.memories !== undefined) {
                    window.AppData = data;
                    Toast.success('✅ تم استيراد البيانات بنجاح، سيتم تحديث الصفحة');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    Toast.error('❌ الملف غير صالح');
                }
            } catch (error) {
                Toast.error('❌ خطأ في قراءة الملف');
            }
        };
        reader.readAsText(file);
    },

    // ============================================================
    // BIND MAIN EVENTS
    // ============================================================
    bindEvents: function() {
        // Login
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('adminUsername').value;
                const password = document.getElementById('adminPassword').value;
                const errorEl = document.getElementById('adminLoginError');

                if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
                    this.isLoggedIn = true;
                    Utils.storage.set('adminAuth', { username, timestamp: Date.now() });
                    this.render();
                    this.bindEvents();
                    errorEl.textContent = '';
                    Toast.success('✅ مرحباً بك في لوحة التحكم');
                } else {
                    errorEl.textContent = '❌ اسم المستخدم أو كلمة المرور غير صحيحة';
                }
            });
        }

        // Admin cards
        document.querySelectorAll('.admin-card').forEach(card => {
            card.addEventListener('click', () => {
                const section = card.dataset.section;
                if (section) this.showSection(section);
            });
        });

        // Logout
        const logoutBtn = document.getElementById('adminLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من الخروج؟')) {
                    Utils.storage.remove('adminAuth');
                    this.isLoggedIn = false;
                    this.render();
                    this.bindEvents();
                    Toast.info('👋 تم الخروج بنجاح');
                }
            });
        }

        // Export
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Import
        const importBtn = document.getElementById('importDataBtn');
        const importInput = document.getElementById('importFileInput');
        if (importBtn && importInput) {
            importBtn.addEventListener('click', () => importInput.click());
            importInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    this.importData(e.target.files[0]);
                    importInput.value = '';
                }
            });
        }
    },

    // ============================================================
    // SECTION EVENTS (يتم تكرارها من الملف الأصلي)
    // ============================================================
    bindSectionEvents: function(section) {
        // نفس الكود الموجود في admin.js الأصلي
        // ... (محذوف للاختصار)
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminComponent;
}
