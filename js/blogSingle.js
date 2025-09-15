const { createApp } = Vue;

function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

const API_BASE_URL = 'https://god-worker.restless-mountain-f968.workers.dev/api';
const FILE_BASE_URL = 'https://pub-adaf71aa7820480384f91cac298ea58e.r2.dev';

const app = createApp({
    data() {
        return {
            blog: null,
            blogContent: null,
            relatedBlogs: [],
            loading: false,
            error: null
        };
    },
    async mounted() {
        const idOrSlug = getQueryParam('id');
        await this.loadBlog(idOrSlug);
    },
    methods: {
        resolveCoverUrl(path) {
            if (!path) return '';
            if (/^https?:\/\//i.test(path)) return path;
            const normalized = path.startsWith('/') ? path : `/${path}`;
            return `${FILE_BASE_URL}${normalized}`;
        },
        async loadBlog(idOrSlug) {
            if (!idOrSlug) {
                this.error = 'No blog specified';
                return;
            }
            try {
                this.loading = true;
                const res = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(idOrSlug)}`);
                const data = await res.json();
                if (data && data.success) {
                    const b = data.data;
                this.blogContent = b.content;
                // Try to find content in various possible fields
                let content = b.content || b.body || b.description || b.excerpt || b.html || b.richText || b.rich_text || '';
                    
                    // Try to find cover image in various possible fields
                    let coverPath = b.coverImage || b.cover_image || b.cover || b.image || b.featured_image || '';
                    
                    // If no content found, try to use static data as fallback
                    if (!content && window.BLOGS) {
                        const staticBlog = window.BLOGS.find(blog => 
                            blog.id === idOrSlug || blog.slug === idOrSlug
                        );
                        if (staticBlog) {
                            content = staticBlog.content;
                            if (!coverPath) coverPath = staticBlog.cover;
                        }
                    }
                    
                    // Ensure content is a string and not empty
                    if (!content || typeof content !== 'string' || !content.trim()) {
                        content = '<p>No content available for this blog post.</p>';
                    }
                    
                    const isPlain = !(content && /<\s*[a-z][\s\S]*>/i.test(content.trim()));
                    this.blog = {
                        id: b.id || b.slug,
                        title: b.title,
                        author: b.author,
                        date: b.publishedAt || b.published_at || b.createdAt || b.created_at,
                        readTime: b.readTime || b.read_time || 5,
                        cover: this.resolveCoverUrl(coverPath),
                        content: content,
                        isPlain
                    };
                    this.blogContent = content; // render as-is

                    // Load related blogs (latest published, exclude current)
                    try {
                        const relRes = await fetch(`${API_BASE_URL}/blogs?published=true&limit=6`);
                        const relData = await relRes.json();
                        if (relData && relData.success && Array.isArray(relData.data)) {
                            const currentId = this.blog.id;
                            this.relatedBlogs = relData.data
                                .map(r => ({
                                    id: r.id || r.slug,
                                    title: r.title,
                                    publishedAt: r.publishedAt || r.published_at || r.createdAt || r.created_at,
                                    cover: this.resolveCoverUrl(r.coverImage || r.cover_image || r.cover || ''),
                                }))
                                .filter(r => r.id !== currentId)
                                .slice(0, 4);
                        }
                    } catch (_) {}
                } else {
                    // Fallback to static data if API fails
                    if (window.BLOGS) {
                        const staticBlog = window.BLOGS.find(blog => 
                            blog.id === idOrSlug || blog.slug === idOrSlug
                        );
                        if (staticBlog) {
                            this.blog = {
                                id: staticBlog.id,
                                title: staticBlog.title,
                                author: staticBlog.author,
                                date: staticBlog.date,
                                readTime: staticBlog.readTime,
                                cover: staticBlog.cover,
                                content: staticBlog.content
                            };
                            this.blogContent = staticBlog.content;
                        } else {
                            this.error = 'Blog not found';
                        }
                    } else {
                        this.error = 'Failed to load blog';
                    }
                }
            } catch (e) {
                console.error('Failed to load blog', e);
                this.error = 'Failed to load blog';
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateStr) {
            const d = new Date(dateStr);
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        },
        getShareUrl(platform) {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(this.blog?.title || 'Check out this blog post');
            const text = encodeURIComponent(`${this.blog?.title || 'Blog Post'} - Genre of Design`);
            
            switch (platform) {
                case 'facebook':
                    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                case 'twitter':
                    return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                case 'linkedin':
                    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                case 'whatsapp':
                    return `https://wa.me/?text=${text}%20${url}`;
                default:
                    return '#';
            }
        },
        async copyUrl() {
            try {
                await navigator.clipboard.writeText(window.location.href);
                // You could add a toast notification here
                alert('Link copied to clipboard!');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = window.location.href;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Link copied to clipboard!');
            }
        },
        handleImageError(event) {
            // Hide the image and show fallback
            event.target.style.display = 'none';
        },
        handleImageLoad(event) {
            // Image loaded successfully
        }
    }
});

app.component('navbar-component', Navbar);
app.component('footer-component', Footer);

app.mount('#app');



