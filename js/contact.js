// Contact Page Application
const { createApp } = Vue;

// API Configuration
const API_BASE_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3001/api'
    : 'https://god-web-api.onrender.com/api';

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

    async sendMessage(messageData) {
        return this.request('/contact/send', {
            method: 'POST',
            data: messageData
        });
    }
};

// Main App
const app = createApp({
    data() {
        return {
            form: {
                name: '',
                email: '',
                phone: '',
                message: ''
            },
            loading: false,
            successMessage: '',
            errorMessage: ''
        };
    },
    methods: {
        async submitForm() {
            try {
                this.loading = true;
                this.successMessage = '';
                this.errorMessage = '';

                const response = await apiService.sendMessage(this.form);
                
                if (response.success) {
                    this.successMessage = 'Message sent successfully! We\'ll get back to you soon.';
                    this.form = {
                        name: '',
                        email: '',
                        phone: '',
                        message: ''
                    };
                } else {
                    this.errorMessage = 'Failed to send message. Please try again.';
                }
            } catch (error) {
                console.error('Error sending message:', error);
                this.errorMessage = 'Failed to send message. Please try again.';
            } finally {
                this.loading = false;
            }
        }
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

// Mount the app
app.mount('#app');





