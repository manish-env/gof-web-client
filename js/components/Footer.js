// Footer Component
const Footer = {
    template: `
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 class="text-xl font-bold mb-4">Genre of Design</h3>
                        <p class="text-gray-300">Creating beautiful, functional spaces that reflect your unique style and enhance your lifestyle.</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul class="space-y-2">
                            <li><a href="projects.html" class="text-gray-300 hover:text-white transition-colors duration-300">Projects</a></li>
                            <li><a href="blogs.html" class="text-gray-300 hover:text-white transition-colors duration-300">Blogs</a></li>
                            <li><a href="careers.html" class="text-gray-300 hover:text-white transition-colors duration-300">Careers</a></li>
                            <li><a href="contact.html" class="text-gray-300 hover:text-white transition-colors duration-300">Contact</a></li>
                            <li><a href="about.html" class="text-gray-300 hover:text-white transition-colors duration-300">About Me</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Contact Info</h4>
                        <p class="text-gray-300">Phone: +91 95998 01061</p>
                        <p class="text-gray-300">Email: info@genreofdesign.com</p>
                        <div class="mt-4">
                            <a href="https://wa.me/+919599801061?text=Hi" target="_blank" 
                               class="inline-flex items-center text-green-500 hover:text-green-400 transition-colors duration-300">
                                <lucide-message-circle :size="20" class="mr-2"></lucide-message-circle>
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                    <p>&copy; 2024 Genre of Design. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Footer;
}





