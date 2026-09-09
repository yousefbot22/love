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
    ADMIN_PASSWORD: 'my live',

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
        
        setTimeout(() => this.renderChart(), 200);

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
    // MEMORIES MANAGER
    // ============================================================
    renderMemoriesManager: function() {
        const data = window.AppData || AppData;
        return `
            <div class="admin-form">
                <div class="form-title">➕ إضافة ذكرى جديدة</div>
                <form id="memoryForm">
                    <div class="form-group">
                        <label>الوصف</label>
                        <textarea id="memoryDesc" placeholder="وصف الذكرى" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>إيموجي</label>
                        <input type="text" id="memoryEmoji" placeholder="❤️" maxlength="2" value="❤️" />
                    </div>
                    <div class="form-group">
                        <label>رابط الصورة</label>
                        <input type="text" id="memoryImage" placeholder="https://example.com/image.jpg" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 حفظ</button>
                        <button type="reset" class="btn-cancel">🗑 إلغاء</button>
                    </div>
                </form>
            </div>
            <div class="admin-list">
                <div style="font-weight:700;margin-bottom:8px;">📋 قائمة الذكريات (${data.memories.length})</div>
                ${data.memories.length ? data.memories.map(m => `
                    <div class="list-item" data-id="${m.id}">
                        <div class="item-info">
                            <div class="item-title">${m.emoji || '❤️'} ${m.description || 'ذكرى'}</div>
                            <div class="item-sub">${m.image ? '🖼' : '📝'}</div>
                        </div>
                        <div class="item-actions">
                            <button class="delete-btn" data-id="${m.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('') : '<div style="text-align:center;padding:20px;color:var(--text-secondary);opacity:0.6;">لا توجد ذكريات</div>'}
            </div>
        `;
    },

    // ============================================================
    // MESSAGES MANAGER
    // ============================================================
    renderMessagesManager: function() {
        const data = window.AppData || AppData;
        return `
            <div class="admin-form">
                <div class="form-title">➕ إضافة رسالة جديدة</div>
                <form id="messageForm">
                    <div class="form-group">
                        <label>نص الرسالة</label>
                        <textarea id="messageContent" placeholder="نص الرسالة" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>إيموجي</label>
                        <input type="text" id="messageEmoji" placeholder="💌" maxlength="2" value="💌" />
                    </div>
                    <div class="form-group">
                        <label>رابط الصورة (اختياري)</label>
                        <input type="text" id="messageImage" placeholder="https://example.com/image.jpg" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 حفظ</button>
                        <button type="reset" class="btn-cancel">🗑 إلغاء</button>
                    </div>
                </form>
            </div>
            <div class="admin-list">
                <div style="font-weight:700;margin-bottom:8px;">📋 قائمة الرسائل (${data.messages.length})</div>
                ${data.messages.length ? data.messages.map(m => `
                    <div class="list-item" data-id="${m.id}">
                        <div class="item-info">
                            <div class="item-title">${m.emoji || '💌'} ${m.content || 'رسالة'}</div>
                            <div class="item-sub">${m.image ? '🖼' : '📝'}</div>
                        </div>
                        <div class="item-actions">
                            <button class="delete-btn" data-id="${m.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('') : '<div style="text-align:center;padding:20px;color:var(--text-secondary);opacity:0.6;">لا توجد رسائل</div>'}
            </div>
        `;
    },

    // ============================================================
    // SONGS MANAGER
    // ============================================================
    renderSongsManager: function() {
        const data = window.AppData || AppData;
        const editingSong = this.editingSongId ? data.songs.find(s => s.id === this.editingSongId) : null;

        return `
            <div class="admin-form">
                <div class="form-title">${editingSong ? '✏️ تعديل الأغنية' : '➕ إضافة أغنية جديدة'}</div>
                <form id="songForm">
                    <input type="hidden" id="songEditId" value="${editingSong ? editingSong.id : ''}" />
                    <div class="form-group">
                        <label>اسم الأغنية</label>
                        <input type="text" id="songName" placeholder="اسم الأغنية" required value="${editingSong ? editingSong.name : ''}" />
                    </div>
                    <div class="form-group">
                        <label>اسم الفنان</label>
                        <input type="text" id="songArtist" placeholder="اسم الفنان" required value="${editingSong ? editingSong.artist : ''}" />
                    </div>
                    <div class="form-group">
                        <label>رابط الصورة (غلاف)</label>
                        <input type="text" id="songCover" placeholder="https://example.com/cover.jpg" value="${editingSong ? editingSong.cover : ''}" />
                    </div>
                    <div class="form-group">
                        <label>رابط الصوت (MP3 أو SoundCloud)</label>
                        <input type="text" id="songAudio" placeholder="https://example.com/song.mp3" value="${editingSong ? editingSong.audioUrl : ''}" />
                    </div>
                    <div class="form-group">
                        <label>الوصف</label>
                        <input type="text" id="songDesc" placeholder="وصف الأغنية" value="${editingSong ? editingSong.description : ''}" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 ${editingSong ? 'تحديث' : 'حفظ'}</button>
                        ${editingSong ? `<button type="button" class="btn-cancel" id="cancelEditSong">🗑 إلغاء التعديل</button>` : ''}
                        <button type="reset" class="btn-cancel">🗑 إلغاء</button>
                    </div>
                </form>
            </div>
            <div class="admin-list">
                <div style="font-weight:700;margin-bottom:8px;">📋 قائمة الأغاني (${data.songs.length})</div>
                ${data.songs.length ? data.songs.map(s => `
                    <div class="list-item" data-id="${s.id}">
                        <div class="item-info">
                            <div class="item-title">🎵 ${s.name}</div>
                            <div class="item-sub">${s.artist} ${s.audioUrl ? '🔊' : '🔇'}</div>
                        </div>
                        <div class="item-actions">
                            <button class="edit-song-btn" data-id="${s.id}"><i class="fas fa-edit"></i></button>
                            <button class="delete-song-btn" data-id="${s.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('') : '<div style="text-align:center;padding:20px;color:var(--text-secondary);opacity:0.6;">لا توجد أغاني</div>'}
            </div>
        `;
    },

    // ============================================================
    // TIMELINE MANAGER
    // ============================================================
    renderTimelineManager: function() {
        const data = window.AppData || AppData;
        return `
            <div class="admin-form">
                <div class="form-title">➕ إضافة حدث جديد</div>
                <form id="timelineForm">
                    <div class="form-group">
                        <label>الوصف</label>
                        <input type="text" id="timelineDesc" placeholder="وصف الحدث" required />
                    </div>
                    <div class="form-group">
                        <label>إيموجي</label>
                        <input type="text" id="timelineEmoji" placeholder="✨" maxlength="2" value="✨" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 حفظ</button>
                        <button type="reset" class="btn-cancel">🗑 إلغاء</button>
                    </div>
                </form>
            </div>
            <div class="admin-list">
                <div style="font-weight:700;margin-bottom:8px;">📋 قائمة الأحداث (${data.timeline.length})</div>
                ${data.timeline.length ? data.timeline.map((t, i) => `
                    <div class="list-item" data-index="${i}">
                        <div class="item-info">
                            <div class="item-title">${t.emoji || '✨'} ${t.description || ''}</div>
                        </div>
                        <div class="item-actions">
                            <button class="delete-timeline-btn" data-index="${i}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `).join('') : '<div style="text-align:center;padding:20px;color:var(--text-secondary);opacity:0.6;">لا توجد أحداث</div>'}
            </div>
        `;
    },

    // ============================================================
    // SETTINGS MANAGER
    // ============================================================
    renderSettingsManager: function() {
        const data = window.AppData || AppData;
        const settings = data.settings;

        const formatDateForInput = function(date) {
            if (!date) return '';
            try {
                const d = new Date(date);
                return d.toISOString().slice(0, 16);
            } catch (e) {
                return '';
            }
        };

        return `
            <div class="admin-form">
                <div class="form-title">⚙️ إعدادات الموقع</div>
                <form id="settingsForm">
                    <div class="form-group">
                        <label>عنوان الموقع</label>
                        <input type="text" id="siteTitle" value="${settings.siteTitle || 'ذكرياتنا ❤️'}" />
                    </div>
                    <div class="form-group">
                        <label>العنوان الفرعي</label>
                        <input type="text" id="siteSubtitle" value="${settings.siteSubtitle || 'من بداية قصتنا إلى كل لحظة جميلة عشناها'}" />
                    </div>
                    <div class="form-group">
                        <label>تاريخ البداية</label>
                        <input type="datetime-local" id="startDate" value="${formatDateForInput(settings.startDate)}" />
                    </div>
                    <div class="form-group">
                        <label>كلمة مرور الموقع</label>
                        <input type="text" id="sitePassword" value="${settings.sitePassword || ''}" placeholder="كلمة مرور جديدة" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 حفظ الإعدادات</button>
                    </div>
                </form>
            </div>
        `;
    },

    // ============================================================
    // SECURITY MANAGER
    // ============================================================
    renderSecurityManager: function() {
        return `
            <div class="admin-form">
                <div class="form-title">🔐 تغيير بيانات الدخول</div>
                <form id="securityForm">
                    <div class="form-group">
                        <label>اسم المستخدم الحالي</label>
                        <input type="text" id="currentUsername" value="${this.ADMIN_USERNAME}" disabled style="opacity:0.6;" />
                    </div>
                    <div class="form-group">
                        <label>كلمة المرور الحالية</label>
                        <input type="password" id="currentPassword" placeholder="••••••••" required />
                    </div>
                    <div class="form-group">
                        <label>اسم المستخدم الجديد</label>
                        <input type="text" id="newUsername" placeholder="اسم مستخدم جديد" />
                    </div>
                    <div class="form-group">
                        <label>كلمة المرور الجديدة</label>
                        <input type="password" id="newPassword" placeholder="••••••••" />
                    </div>
                    <div class="form-group">
                        <label>تأكيد كلمة المرور</label>
                        <input type="password" id="confirmPassword" placeholder="••••••••" />
                    </div>
                    <div style="color:var(--text-secondary);font-size:0.8rem;margin-bottom:12px;">
                        <i class="fas fa-info-circle"></i> اترك الحقول فارغة إذا لم ترغب في تغييرها
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 تحديث البيانات</button>
                    </div>
                </form>
            </div>
        `;
    },

    // ============================================================
    // MUSIC MANAGER
    // ============================================================
    renderMusicManager: function() {
        const data = window.AppData || AppData;
        const song = data.songs[0] || {};
        return `
            <div class="admin-form">
                <div class="form-title">🎶 إدارة الموسيقى الرئيسية</div>
                <form id="musicForm">
                    <div class="form-group">
                        <label>رابط الصوت (MP3)</label>
                        <input type="text" id="musicAudioUrl" value="${song.audioUrl || ''}" placeholder="https://example.com/song.mp3" />
                        <div style="font-size:0.7rem;color:var(--text-secondary);margin-top:4px;">
                            <i class="fas fa-info-circle"></i> استخدم رابطاً مباشراً لملف MP3 أو رابط SoundCloud
                        </div>
                    </div>
                    <div class="form-group">
                        <label>رابط الغلاف</label>
                        <input type="text" id="musicCover" value="${song.cover || ''}" placeholder="https://example.com/cover.jpg" />
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-save">💾 تحديث الموسيقى</button>
                    </div>
                </form>
            </div>
            <div class="glass-sm" style="padding:16px;margin:12px 0;">
                <div style="font-weight:700;margin-bottom:8px;">📌 اختبار الرابط</div>
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                    <input type="text" id="testAudioUrl" value="${song.audioUrl || ''}" placeholder="أدخل رابطاً للتجربة" style="flex:1;min-width:200px;padding:8px 14px;border-radius:30px;border:1px solid var(--glass-border);background:var(--bg-input);color:var(--text-primary);font-family:var(--font);" />
                    <button id="testAudioBtn" style="padding:8px 16px;border:none;border-radius:30px;background:var(--accent);color:#fff;cursor:pointer;font-family:var(--font);">▶️ اختبار</button>
                </div>
                <div id="testResult" style="font-size:0.8rem;margin-top:6px;color:var(--text-secondary);"></div>
            </div>
        `;
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
                    setTimeout(() => location.reload(), 1500);
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
    // BIND SECTION EVENTS
    // ============================================================
    bindSectionEvents: function(section) {
        switch(section) {
            case 'memories':
                this.bindMemoryEvents();
                break;
            case 'messages':
                this.bindMessageEvents();
                break;
            case 'songs':
                this.bindSongEvents();
                break;
            case 'timeline':
                this.bindTimelineEvents();
                break;
            case 'settings':
                this.bindSettingsEvents();
                break;
            case 'security':
                this.bindSecurityEvents();
                break;
            case 'music':
                this.bindMusicEvents();
                break;
        }
    },

    // ============================================================
    // MEMORY EVENTS
    // ============================================================
    bindMemoryEvents: function() {
        const form = document.getElementById('memoryForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                const newMemory = {
                    id: Date.now() + Math.random() * 1000,
                    description: document.getElementById('memoryDesc').value,
                    emoji: document.getElementById('memoryEmoji').value || '❤️',
                    image: document.getElementById('memoryImage').value || ''
                };
                data.memories.push(newMemory);
                Toast.success('✅ تم إضافة الذكرى');
                this.showSection('memories');
                if (window.HomeComponent) window.HomeComponent.render();
                if (window.MemoriesComponent) window.MemoriesComponent.render();
            });
        }

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من حذف هذه الذكرى؟')) {
                    const id = parseInt(btn.dataset.id);
                    const data = window.AppData || AppData;
                    data.memories = data.memories.filter(m => m.id !== id);
                    Toast.success('🗑 تم حذف الذكرى');
                    this.showSection('memories');
                    if (window.HomeComponent) window.HomeComponent.render();
                    if (window.MemoriesComponent) window.MemoriesComponent.render();
                }
            });
        });
    },

    // ============================================================
    // MESSAGE EVENTS
    // ============================================================
    bindMessageEvents: function() {
        const form = document.getElementById('messageForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                const newMessage = {
                    id: Date.now() + Math.random() * 1000,
                    content: document.getElementById('messageContent').value,
                    emoji: document.getElementById('messageEmoji').value || '💌',
                    image: document.getElementById('messageImage').value || ''
                };
                data.messages.push(newMessage);
                Toast.success('✅ تم إضافة الرسالة');
                this.showSection('messages');
                if (window.MessagesComponent) window.MessagesComponent.render();
            });
        }

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
                    const id = parseInt(btn.dataset.id);
                    const data = window.AppData || AppData;
                    data.messages = data.messages.filter(m => m.id !== id);
                    Toast.success('🗑 تم حذف الرسالة');
                    this.showSection('messages');
                    if (window.MessagesComponent) window.MessagesComponent.render();
                }
            });
        });
    },

    // ============================================================
    // SONG EVENTS
    // ============================================================
    bindSongEvents: function() {
        const form = document.getElementById('songForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                const editId = document.getElementById('songEditId').value;
                const songData = {
                    name: document.getElementById('songName').value,
                    artist: document.getElementById('songArtist').value,
                    cover: document.getElementById('songCover').value || '',
                    audioUrl: document.getElementById('songAudio').value || '',
                    description: document.getElementById('songDesc').value || ''
                };

                if (editId) {
                    const index = data.songs.findIndex(s => s.id === parseInt(editId));
                    if (index !== -1) {
                        data.songs[index] = { ...data.songs[index], ...songData };
                        Toast.success('✅ تم تحديث الأغنية');
                    }
                    this.editingSongId = null;
                } else {
                    const newSong = {
                        id: Date.now() + Math.random() * 1000,
                        ...songData
                    };
                    data.songs.push(newSong);
                    Toast.success('✅ تم إضافة الأغنية');
                }

                this.showSection('songs');
                if (window.HomeComponent) {
                    window.HomeComponent.updateMusic();
                }
            });
        }

        const cancelEdit = document.getElementById('cancelEditSong');
        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => {
                this.editingSongId = null;
                this.showSection('songs');
            });
        }

        document.querySelectorAll('.edit-song-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.editingSongId = id;
                this.showSection('songs');
            });
        });

        document.querySelectorAll('.delete-song-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من حذف هذه الأغنية؟')) {
                    const id = parseInt(btn.dataset.id);
                    const data = window.AppData || AppData;
                    data.songs = data.songs.filter(s => s.id !== id);
                    if (this.editingSongId === id) this.editingSongId = null;
                    Toast.success('🗑 تم حذف الأغنية');
                    this.showSection('songs');
                    if (window.HomeComponent) {
                        window.HomeComponent.updateMusic();
                    }
                }
            });
        });
    },

    // ============================================================
    // TIMELINE EVENTS
    // ============================================================
    bindTimelineEvents: function() {
        const form = document.getElementById('timelineForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                const newItem = {
                    emoji: document.getElementById('timelineEmoji').value || '✨',
                    description: document.getElementById('timelineDesc').value
                };
                data.timeline.push(newItem);
                Toast.success('✅ تم إضافة الحدث');
                this.showSection('timeline');
                if (window.HomeComponent) window.HomeComponent.render();
            });
        }

        document.querySelectorAll('.delete-timeline-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من حذف هذا الحدث؟')) {
                    const index = parseInt(btn.dataset.index);
                    const data = window.AppData || AppData;
                    data.timeline.splice(index, 1);
                    Toast.success('🗑 تم حذف الحدث');
                    this.showSection('timeline');
                    if (window.HomeComponent) window.HomeComponent.render();
                }
            });
        });
    },

    // ============================================================
    // SETTINGS EVENTS
    // ============================================================
    bindSettingsEvents: function() {
        const form = document.getElementById('settingsForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                data.settings.siteTitle = document.getElementById('siteTitle').value;
                data.settings.siteSubtitle = document.getElementById('siteSubtitle').value;
                data.settings.startDate = document.getElementById('startDate').value;
                const newPassword = document.getElementById('sitePassword').value;
                if (newPassword) {
                    data.settings.sitePassword = newPassword;
                }
                Toast.success('✅ تم حفظ الإعدادات بنجاح');
                if (window.HomeComponent) window.HomeComponent.render();
            });
        }
    },

    // ============================================================
    // SECURITY EVENTS
    // ============================================================
    bindSecurityEvents: function() {
        const form = document.getElementById('securityForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const currentPass = document.getElementById('currentPassword').value;
                const newUsername = document.getElementById('newUsername').value;
                const newPass = document.getElementById('newPassword').value;
                const confirmPass = document.getElementById('confirmPassword').value;

                if (currentPass !== this.ADMIN_PASSWORD) {
                    Toast.error('❌ كلمة المرور الحالية غير صحيحة');
                    return;
                }

                if (newUsername && newUsername.length > 0) {
                    this.ADMIN_USERNAME = newUsername;
                }

                if (newPass && newPass.length > 0) {
                    if (newPass !== confirmPass) {
                        Toast.error('❌ كلمة المرور الجديدة غير متطابقة');
                        return;
                    }
                    if (newPass.length < 4) {
                        Toast.error('❌ كلمة المرور يجب أن تكون 4 أحرف على الأقل');
                        return;
                    }
                    this.ADMIN_PASSWORD = newPass;
                    Utils.storage.set('adminAuth', {
                        username: this.ADMIN_USERNAME,
                        timestamp: Date.now()
                    });
                }

                Toast.success('✅ تم تحديث بيانات الدخول بنجاح');
                form.reset();
                this.render();
                this.bindEvents();
            });
        }
    },

    // ============================================================
    // MUSIC EVENTS
    // ============================================================
    bindMusicEvents: function() {
        const form = document.getElementById('musicForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = window.AppData || AppData;
                const audioUrl = document.getElementById('musicAudioUrl').value;
                const cover = document.getElementById('musicCover').value;
                
                if (data.songs.length === 0) {
                    data.songs.push({
                        id: Date.now() + Math.random() * 1000,
                        name: 'الأغنية الرئيسية',
                        artist: 'ذكرياتنا',
                        cover: cover || '',
                        audioUrl: audioUrl || '',
                        description: ''
                    });
                } else {
                    data.songs[0].audioUrl = audioUrl || '';
                    data.songs[0].cover = cover || '';
                }
                
                Toast.success('✅ تم تحديث الموسيقى بنجاح');
                if (window.HomeComponent) {
                    window.HomeComponent.updateMusic();
                }
            });
        }

        const testBtn = document.getElementById('testAudioBtn');
        const testInput = document.getElementById('testAudioUrl');
        const testResult = document.getElementById('testResult');
        
        if (testBtn && testInput) {
            testBtn.addEventListener('click', () => {
                const url = testInput.value.trim();
                if (!url) {
                    testResult.textContent = '⚠️ الرجاء إدخال رابط';
                    testResult.style.color = '#e74c3c';
                    return;
                }
                
                if (/^(https?:\/\/)(www\.)?soundcloud\.com\//i.test(url)) {
                    testResult.textContent = '✅ رابط SoundCloud صالح للمشغل داخل الموقع';
                    testResult.style.color = '#2ecc71';
                    return;
                }

                testResult.textContent = '⏳ جاري اختبار الرابط...';
                testResult.style.color = 'var(--text-secondary)';
                
                const audio = new Audio();
                audio.preload = 'metadata';
                audio.src = url;
                
                audio.addEventListener('loadedmetadata', () => {
                    testResult.textContent = '✅ الرابط يعمل! المدة: ' + Math.floor(audio.duration) + ' ثانية';
                    testResult.style.color = '#2ecc71';
                    audio.src = '';
                });
                
                audio.addEventListener('error', () => {
                    testResult.textContent = '❌ الرابط لا يعمل. استخدم رابط MP3 مباشر أو رابط SoundCloud صالح.';
                    testResult.style.color = '#e74c3c';
                    audio.src = '';
                });
                
                setTimeout(() => {
                    if (testResult.textContent === '⏳ جاري اختبار الرابط...') {
                        testResult.textContent = '⏱️ انتهى الوقت. قد يكون الرابط بطيئاً أو غير صحيح';
                        testResult.style.color = '#f39c12';
                        audio.src = '';
                    }
                }, 5000);
            });
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminComponent;
}
