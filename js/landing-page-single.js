// Individual Landing Page Application
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
            landingPage: null,
            loading: false,
            error: null,
            formData: {},
            submitting: false,
            formSubmitted: false
        };
    },
    async mounted() {
        await this.loadLandingPage();
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
        async loadLandingPage() {
            try {
                this.loading = true;
                const slug = this.getSlugFromUrl();
                if (!slug) {
                    this.error = 'Landing page not found';
                    return;
                }

                const res = await fetch(`${API_BASE_URL}/landing-pages/${encodeURIComponent(slug)}`);
                const data = await res.json();
                
                if (data && data.success && data.data) {
                    this.landingPage = data.data;
                    document.title = `${this.landingPage.title} - Genre of Design`;
                    document.getElementById('page-title').textContent = this.landingPage.title;
                } else {
                    this.error = 'Landing page not found';
                }
            } catch (e) {
                console.error('Failed to load landing page', e);
                this.error = 'Failed to load landing page';
            } finally {
                this.loading = false;
            }
        },
        getSlugFromUrl() {
            const params = new URLSearchParams(window.location.search);
            return params.get('slug');
        },
        async submitForm() {
            if (this.submitting) return;
            
            try {
                this.submitting = true;
                
                // Extract primary identity fields robustly from dynamic formData
                const { name, email, phone } = this.extractLeadIdentity();

                // Prepare form data
                const formPayload = {
                    name,
                    email,
                    phone,
                    landing_page_id: this.landingPage.id,
                    landing_page_title: this.landingPage.title,
                    category: this.landingPage.category,
                    form_data: this.formData,
                    utm_source: this.getUtmParam('utm_source'),
                    utm_medium: this.getUtmParam('utm_medium'),
                    utm_campaign: this.getUtmParam('utm_campaign'),
                    utm_term: this.getUtmParam('utm_term'),
                    utm_content: this.getUtmParam('utm_content')
                };

                const res = await fetch(`${API_BASE_URL}/leads/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formPayload)
                });

                const data = await res.json();
                
                if (data && data.success) {
                    this.formSubmitted = true;
                    this.formData = {};
                } else {
                    alert('Failed to submit form. Please try again.');
                }
            } catch (e) {
                console.error('Failed to submit form', e);
                alert('Failed to submit form. Please try again.');
            } finally {
                this.submitting = false;
            }
        },
        // Map dynamic form keys (e.g., "Name", "Email Address") to required payload fields
        extractLeadIdentity() {
            const normalized = {};
            for (const key in this.formData) {
                if (!Object.prototype.hasOwnProperty.call(this.formData, key)) continue;
                const normKey = key.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                normalized[normKey] = this.formData[key];
            }

            const valueFor = (synonyms) => {
                for (const s of synonyms) {
                    if (normalized[s]) return normalized[s];
                }
                return '';
            };

            const name = valueFor(['name', 'fullname', 'full_name', 'yourname', 'contactname']);
            const email = valueFor(['email', 'emailaddress', 'mail', 'e-mail', 'emailid']);
            const phone = valueFor(['phone', 'phonenumber', 'phone_number', 'mobile', 'mobilephone', 'whatsapp', 'whatsappnumber', 'contact', 'contactnumber']);

            return {
                // Fallback to original common keys if not mapped
                name: name || this.formData.name || this.formData.Name || '',
                email: email || this.formData.email || this.formData.Email || '',
                phone: phone || this.formData.phone || this.formData.Phone || ''
            };
        },
        getUtmParam(param) {
            const params = new URLSearchParams(window.location.search);
            return params.get(param) || '';
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
