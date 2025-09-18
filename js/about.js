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
            <div class="overflow-hidden cursor-grab active:cursor-grabbing"
                 @mousedown="startDrag"
                 @mousemove="drag"
                 @mouseup="endDrag"
                 @mouseleave="endDrag">
                <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: \`translateX(-\${currentIndex * slideWidth}%)\` }">
                    <div v-for="(project, index) in projects" :key="project.id" 
                         :class="['flex-shrink-0 relative mr-2 md:mr-4', isMobile ? 'w-[90%]' : 'w-[70%]']">
                        <div class="w-full max-h-[60vh] md:max-h-[95vh] flex justify-start items-end h-full relative">
                            <img :src="project.image" 
                                 :alt="project.name"
                                 class="h-auto w-full object-cover rounded-lg md:rounded-none"
                                 loading="eager" />
                            <div class="absolute bottom-2 left-2 md:bottom-20 md:left-20">
                                <div class="mr-auto inline-block text-white bg-black/30 py-1 px-3 md:py-4 md:px-6 backdrop-blur-xl shadow-md z-10 rounded-md md:rounded-none">
                                    <div class="">
                                        <h3 class="text-sm md:text-xl underline font-medium md:font-semibold">
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
                    class="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1.5 md:p-2 rounded-full hover:bg-black/50 transition-colors z-10">
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
            <button @click="nextSlide" 
                    class="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1.5 md:p-2 rounded-full hover:bg-black/50 transition-colors z-10">
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
            
            <!-- Dots Indicator -->
            <div class="flex justify-center mt-3 md:mt-4 space-x-1.5 md:space-x-2">
                <button v-for="(project, index) in projects" :key="index"
                        @click="currentIndex = index"
                        :class="['rounded-full transition-colors', 
                                currentIndex === index ? 'bg-red-600' : 'bg-gray-300',
                                isMobile ? 'w-2 h-2' : 'w-3 h-3']">
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
            ],
            windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
            isDragging: false,
            startX: 0,
            currentTranslate: 0
        }
    },
    computed: {
        isMobile() {
            return this.windowWidth < 768;
        },
        slideWidth() {
            return this.isMobile ? 90 : 70;
        }
    },
    methods: {
        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.projects.length;
        },
        previousSlide() {
            this.currentIndex = this.currentIndex === 0 ? this.projects.length - 1 : this.currentIndex - 1;
        },
        startDrag(e) {
            this.isDragging = true;
            this.startX = e.pageX;
            this.currentTranslate = this.currentIndex * this.slideWidth;
        },
        drag(e) {
            if (!this.isDragging) return;
            e.preventDefault();
            const currentX = e.pageX;
            const diffX = this.startX - currentX;
            const threshold = 50; // Minimum drag distance to change slide
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
                this.isDragging = false;
            }
        },
        endDrag() {
            this.isDragging = false;
        }
    },
    mounted() {
        // Auto-play carousel
        setInterval(() => {
            this.nextSlide();
        }, 5000);
        
        // Listen for window resize
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', () => {
                this.windowWidth = window.innerWidth;
            });
        }
    }
};

// Features Section Component (Scrollable container)
const FeaturesSection = {
    template: `
      <div class="relative">
        <div class="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
             ref="scrollContainer"
             @scroll="onScroll"
             @mousedown="startDrag"
             @mousemove="drag"
             @mouseup="endDrag"
             @mouseleave="endDrag">
          <div class="flex pb-4" style="width: max-content;">
            
            <div v-for="feature in features" :key="feature.id"
                 class="feature-card flex-shrink-0 flex items-center justify-center px-2">
              <img :src="feature.image"
                   :alt="feature.title"
                   :class="['w-auto object-contain select-none', isMobile ? 'h-[50vh]' : 'h-[80vh]']"
                   loading="lazy" />
            </div>
  
          </div>
        </div>
  
        <!-- Navigation Buttons -->
        <button @click="scrollLeft" 
                class="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1.5 md:p-2 rounded-full hover:bg-black/50 transition-colors z-10">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button @click="scrollRight" 
                class="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1.5 md:p-2 rounded-full hover:bg-black/50 transition-colors z-10">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
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
        ],
        windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
        isDragging: false,
        startX: 0,
        scrollLeft: 0
      }
    },
    computed: {
      isMobile() {
        return this.windowWidth < 768;
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
      },
      startDrag(e) {
        this.isDragging = true;
        this.startX = e.pageX - this.$refs.scrollContainer.offsetLeft;
        this.scrollLeft = this.$refs.scrollContainer.scrollLeft;
        this.$refs.scrollContainer.style.cursor = 'grabbing';
      },
      drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const x = e.pageX - this.$refs.scrollContainer.offsetLeft;
        const walk = (x - this.startX) * 2; // Scroll speed multiplier
        this.$refs.scrollContainer.scrollLeft = this.scrollLeft - walk;
      },
      endDrag() {
        this.isDragging = false;
        this.$refs.scrollContainer.style.cursor = 'grab';
      }
    }
  };
  

