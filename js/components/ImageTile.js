// Image Tile Component - Exact god_old Design
const ImageTile = {
    props: {
        project: {
            type: Object,
            required: true
        },
        getProjectImage: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            mouseOver: false
        }
    },
    template: `
        <div 
            class="project-tile" 
            @click="$emit('view-project', project)"
            @mouseenter="mouseOver = true"
            @mouseleave="mouseOver = false"
        >
            <!-- Image - Direct in container -->
            <img 
                :src="getProjectImage(project)"
                :alt="project.name"
                class="tile-image"
                :class="{ 'image-hover': mouseOver }"
                @load="handleImageLoad"
                @error="handleImageError"
            />
            
            <!-- Gradient Overlay - Separate div -->
            <div class="tile-gradient-overlay"></div>
            
            <!-- Text Content - Separate div -->
            <div class="tile-text-content">
                <h2 class="project-title">{{ project.name }}</h2>
                <div class="project-location">{{ project.location }}</div>
            </div>
        </div>
    `,
    methods: {
        handleImageLoad(event) {
            this.$emit('image-load', event);
        },
        handleImageError(event) {
            this.$emit('image-error', event);
        }
    }
};

// Add CSS styles - Exact god_old Design
const style = document.createElement('style');
style.textContent = `
/* Project Tile - Exact god_old Structure */
.project-tile {
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    z-index: 10;
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
}

/* Image - Direct in container */
.tile-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    z-index: 10;
    transition: transform 0.1s ease-in-out;
    display: block;
}

.tile-image.image-hover {
    transform: scale(1.1);
}

/* Gradient Overlay - Separate div like god_old */
.tile-gradient-overlay {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 10;
    display: flex;
    align-items: flex-end;
    padding: 12px;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
    pointer-events: none;
}

/* Text Content - Separate div like god_old */
.tile-text-content {
    position: absolute;
    bottom: 0;
    z-index: 20;
    padding: 8px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.project-title {
    color: white;
    font-size: 2rem;
    font-weight: 400;
    line-height: 1.2;
    width: 100%;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.project-location {
    color: white;
    width: auto;
    display: flex;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.2;
    white-space: nowrap;
    margin: 0;
}

/* Mobile Responsive - Exact god_old breakpoints */
@media (max-width: 640px) {
    .project-title {
        font-size: 1.5rem;
    }
    
    .project-location {
        font-size: 0.875rem;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageTile;
}
