// Single Landing Page Application
const { createApp } = Vue;

function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

// API Configuration
const API_BASE_URL = 'https://god-worker.restless-mountain-f968.workers.dev/api';
const FILE_BASE_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:4001'
    : 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';

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
        const slug = getQueryParam('slug');
        if (slug) {
            await this.loadLandingPage(slug);
            this.initializeForm();
        } else {
            this.error = 'No landing page specified';
        }
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
        async loadLandingPage(slug) {
            try {
                this.loading = true;
                const res = await fetch(`${API_BASE_URL}/landing-pages/${encodeURIComponent(slug)}`);
                const data = await res.json();
                if (data && data.success) {
                    this.landingPage = data.data;
                    // Update page title
                    document.getElementById('page-title').textContent = `${this.landingPage.title} - Genre of Design`;
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
        initializeForm() {
            if (this.landingPage && this.landingPage.form) {
                // Initialize form data with empty values
                this.landingPage.form.fields.forEach(field => {
                    this.formData[field.name] = '';
                });
            }
        },
        scrollToForm() {
            const formElement = document.getElementById('contact-form');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth' });
            }
        },
        async submitForm() {
            if (!this.landingPage || !this.landingPage.form) return;

            // Validate required fields
            const requiredFields = this.landingPage.form.fields.filter(field => field.required);
            const missingFields = requiredFields.filter(field => !this.formData[field.name] || this.formData[field.name].trim() === '');
            
            if (missingFields.length > 0) {
                alert('Please fill in all required fields');
                return;
            }

            try {
                this.submitting = true;
                
                // Prepare form data
                const formPayload = {
                    landingPage: this.landingPage.title,
                    landingPageSlug: this.landingPage.slug,
                    category: this.landingPage.category,
                    ...this.formData
                };

                // Submit to leads API
                const res = await fetch(`${API_BASE_URL}/leads/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formPayload)
                });

                const data = await res.json();
                
                if (data && data.success) {
                    this.formSubmitted = true;
                    // Reset form
                    this.initializeForm();
                    // Scroll to top of form
                    this.scrollToForm();
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
