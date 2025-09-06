// Blogs Page Application
const { createApp } = Vue;

// Main App
const app = createApp({
    data() {
        return {
            // Future blog data will go here
        };
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

// Mount the app
app.mount('#app');




