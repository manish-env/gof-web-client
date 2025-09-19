// Footer Component
const Footer = {
    data() {
        return {
            settings: {
                companyName: 'Genre of Design',
                description: 'Genre Of Design is a multi-disciplinary platform for Architecture, Urbanism, and Landscape, creating possibilities for life through diverse expertise in Architecture, Structures, Hospitality, Healthcare, Master Planning, Urban Design, Landscape, Interior, and Product.',
                quote: {
                    text: 'To create architecture is to create possibilities — possibilities for life to happen and flourish',
                    author: 'Rakesh Sharma, Director and Principal Architect'
                },
                quickLinks: [
                    { name: 'Projects', url: 'projects.html' },
                    { name: 'Blogs', url: 'blogs.html' },
                    { name: 'Careers', url: 'careers.html' },
                    { name: 'Contact', url: 'contact.html' },
                    { name: 'About Us', url: 'about.html' },
                    { name: 'Discover More', url: 'landing-pages.html' }
                ],
                contactInfo: {
                    phone: '+91 95996 95099',
                    email: 'info@genreofdesign.com',
                    address: {
                        line1: 'D-229, Ground Floor,',
                        line2: 'Sarvodya Enclave,',
                        line3: 'New Delhi, 110017,',
                        line4: 'India'
                    }
                },
                socialLinks: [
                    { name: 'Instagram', url: 'https://www.instagram.com/genreofdesign/', icon: 'fab fa-instagram', color: '#E4405F' },
                    { name: 'YouTube', url: 'https://m.youtube.com/channel/UCSvIFtFmaxvO4uSwhY9OKQg', icon: 'fab fa-youtube', color: '#FF0000' },
                    { name: 'Pinterest', url: 'https://in.pinterest.com/genreofdesign/', icon: 'fab fa-pinterest', color: '#BD081C' },
                    { name: 'LinkedIn', url: 'https://in.linkedin.com/company/genre-of-design', icon: 'fab fa-linkedin', color: '#0077B5' },
                    { name: 'Facebook', url: 'https://m.facebook.com/GenreOfDesign/', icon: 'fab fa-facebook', color: '#1877F2' },
                    { name: 'WhatsApp', url: 'https://wa.me/+919599801061?text=Hi', icon: 'fab fa-whatsapp', color: '#25D366' }
                ],
                copyright: '© 2024 Genre of Design. All rights reserved.'
            },
            ADMIN_API_BASE_URL: 'https://god-admin-worker.restless-mountain-f968.workers.dev/api'
        };
    },
    async mounted() {
        try {
            const res = await fetch(`${this.ADMIN_API_BASE_URL}/site-settings?section=footer&_=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.success && data.data) {
                    this.settings = { ...this.settings, ...data.data };
                }
            }
        } catch (e) {
            console.warn('Footer settings load failed:', e.message);
        }
    },
    template: `
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-full mx-auto px-2.5">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                    <div class="lg:col-span-4">
                        <h3 class="text-xl font-bold mb-4">{{ settings.companyName }}</h3>
                        <div class="mb-6" v-if="settings.quote && settings.quote.text">
                            <blockquote class="text-gray-200 italic text-sm leading-relaxed mb-2">"{{ settings.quote.text }}"</blockquote>
                            <cite class="text-gray-400 text-xs" v-if="settings.quote.author">— {{ settings.quote.author }}</cite>
                        </div>
                        <p class="text-gray-300 mb-6">{{ settings.description }}</p>
                        <div>
                            <h5 class="text-md font-medium text-white mb-3">Follow Us</h5>
                            <div class="flex items-center space-x-4">
                                <a v-for="s in settings.socialLinks" :key="s.name" :href="s.url" target="_blank" class="text-gray-300 transition-colors duration-300 text-2xl" :style="{ color: 'inherit' }" :aria-label="s.name">
                                    <i :class="s.icon"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="lg:col-span-2">
                        <h4 class="text-lg font-semibold mb-4">Expertise</h4>
                        <ul class="space-y-2">
                            <li v-for="item in (settings.expertise || ['Hospitality','Residential','Township','Commercial','Healthcare','Offices','Retail','Institutional','Builder\'s Project'])" :key="item"><span class="text-gray-300">{{ item }}</span></li>
                        </ul>
                    </div>
                    <div class="lg:col-span-2">
                        <h4 class="text-lg font-semibold mb-4">Services</h4>
                        <ul class="space-y-2">
                            <li v-for="svc in (settings.services || ['Architecture','Interior Design','Urban Design'])" :key="svc"><span class="text-gray-300">{{ svc }}</span></li>
                        </ul>
                    </div>
                    <div class="lg:col-span-2">
                        <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul class="space-y-2">
                            <li v-for="link in settings.quickLinks" :key="link.name"><a :href="link.url" class="text-gray-300 hover:text-white transition-colors duration-300">{{ link.name }}</a></li>
                        </ul>
                    </div>
                    <div class="lg:col-span-2">
                        <h4 class="text-lg font-semibold mb-4">Contact Info</h4>
                        <p class="text-gray-300" v-if="settings.contactInfo && settings.contactInfo.phone">Phone: {{ settings.contactInfo.phone }}</p>
                        <p class="text-gray-300" v-if="settings.contactInfo && settings.contactInfo.email">Email: {{ settings.contactInfo.email }}</p>
                        <div class="mt-4" v-if="settings.contactInfo && settings.contactInfo.address">
                            <h5 class="text-md font-medium text-white mb-2">Address</h5>
                            <p class="text-gray-300 text-sm leading-relaxed">
                                {{ settings.contactInfo.address.line1 }}<br>
                                {{ settings.contactInfo.address.line2 }}<br>
                                {{ settings.contactInfo.address.line3 }}<br>
                                {{ settings.contactInfo.address.line4 }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                    <p>{{ settings.copyright }}</p>
                </div>
            </div>
        </footer>
    `
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Footer;
}





