// Landing Pages Listing Application
const { createApp } = Vue;

// API Configuration
const API_BASE_URL = 'https://god-public-api.restless-mountain-f968.workers.dev/api';
const FILE_BASE_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:4001'
    : 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';

// Main App
const app = createApp({
    data() {
        return {
            landingPages: [],
            filteredPages: [],
            loading: false,
            error: null,
            searchQuery: '',
            selectedCategory: ''
        };
    },
    async mounted() {
        await this.loadLandingPages();
    },
    methods: {
        resolveImageUrl(path) {
            if (!path) return '';
            // If full URL, return as-is
            if (/^https?:\/\//i.test(path)) return path;
            // Normalize leading slash
            const normalized = path.startsWith('/') ? path : `/${path}`;
            return `${FILE_BASE_URL}${normalized}`;
        },
        async loadLandingPages() {
            try {
                this.loading = true;
                console.log('🌐 Fetching landing pages from:', `${API_BASE_URL}/landing-pages`);
                const res = await fetch(`${API_BASE_URL}/landing-pages`);
                console.log('📡 Response status:', res.status, res.statusText);
                const data = await res.json();
                console.log('📦 Response data:', data);
                if (data && data.success) {
                    this.landingPages = data.data || [];
                    this.filteredPages = [...this.landingPages];
                    console.log('✅ Loaded landing pages:', this.landingPages.length);
                } else {
                    console.error('❌ API returned error:', data);
                    this.error = 'Failed to load landing pages: ' + (data.message || 'Unknown error');
                }
            } catch (e) {
                console.error('❌ Failed to load landing pages', e);
                this.error = 'Failed to load landing pages: ' + e.message;
            } finally {
                this.loading = false;
            }
        },
        filterPages() {
            let filtered = [...this.landingPages];

            // Filter by search query
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(page => 
                    page.title.toLowerCase().includes(query) ||
                    page.description.toLowerCase().includes(query) ||
                    page.category.toLowerCase().includes(query) ||
                    (page.tags && page.tags.some(tag => tag.toLowerCase().includes(query)))
                );
            }

            // Filter by category
            if (this.selectedCategory) {
                filtered = filtered.filter(page => 
                    page.category.toLowerCase() === this.selectedCategory.toLowerCase()
                );
            }

            this.filteredPages = filtered;
        },
        formatDate(dateStr) {
            const d = new Date(dateStr);
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        }
    }
});

// Register components
if (typeof Navbar !== 'undefined') {
    app.component('navbar-component', Navbar);
} else {
    console.error('Navbar component not found');
}

if (typeof Footer !== 'undefined') {
    app.component('footer-component', Footer);
} else {
    console.error('Footer component not found');
}

// Mount the app
app.mount('#app');
