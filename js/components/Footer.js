// Footer Component
const Footer = {
    template: `
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-full mx-auto px-2.5">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-xl font-bold mb-4">Genre of Design</h3>
                        <p class="text-gray-300 mb-6">Creating beautiful, functional spaces that reflect your unique style and enhance your lifestyle.</p>
                        
                        <!-- Social Media Icons -->
                        <div>
                            <h5 class="text-md font-medium text-white mb-3">Follow Us</h5>
                            <div class="flex items-center space-x-4">
                                <!-- YouTube -->
                                <a href="https://youtube.com/@genreofdesign" target="_blank" 
                                   class="text-gray-300 hover:text-[#ED1A23] transition-colors duration-300 text-2xl"
                                   aria-label="YouTube">
                                    <i class="fab fa-youtube"></i>
                                </a>
                                
                                <!-- Facebook -->
                                <a href="https://facebook.com/genreofdesign" target="_blank" 
                                   class="text-gray-300 hover:text-[#ED1A23] transition-colors duration-300 text-2xl"
                                   aria-label="Facebook">
                                    <i class="fab fa-facebook"></i>
                                </a>
                                
                                <!-- Instagram -->
                                <a href="https://instagram.com/genreofdesign" target="_blank" 
                                   class="text-gray-300 hover:text-[#ED1A23] transition-colors duration-300 text-2xl"
                                   aria-label="Instagram">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                
                                <!-- Pinterest -->
                                <a href="https://pinterest.com/genreofdesign" target="_blank" 
                                   class="text-gray-300 hover:text-[#ED1A23] transition-colors duration-300 text-2xl"
                                   aria-label="Pinterest">
                                    <i class="fab fa-pinterest"></i>
                                </a>
                                
                                <!-- WhatsApp -->
                                <a href="https://wa.me/+919599801061?text=Hi" target="_blank" 
                                   class="text-gray-300 hover:text-[#ED1A23] transition-colors duration-300 text-2xl"
                                   aria-label="WhatsApp">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                                
                                <!-- LinkedIn -->
                                <a href="https://linkedin.com/company/genreofdesign" target="_blank" 
                                   class="text-gray-300 hover:text-[#ED1A23] transition-colors duration-300 text-2xl"
                                   aria-label="LinkedIn">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Discover More</h4>
                        <ul class="space-y-2">
                            <li><a href="projects.html?category=Residential" class="text-gray-300 hover:text-white transition-colors duration-300">Residential</a></li>
                            <li><a href="projects.html?category=Healthcare" class="text-gray-300 hover:text-white transition-colors duration-300">Healthcare</a></li>
                            <li><a href="projects.html?category=Hospitality" class="text-gray-300 hover:text-white transition-colors duration-300">Hospitality</a></li>
                            <li><a href="projects.html?category=Commercial" class="text-gray-300 hover:text-white transition-colors duration-300">Commercial</a></li>
                            <li><a href="projects.html?category=Institution" class="text-gray-300 hover:text-white transition-colors duration-300">Institution</a></li>
                        </ul>
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
                        
                        <!-- Address -->
                        <div class="mt-4">
                            <h5 class="text-md font-medium text-white mb-2">Address</h5>
                            <p class="text-gray-300 text-sm leading-relaxed">
                                D-229, Ground Floor,<br>
                                Sarvodya Enclave,<br>
                                New Delhi, 110017,<br>
                                India
                            </p>
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





