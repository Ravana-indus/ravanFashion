# US3.4: Featured Collections Grid

**Story Points:** 5 **Section:** Homepage Experience **Priority:** High **Status:** Ready

## User Story

As a shopper, I want featured collections displayed so I can quickly browse key products.

## Acceptance Criteria

✅ **Primary Acceptance:** Grid loads selected collection, hover zoom works on images.

### Detailed Acceptance Criteria:

1. **Grid Layout**
   - [ ] Responsive grid adapting to screen sizes (1-4 columns)
   - [ ] Featured collections selectable in Shopify admin
   - [ ] Consistent card design with product images
   - [ ] Clear collection titles and descriptions

2. **Product Display**
   - [ ] High-quality product images with proper aspect ratios
   - [ ] Product names and pricing displayed
   - [ ] Collection-level metadata (item count, category)
   - [ ] Quick view or "Shop Collection" CTAs

3. **Interactive Features**
   - [ ] Hover effects with image zoom
   - [ ] Smooth transitions and animations
   - [ ] Collection cards clickable to collection pages
   - [ ] Loading states for slow connections

4. **Cultural Integration**
   - [ ] Tamil collection names where appropriate
   - [ ] Cultural storytelling elements
   - [ ] Brand-consistent styling
   - [ ] Accessibility for bilingual content

## Design Specifications

### Grid Structure

```
┌─────────────────────────────────────┐
│        Featured Collections        │
│     "எங்கள் சிறப்பு தொகுப்புகள்"      │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ IMG  │ │ IMG  │ │ IMG  │ │ IMG  │ │
│  │      │ │      │ │      │ │      │ │
│  │Title │ │Title │ │Title │ │Title │ │
│  │Desc  │ │Desc  │ │Desc  │ │Desc  │ │
│  │Shop→ │ │Shop→ │ │Shop→ │ │Shop→ │ │
│  └──────┘ └──────┘ └──────┘ └──────┘ │
│                                     │
│             [View All →]            │
└─────────────────────────────────────┘
```

### Card Design

- **Image**: 4:3 aspect ratio, optimized for mobile
- **Content**: Collection name, item count, starting price
- **CTA**: "Shop Collection" button with cultural touch
- **Hover**: Subtle lift and image zoom effect

## Technical Implementation

### Section Structure (sections/featured-collections.liquid)

```liquid
<section class="featured-collections py-16 bg-cream-white">
  <div class="container mx-auto px-4">
    <!-- Section Header -->
    <header class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-charcoal-black mb-4">
        {{ section.settings.heading_english | default: 'Featured Collections' }}
      </h2>
      {% if section.settings.heading_tamil %}
        <p class="text-xl font-tamil text-deep-maroon mb-4">
          {{ section.settings.heading_tamil }}
        </p>
      {% endif %}
      {% if section.settings.description %}
        <p class="text-lg text-muted-teal max-w-2xl mx-auto">
          {{ section.settings.description }}
        </p>
      {% endif %}
    </header>

    <!-- Collections Grid -->
    <div class="collections-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-{{ section.settings.columns_desktop | default: 3 }} gap-8 mb-12">
      {% for block in section.blocks %}
        {% assign collection = collections[block.settings.collection] %}
        {% if collection %}
          <article class="collection-card group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div class="collection-image-wrapper relative overflow-hidden aspect-[4/3]">
              {% if collection.featured_image %}
                <img src="{{ collection.featured_image | img_url: '600x450' }}"
                     alt="{{ collection.title }}"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     loading="lazy">
              {% else %}
                <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span class="text-gray-400">{{ 'collections.no_image' | t }}</span>
                </div>
              {% endif %}

              <!-- Overlay on hover -->
              <div class="absolute inset-0 bg-deep-maroon/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <!-- Quick stats overlay -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-charcoal-black">
                {{ collection.products_count }} {{ 'collections.items' | t }}
              </div>
            </div>

            <div class="collection-content p-6">
              <header class="mb-4">
                <h3 class="text-xl font-bold text-charcoal-black mb-2 group-hover:text-deep-maroon transition-colors">
                  {{ collection.title }}
                </h3>
                {% if block.settings.tamil_name %}
                  <p class="text-lg font-tamil text-deep-maroon mb-2">
                    {{ block.settings.tamil_name }}
                  </p>
                {% endif %}
                {% if collection.description != blank %}
                  <p class="text-muted-teal text-sm line-clamp-2">
                    {{ collection.description | strip_html | truncate: 100 }}
                  </p>
                {% endif %}
              </header>

              <footer class="flex items-center justify-between">
                <div class="price-info">
                  {% assign first_product = collection.products.first %}
                  {% if first_product %}
                    <span class="text-sm text-muted-teal">{{ 'collections.starting_from' | t }}</span>
                    <span class="text-lg font-bold text-charcoal-black">
                      {{ first_product.price | money }}
                    </span>
                  {% endif %}
                </div>

                <a href="{{ collection.url }}"
                   class="btn btn-sm btn-outline group-hover:btn-gold transition-all duration-300">
                  {{ 'collections.shop_collection' | t }}
                  <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </footer>
            </div>
          </article>
        {% endif %}
      {% endfor %}
    </div>

    <!-- View All CTA -->
    {% if section.settings.show_view_all and section.settings.view_all_url %}
      <div class="text-center">
        <a href="{{ section.settings.view_all_url }}"
           class="btn btn-lg btn-gold">
          {{ section.settings.view_all_text | default: 'View All Collections' }}
        </a>
      </div>
    {% endif %}
  </div>
</section>
```

