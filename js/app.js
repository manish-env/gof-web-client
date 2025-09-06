// Vue.js Application for Genre of Design
const { createApp } = Vue;

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// API Service
const apiService = {
    async request(url, options = {}) {
        const token = localStorage.getItem('authToken');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
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

    // Auth endpoints
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            data: credentials
        });
    },

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            data: userData
        });
    },

    async getCurrentUser() {
        return this.request('/auth/me');
    },

    // Project endpoints
    async getProjects(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/projects${queryString ? `?${queryString}` : ''}`);
    },

    async getProject(id) {
        return this.request(`/projects/${id}`);
    },

    async getProjectTypes() {
        return this.request('/projects/types');
    },

    // Job endpoints
    async getJobs() {
        return this.request('/jobs');
    },

    async getJob(id) {
        return this.request(`/jobs/${id}`);
    },

    async applyForJob(applicationData) {
        return this.request('/jobs/apply', {
            method: 'POST',
            data: applicationData
        });
    },

    // Contact endpoints
    async sendMessage(messageData) {
        return this.request('/contact/send', {
            method: 'POST',
            data: messageData
        });
    },

    // Vendor endpoints
    async registerVendor(vendorData) {
        return this.request('/vendor/register', {
            method: 'POST',
            data: vendorData
        });
    }
};

// Simple data management for homepage

// Main App
const app = createApp({
    data() {
        return {
        projects: [],
        loading: false,
        error: null
        };
    },
    computed: {
        featuredProjects() {
            return this.projects.slice(0, 12);
        }
    },
    async mounted() {
        await this.loadProjects();
    },
    methods: {
        async loadProjects() {
            try {
                this.loading = true;
                // Fetch all projects and show first 6 on homepage
                const response = await apiService.getProjects();
                
                console.log('Homepage API Response:', response);
                
                if (response.success) {
                    // Add lazy loading properties to each project
                    this.projects = response.data.map(project => ({
                        ...project,
                        imageLoaded: false,
                        imageError: false,
                        isLazyLoaded: false,
                        isInViewport: false
                    }));
                    
                    console.log('Homepage loaded projects count:', this.projects.length);
                    console.log('Homepage first project data:', this.projects[0]);
                    console.log('Homepage project photos structure:', this.projects[0]?.photos);
                    console.log('Homepage project image URL:', this.getProjectImage(this.projects[0]));
                    
                    // Setup lazy loading for featured projects
                    this.$nextTick(() => {
                        this.setupLazyLoading();
                    });
                }
            } catch (error) {
                console.error('Failed to load projects:', error);
                this.error = 'Failed to load projects';
            } finally {
                this.loading = false;
            }
        },
        getProjectImage(project) {
            const baseUrl = 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';
            
            // Check if project has photos array and it's not empty
            if (project.photos && Array.isArray(project.photos) && project.photos.length > 0) {
                const firstPhoto = project.photos[0];
                
                // If it's already a full URL, return it
                if (firstPhoto && firstPhoto.startsWith('http')) {
                    return firstPhoto;
                }
                
                // If it starts with data/ or docs/, use the R2 bucket URL
                if (firstPhoto && (firstPhoto.startsWith('data/') || firstPhoto.startsWith('docs/'))) {
                    return `${baseUrl}/${firstPhoto}`;
                }
                
                // If it's a relative path, use the R2 bucket URL
                if (firstPhoto) {
                    return `${baseUrl}/${firstPhoto}`;
                }
            }
            
            // Fallback to placeholder
            return 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';
        },
        handleImageError(event) {
            console.log('Image error for project:', event.target.src);
            // Set a fallback image
            event.target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Image+Not+Found';
            
            // Find the project and mark image as error
            const project = this.projects.find(p => this.getProjectImage(p) === event.target.src);
            if (project) {
                project.imageError = true;
                project.imageLoaded = true;
            }
        },
        handleImageLoad(event) {
            console.log('Image loaded successfully:', event.target.src);
            // Find the project and mark image as loaded
            const project = this.projects.find(p => this.getProjectImage(p) === event.target.src);
            if (project) {
                project.imageLoaded = true;
            }
        },
        setupLazyLoading() {
            // Use Intersection Observer for lazy loading
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            const projectId = img.dataset.projectId;
                            
                            // Find the project and mark as in viewport
                            const project = this.projects.find(p => p.uuid1 === projectId);
                            if (project) {
                                project.isInViewport = true;
                                this.loadProjectImage(project, img);
                            }
                            
                            observer.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                });
                
                // Observe all project images
                this.$nextTick(() => {
                    const images = document.querySelectorAll('.project-image[data-project-id]');
                    console.log('Found', images.length, 'images to observe');
                    
                    if (images.length === 0) {
                        console.log('No images found, loading all images immediately');
                        this.loadAllImages();
                    } else {
                        images.forEach(img => {
                            imageObserver.observe(img);
                        });
                    }
                });
            } else {
                // Fallback for browsers without IntersectionObserver
                this.loadAllImages();
            }
        },
        loadProjectImage(project, imgElement) {
            if (project.isLazyLoaded) return;
            
            project.isLazyLoaded = true;
            const imageUrl = this.getProjectImage(project);
            
            if (imageUrl) {
                const img = new Image();
                img.onload = () => {
                    project.imageLoaded = true;
                    project.imageError = false;
                    if (imgElement) {
                        imgElement.src = imageUrl;
                        imgElement.classList.add('loaded');
                    }
                };
                img.onerror = () => {
                    project.imageError = true;
                    project.imageLoaded = false;
                    if (imgElement) {
                        imgElement.classList.add('error');
                    }
                };
                img.src = imageUrl;
            } else {
                project.imageError = true;
                project.imageLoaded = false;
                if (imgElement) {
                    imgElement.classList.add('error');
                }
            }
        },
        loadAllImages() {
            // Fallback: load all images immediately
            this.projects.forEach(project => {
                if (!project.isLazyLoaded) {
                    project.isLazyLoaded = true;
                    const imageUrl = this.getProjectImage(project);
                    if (imageUrl) {
                        const img = new Image();
                        img.onload = () => {
                            project.imageLoaded = true;
                            project.imageError = false;
                        };
                        img.onerror = () => {
                            project.imageError = true;
                            project.imageLoaded = false;
                        };
                        img.src = imageUrl;
                    }
                }
            });
        }
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

// Mount the app
app.mount('#app');
