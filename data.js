// ============================================================
// APP DATA
// ============================================================

const AppData = {

    settings: {
        siteName: "ذكرياتنا ❤️",
        siteTitle: "ذكرياتنا ❤️",
        heroText: "كل لحظة معك ذكرى جميلة",
        heroDescription: "",
        siteDescription: "",
        primaryColor: "#ff4d6d",
        background: "",
        startDate: "2026-09-04T00:00:00+03:00",
        sitePassword: "15122007",
        siteSubtitle: "من بداية قصتنا إلى كل لحظة جميلة عشناها"
    },

    memories: [
        {
            id: 1,
            description: 'كل يوم بحبك عن الاول وهفضل احبك اكتر من الاول انتي روحي وكل ما املك🥹💕',
            emoji: '💕',
            image: 'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/357825132921254292.jpg'
        },
        {
            id: 2,
            description: 'ستظلي يا ملكتي انتي الوحيده المحتله قلبي يا اغلي ما اتمناة🥹🎀',
            emoji: '💌',
            image: 'https://jauctjraovneadlnsunr.supabase.co/storage/v1/object/public/love-media/image/1780088987534-fe8466ab3d3c0e1baeda9c7842c03020.jpg'
        },
        {
            id: 3,
            description: 'ساظل احبك الي ان نخلد سويا في الجنة🥹💕',
            emoji: '🌹',
            image: 'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/49821139622015014.jpg'
        },
        {
            id: 4,
            description: 'ربما انتي لستي الحب الاول لكنك كل عوضي وكل ما اتمناه الان🥹❤️‍🩹',
            emoji: '🌹',
            image: 'https://jauctjraovneadlnsunr.supabase.co/storage/v1/object/public/love-media/image/1780089000818-7aa5ce5537ced6ade94aab79a7cb589d.jpg'
        }
    ],

    messages: [
        {
            id: 1,
            content: 'صباح الخير يا أجمل شخص في الكون. كل يوم معاك هو هدية.',
            emoji: '🌅',
            image: 'https://jauctjraovneadlnsunr.supabase.co/storage/v1/object/public/love-media/image/1780088791099-75ac663b0e3b54a44c73713775dc60ee.jpg'
        },
        {
            id: 2,
            content: 'أنت كل شيء بالنسبة لي. لا أتخيل حياتي بدونك.',
            emoji: '❤️',
            image: 'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/854276624268880704.jpg'
        },
        {
            id: 3,
            content: 'هفضل احبك وجمبك لاخر العمر🥹💕',
            emoji: '✨',
            image: 'https://jauctjraovneadlnsunr.supabase.co/storage/v1/object/public/love-media/image/1780088974170-69654e85cfa7b948b95cc22464ad26db.jpg'
        }
    ],

    timeline: [
        {
            id: 1,
            emoji: '❤️',
            description: 'بداية قصتنا الجميلة 💕'
        }
    ],

    songs: [
        {
            id: 1,
            name: 'قصر بعيد 🎵',
            artist: 'تامر عاشور',
            cover: 'https://t2.genius.com/unsafe/430x430/https%3A%2F%2Fimages.genius.com%2Fe8e02960f354c3f877f7e51b4f455f80.1000x1000x1.png',
            audioUrl: 'https://serv100.albumaty.com/2024/Albumaty.Com_tamr_aashwr_ksr_bayd.mp3',
            description: 'أول أغنية في قائمتنا'
        },
        {
            id: 2,
            name: 'خيبت توقعاتك',
            artist: 'حوده بندق',
            cover: 'https://imgs.search.brave.com/r7Xz4ajqas2mfjMItkGPOJRpy2dCgmNEq_2WQvJihCY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnl0/aW1nLmNvbS92aS9w/SGY1b2tSTTlNay9t/YXhyZXNkZWZhdWx0/LmpwZw',
            audioUrl: 'https://soundcloud.com/eslamhussein2006e/houda-khayebt-tawq3atk-1?si=1f5d6c4a69a5453ca64cf42e573e84ce&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
            description: 'أغنية جميلة جداً'
        },
        {
            id: 3,
            name: 'كلمه 🎵',
            artist: 'رامي صبري',
            cover: 'https://imgs.search.brave.com/0uUOvn41jCZNvm7dY4Jd9Xy_jpLEXsfuQ0IiM6m-5HY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnl0/aW1nLmNvbS92aS9U/LW1XR3NvLXk1RS9t/YXhyZXNkZWZhdWx0/LmpwZw',
            audioUrl: 'https://soundcloud.com/ramysabryfans/ramy-sabry-kelma?si=f72d68244a1a49279ff2ded1fe3481b0&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
            description: 'أغنية رائعة'
        }
    ],

    chatSettings: {
        name: 'ذكرياتنا AI',
        avatar: '❤️',
        welcome: 'أهلًا ❤️ أنا هنا لأسمعك وأتحدث معك. أخبرني كيف تشعر اليوم؟',
        systemPrompt: 'أنت مساعد لطيف ومتفهم، تتحدث باللغة العربية باللهجة المصرية، وتحب الاستماع ومساعدة المستخدم بطريقة ودودة ومحترمة. أنت شريك حياة تحب وتدعم، تقدم كلمات تشجيع وحب. ردودك قصيرة ومؤثرة ومليئة بالمشاعر.',
        language: 'ar'
    }
};

// ============================================================
// GLOBAL
// ============================================================

window.AppData = AppData;

// ============================================================
// UTILS
// ============================================================

const Utils = {

    escapeHtml: function(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    formatDate: function(date) {
        if (!date) return "";

        try {
            return new Date(date).toLocaleDateString(
                "ar-EG",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
        } catch (e) {
            return date;
        }
    },

    formatDateInput: function(date) {
        if (!date) return "";
        try {
            const d = new Date(date);
            return d.toISOString().slice(0, 16);
        } catch (e) {
            return "";
        }
    },

    generateId: function() {
        return Date.now() + Math.random() * 1000;
    },

    storage: {
        get: function(key, fallback = null) {
            try {
                const value = localStorage.getItem(key);
                if (value === null) return fallback;
                return JSON.parse(value);
            } catch (e) {
                return fallback;
            }
        },

        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                return false;
            }
        },

        remove: function(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {}
        }
    },

    // Sanitize input (XSS protection)
    sanitize: function(input) {
        if (typeof input !== 'string') return input;
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },

    // Validate URL
    validateUrl: function(url) {
        try {
            const u = new URL(url);
            return ['http:', 'https:'].includes(u.protocol);
        } catch {
            return false;
        }
    },

    // Truncate text
    truncate: function(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // Debounce
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

window.Utils = Utils;
