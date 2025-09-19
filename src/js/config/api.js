/**
 * API Configuration
 * Central configuration file for all API endpoints and settings
 */

// API Base Configuration
const API_CONFIG = {
    // Base URL for all API calls
    BASE_URL: 'https://god-worker.restless-mountain-f968.workers.dev',
    
    // API Version (if needed)
    VERSION: 'v1',
    
    // Timeout settings
    TIMEOUT: 10000, // 10 seconds
    
    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
};

// API Endpoints
const API_ENDPOINTS = {
    // Landing Pages
    LANDING_PAGES: {
        LIST: '/landing-pages',
        SINGLE: (slug) => `/landing-pages/${encodeURIComponent(slug)}`,
        CREATE: '/landing-pages',
        UPDATE: (id) => `/landing-pages/${id}`,
        DELETE: (id) => `/landing-pages/${id}`
    },
    
    // Projects
    PROJECTS: {
        LIST: '/projects',
        SINGLE: (id) => `/projects/${id}`,
        CREATE: '/projects',
        UPDATE: (id) => `/projects/${id}`,
        DELETE: (id) => `/projects/${id}`
    },
    
    // Blogs
    BLOGS: {
        LIST: '/blogs',
        SINGLE: (id) => `/blogs/${id}`,
        CREATE: '/blogs',
        UPDATE: (id) => `/blogs/${id}`,
        DELETE: (id) => `/blogs/${id}`
    },
    
    // Leads/Contact
    LEADS: {
        LIST: '/leads',
        CREATE: '/leads',
        UPDATE: (id) => `/leads/${id}`,
        DELETE: (id) => `/leads/${id}`
    },
    
    // Contact Forms
    CONTACT: {
        SUBMIT: '/contact',
        INQUIRY: '/contact/inquiry'
    },
    
    // Settings
    SETTINGS: {
        GET: '/settings',
        UPDATE: '/settings'
    }
};

// Helper function to build full API URL
function buildApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function to get API configuration
function getApiConfig() {
    return API_CONFIG;
}

// Helper function to get API endpoints
function getApiEndpoints() {
    return API_ENDPOINTS;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        API_CONFIG,
        API_ENDPOINTS,
        buildApiUrl,
        getApiConfig,
        getApiEndpoints
    };
} else {
    // Browser environment - make available globally
    window.API_CONFIG = API_CONFIG;
    window.API_ENDPOINTS = API_ENDPOINTS;
    window.buildApiUrl = buildApiUrl;
    window.getApiConfig = getApiConfig;
    window.getApiEndpoints = getApiEndpoints;
}
