// Clean URLs Handler for Landing Pages
// This script handles clean URLs like /landing-page-slug

(function() {
    'use strict';
    
    // Configuration
    const LANDING_PAGE_BASE = 'landing-page.html';
    const KNOWN_PAGES = ['index', 'about', 'contact', 'careers', 'blogs', 'projects', 'landing-pages'];
    
    // Check if current URL is a clean landing page URL
    function isLandingPageCleanUrl() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        // Must have exactly one segment
        if (segments.length !== 1) return false;
        
        const segment = segments[0];
        
        // Must not be a known page
        if (KNOWN_PAGES.includes(segment)) return false;
        
        // Must not have file extension
        if (segment.includes('.')) return false;
        
        // Must not be the landing page base file
        if (segment === 'landing-page') return false;
        
        // Must not be empty or just a slash
        if (!segment || segment === '/') return false;
        
        // Additional check: only redirect if we're not already on a known page
        const currentPage = window.location.pathname.split('/').pop();
        if (KNOWN_PAGES.some(page => currentPage === page || currentPage === page + '.html')) {
            return false;
        }
        
        return true;
    }
    
    // Redirect clean URL to query parameter format
    function handleCleanUrl() {
        if (isLandingPageCleanUrl()) {
            const path = window.location.pathname;
            const slug = path.split('/').filter(segment => segment)[0];
            const newUrl = `${LANDING_PAGE_BASE}?slug=${encodeURIComponent(slug)}`;
            
            // Use replace to avoid adding to browser history
            window.location.replace(newUrl);
        }
    }
    
    // Update links to use clean URLs
    function updateLinksToCleanUrls() {
        // Find all links that point to landing-page.html with slug parameter
        const links = document.querySelectorAll('a[href*="landing-page.html?slug="]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            const match = href.match(/landing-page\.html\?slug=([^&]+)/);
            
            if (match) {
                const slug = decodeURIComponent(match[1]);
                link.setAttribute('href', `/${slug}`);
            }
        });
    }
    
    // Initialize
    function init() {
        // Only run on landing page or when we detect a clean URL
        const currentPage = window.location.pathname.split('/').pop();
        const isLandingPage = currentPage === 'landing-page.html' || currentPage === 'landing-page';
        const isCleanUrl = isLandingPageCleanUrl();
        
        if (isLandingPage || isCleanUrl) {
            // Handle clean URLs
            handleCleanUrl();
            
            // Update existing links to use clean URLs
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', updateLinksToCleanUrls);
            } else {
                updateLinksToCleanUrls();
            }
        }
    }
    
    // Start the handler
    init();
})();
