// Blogs Page Application
const { createApp } = Vue;

// API Configuration - using common config
const API_BASE_URL = API_CONFIG.BASE_URL;
const ADMIN_API_BASE_URL = window.ADMIN_API_BASE_URL || 'https://god-admin-worker.restless-mountain-f968.workers.dev/api';
const FILE_BASE_URL = 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';

const settingsService = {
    async getBlogsSettings() {
        try {
            const res = await fetch(`${ADMIN_API_BASE_URL}/site-settings?section=blogs&_=${Date.now()}`);
            if (!res.ok) throw new Error(`Failed: ${res.status}`);
            const data = await res.json();
            if (data && data.success) {
                console.log('[Blogs] Loaded site-settings blogs:', data.data);
                return data.data || {};
            }
            return {};
        } catch (e) {
            console.error('Error fetching blogs settings:', e);
            // Fallback: try public settings map (blogs.* keys)
            try {
                const pub = await fetch(`${ADMIN_API_BASE_URL}/settings/public?_=${Date.now()}`);
                if (pub.ok) {
                    const pubData = await pub.json();
                    if (pubData && pubData.success && pubData.data) {
                        const map = pubData.data;
                        const fallback = {
                            title: map['blogs.title'],
                            description: map['blogs.description'],
                            coverImage: map['blogs.coverImage'] || map['blogs.cover_image']
                        };
                        console.log('[Blogs] Fallback public settings:', fallback);
                        return fallback;
                    }
                }
            } catch (e2) {
                console.warn('Fallback public settings failed:', e2);
            }
            return {};
        }
    }
};

// Main App
const app = createApp({
    data() {
        return {
            blogs: [],
            loading: false,
            error: null,
            settings: {
                title: 'Design Journal',
                description: 'Insights, process notes, and lessons from our projects. Explore our design philosophy through detailed case studies, innovative approaches, and the stories behind our most impactful architectural and interior design solutions.',
                coverImage: ''
            }
        };
    },
    async mounted() {
        await Promise.all([this.loadSettings(), this.loadBlogs()]);
    },
    methods: {
        async loadSettings() {
            const s = await settingsService.getBlogsSettings();
            this.settings = { ...this.settings, ...s };
        },
        resolveCoverUrl(path) {
            if (!path) return '';
            // If full URL, return as-is
            if (/^https?:\/\//i.test(path)) return path;
            // Normalize leading slash
            const normalized = path.startsWith('/') ? path : `/${path}`;
            return `${FILE_BASE_URL}${normalized}`;
        },
        async loadBlogs() {
            try {
                this.loading = true;
                const res = await fetch(`${API_BASE_URL}/blogs`);
                const data = await res.json();
                if (data && data.success) {
                    this.blogs = (data.data || []).map(b => {
                        const content = b.content || b.body || b.description || b.excerpt || b.html || '';
                        // derive a plain-text excerpt if missing
                        const plain = content ? content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
                        const excerpt = b.excerpt || (plain ? plain.slice(0, 160) + (plain.length > 160 ? '…' : '') : '');
                        return {
                        id: b.id,
                        slug: b.slug,
                        title: b.title,
                        author: b.author,
                        date: b.publishedAt || b.published_at || b.createdAt || b.created_at,
                        readTime: b.readTime || 5,
                        cover: this.resolveCoverUrl(b.coverImage || b.cover_image || b.cover || ''),
                        excerpt,
                        content
                        };
                    });
                } else {
                    this.error = 'Failed to load blogs';
                }
            } catch (e) {
                console.error('Failed to load blogs', e);
                this.error = 'Failed to load blogs';
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateStr) {
            const d = new Date(dateStr);
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        },
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);
app.component('whatsapp-component', WhatsApp);

// Mount the app
app.mount('#app');




