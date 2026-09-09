// ============================================================
// DATA STORE - With localStorage persistence
// ============================================================

// Default data (your data)
const defaultData = {
    // Site Settings
    settings: {
        sitePassword: '15122007',
        startDate: '2026-09-04T00:00:00',
        siteTitle: 'ذكرياتنا ❤️',
        siteSubtitle: 'من بداية قصتنا إلى كل لحظة جميلة عشناها',
        theme: 'dark'
    },

    // Memories
    memories: [{
        id: 1,
        title: 'أول لقاء',
        description: 'اليوم الذي تغير فيه كل شيء',
        date: '2026-09-04',
        emoji: '💕',
        image: 'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/357825132921254292.jpg'
    }, {
        id: 2,
        title: 'أول رسالة',
        description: 'رجعنا لبعض تاني',
        date: '2026-09-02',
        emoji: '💌',
        image: 'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/42221315255560697.jpg'
    }, {
        id: 3,
        title: 'أجمل يوم',
        description: 'ضحكتك تغير الدنيا',
        date: '2026-09-05',
        emoji: '🌹',
        image: 'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/49821139622015014.jpg'
    }],

    // Messages
    messages: [{
        id: 1,
        title: 'صباح الخير ينور عيني',
        content: 'صباح الخير يا أجمل شخص في الكون. كل يوم معاك هو هدية.',
        date: 'للابد',
        emoji: '🌅',
        image: 'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/49821139622015014.jpg'
    }, {
        id: 2,
        title: 'حبي لك',
        content: 'أنت كل شيء بالنسبة لي. لا أتخيل حياتي بدونك.',
        date: 'للابد',
        emoji: '❤️',
        image: 'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/42221315255560697.jpg'
    }, {
        id: 3,
        title: 'أمنية',
        content: 'أتمنى أن نبقى معًا إلى الأبد. أنت نصفي الآخر.',
        date: 'للابد',
        emoji: '✨',
        image: 'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/357825132921254292.jpg'
    }],

    // Timeline
    timeline: [
        { emoji: '❤️', title: 'البداية', description: 'بدأت قصتنا الجميلة' },
        { emoji: '💌', title: 'أول رسالة', description: 'كلمات من القلب' },
        { emoji: '🌹', title: 'أجمل لحظة', description: 'يوم لا يُنسى' },
        { emoji: '✨', title: 'ذكرياتنا الحالية', description: 'كل يوم هو قصة جديدة' }
    ],

    // Songs
    songs: [{
        id: 1,
        name: 'قصر بعيد 🎵',
        artist: 'تامر عاشور',
        cover: 'https://t2.genius.com/unsafe/430x430/https%3A%2F%2Fimages.genius.com%2Fe8e02960f354c3f877f7e51b4f455f80.1000x1000x1.png',
        audioUrl: 'https://serv100.albumaty.com/2024/Albumaty.Com_tamr_aashwr_ksr_bayd.mp3',
        description: 'أول أغنية في قائمتنا'
    }, {
        id: 2,
        name: 'خيبت توقعاتك',
        artist: 'حوده بندق',
        cover: 'https://music.apple.com/vg/song/%D8%AE%D9%8A%D8%A8%D8%AA-%D8%AA%D9%88%D9%82%D8%B9%D8%A7%D8%AA%D9%83/1861424327',
        audioUrl: 'https://soundcloud.com/eslamhussein2006e/houda-khayebt-tawq3atk-1?si=1f5d6c4a69a5453ca64cf42e573e84ce&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
        description: '.....'
    }],

    // Chat Settings
    chatSettings: {
        name: 'ذكرياتنا AI',
        avatar: '❤️',
        welcome: 'أهلًا ❤️ أنا هنا لأسمعك وأتحدث معك. أخبرني كيف تشعر اليوم؟',
        systemPrompt: 'أنت مساعد رومانسي ولطيف، تتحدث باللهجة العربية. أنت ابن اسمك محمد حنون ومتفهم وتحب الاستماع.',
        language: 'ar'
    }
};

// ============================================================
// Load saved data or use default
// ============================================================
function loadData() {
    try {
        const saved = localStorage.getItem('appData');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge with default to ensure all fields exist
            return mergeDeep(defaultData, parsed);
        }
    } catch (e) {
        console.warn('Failed to load saved data:', e);
    }
    return JSON.parse(JSON.stringify(defaultData));
}

// ============================================================
// Deep merge helper
// ============================================================
function mergeDeep(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source[key] instanceof Object && !Array.isArray(source[key])) {
            result[key] = mergeDeep(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

// ============================================================
// Create AppData with persistence
// ============================================================
let AppData = loadData();

// ============================================================
// Save function
// ============================================================
function saveData() {
    try {
        localStorage.setItem('appData', JSON.stringify(AppData));
        console.log('✅ Data saved successfully');
    } catch (e) {
        console.warn('Failed to save data:', e);
    }
}

// ============================================================
// Auto-save wrapper for array methods
// ============================================================
function wrapArrayMethods(array, arrayName) {
    const originalPush = array.push;
    array.push = function(...items) {
        const result = originalPush.apply(this, items);
        saveData();
        return result;
    };

    const originalPop = array.pop;
    array.pop = function() {
        const result = originalPop.apply(this);
        saveData();
        return result;
    };

    const originalSplice = array.splice;
    array.splice = function(...args) {
        const result = originalSplice.apply(this, args);
        saveData();
        return result;
    };

    const originalShift = array.shift;
    array.shift = function() {
        const result = originalShift.apply(this);
        saveData();
        return result;
    };

    const originalUnshift = array.unshift;
    array.unshift = function(...items) {
        const result = originalUnshift.apply(this, items);
        saveData();
        return result;
    };

    // Override filter to save after filtering
    const originalFilter = array.filter;
    array.filter = function(...args) {
        const result = originalFilter.apply(this, args);
        // Update the original array reference
        const parent = AppData;
        for (const key in parent) {
            if (parent[key] === this) {
                parent[key] = result;
                saveData();
                break;
            }
        }
        return result;
    };

    return array;
}

// ============================================================
// Wrap all arrays with auto-save
// ============================================================
wrapArrayMethods(AppData.memories, 'memories');
wrapArrayMethods(AppData.messages, 'messages');
wrapArrayMethods(AppData.songs, 'songs');
wrapArrayMethods(AppData.timeline, 'timeline');

// ============================================================
// Helper to update object properties with auto-save
// ============================================================
function updateData(callback) {
    callback();
    saveData();
}

// ============================================================
// Watch for settings changes
// ============================================================
const settingsProxy = new Proxy(AppData.settings, {
    set(target, property, value) {
        target[property] = value;
        saveData();
        return true;
    }
});

// Replace settings with proxy
AppData.settings = settingsProxy;

// ============================================================
// Save initially
// ============================================================
saveData();

// ============================================================
// Export
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppData;
    module.exports.saveData = saveData;
    module.exports.updateData = updateData;
} else {
    // Make available globally
    window.AppData = AppData;
    window.saveData = saveData;
    window.updateData = updateData;
}

console.log('💾 Data loaded and ready with auto-save');
console.log('📊 Memories:', AppData.memories.length);
console.log('💌 Messages:', AppData.messages.length);
console.log('🎵 Songs:', AppData.songs.length);
