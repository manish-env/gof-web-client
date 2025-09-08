// Blogs Page Application
const { createApp } = Vue;

const API_BASE_URL = 'http://localhost:3001/api';
const FILE_BASE_URL = 'http://localhost:4001';

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
                    this.blogs = (data.data || []).map(b => ({
                        id: b.id || b.slug,
                        title: b.title,
                        author: b.author,
                        date: b.publishedAt || b.createdAt,
                        readTime: b.readTime || 5,
                        cover: this.resolveCoverUrl(b.coverImage || b.cover || ''),
                        excerpt: b.excerpt || '',
                        content: b.content
                    }));
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
        }
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

// Mount the app
app.mount('#app');




