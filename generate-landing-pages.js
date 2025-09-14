// Script to generate individual landing page files for clean URLs
// This script should be run to create individual HTML files for each landing page

const fs = require('fs');
const path = require('path');

// Read the main landing-page.html template
const templatePath = path.join(__dirname, 'landing-page.html');
const template = fs.readFileSync(templatePath, 'utf8');

// API endpoint to get all landing pages
const API_BASE_URL = 'https://god-public-api.restless-mountain-f968.workers.dev/api';

async function generateLandingPages() {
    try {
        console.log('Fetching landing pages...');
        const response = await fetch(`${API_BASE_URL}/landing-pages`);
        const data = await response.json();
        
        if (!data.success || !data.data) {
            throw new Error('Failed to fetch landing pages');
        }
        
        const landingPages = data.data;
        console.log(`Found ${landingPages.length} landing pages`);
        
        for (const page of landingPages) {
            const slug = page.slug;
            const fileName = `${slug}.html`;
            const filePath = path.join(__dirname, fileName);
            
            // Update the template to include the slug in the script
            const updatedTemplate = template.replace(
                'const slug = this.getSlugFromUrl();',
                `const slug = '${slug}'; // Pre-defined slug for clean URLs`
            );
            
            // Write the individual file
            fs.writeFileSync(filePath, updatedTemplate);
            console.log(`Generated: ${fileName}`);
        }
        
        console.log('All landing pages generated successfully!');
        
    } catch (error) {
        console.error('Error generating landing pages:', error);
    }
}

// Run the script
generateLandingPages();