### Enhanced Hover Effects (assets/featured-collections.css)

```css
.collection-card {
  @apply transform-gpu;
  will-change: transform, box-shadow;
}

.collection-card:hover {
  @apply -translate-y-1;
}

.collection-image-wrapper {
  position: relative;
  overflow: hidden;
}

.collection-image-wrapper img {
  @apply transition-transform duration-500 ease-out;
  will-change: transform;
}

.collection-card:hover .collection-image-wrapper img {
  @apply scale-110;
}

/* Loading animation for images */
.collection-image-wrapper::before {
  content: '';
  @apply absolute inset-0 bg-gray-200 animate-pulse;
  z-index: 1;
}

.collection-image-wrapper img[data-loaded='true'] + ::before {
  @apply hidden;
}

/* Cultural accent elements */
.collection-card::after {
  content: '';
  @apply absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-deep-maroon to-gold;
  transform: scaleX(0);
  transition: transform 0.3s ease-out;
}

.collection-card:hover::after {
  transform: scaleX(1);
}
```

### JavaScript Enhancement (assets/featured-collections.js)

```javascript
class FeaturedCollections {
  constructor() {
    this.init();
  }

  init() {
    this.setupImageLoading();
    this.setupAnalytics();
    this.setupIntersectionObserver();
  }

  setupImageLoading() {
    const images = document.querySelectorAll('.collection-card img');

    images.forEach(img => {
      img.addEventListener('load', () => {
        img.setAttribute('data-loaded', 'true');
        img.closest('.collection-image-wrapper').classList.add('loaded');
      });

      // Handle loading errors
      img.addEventListener('error', () => {
        const wrapper = img.closest('.collection-image-wrapper');
        wrapper.innerHTML = `
          <div class="w-full h-full bg-gray-100 flex items-center justify-center">
            <span class="text-gray-400">Image unavailable</span>
          </div>
        `;
      });
    });
  }

  setupAnalytics() {
    const collectionCards = document.querySelectorAll('.collection-card');

    collectionCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        const collectionName = card.querySelector('h3').textContent.trim();

        if (typeof gtag !== 'undefined') {
          gtag('event', 'collection_click', {
            event_category: 'engagement',
            event_label: collectionName,
            collection_position: index + 1,
          });
        }
      });
    });
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );

      document.querySelectorAll('.collection-card').forEach(card => {
        observer.observe(card);
      });
    }
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new FeaturedCollections();
});
```

