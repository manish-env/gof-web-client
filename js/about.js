const { createApp } = Vue;

// Spotlight Carousel Component
const SpotlightCarousel = {
    template: `
        <div class="relative">
            <div class="overflow-hidden">
                <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: \`translateX(-\${currentIndex * 70}%)\` }">
                    <div v-for="(project, index) in projects" :key="project.id" 
                         class="w-[70%] flex-shrink-0 relative mr-4">
                        <div class="w-full max-h-[95vh] flex justify-start items-end h-full relative">
                            <img :src="project.image" 
                                 :alt="project.name"
                                 class="h-auto w-full object-cover"
                                 loading="eager" />
                            <div class="absolute sm:bottom-20 sm:left-20 left-2 bottom-2">
                                <div class="mr-auto inline-block text-white bg-black/30 sm:py-4 sm:px-6 py-1 px-3 backdrop-blur-xl shadow-md z-10">
                                    <div class="">
                                        <h3 class="text-xl underline sm:font-semibold font-medium">
                                            {{ project.name }}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Navigation Buttons -->
            <button @click="previousSlide" 
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10">
                <lucide-chevron-left :size="24"></lucide-chevron-left>
            </button>
            <button @click="nextSlide" 
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10">
                <lucide-chevron-right :size="24"></lucide-chevron-right>
            </button>
            
            <!-- Dots Indicator -->
            <div class="flex justify-center mt-4 space-x-2">
                <button v-for="(project, index) in projects" :key="index"
                        @click="currentIndex = index"
                        :class="['w-3 h-3 rounded-full transition-colors', 
                                currentIndex === index ? 'bg-red-600' : 'bg-gray-300']">
                </button>
            </div>
        </div>
    `,
    data() {
        return {
            currentIndex: 0,
            projects: [
                {
                    id: "1",
                    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                    name: "Ayodhya"
                },
                {
                    id: "2", 
                    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
                    name: "Ayodhya"
                },
                {
                    id: "3",
                    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", 
                    name: "Itarsi Mini Club"
                },
                {
                    id: "4",
                    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                    name: "Itarsi Township"
                },
                {
                    id: "5",
                    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80",
                    name: "Manlok Villa"
                },
                {
                    id: "6",
                    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                    name: "Sea Leaf"
                },
                {
                    id: "7",
                    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                    name: "Sea Leaf"
                }
            ]
        }
    },
    methods: {
        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.projects.length;
        },
        previousSlide() {
            this.currentIndex = this.currentIndex === 0 ? this.projects.length - 1 : this.currentIndex - 1;
        },
    },
    mounted() {
        // Auto-play carousel
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
};

// Features Section Component
const FeaturesSection = {
    template: `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="feature in features" :key="feature.id" 
                 class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div class="aspect-video bg-gray-100">
                    <img :src="feature.image" :alt="feature.title" 
                         class="w-full h-full object-cover" />
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2">{{ feature.title }}</h3>
                    <p class="text-gray-600 text-sm">{{ feature.description }}</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            features: [
                {
                    id: 1,
                    title: "Architectural Digest",
                    description: "Featured in the prestigious architectural magazine",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                },
                {
                    id: 2,
                    title: "Design Today",
                    description: "Recognized for innovative design approach",
                    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
                },
                {
                    id: 3,
                    title: "Interior Design Magazine",
                    description: "Showcased in leading interior design publication",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                },
                {
                    id: 4,
                    title: "Home & Garden",
                    description: "Featured for exceptional residential projects",
                    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
                },
                {
                    id: 5,
                    title: "Design Week",
                    description: "Highlighted for sustainable design practices",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                },
                {
                    id: 6,
                    title: "Architecture Now",
                    description: "Recognized for contemporary architectural solutions",
                    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
                }
            ]
        }
    }
};

// Testimonials Section Component
const TestimonialsSection = {
    template: `
        <section class="w-full py-12 md:py-24 lg:py-32 px-6 sm:px-0">
            <div class="container grid items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
                <div class="space-y-3 text-center">
                    <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        What Our Clients Say
                    </h2>
                    <p class="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        Hear from the people who love using our product.
                    </p>
                </div>
                <div class="relative">
                    <div class="overflow-hidden">
                        <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: \`translateX(-\${currentIndex * 33.333}%)\` }">
                            <div v-for="(video, index) in videos" :key="video.id" 
                                 class="w-1/3 flex-shrink-0 px-2">
                                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <div class="aspect-video bg-gray-100 relative">
                                        <iframe :src="\`https://www.youtube.com/embed/\${video.id}\`" 
                                                frameborder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowfullscreen
                                                class="w-full h-full">
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation Buttons -->
                    <button @click="previousVideo" 
                            class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                        <lucide-chevron-left :size="20"></lucide-chevron-left>
                    </button>
                    <button @click="nextVideo" 
                            class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                        <lucide-chevron-right :size="20"></lucide-chevron-right>
                    </button>
                </div>
            </div>
        </section>
    `,
    data() {
        return {
            currentIndex: 0,
            videos: [
                { id: "7aMhel3fXzY" },
                { id: "xMTOhc73jtQ" },
                { id: "k9hw6YxAfww" },
                { id: "vIcuYpP-9QY" },
                { id: "SeuvW3Ltdgw" }
            ]
        }
    },
    methods: {
        nextVideo() {
            const maxIndex = Math.max(0, this.videos.length - 3);
            this.currentIndex = this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
        },
        previousVideo() {
            const maxIndex = Math.max(0, this.videos.length - 3);
            this.currentIndex = this.currentIndex <= 0 ? maxIndex : this.currentIndex - 1;
        }
    }
};

// Main Vue App
createApp({
    components: {
        'navbar-component': Navbar,
        'footer-component': Footer,
        'spotlight-carousel': SpotlightCarousel,
        'features-section': FeaturesSection,
        'testimonials-section': TestimonialsSection
    }
}).mount('#app');