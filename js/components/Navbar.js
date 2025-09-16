// Navbar Component
const Navbar = {
    template: `
        <nav class="w-full bg-white sticky top-0 z-50 shadow-sm">
            <div class="max-w-full mx-auto px-2.5">
                <div class="flex justify-center items-center h-16 relative">
                    <!-- Left Navigation Links -->
                    <div class="hidden md:flex items-center space-x-8 absolute left-0">
                        <a href="index.html" :class="['nav-link-simple', { 'active-link': isActive('index.html') } ]">Projects</a>
                        <a href="blogs.html" :class="['nav-link-simple', { 'active-link': isActive('blogs.html') } ]">Blogs</a>
                        <a href="landing-pages.html" :class="['nav-link-simple', { 'active-link': isActive('landing-pages.html') } ]">Discover More</a>
                    </div>
                    
                    <!-- Center Logo -->
                    <div class="flex-shrink-0">
                        <a href="index.html" class="block">
                            <img src="https://i.ibb.co/WNqDWqx3/genre-of-design-logo-removebg-preview.png" alt="Genre of Design" class="h-14 w-14 object-contain" />
                        </a>
                    </div>
                    
                    <!-- Right Navigation Links -->
                    <div class="hidden md:flex items-center space-x-8 absolute right-0">
                        <a href="about.html" :class="['nav-link-simple', { 'active-link': isActive('about.html') } ]">About Us</a>
                        <a href="contact.html" :class="['nav-link-simple', { 'active-link': isActive('contact.html') } ]">Contact</a>
                        <a href="careers.html" :class="['nav-link-simple', { 'active-link': isActive('careers.html') } ]">Career</a>
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
                                <a href="landing-pages.html" :class="['mobile-nav-link', { 'active-link': isActive('landing-pages.html') } ]" @click="closeMobileMenu">Discover More</a>
                                <a href="about.html" :class="['mobile-nav-link', { 'active-link': isActive('about.html') } ]" @click="closeMobileMenu">About Us</a>
                                <a href="contact.html" :class="['mobile-nav-link', { 'active-link': isActive('contact.html') } ]" @click="closeMobileMenu">Contact</a>
                                <a href="careers.html" :class="['mobile-nav-link', { 'active-link': isActive('careers.html') } ]" @click="closeMobileMenu">Careers</a>
                            </nav>
                            <div class="absolute left-0 right-0 bottom-0 bg-white border-t p-3 text-sm text-gray-500">
                                <div class="mb-2 px-1">Connect with us</div>
                                <div class="flex items-center gap-4 text-lg px-1">
                                    <a href="https://instagram.com" target="_blank" class="hover:text-red-600" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                                    <a href="https://facebook.com" target="_blank" class="hover:text-red-600" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                                    <a href="https://wa.me/+919599695099" target="_blank" class="hover:text-red-600" aria-label="WhatsApp">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                        </svg>
                                    </a>
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