// Contact Page Application
const { createApp } = Vue;

// API Configuration - using common config
const API_BASE_URL = API_CONFIG.BASE_URL;

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
    },

    async uploadVendorFile(file, key) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('key', key);
        
        const response = await fetch(`${API_BASE_URL}/vendor/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.statusText} - ${errorText}`);
        }
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Upload failed');
        }
        
        return result.key;
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
                companyWebsite: '',
                contactPerson: '',
                directorName: '',
                personDesignation: '',
                email: '',
                phone: '',
                address: '',
                category: '',
                experience: '',
                description: '',
                file: null
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

        handleVendorFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.vendorForm.file = file;
            }
        },

        async submitVendorForm() {
            try {
                this.vendorLoading = true;
                this.vendorSuccessMessage = '';
                this.vendorErrorMessage = '';

                // Step 1: Upload file if provided
                let filePath = null;
                if (this.vendorForm.file) {
                    const timestamp = Date.now();
                    const randomId = Math.random().toString(36).substring(2, 15);
                    const fileName = this.vendorForm.file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
                    const key = `vendor/${this.vendorForm.companyName}_${timestamp}_${randomId}_${fileName}`;
                    
                    filePath = await apiService.uploadVendorFile(this.vendorForm.file, key);
                }

                // Step 2: Submit vendor registration with file path
                const payload = {
                    companyName: this.vendorForm.companyName,
                    companyWebsite: this.vendorForm.companyWebsite,
                    contactPerson: this.vendorForm.contactPerson,
                    directorName: this.vendorForm.directorName,
                    personDesignation: this.vendorForm.personDesignation,
                    email: this.vendorForm.email,
                    phone: this.vendorForm.phone,
                    address: this.vendorForm.address,
                    category: this.vendorForm.category,
                    experience: this.vendorForm.experience,
                    description: this.vendorForm.description,
                    file: filePath // Include the file path
                };

                const response = await apiService.sendVendorRegistration(payload);
                
                if (response.success) {
                    this.vendorSuccessMessage = 'Registration submitted successfully! We\'ll review your application and get back to you soon.';
                    this.vendorForm = {
                        companyName: '',
                        companyWebsite: '',
                        contactPerson: '',
                        directorName: '',
                        personDesignation: '',
                        email: '',
                        phone: '',
                        address: '',
                        category: '',
                        experience: '',
                        description: '',
                        file: null
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





