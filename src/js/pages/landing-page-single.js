// Individual Landing Page Application
const { createApp } = Vue;

// API Configuration - using common config
const API_BASE_URL = API_CONFIG.BASE_URL;
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
                
                // For testing purposes, always use dummy data
                console.log('Loading dummy landing page data for testing');
                this.landingPage = this.getDummyLandingPageData();
                document.title = `${this.landingPage.title} - Genre of Design`;
                document.getElementById('page-title').textContent = this.landingPage.title;
                
                // Optional: Try to load from API as well (for future use)
                const slug = this.getSlugFromUrl();
                if (slug && slug !== 'architectural-design') {
                    try {
                        const res = await fetch(`${API_BASE_URL}/landing-pages/${encodeURIComponent(slug)}`);
                        const data = await res.json();
                        
                        if (data && data.success && data.data) {
                            console.log('API data loaded, replacing dummy data');
                            this.landingPage = data.data;
                            document.title = `${this.landingPage.title} - Genre of Design`;
                            document.getElementById('page-title').textContent = this.landingPage.title;
                        }
                    } catch (apiError) {
                        console.warn('API request failed, keeping dummy data:', apiError);
                    }
                }
                
            } catch (e) {
                console.error('Failed to load landing page', e);
                // Fallback to dummy data
                this.landingPage = this.getDummyLandingPageData();
                document.title = `${this.landingPage.title} - Genre of Design`;
                document.getElementById('page-title').textContent = this.landingPage.title;
            } finally {
                this.loading = false;
            }
        },
        
        getDummyLandingPageData() {
            return {
                id: 'dummy-landing-page',
                slug: 'architectural-design',
                title: 'ARCHITECTURAL',
                description: 'Discover the magic behind our innovative architecture designs and experience. Craft architectural with passion.',
                category: 'Architecture',
                heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                projectSelectionType: 'all',
                selectedProjects: [],
                selectedCategory: null,
                belowFold: {
                    services: [
                        'Residential Architecture',
                        'Commercial Design',
                        'Interior Design',
                        'Urban Planning',
                        'Renovation & Restoration'
                    ],
                    benefits: [
                        'Award-winning design team',
                        'Sustainable building practices',
                        'Timely project delivery',
                        '24/7 client support',
                        '10+ years experience'
                    ],
                    testimonials: [
                        {
                            quote: 'Genre of Design transformed our vision into reality. Their attention to detail and innovative approach exceeded our expectations.',
                            author: 'Sarah Johnson, Homeowner'
                        },
                        {
                            quote: 'Professional, creative, and reliable. They delivered our commercial project on time and within budget.',
                            author: 'Michael Chen, Business Owner'
                        },
                        {
                            quote: 'The team\'s expertise in sustainable design helped us create an eco-friendly home that\'s both beautiful and functional.',
                            author: 'Emily Rodriguez, Architect'
                        }
                    ]
                },
                form: {
                    title: 'Start Your Project Today',
                    fields: [
                        { name: 'name', label: 'Full Name', type: 'text', required: true },
                        { name: 'email', label: 'Email Address', type: 'email', required: true },
                        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
                        { name: 'project_type', label: 'Project Type', type: 'select', required: true, options: ['Residential', 'Commercial', 'Interior Design', 'Renovation', 'Other'] },
                        { name: 'budget', label: 'Budget Range', type: 'select', required: false, options: ['Under $50k', '$50k - $100k', '$100k - $250k', '$250k - $500k', 'Over $500k'] },
                        { name: 'message', label: 'Project Description', type: 'textarea', required: false }
                    ]
                }
            };
        },
        getSlugFromUrl() {
            // Check for marketing parameter first (from /discovermore?marketing=slugname)
            const params = new URLSearchParams(window.location.search);
            const marketingSlug = params.get('marketing');
            if (marketingSlug) {
                console.log('Found marketing parameter:', marketingSlug);
                return marketingSlug;
            }
            
            // Check for slug parameter (backward compatibility)
            const slugParam = params.get('slug');
            if (slugParam) {
                console.log('Found slug parameter:', slugParam);
                return slugParam;
            }
            
            // Check for clean URL path (e.g., /landing-page-slug)
            const path = window.location.pathname;
            const pathSegments = path.split('/').filter(segment => segment);
            
            // Look for landing page slug in the path
            if (pathSegments.length > 0) {
                const lastSegment = pathSegments[pathSegments.length - 1];
                // If it's not a common file extension or known paths, treat it as a slug
                if (!lastSegment.includes('.') && 
                    lastSegment !== 'landing-page' && 
                    lastSegment !== 'landing-pages' &&
                    lastSegment !== 'discovermore' &&
                    lastSegment !== 'index' &&
                    lastSegment !== 'about' &&
                    lastSegment !== 'contact' &&
                    lastSegment !== 'careers' &&
                    lastSegment !== 'blogs' &&
                    lastSegment !== 'projects') {
                    console.log('Found slug in path:', lastSegment);
                    return lastSegment;
                }
            }
            
            console.log('No slug found in URL');
            return null;
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
                
                // For testing, use dummy project data
                console.log('📝 Using dummy project data for testing');
                this.projects = this.getDummyProjectData();
                
                // Initialize project states for image loading (same as index page)
                this.projects = this.projects.map(project => {
                    return {
                        ...project,
                        isLazyLoaded: true, // Set to true immediately like index page
                        imageLoaded: true, // Set to true immediately like index page
                        imageError: false
                    };
                });
                
                console.log('📝 Projects loaded:', this.projects.length);
                console.log('📝 First project data:', this.projects[0]);
                if (this.projects[0]) {
                    console.log('📝 First project photos:', this.projects[0].photos);
                    console.log('📝 First project image URL:', this.getProjectImage(this.projects[0]));
                }
                
                // Optional: Try to load from API as well (for future use)
                try {
                    const res = await fetch(`${API_BASE_URL}/projects`);
                    const data = await res.json();
                    
                    if (data.success && data.data && data.data.length > 0) {
                        console.log('📝 API projects loaded, replacing dummy data');
                        this.projects = data.data.map(project => {
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
                                photos: photos,
                                isLazyLoaded: true,
                                imageLoaded: true,
                                imageError: false
                            };
                        });
                    }
                } catch (apiError) {
                    console.warn('API projects failed, keeping dummy data:', apiError);
                }
                
            } catch (error) {
                console.error('❌ Failed to load projects:', error);
                this.projects = this.getDummyProjectData();
            } finally {
                this.loadingProjects = false;
            }
        },
        
        getDummyProjectData() {
            return [
                {
                    uuid1: 'dummy-project-1',
                    name: 'Modern Residential Villa',
                    location: 'Mumbai, India',
                    type: 'Residential',
                    clientName: 'Rajesh Kumar',
                    status: 'Completed',
                    area: '3500 sq ft',
                    description: 'A stunning modern villa featuring clean lines, large glass facades, and sustainable design elements.',
                    photos: [
                        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    uuid1: 'dummy-project-2',
                    name: 'Corporate Office Complex',
                    location: 'Delhi, India',
                    type: 'Commercial',
                    clientName: 'Tech Solutions Ltd',
                    status: 'In Progress',
                    area: '15000 sq ft',
                    description: 'Contemporary office design with open workspaces, meeting rooms, and employee wellness areas.',
                    photos: [
                        'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    uuid1: 'dummy-project-3',
                    name: 'Luxury Hotel Interior',
                    location: 'Goa, India',
                    type: 'Hospitality',
                    clientName: 'Ocean View Resorts',
                    status: 'Completed',
                    area: '8000 sq ft',
                    description: 'Elegant hotel interior design with coastal themes, premium finishes, and guest comfort focus.',
                    photos: [
                        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    uuid1: 'dummy-project-4',
                    name: 'Sustainable Eco-Home',
                    location: 'Bangalore, India',
                    type: 'Residential',
                    clientName: 'Green Living Foundation',
                    status: 'Completed',
                    area: '2800 sq ft',
                    description: 'Environmentally conscious home design with solar panels, rainwater harvesting, and natural materials.',
                    photos: [
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    uuid1: 'dummy-project-5',
                    name: 'Retail Store Design',
                    location: 'Pune, India',
                    type: 'Retail',
                    clientName: 'Fashion Forward',
                    status: 'Completed',
                    area: '2000 sq ft',
                    description: 'Modern retail space with dynamic lighting, flexible displays, and customer flow optimization.',
                    photos: [
                        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    ]
                },
                {
                    uuid1: 'dummy-project-6',
                    name: 'Medical Center',
                    location: 'Chennai, India',
                    type: 'Healthcare',
                    clientName: 'Health Plus Clinic',
                    status: 'In Progress',
                    area: '5000 sq ft',
                    description: 'Patient-centered healthcare facility with calming interiors, efficient layouts, and accessibility features.',
                    photos: [
                        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1576091160550-2173dba0ef08?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    ]
                }
            ];
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
