// About Page Application
const { createApp } = Vue;

// Main App
const app = createApp({
    data() {
        return {
            // About page data
        };
    }
});

// Register components
app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

// Mount the app
app.mount('#app');





