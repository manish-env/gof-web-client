// Projects Page Application
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

    async getProjects(params = {}) {
        const queryString = new URLSearchParams(params).toString();
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
            displayedProjects: [],
            currentPage: 1,
            hasMore: true,
            selectedProject: null,
            carouselContainer: null
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
        await this.loadProjects();
        await this.loadProjectTypes();
        this.setupInfiniteScroll();
    },
    methods: {
        async loadProjects() {
            try {
                this.loading = true;
                // Fetch ALL projects without limit, like GenreOfDesign
                const response = await apiService.getProjects();
                
                console.log('API Response:', response);
                
                if (response.success) {
                    // Add lazy loading properties to each project
                    this.projects = response.data.map(project => ({
                        ...project,
                        imageLoaded: false,
                        imageError: false,
                        isLazyLoaded: false,
                        isInViewport: false
                    }));
                    
                    console.log('Loaded projects count:', this.projects.length);
                    console.log('First project data:', this.projects[0]);
                    console.log('Project photos structure:', this.projects[0]?.photos);
                    console.log('Project image URL:', this.getProjectImage(this.projects[0]));
                    
                    // Load initial projects - first 12
                    console.log('Loading initial projects...');
                    console.log('Total projects available:', this.projects.length);
                    this.displayedProjects = this.filteredProjects.slice(0, 12);
                    this.currentPage = 1;
                    console.log('Initial projects loaded:', this.displayedProjects.length);
                    
                    // Setup lazy loading for initial projects
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
        async loadProjectTypes() {
            try {
                const response = await apiService.getProjectTypes();
                if (response.success) {
                    this.projectTypes = response.data;
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
        loadMoreProjects() {
            console.log('loadMoreProjects called', {
                loadingMore: this.loadingMore,
                hasMore: this.hasMore,
                currentPage: this.currentPage,
                totalProjects: this.filteredProjects.length,
                displayedCount: this.displayedProjects.length
            });
            
            if (this.loadingMore || !this.hasMore) {
                console.log('Exiting loadMoreProjects - loadingMore:', this.loadingMore, 'hasMore:', this.hasMore);
                return;
            }
            
            this.loadingMore = true;
            
            // Load 12 projects at a time
            const newPageData = this.filteredProjects.slice(this.currentPage * 12, (this.currentPage + 1) * 12);
            console.log('New page data:', newPageData.length, 'from page', this.currentPage);
            
            if (newPageData.length === 0) {
                this.hasMore = false;
                console.log('No more projects to load');
                this.loadingMore = false;
                return;
            }
            
            // Simulate smooth loading like GenreOfDesign
            setTimeout(() => {
                this.displayedProjects = [...this.displayedProjects, ...newPageData];
                this.currentPage++;
                this.loadingMore = false;
                console.log('Loaded projects. Total displayed:', this.displayedProjects.length);
                
                // Setup lazy loading for new projects
                this.$nextTick(() => {
                    this.setupLazyLoading();
                    // Force masonry grid to reflow after a short delay
                    setTimeout(() => {
                        this.forceMasonryReflow();
                    }, 100);
                });
            }, 500);
        },
        setupInfiniteScroll() {
            // Use window scroll event for better compatibility
            const scrollHandler = () => {
                if (this.loadingMore || !this.hasMore) return;
                
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                
                // Calculate how many images are visible based on screen size
                const imagesPerRow = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 640 ? 2 : 1);
                
                // Calculate the height of 6 images from the bottom
                const imageHeight = 300; // Approximate height of each image card
                const sixImagesHeight = 6 * imageHeight;
                const threshold = documentHeight - sixImagesHeight;
                
                console.log('Scroll check:', {
                    scrollTop,
                    windowHeight,
                    documentHeight,
                    threshold,
                    imagesPerRow,
                    distanceFromBottom: documentHeight - (scrollTop + windowHeight),
                    shouldLoad: scrollTop + windowHeight >= threshold
                });
                
                // Load more when 6 images from the bottom are visible
                if (scrollTop + windowHeight >= threshold) {
                    console.log('Triggering load more from scroll - 6 images from bottom');
                    this.loadMoreProjects();
                }
            };
            
            window.addEventListener('scroll', scrollHandler);
            
            // Also check on initial load
            setTimeout(() => {
                scrollHandler();
            }, 1000);
        },
        resetPagination() {
            this.displayedProjects = this.filteredProjects.slice(0, 12);
            this.currentPage = 1;
            this.hasMore = this.filteredProjects.length > 12;
            console.log('Reset pagination - displayed:', this.displayedProjects.length, 'hasMore:', this.hasMore);
            
            // Setup lazy loading for reset projects
            this.$nextTick(() => {
                this.setupLazyLoading();
            });
        },
        setupLazyLoading() {
            console.log('Setting up lazy loading for', this.displayedProjects.length, 'projects');
            
            // Simplified approach: load all images immediately for now
            // This ensures images show up reliably
            this.loadAllImages();
        },
        loadProjectImage(project, imgElement) {
            if (project.isLazyLoaded) {
                console.log('Project already lazy loaded:', project.name);
                return;
            }
            
            console.log('Loading image for project:', project.name);
            project.isLazyLoaded = true;
            const imageUrl = this.getProjectImage(project);
            console.log('Image URL:', imageUrl);
            
            if (imageUrl) {
                const img = new Image();
                img.onload = () => {
                    console.log('Image loaded successfully:', project.name);
                    project.imageLoaded = true;
                    project.imageError = false;
                    if (imgElement) {
                        imgElement.src = imageUrl;
                        imgElement.classList.add('loaded');
                    }
                };
                img.onerror = () => {
                    console.log('Image failed to load:', project.name);
                    project.imageError = true;
                    project.imageLoaded = false;
                    if (imgElement) {
                        imgElement.classList.add('error');
                    }
                };
                img.src = imageUrl;
            } else {
                console.log('No image URL for project:', project.name);
                project.imageError = true;
                project.imageLoaded = false;
                if (imgElement) {
                    imgElement.classList.add('error');
                }
            }
        },
        loadAllImages() {
            // Mark all projects as ready to load images
            console.log('Preparing images for', this.displayedProjects.length, 'projects');
            this.displayedProjects.forEach(project => {
                console.log('Preparing image for project:', project.name);
                project.isLazyLoaded = true;
                const imageUrl = this.getProjectImage(project);
                console.log('Image URL:', imageUrl);
            });
        },
        forceMasonryReflow() {
            // Force the masonry grid to reflow by temporarily changing column count
            const grid = document.getElementById('projects-container');
            if (grid) {
                // Get current column count
                const computedStyle = getComputedStyle(grid);
                const currentColumnCount = computedStyle.columnCount;
                
                // Temporarily change to single column
                grid.style.columnCount = '1';
                grid.style.columnFill = 'auto';
                
                // Force reflow
                grid.offsetHeight;
                
                // Restore original settings
                grid.style.columnCount = currentColumnCount;
                grid.style.columnFill = 'balance';
                
                console.log('Masonry grid reflowed with', currentColumnCount, 'columns');
            }
        },
        async viewProject(project) {
            console.log('=== PROJECT TILE CLICKED ===');
            console.log('Project ID:', project.uuid1);
            console.log('Project Name:', project.name);
            console.log('Project Type:', project.type);
            console.log('Project Location:', project.location);
            console.log('Project Photos Array:', project.photos);
            console.log('Photos Count:', project.photos ? project.photos.length : 0);
            console.log('Sample photo paths:', project.photos ? project.photos.slice(0, 3) : 'No photos');
            console.log('Full Project Object:', project);
            
            this.selectedProject = project;
            
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            
            // Initialize carousel after first render
            this.initCarousel();
            
            // Optionally fetch fresh project data with all details
            try {
                console.log('Fetching fresh project data for ID:', project.uuid1);
                const freshProject = await this.loadSingleProject(project.uuid1);
                if (freshProject) {
                    console.log('Fresh project data received:', freshProject);
                    console.log('Fresh photos array:', freshProject.photos);
                    console.log('Fresh photos count:', freshProject.photos ? freshProject.photos.length : 0);
                    this.selectedProject = freshProject;
                    // Re-init after data update
                    this.initCarousel();
                } else {
                    console.log('No fresh project data received, using cached data');
                }
            } catch (error) {
                console.log('Error fetching fresh project data:', error);
                console.log('Using cached project data:', project);
            }
            
            console.log('Final selected project for modal:', this.selectedProject);
            console.log('Final photos for carousel:', this.selectedProject.photos);
            console.log('=== END PROJECT CLICK ===');
        },
        // Navigate carousel by slide widths
        prevSlide() {
            const container = this.$refs.carouselContainer;
            if (!container) return;
            const slides = Array.from(container.querySelectorAll('.carousel-slide'));
            if (slides.length === 0) return;
            const gap = 5;
            const currentLeft = container.scrollLeft;
            let cumulative = 0;
            let target = 0;
            for (let i = 0; i < slides.length; i++) {
                const width = slides[i].offsetWidth;
                if (cumulative + 1 >= currentLeft) {
                    // move to previous slide start
                    const prevIndex = Math.max(0, i - 1);
                    target = slides.slice(0, prevIndex).reduce((acc, s) => acc + s.offsetWidth + gap, 0);
                    break;
                }
                cumulative += width + gap;
            }
            container.scrollTo({ left: target, behavior: 'smooth' });
        },
        nextSlide() {
            const container = this.$refs.carouselContainer;
            if (!container) return;
            const slides = Array.from(container.querySelectorAll('.carousel-slide'));
            if (slides.length === 0) return;
            const gap = 5;
            const currentLeft = container.scrollLeft;
            let cumulative = 0;
            for (let i = 0; i < slides.length; i++) {
                const width = slides[i].offsetWidth;
                if (cumulative >= currentLeft - 1) {
                    const nextIndex = Math.min(i + 1, slides.length - 1);
                    const target = slides.slice(0, nextIndex).reduce((acc, s) => acc + s.offsetWidth + gap, 0);
                    container.scrollTo({ left: target, behavior: 'smooth' });
                    return;
                }
                cumulative += width + gap;
            }
        },
        initCarousel() {
            this.$nextTick(() => {
                const container = this.$refs.carouselContainer;
                if (!container) return;
                this.carouselContainer = container;
                // Start at the info slide (position 0)
                container.scrollTo({ left: 0, behavior: 'auto' });
            });
        },
        closeModal() {
            this.selectedProject = null;
            this.carouselContainer = null;
            
            // Restore body scroll
            document.body.style.overflow = 'auto';
        },
        handleCarouselScroll() {
            // Handle carousel scroll if needed
            // This can be used for scroll indicators or other scroll-based features
        },
        handleModalImageError(event) {
            console.log('Modal image error:', event.target.src);
            // Set a fallback image
            event.target.src = 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=Image+Not+Found';
        },
        getProjectImage(project, specificImage = null) {
            const baseUrl = 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';
            
            console.log('getProjectImage called with:', { project: project?.name, specificImage });
            
            // If specific image is provided, use it
            if (specificImage) {
                let imageUrl;
                
                // Handle different image path formats
                if (specificImage.startsWith('http://') || specificImage.startsWith('https://')) {
                    // Already a full URL
                    imageUrl = specificImage;
                } else if (specificImage.startsWith('data/') || specificImage.startsWith('docs/') || specificImage.startsWith('uploads/')) {
                    // Path already includes folder
                    imageUrl = `${baseUrl}/${specificImage}`;
                } else {
                    // For simple filenames, try data/ folder first
                    imageUrl = `${baseUrl}/data/${specificImage}`;
                }
                
                console.log('Generated image URL for specific image (pre-encode):', imageUrl);
                return encodeURI(imageUrl);
            }
            
            // Check if project has photos array and it's not empty
            if (project.photos && Array.isArray(project.photos) && project.photos.length > 0) {
                const firstPhoto = project.photos[0];
                let imageUrl;
                
                // Handle different image path formats
                if (firstPhoto.startsWith('http://') || firstPhoto.startsWith('https://')) {
                    // Already a full URL
                    imageUrl = firstPhoto;
                } else if (firstPhoto.startsWith('data/') || firstPhoto.startsWith('docs/') || firstPhoto.startsWith('uploads/')) {
                    // Path already includes folder
                    imageUrl = `${baseUrl}/${firstPhoto}`;
                } else {
                    // For simple filenames, try data/ folder first
                    imageUrl = `${baseUrl}/data/${firstPhoto}`;
                }
                
                console.log('Generated image URL for first photo (pre-encode):', imageUrl);
                return encodeURI(imageUrl);
            }
            
            // Fallback to placeholder
            console.log('No photos found, using placeholder');
            return 'https://via.placeholder.com/400x300?text=No+Image+Available';
        },
        getCarouselImage(project, image) {
            const baseUrl = 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';
            
            console.log('=== getCarouselImage DEBUG ===');
            console.log('Project name:', project?.name);
            console.log('Image path:', image);
            console.log('Image type:', typeof image);
            
            if (!image) {
                console.log('❌ No image provided for carousel');
                return 'https://via.placeholder.com/800x600?text=No+Image+Available';
            }
            
            let imageUrl;
            
            // Handle different image path formats
            if (image.startsWith('http://') || image.startsWith('https://')) {
                // Already a full URL
                imageUrl = image;
                console.log('✅ Using full URL');
            } else if (image.startsWith('data/') || image.startsWith('docs/') || image.startsWith('uploads/')) {
                // Path already includes folder
                imageUrl = `${baseUrl}/${image}`;
                console.log('✅ Using path with folder');
            } else {
                // For simple filenames, try data/ folder first, then root
                imageUrl = `${baseUrl}/data/${image}`;
                console.log('✅ Using data/ folder for simple filename');
            }
            
            const encodedUrl = encodeURI(imageUrl);
            console.log('🎯 Final carousel image URL (encoded):', encodedUrl);
            console.log('=== END getCarouselImage DEBUG ===');
            return encodedUrl;
        },
        handleImageError(event) {
            console.log('Image error for project:', event.target.src);
            // Set a fallback image
            event.target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Image+Not+Found';
            
            // Find the project and mark image as error
            const projectId = event.target.dataset.projectId;
            const project = this.displayedProjects.find(p => p.uuid1 === projectId);
            if (project) {
                project.imageError = true;
                project.imageLoaded = true;
                console.log('Marked project as error:', project.name);
                // Force Vue to update the view
                this.$forceUpdate();
            }
        },
        handleImageLoad(event) {
            console.log('Image loaded successfully:', event.target.src);
            // Find the project and mark image as loaded
            const projectId = event.target.dataset.projectId;
            const project = this.displayedProjects.find(p => p.uuid1 === projectId);
            if (project) {
                project.imageLoaded = true;
                project.imageError = false;
                console.log('Marked project as loaded:', project.name);
                // Force Vue to update the view
                this.$forceUpdate();
            }
        }
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

// Mount the app
app.mount('#app');
