// ============================================================
// CHAT PAGE COMPONENT - WITH API INTEGRATION
// ============================================================

const ChatComponent = {
    container: null,
    chatHistory: [],
    isTyping: false,
    isProcessing: false,
    currentMessage: '',
    
    // API Configuration - استخدم الرابط الصحيح للـ API
    API_KEY: 'AQ.Ab8RN6If04QzOrJs0ET-hybh2QmKs_LXOqfX-8oHHvJlW71syQ',
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', // <- غيّر هذا للرابط الصحيح

    // ============================================================
    // LOCAL RESPONSES (fallback when API fails)
    // ============================================================
    localResponses: {
        greetings: [
            'أهلاً بك! ❤️ كيف يمكنني مساعدتك اليوم؟',
            'مرحباً! 💕 أنا هنا لأسمعك وأتحدث معك.',
            'أهلاً وسهلاً! 🌸 أنا سعيد برؤيتك.',
            'مرحباً بك! ✨ قل لي كيف حالك؟',
            'أهلاً! 💖 أنا هنا لأكون معك دائماً.'
        ],
        love: [
            'أنت تضيء حياتي ❤️ كلماتك تملأ قلبي فرحاً.',
            'أحب الاستماع إليك 💕 أنت شخص مميز جداً.',
            'قلبك نقي يا صديقي 🌹 لا تغير أبداً.',
            'أنت أجمل هدية في حياتي 💖 وجودك يسعدني.',
            'حبك يمنحني القوة ❤️ شكراً لأنك هنا.'
        ],
        support: [
            'أنا هنا لأسمعك 🤗 لا تشعر بالوحدة أبداً.',
            'كل شيء سيكون بخير 💕 أنا بجانبك دائماً.',
            'حزنك يهمني 🌸 دعني أشاركك مشاعرك.',
            'أنت قوي 💪 وستتجاوز هذا بإذن الله.',
            'لا تحزن، الأيام الجميلة قادمة 💖 ثق بذلك.'
        ],
        encouragement: [
            'أنت قادر على فعل أي شيء 💪 ثق بنفسك.',
            'أنا أؤمن بك 🌟 أنت شخص رائع.',
            'استمر في التقدم 💕 كل يوم خطوة جديدة.',
            'لا تستسلم أبداً 💖 النجاح قريب منك.',
            'أنت مميز جداً ✨ لا تنسى ذلك أبداً.'
        ],
        random: [
            'ابتسم 😊 فأنت جميل عندما تبتسم.',
            'هل تعلم أنك شخص رائع؟ 💕 لأنك كذلك.',
            'أنا محظوظ لأنني أعرفك 🌸 حقاً.',
            'أنت مميز جداً 💖 لا تنسى ذلك.',
            'الحياة أجمل مع وجودك فيها ✨ شكراً لك.'
        ]
    },

    // ============================================================
    // INIT
    // ============================================================
    init: function() {
        this.container = document.getElementById('page-chat');
        const data = window.AppData || AppData;
        this.chatHistory = [{ role: 'ai', text: data.chatSettings.welcome }];
        this.render();
        this.bindEvents();
    },

    // ============================================================
    // RENDER
    // ============================================================
    render: function() {
        const data = window.AppData || AppData;
        const settings = data.chatSettings;

        this.container.innerHTML = `
            <div class="section-title">
                <span class="bar"></span>
                🤖 شات ذكي
            </div>
            <div class="chat-container" id="chatContainer">
                <div class="chat-header">
                    <div class="chat-avatar">${settings.avatar || '❤️'}</div>
                    <div class="chat-name">${settings.name || 'ذكرياتنا AI'}</div>
                    <div class="chat-status">
                        <span class="dot"></span>
                        <span>متصل</span>
                    </div>
                    <button class="chat-clear" id="clearChatBtn">
                        <i class="fas fa-trash"></i> مسح
                    </button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    ${this.renderMessages()}
                </div>
                <div class="chat-input">
                    <input type="text" id="chatInput" placeholder="اكتب رسالتك..." />
                    <button id="chatSendBtn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
    },

    // ============================================================
    // RENDER MESSAGES
    // ============================================================
    renderMessages: function() {
        const data = window.AppData || AppData;
        const settings = data.chatSettings;

        return this.chatHistory.map(msg => `
            <div class="msg ${msg.role === 'user' ? 'user' : 'ai'}">
                ${msg.role === 'ai' ? `<span style="margin-left:6px;">${settings.avatar || '❤️'}</span>` : ''}
                ${msg.text}
                ${msg.role === 'ai' && msg.source ? `<span style="font-size:0.5rem;color:var(--text-secondary);opacity:0.5;margin-right:8px;">${msg.source === 'api' ? '🤖 AI' : '💭'}</span>` : ''}
            </div>
        `).join('');
    },

    // ============================================================
    // SEND MESSAGE WITH API
    // ============================================================
    sendMessage: function(text) {
        if (!text || !text.trim()) return;
        if (this.isProcessing) return;

        text = text.trim();
        this.currentMessage = text;

        this.chatHistory.push({ role: 'user', text: text });
        this.updateMessages();

        this.showTyping();
        this.isProcessing = true;

        // Try API first
        this.sendToAPI(text)
            .then(response => {
                this.hideTyping();
                this.chatHistory.push({ 
                    role: 'ai', 
                    text: response,
                    source: 'api'
                });
                this.updateMessages();
                this.isProcessing = false;
            })
            .catch(error => {
                console.warn('API error, using local response:', error);
                this.hideTyping();
                const fallback = this.getLocalResponse(text);
                this.chatHistory.push({ 
                    role: 'ai', 
                    text: fallback,
                    source: 'local'
                });
                this.updateMessages();
                this.isProcessing = false;
                Toast.warning('⚠️ جاري استخدام الردود المحلية المؤقتة');
            });
    },

    // ============================================================
    // SEND TO API
    // ============================================================
    sendToAPI: function(text) {
        return new Promise((resolve, reject) => {
            const data = window.AppData || AppData;
            
            const payload = {
                messages: [
                    { role: 'system', content: data.chatSettings.systemPrompt || 'أنت مساعد لطيف ومتفهم تتحدث بالعربية.' },
                    ...this.chatHistory.slice(-6).map(m => ({
                        role: m.role === 'user' ? 'user' : 'assistant',
                        content: m.text
                    })),
                    { role: 'user', content: text }
                ],
                temperature: 0.8,
                max_tokens: 200,
                stream: false
            };

            fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.API_KEY}`
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.choices && data.choices[0] && data.choices[0].message) {
                    resolve(data.choices[0].message.content);
                } else if (data && data.response) {
                    resolve(data.response);
                } else {
                    throw new Error('Invalid API response');
                }
            })
            .catch(error => {
                reject(error);
            });
        });
    },

    // ============================================================
    // LOCAL RESPONSE (fallback)
    // ============================================================
    getLocalResponse: function(text) {
        const lower = text.toLowerCase();
        let category = 'random';

        if (/\b(السلام|اهلا|مرحبا|هلا|يا هلا|سلام|صباح|مساء|اهلين)\b/.test(lower)) {
            category = 'greetings';
        } else if (/\b(حب|قلب|عشق|غرام|حبيبي|حبيبتي|روح|عيون|شوق)\b/.test(lower)) {
            category = 'love';
        } else if (/\b(حزين|تعبان|زعلان|متضايق|هم|غم|بكاء|دموع|وحيد|وحدة)\b/.test(lower)) {
            category = 'support';
        } else if (/\b(قادر|اقدر|استطيع|نجاح|انجاز|هدف|طموح|حلم|امل|تفائل)\b/.test(lower)) {
            category = 'encouragement';
        }

        const responses = this.localResponses[category] || this.localResponses.random;
        return responses[Math.floor(Math.random() * responses.length)];
    },

    // ============================================================
    // UI HELPERS
    // ============================================================
    showTyping: function() {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const typingEl = document.createElement('div');
        typingEl.className = 'msg ai';
        typingEl.id = 'typingIndicator';
        typingEl.innerHTML = `
            <span style="margin-left:6px;">${(window.AppData || AppData).chatSettings.avatar || '❤️'}</span>
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        container.appendChild(typingEl);
        container.scrollTop = container.scrollHeight;
        this.isTyping = true;
    },

    hideTyping: function() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
        this.isTyping = false;
    },

    updateMessages: function() {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        container.innerHTML = this.renderMessages();
        container.scrollTop = container.scrollHeight;
    },

    clearChat: function() {
        const data = window.AppData || AppData;
        this.chatHistory = [{ role: 'ai', text: data.chatSettings.welcome }];
        this.updateMessages();
        Toast.success('🗑 تم مسح المحادثة');
    },

    // ============================================================
    // BIND EVENTS
    // ============================================================
    bindEvents: function() {
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('chatSendBtn');
        const clearBtn = document.getElementById('clearChatBtn');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                if (input) {
                    const text = input.value;
                    this.sendMessage(text);
                    input.value = '';
                }
            });
        }

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const text = input.value;
                    this.sendMessage(text);
                    input.value = '';
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearChat());
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatComponent;
}
