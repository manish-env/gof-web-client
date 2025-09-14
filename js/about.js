const { createApp } = Vue;

// Spotlight Carousel Component (accepts images prop)
const SpotlightCarousel = {
    props: {
        images: {
            type: Array,
            default: () => []
        }
    },
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
            projects: this.images.length ? this.images : [
                { id: "1", image: "public/images/projects/Ayodhya1.jpg", name: "Ayodhya" },
                { id: "2", image: "public/images/projects/Ayodhya3.jpg", name: "Ayodhya" },
                { id: "3", image: "public/images/projects/ItarsiMiniClub.jpg", name: "Itarsi Mini Club" },
                { id: "4", image: "public/images/projects/ItarsiTownship.jpg", name: "Itarsi Township" },
                { id: "5", image: "public/images/projects/ManlokVilla.jpg", name: "Manlok Villa" },
                { id: "6", image: "public/images/projects/SeaLeaf1.jpg", name: "Sea Leaf" },
                { id: "7", image: "public/images/projects/SeaLeaf2.jpg", name: "Sea Leaf" }
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

// Features Section Component (Scrollable container)
const FeaturesSection = {
    template: `
      <div class="relative">
        <div class="overflow-x-auto scrollbar-hide"
             ref="scrollContainer"
             @scroll="onScroll">
          <div class="flex pb-4" style="width: max-content;">
            
            <div v-for="feature in features" :key="feature.id"
                 class="feature-card flex-shrink-0 flex items-center justify-center px-4">
              <img :src="feature.image"
                   :alt="feature.title"
                   class="h-[80vh] w-auto object-contain"
                   loading="lazy" />
            </div>
  
          </div>
        </div>
  
        <!-- Navigation Buttons -->
        <button @click="scrollLeft" 
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10">
          <lucide-chevron-left :size="24"></lucide-chevron-left>
        </button>
        <button @click="scrollRight" 
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10">
          <lucide-chevron-right :size="24"></lucide-chevron-right>
        </button>
      </div>
    `,
    data() {
      return {
        features: [
          {
            id: 1,
            title: "Glitz Magazine",
            description: "Featured in the prestigious lifestyle magazine",
            image: "public/features/Glitz.png"   // ✅ restored
          },
          {
            id: 2,
            title: "IFJ Publication",
            description: "Recognized for innovative design approach",
            image: "public/features/IFJ.png"
          },
          {
            id: 3,
            title: "SS Design",
            description: "Showcased in leading design publication",
            image: "public/features/SS.png"
          },
          {
            id: 4,
            title: "ToR Magazine",
            description: "Featured for exceptional architectural solutions",
            image: "public/features/ToR.png"
          }
        ]
      }
    },
    methods: {
      scrollLeft() {
        const container = this.$refs.scrollContainer;
        const card = container.querySelector('.feature-card');
        const scrollAmount = card ? card.offsetWidth : 800;
        container.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      },
      scrollRight() {
        const container = this.$refs.scrollContainer;
        const card = container.querySelector('.feature-card');
        const scrollAmount = card ? card.offsetWidth : 800;
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      },
      onScroll(e) {
        // Optional: track active slide here if needed
      }
    }
  };
  

// Services Accordion (matches old site layout)
const ServicesAccordion = {
    template: `
        <div>
            <div v-for="(s, idx) in services" :key="s.title" class="py-6 border-b border-gray-200">
                <button @click="toggle(idx)" class="w-full grid grid-cols-[auto_1fr_auto] items-center gap-2 text-3xl no-underline">
                    <div class="justify-self-start">0{{ idx + 1 }}</div>
                    <div class="text-left md:text-center">{{ s.title }}</div>
                    <div>
                        <svg :class="{'rotate-180': openIndex === idx}" class="w-6 h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </button>
                <div v-show="openIndex === idx" class="pt-4 text-lg">
                    {{ s.description }}
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            openIndex: 0,
            services: [
                {
                    title: 'Architecture',
                    description: "We in genre of design strongly believe in blurring the typological boundaries of architecture and creating an architecture which is not stamped as 'something' based on a functionalist approach but evolves 'for' and 'from' life."
                },
                {
                    title: 'Interior Designing',
                    description: 'We extend our philosophy into our approach to Interior Design, where spaces are conceived as fluid environments that seamlessly integrate with the architecture, enriching the human experience through thoughtful spatial compositions and material selections.'
                },
                {
                    title: 'Urban Designing',
                    description: 'In Urban Design, our focus is on fostering vibrant, inclusive communities by reimagining urban landscapes as interconnected ecosystems that prioritize sustainability and social well-being.'
                }
            ]
        }
    },
    methods: {
        toggle(idx) {
            this.openIndex = this.openIndex === idx ? -1 : idx;
        }
    }
};

// Testimonials Section Component
const TestimonialsSection = {
    template: `
        <section class="w-full px-6 sm:px-0">
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
        'services-accordion': ServicesAccordion,
        'features-section': FeaturesSection,
        'testimonials-section': TestimonialsSection
    }
}).mount('#app');