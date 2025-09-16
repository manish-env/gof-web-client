// Footer Component
const Footer = {
    template: `
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-full mx-auto px-2.5">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                    <div class="lg:col-span-4">
                        <h3 class="text-xl font-bold mb-4">Genre of Design</h3>
                        <p class="text-gray-300 mb-6">Genre Of Design is a multi-disciplinary platform for Architecture, Urbanism, and Landscape, creating possibilities for life through diverse expertise in Architecture, Structures, Hospitality, Healthcare, Master Planning, Urban Design, Landscape, Interior, and Product.</p>
                        
                        <!-- Social Media Icons -->
                        <div>
                            <h5 class="text-md font-medium text-white mb-3">Follow Us</h5>
                            <div class="flex items-center space-x-4">
                                <!-- Instagram -->
                                <a href="https://www.instagram.com/genreofdesign/" target="_blank" 
                                   class="text-gray-300 hover:text-[#E4405F] transition-colors duration-300 text-2xl"
                                   aria-label="Instagram">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                
                                <!-- YouTube -->
                                <a href="https://m.youtube.com/channel/UCSvIFtFmaxvO4uSwhY9OKQg" target="_blank" 
                                   class="text-gray-300 hover:text-[#FF0000] transition-colors duration-300 text-2xl"
                                   aria-label="YouTube">
                                    <i class="fab fa-youtube"></i>
                                </a>
                                
                                <!-- Pinterest -->
                                <a href="https://in.pinterest.com/genreofdesign/" target="_blank" 
                                   class="text-gray-300 hover:text-[#BD081C] transition-colors duration-300 text-2xl"
                                   aria-label="Pinterest">
                                    <i class="fab fa-pinterest"></i>
                                </a>
                                
                                <!-- LinkedIn -->
                                <a href="https://in.linkedin.com/company/genre-of-design" target="_blank" 
                                   class="text-gray-300 hover:text-[#0077B5] transition-colors duration-300 text-2xl"
                                   aria-label="LinkedIn">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                                
                                <!-- Facebook -->
                                <a href="https://m.facebook.com/GenreOfDesign/" target="_blank" 
                                   class="text-gray-300 hover:text-[#1877F2] transition-colors duration-300 text-2xl"
                                   aria-label="Facebook">
                                    <i class="fab fa-facebook"></i>
                                </a>
                                
                                <!-- WhatsApp -->
                                <a href="https://wa.me/+919599801061?text=Hi" target="_blank" 
                                   class="text-gray-300 hover:text-[#25D366] transition-colors duration-300 text-2xl"
                                   aria-label="WhatsApp">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="lg:col-span-2">
                        <h4 class="text-lg font-semibold mb-4">Expertise</h4>
                        <ul class="space-y-2">
                            <li><span class="text-gray-300">Hospitality</span></li>
                            <li><span class="text-gray-300">Residential</span></li>
                            <li><span class="text-gray-300">Township</span></li>
                            <li><span class="text-gray-300">Commercial</span></li>
                            <li><span class="text-gray-300">Healthcare</span></li>
                            <li><span class="text-gray-300">Offices</span></li>
                            <li><span class="text-gray-300">Retail</span></li>
                            <li><span class="text-gray-300">Institutional</span></li>
                            <li><span class="text-gray-300">Builder's Project</span></li>
                        </ul>
                    </div>
                    <div class="lg:col-span-2">
                        <h4 class="text-lg font-semibold mb-4">Services</h4>
                        <ul class="space-y-2">
                            <li><span class="text-gray-300">Architecture</span></li>
                            <li><span class="text-gray-300">Interior Design</span></li>
                            <li><span class="text-gray-300">Urban Design</span></li>
                        </ul>
                    </div>
                    <div class="lg:col-span-2">
                        <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul class="space-y-2">
                            <li><a href="projects.html" class="text-gray-300 hover:text-white transition-colors duration-300">Projects</a></li>
                            <li><a href="blogs.html" class="text-gray-300 hover:text-white transition-colors duration-300">Blogs</a></li>
                            <li><a href="careers.html" class="text-gray-300 hover:text-white transition-colors duration-300">Careers</a></li>
                            <li><a href="contact.html" class="text-gray-300 hover:text-white transition-colors duration-300">Contact</a></li>
                            <li><a href="about.html" class="text-gray-300 hover:text-white transition-colors duration-300">About Us</a></li>
                            <li><a href="landing-pages.html" class="text-gray-300 hover:text-white transition-colors duration-300">Discover More</a></li>
                        </ul>
                    </div>
                    <div class="lg:col-span-2">
                        <h4 class="text-lg font-semibold mb-4">Contact Info</h4>
                        <p class="text-gray-300">Phone: +91 95996 95099</p>
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





