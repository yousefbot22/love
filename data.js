// ============================================================
// DATA STORE - Static Data
// No localStorage
// No automatic persistence
// ============================================================

const AppData = {

    // ============================================================
    // Site Settings
    // ============================================================

    settings: {
        sitePassword: '15122007',

        // تاريخ بداية العداد
        startDate: '2026-09-04T00:00:00+03:00',

        siteTitle: 'ذكرياتنا ❤️',

        siteSubtitle: 'من بداية قصتنا إلى كل لحظة جميلة عشناها',

        theme: 'dark'
    },


    // ============================================================
    // Memories
    // ============================================================

    memories: [

        {
            id: 1,
            description:
                'كل يوم بحبك عن الاول وهفضل احبك اكتر من الاول انتي روحي وكل ما املك🥹💕',

            emoji: '💕',

            image:
                'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/357825132921254292.jpg'
        },

        {
            id: 2,
            description:
                'ستظلي يا ملكتي انتي الوحيده المحتله قلبي يا اغلي ما اتمناة🥹🎀',

            emoji: '💌',

            image:
                'https://jauctjraovneadlnsunr.supabase.co/storage/v1/object/public/love-media/image/1780088987534-fe8466ab3d3c0e1baeda9c7842c03020.jpg'
        },

        {
            id: 3,
            description:
                'ساظل احبك الي ان نخلد سويا في الجنة🥹💕',

            emoji: '🌹',

            image:
                'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/49821139622015014.jpg'
        },

        {
            id: 4,
            description:
                'ربما انتي لستي الحب الاول لكنك كل عوضي وكل ما اتمناه الان🥹❤️‍🩹',

            emoji: '🌹',

            image:
                'https://jauctjraovneadlnsunr.supabase.co/storage/v1/object/public/love-media/image/1780089000818-7aa5ce5537ced6ade94aab79a7cb589d.jpg'
        }

    ],


    // ============================================================
    // Messages
    // ============================================================

    messages: [

        {
            id: 1,

            content:
                'صباح الخير يا أجمل شخص في الكون. كل يوم معاك هو هدية.',

            emoji: '🌅',

            image:
                'https://jauctjraovneadlnsunr.supabase.co/storage/v1/object/public/love-media/image/1780088791099-75ac663b0e3b54a44c73713775dc60ee.jpg'
        },

        {
            id: 2,

            content:
                'أنت كل شيء بالنسبة لي. لا أتخيل حياتي بدونك.',

            emoji: '❤️',

            image:
                'https://krvfsszbffhilxeaqhlc.supabase.co/storage/v1/object/public/memories/854276624268880704.jpg'
        },

        {
            id: 3,

            content:
                'هفضل احبك وجمبك لاخر العمر🥹💕',

            emoji: '✨',

            image:
                'https://jauctjraovneadlnsunr.supabase.co/storage/v1/object/public/love-media/image/1780088974170-69654e85cfa7b948b95cc22464ad26db.jpg'
        }

    ],


    // ============================================================
    // Timeline
    // ============================================================

    timeline: [

        {
            id: 1,
            emoji: '❤️',
            description:
                'هفضل احبك وجمبك لاخر العمر🥹💕'
        }

    ],


    // ============================================================
    // Songs
    // ============================================================

    songs: [

        {
            id: 1,

            name: 'قصر بعيد 🎵',

            artist: 'تامر عاشور',

            cover:
                'https://t2.genius.com/unsafe/430x430/https%3A%2F%2Fimages.genius.com%2Fe8e02960f354c3f877f7e51b4f455f80.1000x1000x1.png',

            audioUrl:
                'https://serv100.albumaty.com/2024/Albumaty.Com_tamr_aashwr_ksr_bayd.mp3',

            description:
                'أول أغنية في قائمتنا'
        },

        {
            id: 2,

            name: 'خيبت توقعاتك',

            artist: 'حوده بندق',

            cover:
                'https://music.apple.com/vg/song/%D8%AE%D9%8A%D8%A8%D8%AA-%D8%AA%D9%88%D9%82%D8%B9%D8%A7%D8%AA%D9%83/1861424327',

            audioUrl:
                'https://soundcloud.com/eslamhussein2006e/houda-khayebt-tawq3atk-1?si=1f5d6c4a69a5453ca64cf42e573e84ce&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',

            description:
                '.....'
        }

    ],


    // ============================================================
    // AI Chat Settings
    // ============================================================

    chatSettings: {

        name: 'ذكرياتنا AI',

        avatar: '❤️',

        welcome:
            'أهلًا ❤️ أنا هنا لأسمعك وأتحدث معك. أخبرني كيف تشعر اليوم؟',

        systemPrompt:
            'أنت مساعد لطيف ومتفهم، تتحدث باللغة العربية باللهجة المصرية، وتحب الاستماع ومساعدة المستخدم بطريقة ودودة ومحترمة.',

        language: 'ar'

    }

};


// ============================================================
// Global access
// ============================================================

if (typeof window !== 'undefined') {
    window.AppData = AppData;
}


// ============================================================
// Optional update function
// ============================================================

function updateData(newData) {

    if (!newData || typeof newData !== 'object') {
        console.warn('⚠️ Invalid data');
        return;
    }

    Object.assign(AppData, newData);

    console.log('✅ AppData updated');
}


if (typeof window !== 'undefined') {
    window.updateData = updateData;
}


// ============================================================
// Ready
// ============================================================

console.log('📦 Static AppData loaded');
console.log('📊 Memories:', AppData.memories.length);
console.log('💌 Messages:', AppData.messages.length);
console.log('🎵 Songs:', AppData.songs.length);
