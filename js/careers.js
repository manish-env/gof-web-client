// Careers Page Application
const { createApp } = Vue;

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// API Service
const apiService = {
    async request(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        };

        try {
            const response = await axios(`${API_BASE_URL}${url}`, config);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async getJobs() {
        return this.request('/jobs');
    }
};

// Main App
const app = createApp({
    data() {
        return {
            jobs: [],
            loading: false,
            error: null
        };
    },
    async mounted() {
        await this.loadJobs();
    },
    methods: {
        async loadJobs() {
            try {
                this.loading = true;
                const response = await apiService.getJobs();
                
                if (response.success) {
                    this.jobs = response.data;
                }
            } catch (error) {
                console.error('Failed to load jobs:', error);
                this.error = 'Failed to load jobs';
            } finally {
                this.loading = false;
            }
        },
        applyForJob(job) {
            // Redirect to contact page or open application form
            window.location.href = `contact.html?job=${encodeURIComponent(job.title)}`;
        }
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

// Mount the app
app.mount('#app');





