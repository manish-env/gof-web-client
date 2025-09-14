// Landing Page Clean URL Redirect
// This script only handles redirecting clean URLs to the landing page

(function() {
    'use strict';
    
    // Known pages that should not be redirected
    const KNOWN_PAGES = ['index', 'about', 'contact', 'careers', 'blogs', 'projects', 'landing-pages', 'landing-page'];
    
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
        
        // Must not be empty
        if (!segment) return false;
        
        return true;
    }
    
    // Redirect clean URL to query parameter format
    function handleCleanUrl() {
        if (isLandingPageCleanUrl()) {
            const path = window.location.pathname;
            const slug = path.split('/').filter(segment => segment)[0];
            const newUrl = `landing-page.html?slug=${encodeURIComponent(slug)}`;
            
            // Use replace to avoid adding to browser history
            window.location.replace(newUrl);
        }
    }
    
    // Only run if we detect a clean URL
    if (isLandingPageCleanUrl()) {
        handleCleanUrl();
    }
})();



