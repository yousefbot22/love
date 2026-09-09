// ============================================================
// MEMORIES PAGE COMPONENT
// ============================================================

const MemoriesComponent = {

    container: null,
    lightboxItems: [],
    lightboxIndex: 0,

    // ========================================================
    // Initialize
    // ========================================================

    init: function () {

        this.container = document.getElementById('page-memories');

        if (!this.container) {
            console.warn('Memories container not found');
            return;
        }

        this.render();
        this.bindEvents();
    },


    // ========================================================
    // Render
    // ========================================================

    render: function () {

        const data = window.AppData || AppData || {};
        const memories = Array.isArray(data.memories)
            ? data.memories
            : [];

        if (!memories.length) {

            this.container.innerHTML = `
                <div class="section-title">
                    <span class="bar"></span>
                    🖼 ذكرياتنا
                </div>

                <div class="empty-state">
                    <span class="big-emoji">📸</span>
                    لا توجد ذكريات بعد
                </div>
            `;

            this.lightboxItems = [];
            return;
        }


        this.container.innerHTML = `
            <div class="section-title">
                <span class="bar"></span>
                🖼 ذكرياتنا
            </div>

            <div class="cards-grid" id="memoriesGrid">

                ${memories.map((m, i) => {

                    // ==================================================
                    // حماية من undefined
                    // ==================================================

                    const title =
                        m && m.title != null
                            ? String(m.title)
                            : '';

                    const image =
                        m && m.image != null
                            ? String(m.image)
                            : '';

                    const emoji =
                        m && m.emoji != null && m.emoji !== ''
                            ? String(m.emoji)
                            : '❤️';

                    const date =
                        m && m.date != null
                            ? m.date
                            : '';

                    return `
                        <div
                            class="card-item"
                            data-index="${i}"
                        >

                            <img
                                class="card-img"
                                src="${image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231a1015"/%3E%3Ctext x="100" y="115" font-size="70" text-anchor="middle" fill="%23d4a0a0"%3E❤️%3C/text%3E%3C/svg%3E'}"
                                alt="${title}"
                                loading="lazy"
                                onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231a1015"/%3E%3Ctext x="100" y="115" font-size="70" text-anchor="middle" fill="%23d4a0a0"%3E❤️%3C/text%3E%3C/svg%3E';"
                            />

                            <div class="card-body">

                                <div class="card-title">
                                    ${emoji} ${title}
                                </div>

                                <div class="card-date">
                                    ${Utils.formatDate(date)}
                                </div>

                            </div>

                        </div>
                    `;

                }).join('')}

            </div>
        `;


        // حفظ البيانات كما هي بدون تعديل
        this.lightboxItems = memories;
    },


    // ========================================================
    // Bind Events
    // ========================================================

    bindEvents: function () {

        const grid =
            document.getElementById('memoriesGrid');

        if (!grid) return;


        // ====================================================
        // Memory cards
        // ====================================================

        grid.querySelectorAll('.card-item').forEach((el) => {

            el.addEventListener('click', () => {

                const index =
                    parseInt(
                        el.dataset.index,
                        10
                    );

                if (
                    Number.isNaN(index) ||
                    index < 0 ||
                    index >= this.lightboxItems.length
                ) {
                    return;
                }

                this.openLightbox(index);

            });

        });


        // ====================================================
        // Lightbox previous
        // ====================================================

        const prevBtn =
            document.getElementById('lbPrev');

        if (prevBtn) {

            prevBtn.addEventListener('click', (e) => {

                e.stopPropagation();

                if (this.lightboxIndex > 0) {

                    this.lightboxIndex--;

                    this.updateLightbox();
                }

            });
        }


        // ====================================================
        // Lightbox next
        // ====================================================

        const nextBtn =
            document.getElementById('lbNext');

        if (nextBtn) {

            nextBtn.addEventListener('click', (e) => {

                e.stopPropagation();

                if (
                    this.lightboxIndex <
                    this.lightboxItems.length - 1
                ) {

                    this.lightboxIndex++;

                    this.updateLightbox();
                }

            });
        }
    },


    // ========================================================
    // Open Lightbox
    // ========================================================

    openLightbox: function (index) {

        if (
            !this.lightboxItems.length ||
            !this.lightboxItems[index]
        ) {
            return;
        }


        this.lightboxIndex = index;

        this.updateLightbox();


        const lightbox =
            document.getElementById('lightbox');

        if (lightbox) {
            lightbox.classList.add('active');
        }


        // Navigation
        const prevBtn =
            document.getElementById('lbPrev');

        const nextBtn =
            document.getElementById('lbNext');


        if (prevBtn) {

            prevBtn.style.display =
                this.lightboxItems.length > 1
                    ? 'block'
                    : 'none';
        }


        if (nextBtn) {

            nextBtn.style.display =
                this.lightboxItems.length > 1
                    ? 'block'
                    : 'none';
        }
    },


    // ========================================================
    // Update Lightbox
    // ========================================================

    updateLightbox: function () {

        const item =
            this.lightboxItems[this.lightboxIndex];

        if (!item) return;


        const image =
            item.image != null
                ? String(item.image)
                : '';


        const title =
            item.title != null
                ? String(item.title)
                : '';


        const description =
            item.description != null
                ? String(item.description)
                : '';


        const emoji =
            item.emoji != null && item.emoji !== ''
                ? String(item.emoji)
                : '❤️';


        const date =
            item.date != null
                ? item.date
                : '';


        // ====================================================
        // Image
        // ====================================================

        const lbImg =
            document.getElementById('lbImg');

        if (lbImg) {

            lbImg.src =
                image ||
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231a1015"/%3E%3Ctext x="100" y="115" font-size="70" text-anchor="middle" fill="%23d4a0a0"%3E❤️%3C/text%3E%3C/svg%3E';

        }


        // ====================================================
        // Title
        // ====================================================

        const lbTitle =
            document.getElementById('lbTitle');

        if (lbTitle) {

            lbTitle.textContent =
                `${emoji} ${title}`;
        }


        // ====================================================
        // Description
        // ====================================================

        const lbDesc =
            document.getElementById('lbDesc');

        if (lbDesc) {

            lbDesc.textContent =
                description;
        }


        // ====================================================
        // Date
        // ====================================================

        const lbDate =
            document.getElementById('lbDate');

        if (lbDate) {

            lbDate.textContent =
                date
                    ? Utils.formatDate(date)
                    : '';
        }
    }
};


// ============================================================
// Export
// ============================================================

if (
    typeof module !== 'undefined' &&
    module.exports
) {

    module.exports =
        MemoriesComponent;
}


// ============================================================
// Global
// ============================================================

window.MemoriesComponent =
    MemoriesComponent;
