// ============================================================
// HOME PAGE COMPONENT - WITH ADVANCED PLAYER
// ============================================================

const HomeComponent = {
    container: null,
    counterInterval: null,
    audioElement: null,
    soundCloudWidget: null,
    soundCloudReady: false,
    soundCloudUrl: '',
    isPlaying: false,
    currentSongIndex: 0,
    progressInterval: null,
    _scMuted: false,

    // Initialize
    init: function() {
        this.container = document.getElementById('page-home');
        this.currentSongIndex = 0;
        this.render();
        this.startCounter();
        this.bindEvents();
        this.setupAudio();
    },

    // Get current song
    getCurrentSong: function() {
        const data = window.AppData || AppData;
        const songs = data.songs || [];
        if (!songs.length) return null;
        if (this.currentSongIndex >= songs.length) {
            this.currentSongIndex = 0;
        }
        return songs[this.currentSongIndex];
    },

    // Get all songs
    getSongs: function() {
        const data = window.AppData || AppData;
        return data.songs || [];
    },

    // Setup audio element / SoundCloud widget
    setupAudio: function() {
        this.audioElement = document.getElementById('homeAudio');
        const song = this.getCurrentSong();

        if (!song) {
            // Create empty audio element
            if (!this.audioElement) {
                this.audioElement = document.createElement('audio');
                this.audioElement.id = 'homeAudio';
                this.audioElement.preload = 'auto';
                document.body.appendChild(this.audioElement);
            }
            return;
        }

        if (this.isSoundCloudUrl(song.audioUrl)) {
            this.setupSoundCloud(song.audioUrl);
            return;
        }

        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            this.audioElement.id = 'homeAudio';
            this.audioElement.preload = 'auto';
            document.body.appendChild(this.audioElement);
        }

        this.updateMusic();

        this.audioElement.onended = () => {
            this.isPlaying = false;
            const playBtn = document.getElementById('homePlayBtn');
            if (playBtn) playBtn.textContent = '▶️';
            // Auto play next song
            this.nextSong();
        };

        this.audioElement.onerror = (e) => {
            console.warn('تشغيل الصوت فشل:', e);
            this.isPlaying = false;
            const playBtn = document.getElementById('homePlayBtn');
            if (playBtn) playBtn.textContent = '▶️';
        };
    },

    isSoundCloudUrl: function(url) {
        try {
            const u = new URL(String(url || '').trim());
            return /(^|\.)soundcloud\.com$/i.test(u.hostname) || /(^|\.)on\.soundcloud\.com$/i.test(u.hostname);
        } catch (e) {
            return false;
        }
    },

    setupSoundCloud: function(url) {
        this.soundCloudUrl = String(url || '').trim();
        this.soundCloudReady = false;

        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.removeAttribute('src');
            this.audioElement.load();
            this.audioElement.style.display = 'none';
        }

        let frame = document.getElementById('homeSoundCloudFrame');
        if (!frame) {
            frame = document.createElement('iframe');
            frame.id = 'homeSoundCloudFrame';
            frame.title = 'SoundCloud player';
            frame.setAttribute('allow', 'autoplay');
            frame.setAttribute('scrolling', 'no');
            frame.setAttribute('frameborder', '0');
            frame.style.position = 'fixed';
            frame.style.width = '1px';
            frame.style.height = '1px';
            frame.style.opacity = '0';
            frame.style.pointerEvents = 'none';
            frame.style.left = '-10px';
            frame.style.bottom = '-10px';
            document.body.appendChild(frame);
        }

        frame.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(this.soundCloudUrl) + '&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false';

        const initWidget = () => {
            if (!window.SC || !window.SC.Widget) return false;
            this.soundCloudWidget = window.SC.Widget(frame);
            this.soundCloudWidget.bind(window.SC.Widget.Events.PLAY, () => {
                this.isPlaying = true;
                const btn = document.getElementById('homePlayBtn');
                if (btn) btn.textContent = '⏸️';
                this.startProgressUpdate();
            });
            this.soundCloudWidget.bind(window.SC.Widget.Events.PAUSE, () => {
                this.isPlaying = false;
                const btn = document.getElementById('homePlayBtn');
                if (btn) btn.textContent = '▶️';
                this.stopProgressUpdate();
            });
            this.soundCloudWidget.bind(window.SC.Widget.Events.FINISH, () => {
                this.isPlaying = false;
                const btn = document.getElementById('homePlayBtn');
                if (btn) btn.textContent = '▶️';
                this.stopProgressUpdate();
                // Auto play next song
                this.nextSong();
            });
            this.soundCloudWidget.bind(window.SC.Widget.Events.READY, () => {
                this.soundCloudReady = true;
            });
            return true;
        };

        if (!initWidget()) {
            frame.addEventListener('load', () => {
                initWidget();
            }, { once: true });
        }
    },

    // Render
    render: function() {
        const data = window.AppData || AppData;
        const settings = data.settings;
        const song = this.getCurrentSong() || {};
        const songs = this.getSongs();
        const totalSongs = songs.length;

        this.container.innerHTML = `
            <!-- Hero -->
            <div class="hero">
                <h1>ذكرياتنا 💕</h1>
                <p>${settings.siteSubtitle || 'من بداية قصتنا إلى كل لحظة جميلة عشناها'}</p>
            </div>

            <!-- Counter -->
            <div class="counter" id="homeCounter">
                <div class="time-unit">
                    <span class="number" id="years">0</span>
                    <div class="label">سنوات</div>
                </div>
                <div class="time-unit">
                    <span class="number" id="months">0</span>
                    <div class="label">أشهر</div>
                </div>
                <div class="time-unit">
                    <span class="number" id="days">0</span>
                    <div class="label">أيام</div>
                </div>
                <div class="time-unit">
                    <span class="number" id="hours">0</span>
                    <div class="label">ساعات</div>
                </div>
                <div class="time-unit">
                    <span class="number" id="minutes">0</span>
                    <div class="label">دقائق</div>
                </div>
                <div class="time-unit">
                    <span class="number" id="seconds">0</span>
                    <div class="label">ثواني</div>
                </div>
            </div>

            <!-- Music Player -->
            <div class="music-player" id="homeMusic">
                <div style="display:flex;align-items:center;gap:12px;width:100%;">
                    <img class="cover" id="homeMusicCover" src="${song.cover || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%231a1015"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="%23d4a0a0"%3E🎵%3C/text%3E%3C/svg%3E'}" alt="cover" />
                    <div class="info">
                        <div class="song-name" id="homeSongName">${song.name || 'أغنية البداية'}</div>
                        <div class="artist" id="homeArtist">${song.artist || 'ذكرياتنا'}</div>
                        <div class="song-counter">
                            ${totalSongs > 0 ? `${this.currentSongIndex + 1} / ${totalSongs}` : '0 / 0'}
                        </div>
                    </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="progress-container" style="margin-top:8px;">
                    <span class="time-current" id="musicCurrentTime">0:00</span>
                    <input type="range" class="progress-bar" id="musicProgress" min="0" max="100" value="0" />
                    <span class="time-duration" id="musicDuration">0:00</span>
                </div>

                <div class="controls" style="margin-top:6px;">
                    <button id="homePrevBtn" title="الأغنية السابقة" ${totalSongs <= 1 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="play-btn" id="homePlayBtn">▶️</button>
                    <button id="homeNextBtn" title="الأغنية التالية" ${totalSongs <= 1 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>
                        <i class="fas fa-step-forward"></i>
                    </button>
                    <button id="homeVolumeBtn" title="كتم الصوت">🔊</button>
                </div>
            </div>

            <!-- Timeline -->
            <div class="section-title">
                <span class="bar"></span>
                📖 ذكرياتنا الزمنية
            </div>
            <div class="timeline" id="timelineContainer">
                ${this.renderTimelineItems()}
            </div>
        `;

        // Update progress bar after render
        setTimeout(() => this.updateProgress(), 100);
    },

    // Render timeline items
    renderTimelineItems: function() {
        const data = window.AppData || AppData;
        return data.timeline.map(item => `
            <div class="timeline-item">
                <span class="tl-emoji">${item.emoji || '✨'}</span>
                <span class="tl-title">${item.description || ''}</span>
            </div>
        `).join('');
    },

    // Start counter
    startCounter: function() {
        this.updateCounter();
        if (this.counterInterval) clearInterval(this.counterInterval);
        this.counterInterval = setInterval(() => this.updateCounter(), 1000);
    },

    // Update counter
    updateCounter: function() {
        const data = window.AppData || AppData;
        const start = new Date(data.settings.startDate);
        const now = new Date();
        let diff = (now - start) / 1000;

        if (diff < 0) diff = 0;
        const seconds = Math.floor(diff);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30.44);
        const years = Math.floor(months / 12);

        const els = {
            years: document.getElementById('years'),
            months: document.getElementById('months'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        if (els.years) els.years.textContent = years;
        if (els.months) els.months.textContent = months % 12;
        if (els.days) els.days.textContent = days % 30;
        if (els.hours) els.hours.textContent = hours % 24;
        if (els.minutes) els.minutes.textContent = minutes % 60;
        if (els.seconds) els.seconds.textContent = seconds % 60;
    },

    // ============================================================
    // PROGRESS BAR
    // ============================================================
    startProgressUpdate: function() {
        this.stopProgressUpdate();
        this.progressInterval = setInterval(() => {
            this.updateProgress();
        }, 500);
    },

    stopProgressUpdate: function() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    },

    updateProgress: function() {
        // For SoundCloud
        if (this.soundCloudWidget && this.soundCloudReady) {
            this.soundCloudWidget.getCurrentPosition((position) => {
                if (position && position > 0) {
                    this.soundCloudWidget.getDuration((duration) => {
                        if (duration && duration > 0) {
                            this.updateProgressUI(position / 1000, duration / 1000);
                        }
                    });
                }
            });
            return;
        }

        // For HTML5 Audio
        if (!this.audioElement) return;
        
        const progressBar = document.getElementById('musicProgress');
        const currentTime = document.getElementById('musicCurrentTime');
        const duration = document.getElementById('musicDuration');
        
        if (progressBar && this.audioElement.duration && this.audioElement.duration > 0) {
            const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
            progressBar.value = progress;
        }
        
        if (currentTime && this.audioElement.currentTime >= 0) {
            const mins = Math.floor(this.audioElement.currentTime / 60);
            const secs = Math.floor(this.audioElement.currentTime % 60);
            currentTime.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        
        if (duration && this.audioElement.duration && this.audioElement.duration > 0) {
            const mins = Math.floor(this.audioElement.duration / 60);
            const secs = Math.floor(this.audioElement.duration % 60);
            duration.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    },

    updateProgressUI: function(currentSeconds, totalSeconds) {
        const progressBar = document.getElementById('musicProgress');
        const currentTime = document.getElementById('musicCurrentTime');
        const duration = document.getElementById('musicDuration');
        
        if (progressBar && totalSeconds > 0) {
            const progress = (currentSeconds / totalSeconds) * 100;
            progressBar.value = Math.min(progress, 100);
        }
        
        if (currentTime) {
            const mins = Math.floor(currentSeconds / 60);
            const secs = Math.floor(currentSeconds % 60);
            currentTime.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        
        if (duration && totalSeconds > 0) {
            const mins = Math.floor(totalSeconds / 60);
            const secs = Math.floor(totalSeconds % 60);
            duration.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    },

    // ============================================================
    // SONG NAVIGATION
    // ============================================================
    prevSong: function() {
        const songs = this.getSongs();
        if (songs.length <= 1) return;
        
        // Stop current playback
        if (this.isPlaying) {
            this.toggleMusic();
        }
        
        this.currentSongIndex--;
        if (this.currentSongIndex < 0) {
            this.currentSongIndex = songs.length - 1;
        }
        
        this.updateMusic();
        this.updateSongCounter();
        
        // Auto play if was playing
        if (this.isPlaying) {
            this.toggleMusic();
        }
    },

    nextSong: function() {
        const songs = this.getSongs();
        if (songs.length <= 1) return;
        
        // Stop current playback
        if (this.isPlaying) {
            this.toggleMusic();
        }
        
        this.currentSongIndex++;
        if (this.currentSongIndex >= songs.length) {
            this.currentSongIndex = 0;
        }
        
        this.updateMusic();
        this.updateSongCounter();
        
        // Auto play if was playing
        if (this.isPlaying) {
            this.toggleMusic();
        }
    },

    updateSongCounter: function() {
        const songs = this.getSongs();
        const counter = document.querySelector('.song-counter');
        if (counter) {
            counter.textContent = songs.length > 0 ? `${this.currentSongIndex + 1} / ${songs.length}` : '0 / 0';
        }
    },

    // ============================================================
    // MUSIC PLAYER
    // ============================================================
    toggleMusic: function() {
        const song = this.getCurrentSong();
        if (!song) {
            Toast.warning('⚠️ لا توجد أغاني. أضف أغاني في لوحة التحكم.');
            return;
        }

        if (!song.audioUrl) {
            Toast.warning('⚠️ لا يوجد رابط صوتي. أضف رابطاً في لوحة التحكم (قسم الأغاني)');
            return;
        }

        if (this.isSoundCloudUrl(song.audioUrl)) {
            if (!this.soundCloudWidget || this.soundCloudUrl !== song.audioUrl) {
                this.setupSoundCloud(song.audioUrl);
            }

            if (!this.soundCloudWidget) {
                Toast.warning('⏳ جاري تجهيز مشغل SoundCloud، حاول مرة أخرى بعد لحظة.');
                return;
            }

            if (this.isPlaying) {
                this.soundCloudWidget.pause();
                this.stopProgressUpdate();
            } else {
                this.soundCloudWidget.play();
                this.startProgressUpdate();
            }
            return;
        }

        if (!this.audioElement) {
            this.setupAudio();
            return;
        }

        if (this.isPlaying) {
            this.audioElement.pause();
            this.isPlaying = false;
            const btn = document.getElementById('homePlayBtn');
            if (btn) btn.textContent = '▶️';
            this.stopProgressUpdate();
            return;
        }

        if (this.audioElement.src !== song.audioUrl) {
            this.audioElement.src = song.audioUrl;
            this.audioElement.load();
        }

        this.audioElement.play().then(() => {
            this.isPlaying = true;
            const btn = document.getElementById('homePlayBtn');
            if (btn) btn.textContent = '⏸️';
            this.startProgressUpdate();
        }).catch((e) => {
            console.warn('تشغيل الصوت فشل:', e);
            Toast.error('⚠️ لا يمكن تشغيل الصوت. تأكد من أن الرابط صحيح ومسموح تشغيله.');
            this.isPlaying = false;
            const btn = document.getElementById('homePlayBtn');
            if (btn) btn.textContent = '▶️';
        });
    },

    toggleVolume: function() {
        const song = this.getCurrentSong();
        if (!song) return;

        if (this.isSoundCloudUrl(song.audioUrl)) {
            if (!this.soundCloudWidget) {
                this.setupSoundCloud(song.audioUrl);
                return;
            }
            if (this._scMuted) {
                this.soundCloudWidget.setVolume(100);
                this._scMuted = false;
                const btn = document.getElementById('homeVolumeBtn');
                if (btn) btn.textContent = '🔊';
            } else {
                this.soundCloudWidget.setVolume(0);
                this._scMuted = true;
                const btn = document.getElementById('homeVolumeBtn');
                if (btn) btn.textContent = '🔇';
            }
            return;
        }

        if (!this.audioElement) return;
        this.audioElement.muted = !this.audioElement.muted;
        const btn = document.getElementById('homeVolumeBtn');
        if (btn) btn.textContent = this.audioElement.muted ? '🔇' : '🔊';
    },

    // Update music info when song changes
    updateMusic: function() {
        const song = this.getCurrentSong();
        if (!song) return;

        const cover = document.getElementById('homeMusicCover');
        const nameEl = document.getElementById('homeSongName');
        const artistEl = document.getElementById('homeArtist');

        if (cover) {
            cover.src = song.cover || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%231a1015"/%3E%3Ctext x="50" y="60" font-size="40" text-anchor="middle" fill="%23d4a0a0"%3E🎵%3C/text%3E%3C/svg%3E';
            cover.alt = song.name || 'أغنية';
        }
        if (nameEl) nameEl.textContent = song.name || 'أغنية البداية';
        if (artistEl) artistEl.textContent = song.artist || 'ذكرياتنا';

        // Reset progress
        const progressBar = document.getElementById('musicProgress');
        const currentTime = document.getElementById('musicCurrentTime');
        const duration = document.getElementById('musicDuration');
        if (progressBar) progressBar.value = 0;
        if (currentTime) currentTime.textContent = '0:00';
        if (duration) duration.textContent = '0:00';

        this.updateSongCounter();

        if (this.isSoundCloudUrl(song.audioUrl)) {
            this.setupSoundCloud(song.audioUrl);
            return;
        }

        if (this.audioElement && song.audioUrl) {
            this.audioElement.style.display = '';
            this.audioElement.src = song.audioUrl;
            this.audioElement.load();
        }

        // Update prev/next buttons
        const songs = this.getSongs();
        const prevBtn = document.getElementById('homePrevBtn');
        const nextBtn = document.getElementById('homeNextBtn');
        if (prevBtn) {
            prevBtn.disabled = songs.length <= 1;
            prevBtn.style.opacity = songs.length <= 1 ? '0.3' : '1';
            prevBtn.style.cursor = songs.length <= 1 ? 'not-allowed' : 'pointer';
        }
        if (nextBtn) {
            nextBtn.disabled = songs.length <= 1;
            nextBtn.style.opacity = songs.length <= 1 ? '0.3' : '1';
            nextBtn.style.cursor = songs.length <= 1 ? 'not-allowed' : 'pointer';
        }
    },

    // ============================================================
    // BIND EVENTS
    // ============================================================
    bindEvents: function() {
        // Music play button
        const playBtn = document.getElementById('homePlayBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.toggleMusic());
        }

        // Volume button
        const volumeBtn = document.getElementById('homeVolumeBtn');
        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => this.toggleVolume());
        }

        // Previous song button
        const prevBtn = document.getElementById('homePrevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSong());
        }

        // Next song button
        const nextBtn = document.getElementById('homeNextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSong());
        }

        // Progress bar seek
        const progressBar = document.getElementById('musicProgress');
        if (progressBar) {
            progressBar.addEventListener('input', (e) => {
                // For SoundCloud
                if (this.soundCloudWidget && this.soundCloudReady) {
                    this.soundCloudWidget.getDuration((duration) => {
                        if (duration && duration > 0) {
                            const seekTime = (e.target.value / 100) * duration;
                            this.soundCloudWidget.seekTo(seekTime);
                        }
                    });
                    return;
                }

                // For HTML5 Audio
                if (this.audioElement && this.audioElement.duration) {
                    const seekTime = (e.target.value / 100) * this.audioElement.duration;
                    this.audioElement.currentTime = seekTime;
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleMusic();
            }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.nextSong();
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.prevSong();
            }
            if (e.key === 'm' || e.key === 'M') {
                this.toggleVolume();
            }
        });
    },

    // ============================================================
    // DESTROY
    // ============================================================
    destroy: function() {
        if (this.counterInterval) {
            clearInterval(this.counterInterval);
            this.counterInterval = null;
        }
        this.stopProgressUpdate();
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
        if (this.soundCloudWidget) {
            try {
                this.soundCloudWidget.pause();
            } catch (e) {}
            this.soundCloudWidget = null;
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeComponent;
}
