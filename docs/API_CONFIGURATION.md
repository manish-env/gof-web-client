# API Configuration Documentation

## Overview
The API configuration system provides a centralized way to manage all API endpoints and settings across the Genre of Design web client application.

## File Location
```
src/js/config/api.js
```

## Configuration Structure

### API_CONFIG Object
Contains the main configuration settings:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://god-worker.restless-mountain-f968.workers.dev/api',
    VERSION: 'v1',
    TIMEOUT: 10000, // 10 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1 second
};
```

### API_ENDPOINTS Object
Contains all available API endpoints organized by feature:

```javascript
const API_ENDPOINTS = {
    LANDING_PAGES: {
        LIST: '/landing-pages',
        SINGLE: (slug) => `/landing-pages/${encodeURIComponent(slug)}`,
        CREATE: '/landing-pages',
        UPDATE: (id) => `/landing-pages/${id}`,
        DELETE: (id) => `/landing-pages/${id}`
    },
    PROJECTS: {
        LIST: '/projects',
        SINGLE: (id) => `/projects/${id}`,
        CREATE: '/projects',
        UPDATE: (id) => `/projects/${id}`,
        DELETE: (id) => `/projects/${id}`
    },
    // ... more endpoints
};
```

## Usage

### In HTML Files
Include the API configuration script before any other JavaScript files:

```html
<!-- API Configuration -->
<script src="src/js/config/api.js"></script>

<!-- Your other scripts -->
<script src="src/js/pages/your-page.js"></script>
```

### In JavaScript Files
Use the global variables and helper functions:

```javascript
// Get the base URL
const baseUrl = API_CONFIG.BASE_URL;

// Build a full API URL
const fullUrl = buildApiUrl('/projects');

// Use predefined endpoints
const projectsUrl = buildApiUrl(API_ENDPOINTS.PROJECTS.LIST);
const singleProjectUrl = buildApiUrl(API_ENDPOINTS.PROJECTS.SINGLE(123));
```

## Helper Functions

### buildApiUrl(endpoint)
Builds a complete API URL by combining the base URL with the endpoint.

```javascript
const url = buildApiUrl('/projects');
// Returns: 'https://god-worker.restless-mountain-f968.workers.dev/api/projects'
```

### getApiConfig()
Returns the complete API configuration object.

```javascript
const config = getApiConfig();
console.log(config.BASE_URL); // 'https://god-worker.restless-mountain-f968.workers.dev/api'
```

### getApiEndpoints()
Returns the complete API endpoints object.

```javascript
const endpoints = getApiEndpoints();
console.log(endpoints.PROJECTS.LIST); // '/projects'
```

## Available Endpoints

### Landing Pages
- `LIST`: Get all landing pages
- `SINGLE(slug)`: Get single landing page by slug
- `CREATE`: Create new landing page
- `UPDATE(id)`: Update landing page by ID
- `DELETE(id)`: Delete landing page by ID

### Projects
- `LIST`: Get all projects
- `SINGLE(id)`: Get single project by ID
- `CREATE`: Create new project
- `UPDATE(id)`: Update project by ID
- `DELETE(id)`: Delete project by ID

### Blogs
- `LIST`: Get all blogs
- `SINGLE(id)`: Get single blog by ID
- `CREATE`: Create new blog
- `UPDATE(id)`: Update blog by ID
- `DELETE(id)`: Delete blog by ID

### Leads/Contact
- `LIST`: Get all leads
- `CREATE`: Create new lead
- `UPDATE(id)`: Update lead by ID
- `DELETE(id)`: Delete lead by ID

### Contact Forms
- `SUBMIT`: Submit contact form
- `INQUIRY`: Submit inquiry form

### Settings
- `GET`: Get site settings
- `UPDATE`: Update site settings

## Environment Configuration

The configuration automatically detects the environment and adjusts URLs accordingly:

- **Production**: Uses the configured base URL
- **Development**: Can be overridden by setting `window.API_CONFIG` before loading the script

## Benefits

1. **Centralized Management**: All API endpoints in one place
2. **Easy Updates**: Change URLs in one file to update everywhere
3. **Type Safety**: Consistent endpoint structure
4. **Maintainability**: Clear organization and documentation
5. **Flexibility**: Easy to add new endpoints or modify existing ones

## Migration from Hardcoded URLs

All JavaScript files have been updated to use the common API configuration:

- ✅ `landing-pages.js`
- ✅ `landing-page-single.js`
- ✅ `projects.js`
- ✅ `blogs.js`
- ✅ `blogSingle.js`
- ✅ `contact.js`
- ✅ `careers.js`

## Future Enhancements

1. **Environment Variables**: Support for different environments (dev, staging, prod)
2. **Authentication**: Add authentication headers and token management
3. **Caching**: Implement API response caching
4. **Error Handling**: Centralized error handling for API calls
5. **Logging**: API call logging and monitoring
