// Projects Page Application
const { createApp } = Vue;

// API Configuration
const API_BASE_URL =  'https://god-worker.restless-mountain-f968.workers.dev/api';

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

    async getProjects(params = {}) {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '' )
        );
        const queryString = new URLSearchParams(cleanParams).toString();
        return this.request(`/projects${queryString ? `?${queryString}` : ''}`);
    },

    async getProjectTypes() {
        return this.request('/projects/types');
    },

    async getProject(id) {
        return this.request(`/projects/${id}`);
    }
};

// Main App
const app = createApp({
    data() {
        return {
            projects: [],
            projectTypes: [],
            selectedCategory: '',
            loading: false,
            loadingMore: false,
            error: null,
            currentPage: 0,
            hasMore: true,
            selectedProject: null,
            carouselContainer: null,
            scrollObserver: null
        };
    },
    computed: {
        filteredProjects() {
            if (!this.selectedCategory) return this.projects;
            return this.projects.filter(project => project.type === this.selectedCategory);
        }
    },
    watch: {
        selectedCategory() {
            this.resetPagination();
        }
    },
    async mounted() {
        await this.loadInitialProjects();
        await this.loadProjectTypes();
        this.setupInfiniteScroll();
    },
    beforeUnmount() {
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
    },
    methods: {
        async loadInitialProjects() {
            try {
                this.loading = true;
                this.error = null;
                
                console.log('Loading initial projects...');
                const response = await apiService.getProjects({ limit: 12, offset: 0, type: this.selectedCategory || undefined });

                console.log('Initial API Response:', response);

                const payload = Array.isArray(response) ? response : (response && response.data) ? response.data : [];
                if (Array.isArray(payload)) {
                    this.projects = payload.map(project => ({
                        ...project,
                        imageLoaded: false,
                        imageError: false,
                        isLazyLoaded: false,
                        isInViewport: false
                    }));

                    this.currentPage = 0;
                    this.hasMore = (response && response.pagination && typeof response.pagination.hasMore !== 'undefined')
                        ? response.pagination.hasMore
                        : payload.length === 12;
                    
                    console.log('Initial projects loaded:', this.projects.length);
                    console.log('Projects data:', this.projects);
                    console.log('Has more projects:', this.hasMore);
                    console.log('Filtered projects count:', this.filteredProjects.length);
                    
                    // Setup lazy loading for initial projects
                    this.$nextTick(() => {
                        this.setupLazyLoading();
                    });
                } else {
                    console.error('Unexpected API response shape', response);
                    this.error = 'Failed to load projects';
                }
            } catch (error) {
                console.error('Failed to load projects:', error);
                this.error = 'Failed to load projects';
            } finally {
                this.loading = false;
            }
        },

        async loadMoreProjects() {
            console.log('loadMoreProjects called - loadingMore:', this.loadingMore, 'hasMore:', this.hasMore);
            
            if (this.loadingMore || !this.hasMore) {
                console.log('Exiting loadMoreProjects - loadingMore:', this.loadingMore, 'hasMore:', this.hasMore);
                return;
            }
            
            try {
                this.loadingMore = true;
                const nextPage = this.currentPage + 1;
                const offset = nextPage * 12;
                
                console.log('Loading more projects - page:', nextPage, 'offset:', offset);
                
                const response = await apiService.getProjects({ 
                    limit: 12, 
                    offset: offset,
                    type: this.selectedCategory || undefined
                });

                const payload = Array.isArray(response) ? response : (response && response.data) ? response.data : [];
                if (Array.isArray(payload) && payload.length > 0) {
                    const newProjects = payload.map(project => ({
                        ...project,
                        imageLoaded: false,
                        imageError: false,
                        isLazyLoaded: false,
                        isInViewport: false
                    }));
                    
                    this.projects.push(...newProjects);
                    this.currentPage = nextPage;
                    this.hasMore = (response && response.pagination && typeof response.pagination.hasMore !== 'undefined')
                        ? response.pagination.hasMore
                        : payload.length === 12;
                    
                    console.log('Loaded more projects:', newProjects.length);
                    console.log('Total projects now:', this.projects.length);
                    console.log('Has more projects:', this.hasMore);
                    
                    // Setup lazy loading for new projects and re-setup infinite scroll
                    this.$nextTick(() => {
                        this.setupLazyLoading();
                        this.setupInfiniteScroll();
                    });
                } else {
                    this.hasMore = false;
                    console.log('No more projects to load');
                }
            } catch (error) {
                console.error('Failed to load more projects:', error);
                this.error = 'Failed to load more projects';
            } finally {
                this.loadingMore = false;
            }
        },

        async resetPagination() {
            this.projects = [];
            this.currentPage = 0;
            this.hasMore = true;
            await this.loadInitialProjects();
        },

        async loadProjectTypes() {
            try {
                const response = await apiService.getProjectTypes();
                const payload = Array.isArray(response) ? response : (response && response.data) ? response.data : [];
                if (Array.isArray(payload)) {
                    this.projectTypes = payload;
                }
            } catch (error) {
                console.error('Failed to load project types:', error);
            }
        },

        async loadSingleProject(id) {
            try {
                console.log('API Request: Fetching project with ID:', id);
                const response = await apiService.getProject(id);
                console.log('API Response:', response);
                
                if (response.success) {
                    console.log('Project data from API:', response.data);
                    console.log('Photos in API response:', response.data.photos);
                    return response.data;
                } else {
                    console.log('API returned success: false, message:', response.message);
                    return null;
                }
            } catch (error) {
                console.error('API Error - Failed to load single project:', error);
                return null;
            }
        },

        setupInfiniteScroll() {
            // Destroy existing observer if any
            if (this.scrollObserver) {
                this.scrollObserver.disconnect();
            }

            this.scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && this.hasMore && !this.loadingMore) {
                        console.log('Load more trigger detected - hasMore:', this.hasMore, 'loadingMore:', this.loadingMore);
                        this.loadMoreProjects();
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            // Observe the trigger element
            this.$nextTick(() => {
                const trigger = document.querySelector('.load-more-trigger');
                if (trigger) {
                    console.log('Observing trigger element for infinite scroll');
                    this.scrollObserver.observe(trigger);
                } else {
                    console.log('No trigger element found for infinite scroll');
                }
            });
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
                    
                    images.forEach(img => {
                        imageObserver.observe(img);
                    });
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
        },

        openProjectModal(project) {
            this.selectedProject = project;
            this.$nextTick(() => {
                this.initializeCarousel();
            });
        },

        closeProjectModal() {
            this.selectedProject = null;
            if (this.carouselContainer) {
                this.carouselContainer.destroy();
            this.carouselContainer = null;
            }
        },

        initializeCarousel() {
            this.$nextTick(() => {
                const carouselElement = document.querySelector('.project-carousel');
                if (carouselElement && this.selectedProject && this.selectedProject.photos && this.selectedProject.photos.length > 1) {
                    // Initialize carousel here if needed
                    console.log('Carousel initialized for project:', this.selectedProject.name);
                }
            });
        },

        getProjectImageUrl(project, photoPath) {
            const baseUrl = 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';
            
            if (photoPath && photoPath.startsWith('http')) {
                return photoPath;
            }
            
            if (photoPath && (photoPath.startsWith('data/') || photoPath.startsWith('docs/'))) {
                return `${baseUrl}/${photoPath}`;
            }
            
            if (photoPath) {
                return `${baseUrl}/${photoPath}`;
            }
            
            return 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=No+Image';
        },

        viewProject(project) {
            this.openProjectModal(project);
        },

        closeModal() {
            this.closeProjectModal();
        },

        getCarouselImage(project, imagePath) {
            return this.getProjectImageUrl(project, imagePath);
        },

        handleModalImageError(event) {
            event.target.src = 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=Image+Not+Found';
        },

        handleCarouselScroll(event) {
            // Handle carousel scroll if needed
        }
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

// Mount the app
app.mount('#app');