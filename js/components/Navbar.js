// Navbar Component
const Navbar = {
    template: `
        <nav class="w-full bg-white sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-center items-center h-20 relative">
                    <!-- Left Navigation Links -->
                    <div class="hidden md:flex items-center space-x-8 absolute left-0">
                        <a href="index.html" :class="['nav-link-simple', { 'active-link': isActive('index.html') } ]">Projects</a>
                        <a href="blogs.html" :class="['nav-link-simple', { 'active-link': isActive('blogs.html') } ]">Blogs</a>
                        <a href="landing-pages.html" :class="['nav-link-simple', { 'active-link': isActive('landing-pages.html') } ]">Landing Pages</a>
                    </div>
                    
                    <!-- Center Logo -->
                    <div class="flex-shrink-0">
                        <a href="index.html" class="block">
                            <img src="https://i.ibb.co/WNqDWqx3/genre-of-design-logo-removebg-preview.png" alt="Genre of Design" class="h-14 w-14 object-contain" />
                        </a>
                    </div>
                    
                    <!-- Right Navigation Links -->
                    <div class="hidden md:flex items-center space-x-8 absolute right-0">
                        <a href="careers.html" :class="['nav-link-simple', { 'active-link': isActive('careers.html') } ]">Careers</a>
                        <a href="contact.html" :class="['nav-link-simple', { 'active-link': isActive('contact.html') } ]">Contact</a>
                        <a href="about.html" :class="['nav-link-simple', { 'active-link': isActive('about.html') } ]">About Me</a>
                    </div>
                    
                    <!-- Mobile menu button (left) -->
                    <div class="md:hidden absolute left-0 z-20">
                        <button @click="toggleMobileMenu" class="text-gray-700 hover:text-red-600 transition-colors duration-300 p-2">
                            <i v-if="!mobileMenuOpen" class="fa-solid fa-bars text-xl"></i>
                            <i v-else class="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile Drawer Navigation -->
                <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 md:hidden">
                    <transition name="fade"><div class="absolute inset-0 bg-black bg-opacity-40" @click="closeMobileMenu"></div></transition>
                    <transition name="slide">
                        <div class="absolute left-0 top-0 w-72 h-screen bg-white shadow-xl p-4 relative">
                            <div class="flex items-center justify-between mb-4">
                                <span class="font-semibold text-lg">Menu</span>
                                <button @click="closeMobileMenu" class="text-gray-600"><i class="fa-solid fa-xmark text-lg"></i></button>
                            </div>
                            <nav class="flex flex-col gap-2 h-full overflow-y-auto pb-24">
                                <a href="index.html" :class="['mobile-nav-link', { 'active-link': isActive('index.html') } ]" @click="closeMobileMenu">Projects</a>
                                <a href="blogs.html" :class="['mobile-nav-link', { 'active-link': isActive('blogs.html') } ]" @click="closeMobileMenu">Blogs</a>
                                <a href="landing-pages.html" :class="['mobile-nav-link', { 'active-link': isActive('landing-pages.html') } ]" @click="closeMobileMenu">Landing Pages</a>
                                <a href="careers.html" :class="['mobile-nav-link', { 'active-link': isActive('careers.html') } ]" @click="closeMobileMenu">Careers</a>
                                <a href="contact.html" :class="['mobile-nav-link', { 'active-link': isActive('contact.html') } ]" @click="closeMobileMenu">Contact</a>
                                <a href="about.html" :class="['mobile-nav-link', { 'active-link': isActive('about.html') } ]" @click="closeMobileMenu">About Me</a>
                            </nav>
                            <div class="absolute left-0 right-0 bottom-0 bg-white border-t p-3 text-sm text-gray-500">
                                <div class="mb-2 px-1">Connect with us</div>
                                <div class="flex items-center gap-4 text-lg px-1">
                                    <a href="https://instagram.com" target="_blank" class="hover:text-red-600" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                                    <a href="https://facebook.com" target="_blank" class="hover:text-red-600" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                                    <a href="https://wa.me/+919599801061" target="_blank" class="hover:text-red-600" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                                    <a href="mailto:hello@genreofdesign.com" class="hover:text-red-600" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
                                </div>
                            </div>
                        </div>
                    </transition>
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