// Services Accordion (matches old site layout)
const ServicesAccordion = {
    template: `
        <div>
            <div v-for="(s, idx) in services" :key="s.title" class="py-4 md:py-6 border-b border-gray-200">
                <button @click="toggle(idx)" class="w-full grid grid-cols-[auto_1fr_auto] items-center gap-2 text-xl md:text-3xl no-underline">
                    <div class="justify-self-start text-sm md:text-base font-medium text-gray-500">0{{ idx + 1 }}</div>
                    <div class="text-left md:text-center font-medium text-gray-900">{{ s.title }}</div>
                    <div>
                        <svg :class="{'rotate-180': openIndex === idx}" class="w-5 h-5 md:w-6 md:h-6 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </button>
                <div v-show="openIndex === idx" class="pt-3 md:pt-4 text-sm md:text-lg text-gray-700 leading-relaxed">
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

// Logo Cloud Component
const LogoCloud = {
    template: `
        <section class="w-full py-16 md:py-24 bg-gray-50">
            <div class="max-w-full mx-auto px-2.5">
                <div class="text-center mb-8">
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Trusted by Leading Brands</h2>
                    <p class="text-gray-600">We're proud to work with industry leaders</p>
                </div>
                <div class="relative">
                    <div class="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing" ref="scroller">
                        <div class="grid grid-rows-2 grid-flow-col auto-cols-max gap-4 md:gap-6 pr-4" style="width: max-content;">
                            <div v-for="logo in sortedLogos" :key="logo.name" class="flex items-center justify-center">
                                <div class="aspect-[1/1] w-36 sm:w-44 md:w-52 lg:w-60 bg-white border border-gray-200 rounded-sm flex items-center justify-center">
                                    <img :src="logo.src" :alt="logo.name" class="w-full h-full object-contain" loading="lazy" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button @click="scrollLeft" class="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-gray-200 p-2 rounded-full shadow-sm">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button @click="scrollRight" class="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-gray-200 p-2 rounded-full shadow-sm">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    `,
    methods: {
        scrollLeft() {
            const scroller = this.$refs.scroller;
            if (!scroller) return;
            const amount = Math.max(200, scroller.clientWidth * 0.9);
            scroller.scrollBy({ left: -amount, behavior: 'smooth' });
        },
        scrollRight() {
            const scroller = this.$refs.scroller;
            if (!scroller) return;
            const amount = Math.max(200, scroller.clientWidth * 0.9);
            scroller.scrollBy({ left: amount, behavior: 'smooth' });
        }
    },
    data() {
        const base = 'public/Client logos/';
        const files = [
            'Aarone Group.png',
            'Chima.png',
            'Cross Country.png',
            'Friends Group.png',
            'Gyanesh Builders.png',
            'Himgiri Group.png',
            'Hitech Solution.png',
            'Horizon.png',
            'IHCL.png',
            "Krishna's Group.png",
            'Lemon Tree Hotels.png',
            'LKG Infra.png',
            'Maheshwari Samaj.png',
            'Mangaldeep Darshan.png',
            'Manohar Jewellers.png',
            'Metro Buildtech.png',
            'Myna Homes.png',
            'Opulo.png',
            'PIMS.png',
            'Plastene India Limited.png',
            'Priti International Ltd.png',
            'Ratnamani Healthcare.png',
            'RCC Group.png',
            'Salcon.png',
            'Sanjay Satpal &  Associates.png',
            'sarovar hotels & resorts.png',
            'Sea Leaf Resort.png',
            'Shree Ram Industries.png',
            'square ft.png',
            'Taj.png',
            'Thar office.png',
            'The woodpecker.png',
            'Trishul Industries.png',
            'UMA Group.png',
            'Untitled Design.png',
            'Uppal Group.png',
            'Varaha Infra ltd.png'
        ];
        const logos = files.map(f => ({
            name: f.replace(/\.png$/i, ''),
            src: encodeURI(base + f)
        }));
        return { logos };
    },
    computed: {
        sortedLogos() {
            return this.logos.slice().sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        }
    }
};

// Testimonials Section Component
const TestimonialsSection = {
    template: `
        <section class="w-full py-16 md:py-24">
            <div class="container grid items-center justify-center gap-4 md:px-6 lg:gap-10">
                <div class="space-y-3 text-center">
                    <h2 class="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
                        What Our Clients Say
                    </h2>
                    <p class="mx-auto max-w-[700px] text-sm md:text-base text-gray-500 lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        Hear directly from our clients as they share what made their journey with us exceptional - In Their Words!
                    </p>
                </div>
                <div class="relative">
                    <div class="overflow-hidden">
                        <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: \`translateX(-\${currentIndex * slideWidth}%)\` }">
                            <div v-for="(video, index) in videos" :key="video.id" 
                                 :class="['flex-shrink-0 px-2', isMobile ? 'w-full' : 'w-1/3']">
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
                            class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 p-1.5 md:p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button @click="nextVideo" 
                            class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 p-1.5 md:p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
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
            ],
            windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024
        }
    },
    computed: {
        isMobile() {
            return this.windowWidth < 768;
        },
        slideWidth() {
            return this.isMobile ? 100 : 33.333;
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

// Beyond The Finish Section Component
const BeyondFinishSection = {
    template: `
        <section class="w-full py-16 md:py-24">
            <div class="container grid items-center justify-center gap-4 md:px-6 lg:gap-10">
                <div class="space-y-3 text-center">
                    <h2 class="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
                        Beyond The Finish
                    </h2>
                    <p class="mx-auto max-w-[700px] text-sm md:text-base text-gray-500 lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        Project Walkthroughs: Experience the completed projects as it truly stands - Raw and Real
                    </p>
                </div>
                <div class="relative">
                    <div class="overflow-hidden">
                        <div class="flex justify-center">
                            <div class="w-full md:w-3/4 lg:w-2/3 px-2">
                                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <div class="aspect-video bg-gray-100 relative">
                                        <iframe src="https://www.youtube.com/embed/uSh9y2aBCsQ" 
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
                </div>
            </div>
        </section>
    `
};

// Main Vue App
createApp({
    components: {
        'navbar-component': Navbar,
        'footer-component': Footer,
        'whatsapp-component': WhatsApp,
        'spotlight-carousel': SpotlightCarousel,
        'services-accordion': ServicesAccordion,
        'features-section': FeaturesSection,
        'testimonials-section': TestimonialsSection,
        'beyond-finish-section': BeyondFinishSection,
        'logo-cloud': LogoCloud
    }
}).mount('#app');