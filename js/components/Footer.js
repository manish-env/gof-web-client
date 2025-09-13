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
                        
                        <!-- Social Media Icons -->
                        <div class="mt-6">
                            <h5 class="text-md font-medium text-white mb-3">Follow Us</h5>
                            <div class="flex items-center space-x-4">
                                <!-- YouTube -->
                                <a href="https://youtube.com/@genreofdesign" target="_blank" 
                                   class="text-gray-300 hover:text-red-500 transition-colors duration-300"
                                   aria-label="YouTube">
                                    <i class="fa-brands fa-youtube text-xl"></i>
                                </a>
                                
                                <!-- Facebook -->
                                <a href="https://facebook.com/genreofdesign" target="_blank" 
                                   class="text-gray-300 hover:text-blue-500 transition-colors duration-300"
                                   aria-label="Facebook">
                                    <i class="fa-brands fa-facebook text-xl"></i>
                                </a>
                                
                                <!-- Instagram -->
                                <a href="https://instagram.com/genreofdesign" target="_blank" 
                                   class="text-gray-300 hover:text-pink-500 transition-colors duration-300"
                                   aria-label="Instagram">
                                    <i class="fa-brands fa-instagram text-xl"></i>
                                </a>
                                
                                <!-- Pinterest -->
                                <a href="https://pinterest.com/genreofdesign" target="_blank" 
                                   class="text-gray-300 hover:text-red-600 transition-colors duration-300"
                                   aria-label="Pinterest">
                                    <i class="fa-brands fa-pinterest text-xl"></i>
                                </a>
                                
                                <!-- WhatsApp -->
                                <a href="https://wa.me/+919599801061?text=Hi" target="_blank" 
                                   class="text-gray-300 hover:text-green-500 transition-colors duration-300"
                                   aria-label="WhatsApp">
                                    <i class="fa-brands fa-whatsapp text-xl"></i>
                                </a>
                                
                                <!-- LinkedIn -->
                                <a href="https://linkedin.com/company/genreofdesign" target="_blank" 
                                   class="text-gray-300 hover:text-blue-600 transition-colors duration-300"
                                   aria-label="LinkedIn">
                                    <i class="fa-brands fa-linkedin text-xl"></i>
                                </a>
                            </div>
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





