// Landing Page Router - Handles clean URLs for landing pages
// This script should be included in landing-page.html

(function() {
    'use strict';
    
    // Check if we're on a clean URL (e.g., /landing-page-slug)
    function isCleanUrl() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment);
        
        if (pathSegments.length === 1) {
            const segment = pathSegments[0];
            // If it's not a known page and doesn't have an extension, treat as landing page slug
            const knownPages = ['index', 'about', 'contact', 'careers', 'blogs', 'projects', 'landing-pages'];
            return !knownPages.includes(segment) && !segment.includes('.');
        }
        return false;
    }
    
    // Redirect clean URLs to query parameter format
    function redirectToQueryFormat() {
        if (isCleanUrl()) {
            const path = window.location.pathname;
            const slug = path.split('/').filter(segment => segment)[0];
            const newUrl = `landing-page.html?slug=${encodeURIComponent(slug)}`;
            window.location.replace(newUrl);
        }
    }
    
    // Initialize the router
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToQueryFormat);
    } else {
        redirectToQueryFormat();
    }
})();


