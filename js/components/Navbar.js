// Navbar Component
const Navbar = {
    template: `
        <nav class="w-full bg-white sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-center items-center h-20 relative">
                    <!-- Left Navigation Links -->
                    <div class="flex items-center space-x-8 absolute left-0">
                        <a href="index.html" :class="['nav-link-simple', { 'active-link': isActive('index.html') } ]">Home</a>
                        <a href="projects.html" :class="['nav-link-simple', { 'active-link': isActive('projects.html') } ]">Projects</a>
                        <a href="blogs.html" :class="['nav-link-simple', { 'active-link': isActive('blogs.html') } ]">Blogs</a>
                    </div>
                    
                    <!-- Center Logo -->
                    <div class="flex-shrink-0">
                        <a href="index.html" class="block">
                            <img src="https://i.ibb.co/WNqDWqx3/genre-of-design-logo-removebg-preview.png" alt="Genre of Design" class="h-14 w-14 object-contain" />
                        </a>
                    </div>
                    
                    <!-- Right Navigation Links -->
                    <div class="flex items-center space-x-8 absolute right-0">
                        <a href="careers.html" :class="['nav-link-simple', { 'active-link': isActive('careers.html') } ]">Careers</a>
                        <a href="contact.html" :class="['nav-link-simple', { 'active-link': isActive('contact.html') } ]">Contact</a>
                        <a href="about.html" :class="['nav-link-simple', { 'active-link': isActive('about.html') } ]">About Me</a>
                    </div>
                    
                    <!-- Mobile menu button -->
                    <div class="md:hidden absolute right-0">
                        <button @click="toggleMobileMenu" class="text-gray-700 hover:text-red-600 transition-colors duration-300">
                            <lucide-menu v-if="!mobileMenuOpen" :size="24"></lucide-menu>
                            <lucide-x v-else :size="24"></lucide-x>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile Navigation -->
                <div v-if="mobileMenuOpen" class="md:hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                        <a href="index.html" :class="['mobile-nav-link', { 'active-link': isActive('index.html') } ]" @click="closeMobileMenu">Home</a>
                        <a href="projects.html" :class="['mobile-nav-link', { 'active-link': isActive('projects.html') } ]" @click="closeMobileMenu">Projects</a>
                        <a href="blogs.html" :class="['mobile-nav-link', { 'active-link': isActive('blogs.html') } ]" @click="closeMobileMenu">Blogs</a>
                        <a href="careers.html" :class="['mobile-nav-link', { 'active-link': isActive('careers.html') } ]" @click="closeMobileMenu">Careers</a>
                        <a href="contact.html" :class="['mobile-nav-link', { 'active-link': isActive('contact.html') } ]" @click="closeMobileMenu">Contact</a>
                        <a href="about.html" :class="['mobile-nav-link', { 'active-link': isActive('about.html') } ]" @click="closeMobileMenu">About Me</a>
                    </div>
                </div>
                
                <!-- Bottom Border Line -->
                <div class="border-b border-gray-200"></div>
            </div>
        </nav>
    `,
    data() {
        return {
            mobileMenuOpen: false
        };
    },
    methods: {
        isActive(path) {
            try {
                const current = window.location.pathname.split('/').pop() || 'index.html';
                return current === path;
            } catch (e) {
                return false;
            }
        },
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        },
        closeMobileMenu() {
            this.mobileMenuOpen = false;
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navbar;
}