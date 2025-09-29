# US4.1: Collection Filter/Sort

**Story Points:** 5 **Section:** Collection & Product Pages **Priority:** High **Status:** Ready

## User Story

As a shopper, I want to filter/sort a collection so I can find products faster.

## Acceptance Criteria

✅ **Primary Acceptance:** Filter/sort updates PLP without full reload, results accurate.

### Detailed Acceptance Criteria:

1. **Filter Options**
   - [ ] Price range slider with Tamil-friendly formatting
   - [ ] Size filters (XS, S, M, L, XL, XXL)
   - [ ] Color filters with visual swatches
   - [ ] Product type/category filters
   - [ ] Cultural design theme filters

2. **Sort Options**
   - [ ] Featured (default)
   - [ ] Price: Low to High / High to Low
   - [ ] Newest arrivals / Oldest first
   - [ ] Best selling
   - [ ] Customer reviews (highest rated)

3. **User Experience**
   - [ ] AJAX updates without page reload
   - [ ] Filter/sort state reflected in URL
   - [ ] Clear all filters functionality
   - [ ] Active filter indicators
   - [ ] Results count display

4. **Cultural Integration**
   - [ ] Tamil number formatting where applicable
   - [ ] Cultural design category filters
   - [ ] Bilingual filter labels
   - [ ] Heritage collection highlighting

## Design Specifications

### Collection Page Layout

```
┌─────────────────────────────────────┐
│  Collection: Tamil Heritage Tees    │
│                                     │
│  ┌─────────────┐  ┌─────────────────┐ │
│  │ FILTERS     │  │ SORT BY: ▼      │ │
│  │ Price       │  │ Featured        │ │
│  │ [$--$]      │  └─────────────────┘ │
│  │             │                     │ │
│  │ Size        │  ████ Products (24) │ │
│  │ ☐S ☐M ☐L   │                     │ │
│  │             │  ┌───┐ ┌───┐ ┌───┐ │ │
│  │ Color       │  │   │ │   │ │   │ │ │
│  │ ●●●●●       │  │ $ │ │ $ │ │ $ │ │ │
│  │             │  └───┘ └───┘ └───┘ │ │
│  │ Design      │                     │ │
│  │ ☐Kolam      │  ┌───┐ ┌───┐ ┌───┐ │ │
│  │ ☐Heritage   │  │   │ │   │ │   │ │ │
│  │             │  │ $ │ │ $ │ │ $ │ │ │
│  │ [Clear All] │  └───┘ └───┘ └───┘ │ │
│  └─────────────┘                     │ │
└─────────────────────────────────────┘
```

### Mobile Responsive

- **Mobile**: Filters in collapsible drawer
- **Tablet**: Sidebar filters + grid
- **Desktop**: Full sidebar + multi-column grid

## Technical Implementation

### Collection Template (templates/collection.liquid)

