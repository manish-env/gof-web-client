// Contact Page Application
const { createApp } = Vue;

// API Configuration
const API_BASE_URL = 'https://god-worker.restless-mountain-f968.workers.dev/api';

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
    },

    async sendVendorRegistration(vendorData) {
        return this.request('/vendor/register', {
            method: 'POST',
            data: vendorData
        });
    }
};

// Main App
const app = createApp({
    data() {
        return {
            activeTab: 'contact',
            contactForm: {
                name: '',
                email: '',
                phone: '',
                message: ''
            },
            vendorForm: {
                companyName: '',
                contactPerson: '',
                email: '',
                phone: '',
                address: '',
                category: '',
                experience: '',
                description: ''
            },
            contactLoading: false,
            vendorLoading: false,
            contactSuccessMessage: '',
            contactErrorMessage: '',
            vendorSuccessMessage: '',
            vendorErrorMessage: ''
        };
    },
    methods: {
        async submitContactForm() {
            try {
                this.contactLoading = true;
                this.contactSuccessMessage = '';
                this.contactErrorMessage = '';

                const response = await apiService.sendMessage(this.contactForm);
                
                if (response.success) {
                    this.contactSuccessMessage = 'Message sent successfully! We\'ll get back to you soon.';
                    this.contactForm = {
                        name: '',
                        email: '',
                        phone: '',
                        message: ''
                    };
                } else {
                    this.contactErrorMessage = 'Failed to send message. Please try again.';
                }
            } catch (error) {
                console.error('Error sending message:', error);
                this.contactErrorMessage = 'Failed to send message. Please try again.';
            } finally {
                this.contactLoading = false;
            }
        },

        async submitVendorForm() {
            try {
                this.vendorLoading = true;
                this.vendorSuccessMessage = '';
                this.vendorErrorMessage = '';

                const response = await apiService.sendVendorRegistration(this.vendorForm);
                
                if (response.success) {
                    this.vendorSuccessMessage = 'Registration submitted successfully! We\'ll review your application and get back to you soon.';
                    this.vendorForm = {
                        companyName: '',
                        contactPerson: '',
                        email: '',
                        phone: '',
                        address: '',
                        category: '',
                        experience: '',
                        description: ''
                    };
                } else {
                    this.vendorErrorMessage = 'Failed to submit registration. Please try again.';
                }
            } catch (error) {
                console.error('Error submitting vendor registration:', error);
                this.vendorErrorMessage = 'Failed to submit registration. Please try again.';
            } finally {
                this.vendorLoading = false;
            }
        }
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);
app.component('whatsapp-component', WhatsApp);

// Mount the app
app.mount('#app');





