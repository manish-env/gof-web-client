const { createApp } = Vue;

function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

const API_BASE_URL = 'https://god-public-api.restless-mountain-f968.workers.dev/api';
const FILE_BASE_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:4001'
    : 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';

const app = createApp({
    data() {
        return {
            blog: null,
            loading: false,
            error: null
        };
    },
    async mounted() {
        const idOrSlug = getQueryParam('id');
        await this.loadBlog(idOrSlug);
    },
    methods: {
        resolveCoverUrl(path) {
            if (!path) return '';
            if (/^https?:\/\//i.test(path)) return path;
            const normalized = path.startsWith('/') ? path : `/${path}`;
            return `${FILE_BASE_URL}${normalized}`;
        },
        async loadBlog(idOrSlug) {
            if (!idOrSlug) {
                this.error = 'No blog specified';
                return;
            }
            try {
                this.loading = true;
                const res = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(idOrSlug)}`);
                const data = await res.json();
                if (data && data.success) {
                    const b = data.data;
                    this.blog = {
                        id: b.id || b.slug,
                        title: b.title,
                        author: b.author,
                        date: b.publishedAt || b.published_at || b.createdAt || b.created_at,
                        readTime: b.readTime || 5,
                        cover: this.resolveCoverUrl(b.coverImage || b.cover_image || b.cover || ''),
                        content: b.content
                    };
                } else {
                    this.error = 'Failed to load blog';
                }
            } catch (e) {
                console.error('Failed to load blog', e);
                this.error = 'Failed to load blog';
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

app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

app.mount('#app');