```liquid
<!-- Collection Header -->
<div class="collection-header bg-cream-white py-8">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-charcoal-black">
          {{ collection.title }}
        </h1>
        {% if collection.description %}
          <p class="text-lg text-muted-teal mt-2">
            {{ collection.description | strip_html | truncate: 200 }}
          </p>
        {% endif %}
      </div>

      <!-- Mobile Filter Toggle -->
      <button class="md:hidden btn btn-outline" id="mobile-filter-toggle">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
        </svg>
        {{ 'collection.filters' | t }}
      </button>
    </div>
  </div>
</div>

<!-- Collection Content -->
<div class="collection-content py-8">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row gap-8">

      <!-- Filters Sidebar -->
      <aside class="collection-filters w-full md:w-64 flex-shrink-0">
        <div id="filter-sidebar"
             class="filters-container bg-white rounded-lg shadow-sm p-6 sticky top-24
                    md:block hidden">

          <!-- Filter Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-charcoal-black">
              {{ 'collection.filters' | t }}
            </h3>
            <button id="clear-all-filters"
                    class="text-sm text-muted-teal hover:text-deep-maroon transition-colors">
              {{ 'collection.clear_all' | t }}
            </button>
          </div>

          <!-- Price Filter -->
          <div class="filter-group mb-6">
            <h4 class="filter-title font-medium text-charcoal-black mb-3">
              {{ 'collection.price' | t }}
              <span class="font-tamil text-deep-maroon ml-2">(விலை)</span>
            </h4>

            <div class="price-filter">
              <div class="price-range-slider mb-3">
                <input type="range"
                       id="price-min"
                       class="price-input"
                       min="0"
                       max="200"
                       value="0"
                       data-currency="{{ shop.currency }}">

                <input type="range"
                       id="price-max"
                       class="price-input"
                       min="0"
                       max="200"
                       value="200"
                       data-currency="{{ shop.currency }}">
              </div>

              <div class="price-display flex items-center justify-between text-sm">
                <span id="price-min-display">{{ 0 | money }}</span>
                <span class="text-muted-teal">to</span>
                <span id="price-max-display">{{ 200 | money }}</span>
              </div>
            </div>
          </div>

          <!-- Size Filter -->
          <div class="filter-group mb-6">
            <h4 class="filter-title font-medium text-charcoal-black mb-3">
              {{ 'collection.size' | t }}
              <span class="font-tamil text-deep-maroon ml-2">(அளவு)</span>
            </h4>

            <div class="size-options grid grid-cols-3 gap-2">
              {% assign available_sizes = collection.products | map: 'variants' | join: ',' | split: ',' | map: 'option1' | uniq %}
              {% for size in available_sizes %}
                {% unless size == blank %}
                  <label class="size-filter-option">
                    <input type="checkbox"
                           name="size"
                           value="{{ size | handle }}"
                           class="sr-only size-checkbox">
                    <span class="size-label block text-center py-2 px-3 border border-gray-300 rounded cursor-pointer hover:border-deep-maroon transition-colors">
                      {{ size }}
                    </span>
                  </label>
                {% endunless %}
              {% endfor %}
            </div>
          </div>

          <!-- Color Filter -->
          <div class="filter-group mb-6">
            <h4 class="filter-title font-medium text-charcoal-black mb-3">
              {{ 'collection.color' | t }}
              <span class="font-tamil text-deep-maroon ml-2">(நிறம்)</span>
            </h4>

            <div class="color-options flex flex-wrap gap-3">
              {% assign available_colors = collection.products | map: 'variants' | join: ',' | split: ',' | map: 'option2' | uniq %}
              {% for color in available_colors %}
                {% unless color == blank %}
                  <label class="color-filter-option">
                    <input type="checkbox"
                           name="color"
                           value="{{ color | handle }}"
                           class="sr-only color-checkbox">
                    <span class="color-swatch w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer transition-all hover:scale-110"
                          style="background-color: {{ settings[color | handle] | default: '#ccc' }}"
                          title="{{ color }}"></span>
                  </label>
                {% endunless %}
              {% endfor %}
            </div>
          </div>

          <!-- Cultural Design Filter -->
          <div class="filter-group mb-6">
            <h4 class="filter-title font-medium text-charcoal-black mb-3">
              {{ 'collection.design_theme' | t }}
              <span class="font-tamil text-deep-maroon ml-2">(வடிவமைப்பு)</span>
            </h4>

            <div class="design-options space-y-2">
              {% assign cultural_tags = 'kolam,heritage,traditional,modern,fusion' | split: ',' %}
              {% for tag in cultural_tags %}
                <label class="design-filter-option flex items-center">
                  <input type="checkbox"
                         name="design"
                         value="{{ tag }}"
                         class="design-checkbox mr-3 rounded border-gray-300">
                  <span class="text-sm">{{ 'collection.design.' | append: tag | t }}</span>
                </label>
              {% endfor %}
            </div>
          </div>

          <!-- Active Filters Display -->
          <div id="active-filters" class="active-filters hidden">
            <h4 class="font-medium text-charcoal-black mb-3">{{ 'collection.active_filters' | t }}</h4>
            <div class="filter-tags flex flex-wrap gap-2"></div>
          </div>
        </div>
      </aside>

      <!-- Product Grid -->
      <main class="collection-products flex-1">
        <!-- Sort and Results Header -->
        <div class="collection-header flex items-center justify-between mb-6">
          <div class="results-count">
            <span id="products-count" class="text-lg font-medium text-charcoal-black">
              {{ collection.products_count }} {{ 'collection.products' | t }}
            </span>
          </div>

          <div class="sort-options">
            <label for="sort-select" class="sr-only">{{ 'collection.sort_by' | t }}</label>
            <select id="sort-select"
                    class="sort-select bg-white border border-gray-300 rounded-lg px-4 py-2 focus:border-deep-maroon focus:outline-none">
              <option value="manual">{{ 'collection.sort.featured' | t }}</option>
              <option value="price-ascending">{{ 'collection.sort.price_low_high' | t }}</option>
              <option value="price-descending">{{ 'collection.sort.price_high_low' | t }}</option>
              <option value="created-descending">{{ 'collection.sort.date_new_old' | t }}</option>
              <option value="created-ascending">{{ 'collection.sort.date_old_new' | t }}</option>
              <option value="best-selling">{{ 'collection.sort.best_selling' | t }}</option>
            </select>
          </div>
        </div>

        <!-- Product Grid -->
        <div id="product-grid"
             class="products-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {% paginate collection.products by 24 %}
            {% for product in collection.products %}
              {% render 'product-card', product: product %}
            {% endfor %}

            <!-- Pagination -->
            {% if paginate.pages > 1 %}
              <div class="pagination col-span-full flex justify-center mt-8">
                {% render 'pagination', paginate: paginate %}
              </div>
            {% endif %}
          {% endpaginate %}
        </div>

        <!-- Loading State -->
        <div id="loading-overlay" class="hidden fixed inset-0 bg-white/75 flex items-center justify-center z-50">
          <div class="text-center">
            <svg class="animate-spin h-8 w-8 text-deep-maroon mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-charcoal-black">{{ 'collection.loading' | t }}</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</div>

<!-- Mobile Filter Modal -->
<div id="mobile-filter-modal" class="md:hidden fixed inset-0 bg-black/50 z-50 hidden">
  <div class="mobile-filter-content bg-white h-full w-full max-w-sm ml-auto overflow-y-auto">
    <div class="filter-header flex items-center justify-between p-4 border-b">
      <h3 class="text-lg font-bold">{{ 'collection.filters' | t }}</h3>
      <button id="close-mobile-filters" class="text-gray-500 hover:text-charcoal-black">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <div class="filter-content p-4">
      <!-- Same filter content as desktop sidebar -->
    </div>

    <div class="filter-footer p-4 border-t">
      <button class="btn btn-gold w-full" id="apply-mobile-filters">
        {{ 'collection.apply_filters' | t }}
      </button>
    </div>
  </div>
</div>
```

