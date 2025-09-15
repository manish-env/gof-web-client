// Blogs Page Application
const { createApp } = Vue;

// API Configuration
const API_BASE_URL = 'https://god-worker.restless-mountain-f968.workers.dev/api';
const FILE_BASE_URL = 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';

// Main App
const app = createApp({
    data() {
        return {
            blogs: [],
            selectedBlog: null,
            loading: false,
            error: null
        };
    },
    async mounted() {
        await this.loadBlogs();
    },
    methods: {
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
        openModal(blog) {
            this.selectedBlog = blog;
        },
        closeModal() {
            this.selectedBlog = null;
        }
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);
app.component('whatsapp-component', WhatsApp);

// Mount the app
app.mount('#app');