## Shopify Section Schema

```json
{
  "name": "Featured Collections",
  "tag": "section",
  "class": "featured-collections-section",
  "settings": [
    {
      "type": "text",
      "id": "heading_english",
      "label": "Section Heading (English)",
      "default": "Featured Collections"
    },
    {
      "type": "text",
      "id": "heading_tamil",
      "label": "Section Heading (Tamil)",
      "default": "எங்கள் சிறப்பு தொகுப்புகள்"
    },
    {
      "type": "textarea",
      "id": "description",
      "label": "Section Description"
    },
    {
      "type": "range",
      "id": "columns_desktop",
      "label": "Desktop Columns",
      "min": 2,
      "max": 4,
      "step": 1,
      "default": 3
    },
    {
      "type": "checkbox",
      "id": "show_view_all",
      "label": "Show View All Button",
      "default": true
    },
    {
      "type": "url",
      "id": "view_all_url",
      "label": "View All Collections URL"
    },
    {
      "type": "text",
      "id": "view_all_text",
      "label": "View All Button Text",
      "default": "View All Collections"
    }
  ],
  "blocks": [
    {
      "type": "collection",
      "name": "Featured Collection",
      "settings": [
        {
          "type": "collection",
          "id": "collection",
          "label": "Collection"
        },
        {
          "type": "text",
          "id": "tamil_name",
          "label": "Tamil Collection Name (Optional)",
          "info": "Display name in Tamil script"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Featured Collections",
      "blocks": [
        {
          "type": "collection"
        },
        {
          "type": "collection"
        },
        {
          "type": "collection"
        }
      ]
    }
  ]
}
```

## Localization Support

```json
// locales/en.default.json
{
  "collections": {
    "items": "items",
    "starting_from": "Starting from",
    "shop_collection": "Shop Collection",
    "no_image": "No image available",
    "view_all": "View All Collections"
  }
}

// locales/ta.json
{
  "collections": {
    "items": "பொருட்கள்",
    "starting_from": "தொடக்க விலை",
    "shop_collection": "தொகுப்பை வாங்கவும்",
    "no_image": "படம் கிடைக்கவில்லை",
    "view_all": "அனைத்து தொகுப்புகளையும் பார்க்கவும்"
  }
}
```

## Definition of Done

- [ ] Grid displays selected collections responsively
- [ ] Hover effects working smoothly
- [ ] Product images load with proper optimization
- [ ] Collection links navigate correctly
- [ ] Tamil content displays properly
- [ ] Performance impact minimal
- [ ] Cross-browser compatibility verified
- [ ] Analytics tracking implemented

## Dependencies

- US1.2: Tailwind CSS configuration
- Shopify collections created and configured
- Product images optimized and uploaded
- Tamil translations prepared

## Files Created/Modified

- `sections/featured-collections.liquid`
- `assets/featured-collections.css`
- `assets/featured-collections.js`
- `locales/en.default.json` (collections keys)
- `locales/ta.json` (Tamil translations)

## Performance Optimization

- [ ] Image lazy loading implemented
- [ ] WebP format with fallbacks
- [ ] Critical CSS inlined
- [ ] JavaScript code splitting
- [ ] Intersection Observer for animations

## Accessibility Requirements

- [ ] Proper heading hierarchy
- [ ] Alt text for all images
- [ ] Keyboard navigation support
- [ ] Screen reader friendly content
- [ ] Focus management for cards

## Testing Checklist

- [ ] Grid responsive on all devices
- [ ] Hover effects smooth and consistent
- [ ] Collection links functional
- [ ] Images load and display correctly
- [ ] Tamil text renders properly
- [ ] Performance metrics acceptable
- [ ] Analytics events firing

## Estimate Breakdown

- Section markup and responsive grid: 2 hours
- Hover effects and animations: 1.5 hours
- JavaScript enhancements: 1 hour
- Testing and optimization: 30 min
- **Total: 5 story points**