### JavaScript Filter/Sort Logic (assets/collection-filters.js)

```javascript
class CollectionFilters {
  constructor() {
    this.currentUrl = new URL(window.location);
    this.isLoading = false;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadFiltersFromURL();
    this.setupPriceSlider();
  }

  setupEventListeners() {
    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', e => this.handleSort(e.target.value));
    }

    // Filter checkboxes
    document.addEventListener('change', e => {
      if (e.target.matches('.size-checkbox, .color-checkbox, .design-checkbox')) {
        this.handleFilterChange();
      }
    });

    // Price range inputs
    const priceInputs = document.querySelectorAll('.price-input');
    priceInputs.forEach(input => {
      input.addEventListener(
        'input',
        debounce(() => this.handlePriceChange(), 500)
      );
    });

    // Clear all filters
    const clearAllBtn = document.getElementById('clear-all-filters');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => this.clearAllFilters());
    }

    // Mobile filter controls
    this.setupMobileFilters();
  }

  setupMobileFilters() {
    const mobileToggle = document.getElementById('mobile-filter-toggle');
    const mobileModal = document.getElementById('mobile-filter-modal');
    const closeMobileBtn = document.getElementById('close-mobile-filters');
    const applyMobileBtn = document.getElementById('apply-mobile-filters');

    if (mobileToggle && mobileModal) {
      mobileToggle.addEventListener('click', () => {
        mobileModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeMobileBtn) {
      closeMobileBtn.addEventListener('click', () => this.closeMobileFilters());
    }

    if (applyMobileBtn) {
      applyMobileBtn.addEventListener('click', () => this.closeMobileFilters());
    }
  }

  closeMobileFilters() {
    const mobileModal = document.getElementById('mobile-filter-modal');
    if (mobileModal) {
      mobileModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  setupPriceSlider() {
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    const minDisplay = document.getElementById('price-min-display');
    const maxDisplay = document.getElementById('price-max-display');

    if (minSlider && maxSlider) {
      const updatePriceDisplay = () => {
        const minValue = parseInt(minSlider.value);
        const maxValue = parseInt(maxSlider.value);

        // Ensure min doesn't exceed max
        if (minValue >= maxValue) {
          minSlider.value = maxValue - 1;
        }

        if (minDisplay) minDisplay.textContent = this.formatMoney(minSlider.value * 100);
        if (maxDisplay) maxDisplay.textContent = this.formatMoney(maxSlider.value * 100);
      };

      minSlider.addEventListener('input', updatePriceDisplay);
      maxSlider.addEventListener('input', updatePriceDisplay);

      updatePriceDisplay();
    }
  }

  handleSort(sortValue) {
    this.currentUrl.searchParams.set('sort_by', sortValue);
    this.updateCollection();
  }

  handleFilterChange() {
    // Collect all active filters
    const filters = this.getActiveFilters();

    // Update URL parameters
    Object.keys(filters).forEach(key => {
      if (filters[key].length > 0) {
        this.currentUrl.searchParams.set(key, filters[key].join(','));
      } else {
        this.currentUrl.searchParams.delete(key);
      }
    });

    this.updateCollection();
  }

  handlePriceChange() {
    const minPrice = document.getElementById('price-min').value;
    const maxPrice = document.getElementById('price-max').value;

    if (minPrice > 0 || maxPrice < 200) {
      this.currentUrl.searchParams.set('price', `${minPrice}-${maxPrice}`);
    } else {
      this.currentUrl.searchParams.delete('price');
    }

    this.updateCollection();
  }

  getActiveFilters() {
    const filters = {
      size: [],
      color: [],
      design: [],
    };

    // Size filters
    document.querySelectorAll('.size-checkbox:checked').forEach(checkbox => {
      filters.size.push(checkbox.value);
    });

    // Color filters
    document.querySelectorAll('.color-checkbox:checked').forEach(checkbox => {
      filters.color.push(checkbox.value);
    });

    // Design filters
    document.querySelectorAll('.design-checkbox:checked').forEach(checkbox => {
      filters.design.push(checkbox.value);
    });

    return filters;
  }

  async updateCollection() {
    if (this.isLoading) return;

    this.showLoading();
    this.isLoading = true;

    try {
      const response = await fetch(
        `${this.currentUrl.pathname}?${this.currentUrl.searchParams}&view=ajax`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch filtered results');
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Update product grid
      const newProductGrid = doc.getElementById('product-grid');
      if (newProductGrid) {
        document.getElementById('product-grid').innerHTML = newProductGrid.innerHTML;
      }

      // Update product count
      const newProductsCount = doc.getElementById('products-count');
      if (newProductsCount) {
        document.getElementById('products-count').textContent = newProductsCount.textContent;
      }

      // Update URL without reload
      window.history.replaceState({}, '', this.currentUrl);

      // Update active filters display
      this.updateActiveFiltersDisplay();

      // Analytics
      this.trackFilterUsage();
    } catch (error) {
      console.error('Filter update failed:', error);
      this.showError();
    } finally {
      this.hideLoading();
      this.isLoading = false;
    }
  }

  updateActiveFiltersDisplay() {
    const activeFiltersContainer = document.getElementById('active-filters');
    const filterTagsContainer = activeFiltersContainer?.querySelector('.filter-tags');

    if (!activeFiltersContainer || !filterTagsContainer) return;

    const activeFilters = this.getActiveFilters();
    const tags = [];

    // Add filter tags
    Object.keys(activeFilters).forEach(filterType => {
      activeFilters[filterType].forEach(value => {
        tags.push({
          type: filterType,
          value: value,
          display: this.getFilterDisplayName(filterType, value),
        });
      });
    });

    // Add price range if set
    const priceParam = this.currentUrl.searchParams.get('price');
    if (priceParam) {
      tags.push({ type: 'price', value: priceParam, display: `Price: ${priceParam}` });
    }

    if (tags.length > 0) {
      activeFiltersContainer.classList.remove('hidden');
      filterTagsContainer.innerHTML = tags
        .map(
          tag => `
        <span class="filter-tag bg-deep-maroon text-cream-white px-3 py-1 rounded-full text-sm flex items-center">
          ${tag.display}
          <button class="ml-2 hover:text-gray-300" onclick="removeFilter('${tag.type}', '${tag.value}')">×</button>
        </span>
      `
        )
        .join('');
    } else {
      activeFiltersContainer.classList.add('hidden');
    }
  }

  getFilterDisplayName(type, value) {
    const displayNames = {
      size: value.toUpperCase(),
      color: value.charAt(0).toUpperCase() + value.slice(1),
      design: value.charAt(0).toUpperCase() + value.slice(1),
    };

    return displayNames[type] || value;
  }

  clearAllFilters() {
    // Clear all checkboxes
    document
      .querySelectorAll('.size-checkbox, .color-checkbox, .design-checkbox')
      .forEach(checkbox => {
        checkbox.checked = false;
      });

    // Reset price sliders
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    if (minSlider) minSlider.value = 0;
    if (maxSlider) maxSlider.value = 200;

    // Clear URL parameters
    this.currentUrl.search = '';

    this.updateCollection();
  }

  loadFiltersFromURL() {
    // Load filters from URL parameters on page load
    const params = this.currentUrl.searchParams;

    // Load size filters
    const sizeFilters = params.get('size')?.split(',') || [];
    sizeFilters.forEach(size => {
      const checkbox = document.querySelector(`.size-checkbox[value="${size}"]`);
      if (checkbox) checkbox.checked = true;
    });

    // Load color filters
    const colorFilters = params.get('color')?.split(',') || [];
    colorFilters.forEach(color => {
      const checkbox = document.querySelector(`.color-checkbox[value="${color}"]`);
      if (checkbox) checkbox.checked = true;
    });

    // Load design filters
    const designFilters = params.get('design')?.split(',') || [];
    designFilters.forEach(design => {
      const checkbox = document.querySelector(`.design-checkbox[value="${design}"]`);
      if (checkbox) checkbox.checked = true;
    });

    // Load price range
    const priceRange = params.get('price');
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      const minSlider = document.getElementById('price-min');
      const maxSlider = document.getElementById('price-max');
      if (minSlider) minSlider.value = min;
      if (maxSlider) maxSlider.value = max;
    }

    // Load sort option
    const sortBy = params.get('sort_by');
    if (sortBy) {
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) sortSelect.value = sortBy;
    }

    this.updateActiveFiltersDisplay();
  }

  showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('hidden');
    }
  }

  hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
    }
  }

  showError() {
    // Simple error handling - could be enhanced
    alert('Failed to update filters. Please try again.');
  }

  formatMoney(cents) {
    return (cents / 100).toLocaleString(undefined, {
      style: 'currency',
      currency: window.shopCurrency || 'USD',
    });
  }

  trackFilterUsage() {
    if (typeof gtag !== 'undefined') {
      const activeFilters = this.getActiveFilters();
      const filterCount = Object.values(activeFilters).flat().length;

      gtag('event', 'collection_filter', {
        event_category: 'ecommerce',
        event_label: 'filter_applied',
        filter_count: filterCount,
      });
    }
  }
}

// Global function for removing individual filters
function removeFilter(type, value) {
  if (type === 'price') {
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    if (minSlider) minSlider.value = 0;
    if (maxSlider) maxSlider.value = 200;
  } else {
    const checkbox = document.querySelector(`.${type}-checkbox[value="${value}"]`);
    if (checkbox) checkbox.checked = false;
  }

  // Trigger filter update
  window.collectionFilters?.handleFilterChange();
}

// Utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  window.collectionFilters = new CollectionFilters();
});
```

