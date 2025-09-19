// Landing Pages Listing Application
const { createApp } = Vue;

// API Configuration - using common config
const API_BASE_URL = API_CONFIG.BASE_URL;
const ADMIN_API_BASE_URL = window.ADMIN_API_BASE_URL || 'https://god-admin-worker.restless-mountain-f968.workers.dev/api';
const FILE_BASE_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:4001'
    : 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';

// Main App
const app = createApp({
    data() {
        return {
            landingPages: [],
            loading: false,
            error: null,
            settings: {
                title: 'Design Solutions',
                subtitle: 'Explore our specialized design services tailored for different project types. From residential spaces to commercial environments, each solution is crafted to meet your unique needs and vision.',
                coverImage: ''
            }
        };
    },
    async mounted() {
        await Promise.all([this.loadSettings(), this.loadLandingPages()]);
    },
    methods: {
        async loadSettings() {
            try {
                const res = await fetch(`${ADMIN_API_BASE_URL}/site-settings?section=landing&_=${Date.now()}`);
                if (!res.ok) throw new Error(`Failed: ${res.status}`);
                const data = await res.json();
                if (data && data.success) {
                    this.settings = { ...this.settings, ...(data.data || {}) };
                }
            } catch (e) {
                console.warn('Landing settings load failed:', e.message);
            }
        },
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
                
                // For testing, use dummy data first
                console.log('🌐 Using dummy landing pages data for testing');
                this.landingPages = this.getDummyLandingPagesData();
                console.log('✅ Loaded dummy landing pages:', this.landingPages.length);
                
                // Optional: Try to load from API as well (for future use)
                try {
                    console.log('🌐 Fetching landing pages from API:', `${API_BASE_URL}/landing-pages`);
                    const res = await fetch(`${API_BASE_URL}/landing-pages`);
                    console.log('📡 Response status:', res.status, res.statusText);
                    const data = await res.json();
                    console.log('📦 Response data:', data);
                    if (data && data.success && data.data && data.data.length > 0) {
                        console.log('✅ API data loaded, replacing dummy data');
                        this.landingPages = data.data || [];
                    }
                } catch (apiError) {
                    console.warn('API request failed, keeping dummy data:', apiError);
                }
                
            } catch (e) {
                console.error('❌ Failed to load landing pages', e);
                this.error = 'Failed to load landing pages: ' + e.message;
            } finally {
                this.loading = false;
            }
        },
        
        getDummyLandingPagesData() {
            return [
                {
                    id: 'dummy-lp-1',
                    slug: 'architectural-design',
                    title: 'Architectural Design',
                    description: 'Transform your vision into stunning architectural masterpieces with our innovative design solutions.',
                    category: 'Architecture',
                    tags: ['residential', 'commercial', 'modern', 'sustainable'],
                    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    createdAt: '2024-01-15T10:00:00Z'
                },
                {
                    id: 'dummy-lp-2',
                    slug: 'interior-design',
                    title: 'Interior Design',
                    description: 'Create beautiful, functional spaces that reflect your personality and lifestyle with our interior design expertise.',
                    category: 'Interior Design',
                    tags: ['home', 'office', 'luxury', 'minimalist'],
                    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    createdAt: '2024-01-20T10:00:00Z'
                },
                {
                    id: 'dummy-lp-3',
                    slug: 'commercial-spaces',
                    title: 'Commercial Spaces',
                    description: 'Professional commercial design solutions that enhance productivity and create impressive business environments.',
                    category: 'Commercial',
                    tags: ['office', 'retail', 'restaurant', 'corporate'],
                    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    createdAt: '2024-01-25T10:00:00Z'
                },
                {
                    id: 'dummy-lp-4',
                    slug: 'hospitality-design',
                    title: 'Hospitality Design',
                    description: 'Exceptional hospitality spaces that create memorable experiences for guests and maximize operational efficiency.',
                    category: 'Hospitality',
                    tags: ['hotel', 'restaurant', 'spa', 'resort'],
                    coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    createdAt: '2024-02-01T10:00:00Z'
                },
                {
                    id: 'dummy-lp-5',
                    slug: 'sustainable-design',
                    title: 'Sustainable Design',
                    description: 'Eco-friendly design solutions that minimize environmental impact while maximizing comfort and functionality.',
                    category: 'Sustainability',
                    tags: ['green', 'eco-friendly', 'energy-efficient', 'sustainable'],
                    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    createdAt: '2024-02-05T10:00:00Z'
                },
                {
                    id: 'dummy-lp-6',
                    slug: 'renovation-projects',
                    title: 'Renovation Projects',
                    description: 'Transform existing spaces with our renovation expertise, breathing new life into old structures.',
                    category: 'Renovation',
                    tags: ['renovation', 'restoration', 'modernization', 'upgrade'],
                    coverImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    createdAt: '2024-02-10T10:00:00Z'
                }
            ];
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

if (typeof WhatsApp !== 'undefined') {
    app.component('whatsapp-component', WhatsApp);
} else {
    console.error('WhatsApp component not found');
}

// Mount the app
app.mount('#app');
