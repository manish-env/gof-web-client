// Projects Page Application
const { createApp } = Vue;

// API Configuration
const API_BASE_URL = 'https://god-public-api.restless-mountain-f968.workers.dev/api';

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
            loadingImages: false,
            error: null,
            currentPage: 0,
            hasMore: true,
            selectedProject: null,
            carouselContainer: null,
            scrollObserver: null,
            // New properties for search dropdown
            dropdownOpen: false,
            searchQuery: ''
        };
    },
    computed: {
        filteredProjects() {
            let filtered = this.projects;
            
            // Filter by category if selected
            if (this.selectedCategory) {
                filtered = filtered.filter(project => project.type === this.selectedCategory);
            }
            
            // Filter by search query if provided
            if (this.searchQuery && this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase().trim();
                filtered = filtered.filter(project => {
                    // Search in project name
                    const nameMatch = project.name && project.name.toLowerCase().includes(query);
                    // Search in project location
                    const locationMatch = project.location && project.location.toLowerCase().includes(query);
                    // Search in project type
                    const typeMatch = project.type && project.type.toLowerCase().includes(query);
                    // Search in client name
                    const clientMatch = project.clientName && project.clientName.toLowerCase().includes(query);
                    // Search in description
                    const descMatch = project.description && project.description.toLowerCase().includes(query);
                    
                    return nameMatch || locationMatch || typeMatch || clientMatch || descMatch;
                });
            }
            
            // Sort by date (latest first) and then by priority
            filtered = filtered.sort((a, b) => {
                // First sort by created_at (latest first)
                const dateA = new Date(a.createdAt || a.created_at || 0);
                const dateB = new Date(b.createdAt || b.created_at || 0);
                
                if (dateA > dateB) return -1;
                if (dateA < dateB) return 1;
                
                // If dates are equal, sort by priority (high to low)
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                const priorityA = priorityOrder[a.priority] || 0;
                const priorityB = priorityOrder[b.priority] || 0;
                
                return priorityB - priorityA;
            });
            
            return filtered;
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
        this.setupClickOutsideHandler();
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
                    
                    // Setup projects for display
                    this.$nextTick(() => {
                        this.setupProjectsForDisplay();
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
            console.log('loadMoreProjects called - loadingMore:', this.loadingMore, 'hasMore:', this.hasMore, 'loadingImages:', this.loadingImages);
            
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
                    
                    // Setup new projects for display and re-setup infinite scroll
                    this.$nextTick(() => {
                        this.setupProjectsForDisplay();
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

        // Dropdown and search methods
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },

        selectCategory(category) {
            this.selectedCategory = category;
            this.dropdownOpen = false;
        },

        searchProjects() {
            // The search is handled by the filteredProjects computed property
            // This method is called on input to trigger reactivity
        },

        clearSearch() {
            this.searchQuery = '';
        },

        setupClickOutsideHandler() {
            document.addEventListener('click', (event) => {
                const dropdown = document.querySelector('.custom-dropdown');
                if (dropdown && !dropdown.contains(event.target)) {
                    this.dropdownOpen = false;
                }
            });
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
            
            console.log('Getting image for project:', project.name, 'Photos:', project.photos);
            
            // Check if project has photos array and it's not empty
            if (project.photos && Array.isArray(project.photos) && project.photos.length > 0) {
                const firstPhoto = project.photos[0];
                console.log('First photo:', firstPhoto);
                
                // If it's already a full URL, return it
                if (firstPhoto && firstPhoto.startsWith('http')) {
                    console.log('Using full URL:', firstPhoto);
                    return firstPhoto;
                }
                
                // If it starts with data/ or docs/, use the R2 bucket URL
                if (firstPhoto && (firstPhoto.startsWith('data/') || firstPhoto.startsWith('docs/'))) {
                    const url = `${baseUrl}/${firstPhoto}`;
                    console.log('Using R2 URL with prefix:', url);
                    return url;
                }
                
                // If it's a relative path, use the R2 bucket URL
                if (firstPhoto) {
                    const url = `${baseUrl}/${firstPhoto}`;
                    console.log('Using R2 URL:', url);
                    return url;
                }
            }
            
            // Fallback to placeholder
            console.log('No photos found, using placeholder');
            return 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';
        },

        handleImageError(event) {
            console.log('Image error for project:', event.target.src);
            
            // Find the project and mark image as error
            const project = this.projects.find(p => this.getProjectImage(p) === event.target.src);
            if (project) {
                project.imageError = true;
                project.imageLoaded = false;
                console.log('Image failed to load for project:', project.name);
            }
        },

        handleImageLoad(event) {
            console.log('Image loaded successfully:', event.target.src);
            // Find the project and update dimensions
            const project = this.projects.find(p => this.getProjectImage(p) === event.target.src);
            if (project) {
                project.imageError = false;
                project.imageWidth = event.target.naturalWidth;
                project.imageHeight = event.target.naturalHeight;
                console.log('Image loaded for project:', project.name, 'Dimensions:', event.target.naturalWidth, 'x', event.target.naturalHeight);
                
                // Update tile height based on actual image dimensions
                this.$nextTick(() => {
                    this.updateTileHeight(project);
                });
            }
        },

        setupLazyLoading() {
            // Use Intersection Observer for lazy loading
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const tile = entry.target;
                            const projectId = tile.dataset.projectId;
                            
                            // Find the project and mark as in viewport
                            const project = this.projects.find(p => p.uuid1 === projectId);
                            if (project) {
                                project.isInViewport = true;
                                this.loadProjectImage(project, null);
                            }
                            
                            observer.unobserve(tile);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                });
                
                // Observe all project tiles
                this.$nextTick(() => {
                    const tiles = document.querySelectorAll('.project-tile[data-project-id]');
                    console.log('Found', tiles.length, 'tiles to observe');
                    
                    tiles.forEach(tile => {
                        imageObserver.observe(tile);
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
                    project.imageWidth = img.naturalWidth;
                    project.imageHeight = img.naturalHeight;
                    console.log('Image loaded for project:', project.name, 'Dimensions:', img.naturalWidth, 'x', img.naturalHeight);
                    
                    // Update tile height based on image aspect ratio
                    this.$nextTick(() => {
                        this.updateTileHeight(project);
                    });
                };
                img.onerror = () => {
                    project.imageError = true;
                    project.imageLoaded = false;
                    console.log('Image failed to load for project:', project.name);
                };
                img.src = imageUrl;
            } else {
                project.imageError = true;
                project.imageLoaded = false;
                console.log('No image URL for project:', project.name);
            }
        },

        setupProjectsForDisplay() {
            // Setup all projects for immediate display
            this.projects.forEach(project => {
                project.isLazyLoaded = true;
                project.imageLoaded = true; // Set to true immediately
                project.imageError = false;
                console.log('Project ready for display:', project.name);
            });
            
            console.log('All projects ready for display');
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
        },

        scrollLeft() {
            const container = this.$refs.carouselContainer;
            if (container) {
                const slideWidth = 355; // 350px + 5px gap
                container.scrollBy({
                    left: -slideWidth,
                    behavior: 'smooth'
                });
            }
        },

        scrollRight() {
            const container = this.$refs.carouselContainer;
            if (container) {
                const slideWidth = 355; // 350px + 5px gap
                container.scrollBy({
                    left: slideWidth,
                    behavior: 'smooth'
                });
            }
        },

        updateTileHeight(project) {
            const tile = document.querySelector(`[data-project-id="${project.uuid1}"]`);
            if (tile && project.imageWidth && project.imageHeight) {
                // Calculate aspect ratio
                const aspectRatio = project.imageHeight / project.imageWidth;
                
                // Get tile width
                const tileWidth = tile.offsetWidth;
                
                // Calculate new height based on aspect ratio
                const newHeight = tileWidth * aspectRatio;
                
                // Apply the new height (no minimum constraint)
                tile.style.height = `${newHeight}px`;
                tile.classList.add('has-image');
                
                console.log('Updated tile height for', project.name, 'to', newHeight, 'px (aspect ratio:', aspectRatio.toFixed(2), ')');
                
                // Force masonry reflow
                this.$nextTick(() => {
                    this.triggerMasonryReflow();
                });
            }
        },

        triggerMasonryReflow() {
            // Force a reflow of the masonry grid
            const container = document.getElementById('projects-container');
            if (container) {
                // Force reflow by reading a layout property
                container.offsetHeight;
                
                // Add a small delay to ensure smooth animation
                setTimeout(() => {
                    // Trigger any CSS transitions
                    container.style.transform = 'translateZ(0)';
                    requestAnimationFrame(() => {
                        container.style.transform = '';
                    });
                }, 10);
            }
        },

        retryFailedImages() {
            // Retry loading images that failed
            this.projects.forEach(project => {
                if (project.imageError && !project.imageLoaded) {
                    console.log('Retrying image load for project:', project.name);
                    project.isLazyLoaded = false;
                    project.imageError = false;
                    this.loadProjectImage(project, null);
                }
            });
        },


        debugProjectStates() {
            console.log('=== Project States Debug ===');
            this.projects.forEach(project => {
                console.log(`${project.name}:`, {
                    isLazyLoaded: project.isLazyLoaded,
                    imageLoaded: project.imageLoaded,
                    imageError: project.imageError,
                    hasPhotos: project.photos && project.photos.length > 0,
                    photoCount: project.photos ? project.photos.length : 0
                });
            });
            console.log('=== End Debug ===');
        }
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

// Mount the app
app.mount('#app');