## Localization Support

```json
// locales/en.default.json
{
  "collection": {
    "filters": "Filters",
    "clear_all": "Clear All",
    "price": "Price",
    "size": "Size",
    "color": "Color",
    "design_theme": "Design Theme",
    "active_filters": "Active Filters",
    "products": "products",
    "sort_by": "Sort by",
    "loading": "Loading...",
    "apply_filters": "Apply Filters",
    "sort": {
      "featured": "Featured",
      "price_low_high": "Price: Low to High",
      "price_high_low": "Price: High to Low",
      "date_new_old": "Newest First",
      "date_old_new": "Oldest First",
      "best_selling": "Best Selling"
    },
    "design": {
      "kolam": "Kolam Patterns",
      "heritage": "Heritage Designs",
      "traditional": "Traditional",
      "modern": "Modern",
      "fusion": "Fusion"
    }
  }
}

// locales/ta.json
{
  "collection": {
    "filters": "வடிகட்டி",
    "clear_all": "அனைத்தையும் அழிக்கவும்",
    "price": "விலை",
    "size": "அளவு",
    "color": "நிறம்",
    "design_theme": "வடிவமைப்பு",
    "active_filters": "செயலில் உள்ள வடிகட்டிகள்",
    "products": "பொருட்கள்",
    "loading": "ஏற்றப்படுகிறது...",
    "apply_filters": "வடிகட்டிகளைப் பயன்படுத்துங்கள்"
  }
}
```

