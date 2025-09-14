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
            projects: [], // All projects loaded
            loadingProjects: false,
            showAllProjects: false, // Toggle for view all
            selectedProject: null, // For modal
            carouselContainer: null, // For carousel
            formData: {},
            submitting: false,
            formSubmitted: false
        };
    },
    computed: {
        displayedProjects() {
            if (this.showAllProjects) {
                return this.projects;
            }
            return this.projects.slice(0, 6);
        },
        columnCount() {
            if (window.innerWidth < 640) return 2; // Mobile: 2 columns
            if (window.innerWidth < 1024) return 2; // Tablet: 2 columns  
            return 3; // Desktop: 3 columns
        }
    },
    async mounted() {
        await this.loadLandingPage();
        if (this.landingPage) {
            await this.loadProjects();
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
                    
                    // Update URL to clean format if we loaded via query parameter
                    const currentSlug = this.getSlugFromUrl();
                    if (currentSlug && currentSlug === this.landingPage.slug) {
                        this.updateUrlToClean(this.landingPage.slug);
                    }
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
            // First try to get slug from clean URL path (e.g., /landing-page-slug)
            const path = window.location.pathname;
            const pathSegments = path.split('/').filter(segment => segment);
            
            // Look for landing page slug in the path
            if (pathSegments.length > 0) {
                const lastSegment = pathSegments[pathSegments.length - 1];
                // If it's not a common file extension or known paths, treat it as a slug
                if (!lastSegment.includes('.') && 
                    lastSegment !== 'landing-page' && 
                    lastSegment !== 'landing-pages' &&
                    lastSegment !== 'index' &&
                    lastSegment !== 'about' &&
                    lastSegment !== 'contact' &&
                    lastSegment !== 'careers' &&
                    lastSegment !== 'blogs' &&
                    lastSegment !== 'projects') {
                    return lastSegment;
                }
            }
            
            // Fallback to query parameter for backward compatibility
            const params = new URLSearchParams(window.location.search);
            return params.get('slug');
        },
        // Update browser URL to clean format
        updateUrlToClean(slug) {
            if (history.pushState) {
                const newUrl = `/${slug}`;
                window.history.pushState({path: newUrl}, '', newUrl);
            }
        },
        // Load projects based on landing page configuration
        async loadProjects() {
            if (!this.landingPage) return;
            
            this.loadingProjects = true;
            try {
                console.log('📝 Loading projects for landing page...');
                
                if (this.landingPage.projectSelectionType === 'specific' && this.landingPage.selectedProjects) {
                    // Load specific projects
                    const projectIds = this.landingPage.selectedProjects;
                    console.log('📝 Loading specific projects:', projectIds);
                    
                    const projectPromises = projectIds.map(async (projectId) => {
                        try {
                            const res = await fetch(`${API_BASE_URL}/projects/${projectId}`);
                            const data = await res.json();
                            return data.success ? data.data : null;
                        } catch (error) {
                            console.error(`Failed to load project ${projectId}:`, error);
                            return null;
                        }
                    });
                    
                    const projects = await Promise.all(projectPromises);
                    this.projects = projects.filter(p => p !== null); // Load all selected projects
                } else if (this.landingPage.projectSelectionType === 'category' && this.landingPage.selectedCategory) {
                    // Load projects by category
                    console.log('📝 Loading projects by category:', this.landingPage.selectedCategory);
                    
                    const res = await fetch(`${API_BASE_URL}/projects?type=${encodeURIComponent(this.landingPage.selectedCategory)}`);
                    const data = await res.json();
                    
                    if (data.success) {
                        this.projects = data.data || [];
                    } else {
                        console.error('Failed to load projects by category:', data.message);
                        this.projects = [];
                    }
                } else {
                    // Fallback: load all projects
                    console.log('📝 Loading all projects as fallback');
                    
                    const res = await fetch(`${API_BASE_URL}/projects`);
                    const data = await res.json();
                    
                    if (data.success) {
                        this.projects = data.data || [];
                    } else {
                        console.error('Failed to load projects:', data.message);
                        this.projects = [];
                    }
                }
                
                // Initialize project states for image loading (same as index page)
                this.projects = this.projects.map(project => {
                    // Ensure photos is properly parsed
                    let photos = project.photos;
                    if (typeof photos === 'string') {
                        try {
                            photos = JSON.parse(photos);
                        } catch (e) {
                            console.log('Failed to parse photos for project:', project.name, photos);
                            photos = [];
                        }
                    }
                    
                    return {
                        ...project,
                        photos: photos, // Ensure photos is an array
                        isLazyLoaded: true, // Set to true immediately like index page
                        imageLoaded: true, // Set to true immediately like index page
                        imageError: false
                    };
                });
                
                console.log('📝 Projects loaded:', this.projects.length);
                console.log('📝 First project data:', this.projects[0]);
                if (this.projects[0]) {
                    console.log('📝 First project photos:', this.projects[0].photos);
                    console.log('📝 First project photos type:', typeof this.projects[0].photos);
                    console.log('📝 First project imageLoaded:', this.projects[0].imageLoaded);
                    console.log('📝 First project isLazyLoaded:', this.projects[0].isLazyLoaded);
                    console.log('📝 First project image URL:', this.getProjectImage(this.projects[0]));
                }
            } catch (error) {
                console.error('❌ Failed to load projects:', error);
                this.projects = [];
            } finally {
                this.loadingProjects = false;
            }
        },
        // Image handling methods (same as index page)
        getProjectImage(project) {
            const baseUrl = 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';
            
            // Check if project has photos array and it's not empty
            if (!project || !project.photos) {
                console.log('No photos for project:', project?.name);
                return null;
            }
            
            // Handle case where photos might be a string that needs parsing
            let photos = project.photos;
            if (typeof photos === 'string') {
                try {
                    photos = JSON.parse(photos);
                } catch (e) {
                    console.log('Failed to parse photos string:', photos);
                    return null;
                }
            }
            
            if (!Array.isArray(photos) || photos.length === 0) {
                console.log('No photos array for project:', project?.name, 'Photos:', photos);
                return null;
            }
            
            const photoPath = photos[0];
            console.log('Getting image for project:', project.name, 'Photo path:', photoPath);
            
            // If it's already a full URL, return as-is
            if (photoPath && photoPath.startsWith('http')) {
                console.log('Using full URL:', photoPath);
                return photoPath;
            }
            
            // Construct the full URL
            if (photoPath) {
                const fullUrl = `${baseUrl}/${photoPath}`;
                console.log('Constructed URL:', fullUrl);
                return fullUrl;
            }
            
            console.log('No valid photo path found');
            return null;
        },
        handleImageLoad(event) {
            const projectId = event.target.closest('.project-tile')?.dataset.projectId;
            console.log('Image loaded for project ID:', projectId);
            if (projectId) {
                const project = this.projects.find(p => p.uuid1 === projectId);
                if (project) {
                    console.log('Image loaded successfully for:', project.name);
                    project.isLazyLoaded = true;
                    project.imageLoaded = true;
                    project.imageError = false;
                }
            }
        },
        handleImageError(event) {
            const projectId = event.target.closest('.project-tile')?.dataset.projectId;
            console.log('Image error for project ID:', projectId, 'Error src:', event.target.src);
            if (projectId) {
                const project = this.projects.find(p => p.uuid1 === projectId);
                if (project) {
                    console.log('Image failed to load for:', project.name);
                    project.isLazyLoaded = true;
                    project.imageLoaded = false;
                    project.imageError = true;
                }
            }
        },
        // Modal methods (same as index page)
        viewProject(project) {
            this.openProjectModal(project);
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
        closeModal() {
            this.closeProjectModal();
        },
        initializeCarousel() {
            this.$nextTick(() => {
                const carouselElement = document.querySelector('.project-carousel');
                if (carouselElement && this.selectedProject && this.selectedProject.photos && this.selectedProject.photos.length > 1) {
                    console.log('Carousel initialized for project:', this.selectedProject.name);
                }
            });
        },
        getCarouselImage(project, imagePath) {
            return this.getProjectImageUrl(project, imagePath);
        },
        getProjectImageUrl(project, photoPath) {
            const baseUrl = 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';
            
            if (photoPath && photoPath.startsWith('http')) {
                return photoPath;
            }
            
            if (photoPath) {
                return `${baseUrl}/${photoPath}`;
            }
            
            return 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=No+Image';
        },
        handleCarouselScroll(event) {
            // Handle carousel scroll if needed
        },
        handleModalImageError(event) {
            event.target.src = 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=Image+Not+Found';
        },
        // View All Projects Toggle
        toggleViewAll() {
            this.showAllProjects = !this.showAllProjects;
            console.log('Toggled view all:', this.showAllProjects, 'Showing', this.displayedProjects.length, 'projects');
        },
        // Masonry column distribution
        getMasonryColumns() {
            const columns = this.columnCount;
            const columnData = Array.from({ length: columns }, () => []);
            
            // Distribute displayed projects across columns for proper masonry effect
            this.displayedProjects.forEach((project, index) => {
                const columnIndex = index % columns;
                columnData[columnIndex].push(project);
            });
            
            return columnData;
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
                    landing_page_slug: this.landingPage.slug,
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
        },
        // Get form fields with default fallback
        getFormFields() {
            if (!this.landingPage || !this.landingPage.form || !this.landingPage.form.fields || this.landingPage.form.fields.length === 0) {
                // Return default fields if none are configured
                return [
                    { name: 'name', label: 'Full Name', type: 'text', required: true },
                    { name: 'email', label: 'Email Address', type: 'email', required: true },
                    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
                    { name: 'message', label: 'Message', type: 'textarea', required: false }
                ];
            }
            return this.landingPage.form.fields;
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

if (typeof WhatsApp !== 'undefined') {
    app.component('whatsapp-component', WhatsApp);
} else {
    console.error('WhatsApp component not found');
}

// Mount the app
app.mount('#app');
