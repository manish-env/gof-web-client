# Genre of Design Web Client - Project Structure

## 📁 **Reorganized Project Structure**

The `gof-web-client` project has been successfully reorganized into a modern, scalable structure following best practices for frontend development.

### **Root Directory**
```
gof-web-client/
├── 📄 index.html              # Main entry point (Projects page)
├── 📄 README.md               # Project documentation
├── 📄 .htaccess              # Apache configuration
└── 📁 [Organized Directories]
```

### **📁 pages/** - HTML Pages
All HTML pages are now organized in a dedicated directory:
```
pages/
├── about.html                 # About page
├── blog.html                  # Single blog post
├── blogs.html                 # Blog listing
├── careers.html               # Careers page
├── contact.html               # Contact page
├── landing-page.html          # Single landing page (discover more)
├── landing-pages.html         # Landing pages listing
└── projects.html              # Projects page
```

### **📁 src/** - Source Code
The main source code is organized into logical subdirectories:

#### **📁 src/js/** - JavaScript Files
```
src/js/
├── app.js                     # Main application file
├── 📁 components/             # Reusable Vue components
│   ├── Footer.js
│   ├── ImageTile.js
│   ├── Logo.js
│   ├── Navbar.js
│   ├── PageTemplate.js
│   └── WhatsApp.js
├── 📁 pages/                  # Page-specific JavaScript
│   ├── about.js
│   ├── blogs.js
│   ├── blogSingle.js
│   ├── careers.js
│   ├── contact.js
│   ├── landing-page-single.js
│   ├── landing-pages.js
│   └── projects.js
├── 📁 data/                   # Static data files
│   └── blogData.js
├── 📁 services/               # API services (future)
└── 📁 utils/                  # Utility functions (future)
```

#### **📁 src/css/** - Stylesheets
```
src/css/
├── styles.css                 # Main stylesheet
├── 📁 components/             # Component-specific styles (future)
├── 📁 pages/                  # Page-specific styles (future)
└── 📁 utils/                  # Utility styles (future)
```

#### **📁 src/assets/** - Static Assets
```
src/assets/
├── 📁 icons/                  # Icon files (future)
└── 📁 images/                 # Image assets
    ├── 📁 clients/            # Client logos (future)
    ├── 📁 features/           # Feature images (future)
    ├── 📁 projects/           # Project images (future)
    └── 📁 team/               # Team photos (future)
```

### **📁 public/** - Public Assets
Legacy assets remain in the public directory for backward compatibility:
```
public/
├── 📁 Client logos/           # Client logo images
├── 📁 features/               # Feature PDFs and images
└── 📁 images/                 # General images
    └── 📁 projects/           # Project images
```

### **📁 scripts/** - Utility Scripts
Development and utility scripts:
```
scripts/
├── clean-urls.js              # URL cleaning utility
├── debug-images.html          # Image debugging tool
├── generate-apex-images.html  # Image generation tool
├── generate-landing-pages.js  # Landing page generator
├── landing-page-redirect.js   # Redirect utility
├── landing-page-router.js     # Router utility
├── test-api.html              # API testing tool
└── test-images.html           # Image testing tool
```

### **📁 docs/** - Documentation
```
docs/
└── LANDING_PAGES_README.md    # Landing pages documentation
```

## 🎯 **Benefits of New Structure**

### **1. Improved Organization**
- **Clear separation** of concerns
- **Logical grouping** of related files
- **Easy navigation** and maintenance

### **2. Scalability**
- **Modular architecture** for easy expansion
- **Component-based** structure
- **Service layer** ready for API integration

### **3. Developer Experience**
- **Intuitive file locations**
- **Consistent naming conventions**
- **Future-ready** for build tools

### **4. Maintenance**
- **Easier debugging** with organized structure
- **Simplified updates** and modifications
- **Better code reusability**

## 🔄 **Migration Notes**

### **File Path Updates Needed**
The following files need their import paths updated to reflect the new structure:

1. **HTML files** in `pages/` directory need to update:
   - JavaScript imports: `js/` → `src/js/`
   - CSS imports: `styles.css` → `src/css/styles.css`

2. **JavaScript files** need to update:
   - Component imports
   - Asset paths
   - API endpoints

### **Next Steps**
1. Update all file references in HTML and JS files
2. Split CSS into modular files
3. Move images from `public/` to `src/assets/`
4. Create service layer for API calls
5. Add build tools for optimization

## 📋 **File Reference Updates Required**

| File Type | Old Path | New Path |
|-----------|----------|----------|
| JavaScript | `js/app.js` | `src/js/app.js` |
| Components | `js/components/` | `src/js/components/` |
| Page Scripts | `js/pages/` | `src/js/pages/` |
| Styles | `styles.css` | `src/css/styles.css` |
| Data | `js/blogData.js` | `src/js/data/blogData.js` |

This reorganization provides a solid foundation for future development and maintenance of the Genre of Design web client.