## Definition of Done

- [ ] All filter options functional and update correctly
- [ ] Sort options work without page reload
- [ ] Filter state reflected in URL for sharing/bookmarking
- [ ] Mobile responsive filter experience
- [ ] Clear all filters functionality working
- [ ] Active filter indicators display correctly
- [ ] Product count updates accurately
- [ ] Performance optimized for large collections

## Dependencies

- Collection template structure
- Product card component
- AJAX view template for filtered results
- Tamil translations and cultural filter categories

## Files Created/Modified

- `templates/collection.liquid`
- `assets/collection-filters.js`
- `assets/collection-filters.css`
- `snippets/product-card.liquid`
- `locales/en.default.json` (collection keys)
- `locales/ta.json` (Tamil translations)

## Performance Considerations

- [ ] Debounced filter updates
- [ ] Efficient DOM updates
- [ ] Pagination for large collections
- [ ] Loading states for user feedback
- [ ] Cached filter options where possible

## Accessibility Requirements

- [ ] Keyboard navigation for all filter controls
- [ ] Screen reader labels for complex filters
- [ ] ARIA live regions for result updates
- [ ] High contrast mode support
- [ ] Focus management in mobile modal

## Testing Checklist

- [ ] All filter combinations work correctly
- [ ] Sort options update results properly
- [ ] URL updates maintain filter state
- [ ] Mobile filter modal functional
- [ ] Clear filters resets all options
- [ ] Price slider responsive and accurate
- [ ] Results count updates correctly
- [ ] Performance acceptable with large collections

## Estimate Breakdown

- Filter UI and responsive design: 2 hours
- JavaScript filter/sort logic: 2 hours
- AJAX integration and URL management: 45 min
- Testing and optimization: 15 min
- **Total: 5 story points**
