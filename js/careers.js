// Careers Page Application
const { createApp } = Vue;

// API Configuration
const API_BASE_URL = 'https://god-public-api.restless-mountain-f968.workers.dev/api';

// API Service
const apiService = {
    async request(url, options = {}) {
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        };

        try {
            console.log('Making API request to:', `${API_BASE_URL}${url}`);
            console.log('Request config:', config);
            const response = await axios(`${API_BASE_URL}${url}`, config);
            console.log('API response received:', response);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            console.error('Error details:', error.response?.data);
            console.error('Error status:', error.response?.status);
            throw error;
        }
    },

    async getJobs() {
        return this.request('/jobs');
    },
    nd

    async testJobsAPI() {
        return this.request('/jobs/test');
    },

    async applyForJob(payload) {
        return this.request('/jobs/apply', {
            method: 'POST',
            data: payload
        });
    },

    async getPresignedUrls(keys) {
        return this.request('/jobs/presigned-urls', {
            method: 'POST',
            data: { keys }
        });
    }
};

// Main App
const app = createApp({
    data() {
        return {
            jobs: [],
            loading: false,
            error: null,
            submitting: false,
            applicationForm: {
                name: '',
                email: '',
                phoneNumber: '',
                expectedSalary: '',
                yearsOfExperience: '',
                graduation: '',
                marksInTenth: '',
                marksInTwelveth: '',
                noticePeriod: '',
                skills: '',
                resume: null,
                coverLetter: null
            }
        };
    },
    async mounted() {
        console.log('Vue app mounted, starting to load jobs...');
        console.log('API Base URL:', API_BASE_URL);
        console.log('Vue version:', Vue.version);
        console.log('Axios available:', typeof axios);
        
        // Test if basic functionality works
        try {
        await this.loadJobs();
        } catch (error) {
            console.error('Error in mounted:', error);
            // Load sample jobs as fallback
            this.loadSampleJobs();
        }
    },
    methods: {
        async loadJobs() {
            try {
                this.loading = true;
                console.log('Testing API connection first...');
                
                // Test API first
                try {
                    const testResponse = await apiService.testJobsAPI();
                    console.log('API Test Response:', testResponse);
                } catch (testError) {
                    console.error('API Test Failed:', testError);
                }
                
                console.log('Loading jobs from API...');
                const response = await apiService.getJobs();
                console.log('API Response:', response);
                
                if (response && response.success) {
                    this.jobs = response.data.map(job => ({
                        ...job,
                        isOpen: false
                    }));
                    console.log('Jobs loaded successfully:', this.jobs);
                } else {
                    console.error('API response not successful:', response);
                    // Fallback to sample data if API fails
                    this.loadSampleJobs();
                }
            } catch (error) {
                console.error('Failed to load jobs:', error);
                // Fallback to sample data if API fails
                this.loadSampleJobs();
            } finally {
                this.loading = false;
            }
        },
        
        loadSampleJobs() {
            console.log('Loading sample jobs as fallback...');
            this.jobs = [
                {
                    id: "sample-1",
                    title: "Interior Designer",
                    description: "Design interiors and coordinate with clients. You will be responsible for creating beautiful, functional spaces that meet client needs and exceed their expectations. Work with a team of talented designers and architects to bring visions to life.",
                    qualification: "B.Arch / Interior Design degree required",
                    experience: "2-4 years of professional interior design experience",
                    skills: "AutoCAD, SketchUp, Adobe Creative Suite, 3D modeling, space planning, color theory, material selection",
                    isOpen: false
                },
                {
                    id: "sample-2",
                    title: "Senior Architect",
                    description: "Lead architectural projects from concept to completion. Manage client relationships and oversee design teams. Create innovative solutions for residential and commercial projects.",
                    qualification: "Master's in Architecture, Licensed Architect",
                    experience: "5+ years of architectural experience",
                    skills: "Revit, AutoCAD, BIM, project management, client relations, team leadership",
                    isOpen: false
                },
                {
                    id: "sample-3",
                    title: "3D Visualization Artist",
                    description: "Create stunning 3D visualizations and renderings for interior design projects. Work closely with design teams to produce photorealistic images and animations.",
                    qualification: "Bachelor's in Design or related field",
                    experience: "1-3 years of 3D visualization experience",
                    skills: "3ds Max, V-Ray, Corona Renderer, Photoshop, After Effects, Unreal Engine",
                    isOpen: false
                }
            ];
            console.log('Sample jobs loaded:', this.jobs);
        },
        toggleAccordion(jobId) {
            this.jobs.forEach(job => {
                if (job.id === jobId) {
                    job.isOpen = !job.isOpen;
                } else {
                    job.isOpen = false;
                }
            });
        },
        handleFileUpload(event, field) {
            const file = event.target.files[0];
            if (file) {
                this.applicationForm[field] = file;
            }
        },
        async submitApplication(job) {
            try {
                this.submitting = true;
                console.log('Submitting application for job:', job.id);
                console.log('Form data:', this.applicationForm);
                
                // Step 1: Upload files to R2 and get URLs
                let resumeUrl = null;
                let coverLetterUrl = null;
                
                if (this.applicationForm.resume) {
                    resumeUrl = await this.uploadFile(this.applicationForm.resume, 'resume');
                }
                
                if (this.applicationForm.coverLetter) {
                    coverLetterUrl = await this.uploadFile(this.applicationForm.coverLetter, 'coverLetter');
                }
                
                // Step 2: Submit application with file URLs
                const payload = {
                    jobPostingId: job.id,
                    name: this.applicationForm.name,
                    email: this.applicationForm.email,
                    phoneNumber: this.applicationForm.phoneNumber,
                    expectedSalary: this.applicationForm.expectedSalary,
                    yearsOfExperience: this.applicationForm.yearsOfExperience,
                    graduation: this.applicationForm.graduation,
                    marks10th: this.applicationForm.marksInTenth,
                    marks12th: this.applicationForm.marksInTwelveth,
                    noticePeriod: this.applicationForm.noticePeriod,
                    skills: this.applicationForm.skills,
                    resume: resumeUrl,
                    coverLetter: coverLetterUrl
                };
                
                console.log('Payload being sent:', payload);
                
                const response = await apiService.applyForJob(payload);
                console.log('Application response:', response);
                
                if (response && response.success) {
                    alert('Application submitted successfully!');
                    this.resetForm();
                } else {
                    alert('Failed to submit application. Please try again.');
                }
            } catch (error) {
                console.error('Application error:', error);
                console.error('Error details:', error.response?.data);
                alert('Failed to submit application: ' + (error.response?.data?.message || error.message));
            } finally {
                this.submitting = false;
            }
        },
        
        async uploadFile(file, type) {
            try {
                // Generate unique key for file
                const timestamp = Date.now();
                const randomId = Math.random().toString(36).substring(2, 15);
                const key = `careers/${this.applicationForm.name}_${timestamp}_${randomId}_${file.name}`;
                
                console.log(`Uploading ${type} file:`, key);
                
                // Upload file directly through worker
                const formData = new FormData();
                formData.append('file', file);
                formData.append('key', key);
                
                const uploadResponse = await fetch(`${API_BASE_URL}/jobs/upload`, {
                    method: 'POST',
                    body: formData
                });
                
                if (!uploadResponse.ok) {
                    const errorText = await uploadResponse.text();
                    throw new Error(`Upload failed: ${uploadResponse.statusText} - ${errorText}`);
                }
                
                const result = await uploadResponse.json();
                console.log('Upload response:', result);
                
                if (!result.success) {
                    throw new Error(result.message || 'Upload failed');
                }
                
                console.log(`${type} file uploaded successfully:`, key);
                return key; // Return the key, not the URL
                
            } catch (error) {
                console.error(`Error uploading ${type} file:`, error);
                throw error;
            }
        },
        resetForm() {
            this.applicationForm = {
                name: '',
                email: '',
                phoneNumber: '',
                expectedSalary: '',
                yearsOfExperience: '',
                graduation: '',
                marksInTenth: '',
                marksInTwelveth: '',
                noticePeriod: '',
                skills: '',
                resume: null,
                coverLetter: null
            };
        }
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);
app.component('logo-component', Logo);

// Mount the app
console.log('About to mount Vue app...');
try {
app.mount('#app');
    console.log('Vue app mounted successfully!');
} catch (error) {
    console.error('Failed to mount Vue app:', error);
}





