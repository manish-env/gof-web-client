# Genre of Design - Frontend (Vue.js)

This is the frontend application for Genre of Design built with Vue.js 3 and Tailwind CSS.

## Features

- **Vue.js 3**: Modern reactive framework with Composition API
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Component-based Architecture**: Modular and reusable components
- **State Management**: Simple Vuex-like store for state management
- **Routing**: Vue Router for single-page application navigation
- **API Integration**: Axios for HTTP requests to backend API
- **Animations**: Smooth transitions and hover effects
- **Icons**: Lucide React icons for consistent iconography

## Project Structure

```
god-mvc-client/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── js/
│   └── app.js          # Vue.js application and components
└── README.md           # This file
```

## Components

### Main App
- **Navigation**: Responsive navigation bar with mobile menu
- **Router View**: Dynamic content based on current route
- **Footer**: Company information and links
- **WhatsApp Button**: Floating contact button

### Pages
- **Home Page**: Hero section, featured projects, services
- **Projects Page**: Portfolio grid with category filtering
- **About Page**: Company information (placeholder)
- **Careers Page**: Job listings (placeholder)
- **Contact Page**: Contact form (placeholder)
- **Login Page**: Authentication form (placeholder)
- **Dashboard Page**: Admin panel (placeholder)

## Features

### Portfolio Display
- **Masonry Grid**: Responsive grid layout for projects
- **Category Filtering**: Filter projects by type
- **Image Optimization**: Responsive images with lazy loading
- **Project Details**: Hover effects and metadata display

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Responsive design for all screen sizes
- **Touch-friendly**: Mobile navigation and interactions
- **Performance**: Optimized loading and animations

### State Management
- **Authentication**: User login/logout state
- **Projects**: Project data and loading states
- **Jobs**: Job listings and applications
- **Error Handling**: Centralized error management

## API Integration

The frontend communicates with the backend API through the `apiService`:

```javascript
// Example API calls
await apiService.getProjects();
await apiService.login(credentials);
await apiService.sendMessage(messageData);
```

### API Endpoints Used
- `GET /api/projects` - Fetch projects
- `GET /api/projects/types` - Fetch project types
- `GET /api/jobs` - Fetch job listings
- `POST /api/auth/login` - User login
- `POST /api/contact/send` - Send contact message

## Styling

### Tailwind CSS Classes
- **Utility Classes**: Extensive use of Tailwind utilities
- **Custom Components**: Reusable component styles
- **Responsive Design**: Mobile-first responsive classes
- **Animations**: Smooth transitions and hover effects

### Custom CSS
- **Component Styles**: Custom styles for complex components
- **Animations**: Keyframe animations for smooth transitions
- **Layout**: Masonry grid and responsive layouts
- **Typography**: Custom font styling and spacing

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **ES6+ Features**: Arrow functions, destructuring, async/await
- **CSS Grid**: Modern CSS layout features
- **Flexbox**: Flexible layout system

## Development

### Local Development
1. Serve the files using any static file server:
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

2. Open `http://localhost:8080` in your browser

### Configuration
Update the API base URL in `js/app.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## Production Deployment

### Static Hosting
Deploy the static files to any static hosting service:
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for public repositories
- **AWS S3**: Scalable cloud storage
- **Cloudflare Pages**: Global CDN distribution

### Configuration
1. Update API_BASE_URL to production backend URL
2. Ensure CORS is configured on backend
3. Test all functionality in production environment

## Performance

### Optimization
- **CDN Resources**: All external libraries loaded via CDN
- **Lazy Loading**: Images loaded on demand
- **Minification**: CSS and JS minified for production
- **Caching**: Proper cache headers for static assets

### Bundle Size
- **Vue.js**: ~34KB gzipped
- **Tailwind CSS**: ~10KB gzipped (used classes only)
- **Custom CSS**: ~5KB gzipped
- **Total**: ~50KB gzipped

## Accessibility

### Features
- **Semantic HTML**: Proper HTML structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG compliant color schemes

## Browser Compatibility

### Supported Browsers
- **Chrome**: 60+
- **Firefox**: 60+
- **Safari**: 12+
- **Edge**: 79+

### Required Features
- **ES6 Modules**: Modern JavaScript module system
- **CSS Grid**: Modern CSS layout
- **Fetch API**: Modern HTTP client
- **Promise**: Asynchronous programming

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS is configured
2. **API Connection**: Check API_BASE_URL configuration
3. **File Loading**: Ensure all files are served correctly
4. **Browser Console**: Check for JavaScript errors

### Debug Mode
Enable debug logging by opening browser console and checking for:
- Network requests to API
- JavaScript errors
- Console warnings
- Performance issues

## Future Enhancements

### Planned Features
- **PWA Support**: Progressive Web App capabilities
- **Offline Support**: Service worker for offline functionality
- **Dark Mode**: Theme switching capability
- **Advanced Filtering**: More sophisticated project filtering
- **Image Gallery**: Lightbox for project images
- **Search**: Full-text search functionality
- **Pagination**: Load more projects on demand

### Performance Improvements
- **Code Splitting**: Lazy load components
- **Image Optimization**: WebP format support
- **Caching**: Advanced caching strategies
- **Bundle Optimization**: Tree shaking and minification
