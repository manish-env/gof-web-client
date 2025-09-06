// Navbar Component
const Navbar = {
    template: `
        <nav class="w-full bg-white sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-center items-center h-20 relative">
                    <!-- Left Navigation Links -->
                    <div class="flex items-center space-x-8 absolute left-0">
                        <a href="projects.html" class="nav-link-simple">Projects</a>
                        <a href="blogs.html" class="nav-link-simple">Blogs</a>
                    </div>
                    
                    <!-- Center Logo -->
                    <div class="flex-shrink-0">
                        <a href="index.html" class="block">
                            <div class="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300">
                                <span class="text-white text-xl font-semibold">G</span>
                            </div>
                        </a>
                    </div>
                    
                    <!-- Right Navigation Links -->
                    <div class="flex items-center space-x-8 absolute right-0">
                        <a href="careers.html" class="nav-link-simple">Careers</a>
                        <a href="contact.html" class="nav-link-simple">Contact</a>
                        <a href="about.html" class="nav-link-simple">About Me</a>
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
                        <a href="projects.html" class="mobile-nav-link" @click="closeMobileMenu">Projects</a>
                        <a href="blogs.html" class="mobile-nav-link" @click="closeMobileMenu">Blogs</a>
                        <a href="careers.html" class="mobile-nav-link" @click="closeMobileMenu">Careers</a>
                        <a href="contact.html" class="mobile-nav-link" @click="closeMobileMenu">Contact</a>
                        <a href="about.html" class="mobile-nav-link" @click="closeMobileMenu">About Me</a>
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