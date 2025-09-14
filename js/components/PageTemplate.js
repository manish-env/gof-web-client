// Page Template for adding WhatsApp component to other pages
// This file provides a simple template for pages that need the WhatsApp component

// Include this script in your page:
// <script src="js/components/WhatsApp.js"></script>

// Add this to your page HTML:
// <whatsapp-component></whatsapp-component>

// Register the component in your Vue app:
// app.component('whatsapp-component', WhatsApp);

// Example usage in a simple page:
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>Your Page Content</h1>
        
        <!-- WhatsApp Float Button Component -->
        <whatsapp-component></whatsapp-component>
    </div>
    
    <script src="js/components/WhatsApp.js"></script>
    <script>
        const { createApp } = Vue;
        
        const app = createApp({
            // Your app logic here
        });
        
        // Register WhatsApp component
        app.component('whatsapp-component', WhatsApp);
        
        // Mount the app
        app.mount('#app');
    </script>
</body>
</html>
*/


