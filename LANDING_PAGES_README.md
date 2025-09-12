# Landing Pages System

This system provides dynamic landing pages for marketing campaigns, allowing you to create targeted pages for different project types and ad campaigns.

## Features

- **Dynamic Landing Pages**: Create multiple landing pages with different content and forms
- **Slug-based URLs**: Each landing page has a unique URL using slugs (e.g., `/landing-page.html?slug=hospitality-architecture`)
- **Category Filtering**: Organize landing pages by categories (Hospitality, Residential, Commercial, etc.)
- **Search Functionality**: Search through landing pages by title, description, or tags
- **Lead Generation Forms**: Each landing page includes a customized contact form
- **Responsive Design**: Mobile-friendly design using Tailwind CSS

## File Structure

```
client/
├── landing-pages.html          # Landing pages listing page
├── landing-page.html           # Single landing page template
└── js/
    ├── landing-pages.js        # JavaScript for listing page
    └── landing-page-single.js  # JavaScript for single page
```

## Backend API

The system uses the following API endpoints:

- `GET /api/landing-pages` - List all landing pages
- `GET /api/landing-pages/{slug}` - Get specific landing page by slug

## Landing Page Structure

Each landing page includes:

### Above the Fold
- Hero image/background
- Main headline and subheadline
- Call-to-action button
- Featured projects showcase

### Below the Fold
- Services list
- Benefits/features
- Client testimonials
- Contact form

### Form Fields
Each landing page can have customized form fields including:
- Text inputs (name, email, phone)
- Select dropdowns (property type, budget, timeline)
- Textarea (project details, preferences)
- Number inputs (area, project size)

## Usage

1. **View All Landing Pages**: Navigate to `/landing-pages.html`
2. **View Single Landing Page**: Navigate to `/landing-page.html?slug={page-slug}`
3. **Filter by Category**: Use the category dropdown on the listing page
4. **Search**: Use the search box to find specific landing pages

## Adding New Landing Pages

To add new landing pages, update the `memory.landingPages` array in `/worker/src/services/store.js` with the following structure:

```javascript
{
  id: "unique-id",
  title: "Page Title",
  slug: "page-slug",
  description: "Page description",
  category: "Category Name",
  heroImage: "path/to/image.jpg",
  aboveFold: {
    headline: "Main Headline",
    subheadline: "Subheadline text",
    ctaText: "Button Text",
    featuredProjects: [...]
  },
  belowFold: {
    services: [...],
    benefits: [...],
    testimonials: [...]
  },
  form: {
    title: "Form Title",
    fields: [...]
  },
  tags: ["tag1", "tag2"],
  published: true,
  createdAt: "2025-01-27T00:00:00.000Z"
}
```

## Example Landing Pages

The system comes with two example landing pages:

1. **Hospitality Architecture** (`/landing-page.html?slug=hospitality-architecture`)
   - Focused on hotel, restaurant, and hospitality design
   - Customized form for hospitality projects

2. **Residential Design** (`/landing-page.html?slug=residential-design`)
   - Focused on home and apartment design
   - Customized form for residential projects

## Navigation

The landing pages are accessible through the main navigation menu under "Landing Pages".
