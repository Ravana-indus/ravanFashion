# US4.2: Product Variant Selector

**Story Points:** 5 **Section:** Collection & Product Pages **Priority:** High **Status:** Ready

## User Story

As a shopper, I want to choose product variants (size, color) so I can personalize my purchase.

## Acceptance Criteria

✅ **Primary Acceptance:** Variant selector updates price, SKU, and featured image.

### Detailed Acceptance Criteria:

1. **Variant Selection Interface**
   - [ ] Size selector with clear size options
   - [ ] Color selector with visual color swatches
   - [ ] Style/design options where applicable
   - [ ] Clear indication of selected variants

2. **Dynamic Updates**
   - [ ] Product price updates when variants change
   - [ ] Featured product image changes with color selection
   - [ ] SKU and product ID update correctly
   - [ ] Stock availability shows for selected variant

3. **User Experience**
   - [ ] Disabled states for unavailable combinations
   - [ ] Clear visual feedback for selections
   - [ ] Error states for invalid combinations
   - [ ] Smooth transitions between variant changes

4. **Cultural Integration**
   - [ ] Size guide accessible with Tamil measurements
   - [ ] Cultural design names where applicable
   - [ ] Bilingual variant labels
   - [ ] Respectful product nomenclature

## Design Specifications

### Variant Selector Layout

```
┌─────────────────────────────────────┐
│  Product Image Gallery   │ Product  │
│  [Main Image Updates]    │ Details  │
│                          │          │
│  ◦ ◦ ◦ ◦ (thumbnails)    │ Title    │
│                          │ Price    │
│                          │          │
│                          │ Size:    │
│                          │ [S][M][L]│
│                          │          │
│                          │ Color:   │
│                          │ ●●●●●    │
│                          │          │
│                          │ Design:  │
│                          │ [▣][▣][▣]│
│                          │          │
│                          │ [Add to  │
│                          │  Cart]   │
└─────────────────────────────────────┘
```

### Size Selector

- **Visual**: Button group with size labels
- **States**: Available, selected, unavailable
- **Tamil**: Show metric measurements
- **Accessibility**: ARIA labels for screen readers

### Color Selector

- **Visual**: Color swatches with border indicators
- **States**: Available colors, selected state
- **Names**: Color names in English and Tamil
- **Accessibility**: Color names for visually impaired

## Technical Implementation

### Product Form Structure (templates/product.liquid)

```liquid
<form action="/cart/add" method="post" id="product-form" class="product-form">
  <div class="variant-selectors space-y-6">
    {% unless product.has_only_default_variant %}

      <!-- Size Selector -->
      {% for option in product.options_with_values %}
        {% if option.name == 'Size' %}
          <div class="variant-selector size-selector">
            <label class="variant-label text-lg font-medium text-charcoal-black mb-3 block">
              {{ option.name }}
              {% if settings.show_tamil_labels %}
                <span class="text-deep-maroon font-tamil ml-2">(அளவு)</span>
              {% endif %}
            </label>

            <div class="size-options flex flex-wrap gap-2">
              {% for value in option.values %}
                <input type="radio"
                       name="options[{{ option.name }}]"
                       id="size-{{ value | handle }}"
                       value="{{ value }}"
                       class="sr-only size-input"
                       {% if option.selected_value == value %}checked{% endif %}>

                <label for="size-{{ value | handle }}"
                       class="size-option px-4 py-2 border-2 border-gray-300 rounded-md cursor-pointer transition-colors hover:border-deep-maroon text-center min-w-[50px] font-medium
                              {% if option.selected_value == value %}bg-deep-maroon text-cream-white border-deep-maroon{% endif %}">
                  {{ value }}
                </label>
              {% endfor %}
            </div>

            <!-- Size Guide Link -->
            <button type="button"
                    class="size-guide-trigger text-sm text-muted-teal hover:text-deep-maroon underline mt-2"
                    data-modal-target="size-guide-modal">
              {{ 'product.size_guide' | t }}
            </button>
          </div>
        {% endif %}

        <!-- Color Selector -->
        {% if option.name == 'Color' %}
          <div class="variant-selector color-selector">
            <label class="variant-label text-lg font-medium text-charcoal-black mb-3 block">
              {{ option.name }}
              {% if settings.show_tamil_labels %}
                <span class="text-deep-maroon font-tamil ml-2">(நிறம்)</span>
              {% endif %}
            </label>

            <div class="color-options flex flex-wrap gap-3">
              {% for value in option.values %}
                {% assign color_handle = value | handle %}
                {% assign color_image = product.images | where: 'alt', value | first %}

                <input type="radio"
                       name="options[{{ option.name }}]"
                       id="color-{{ color_handle }}"
                       value="{{ value }}"
                       class="sr-only color-input"
                       data-color-image="{% if color_image %}{{ color_image | img_url: '800x800' }}{% endif %}"
                       {% if option.selected_value == value %}checked{% endif %}>

                <label for="color-{{ color_handle }}"
                       class="color-option relative w-12 h-12 rounded-full cursor-pointer border-4 border-transparent transition-all hover:scale-110
                              {% if option.selected_value == value %}border-deep-maroon ring-2 ring-deep-maroon ring-offset-2{% endif %}"
                       style="background-color: {{ settings[color_handle] | default: '#ccc' }}">

                  <span class="sr-only">{{ value }}</span>

                  <!-- Color name tooltip -->
                  <div class="color-tooltip absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-charcoal-black text-cream-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {{ value }}
                  </div>
                </label>
              {% endfor %}
            </div>

            <!-- Selected color name -->
            <div class="selected-color-name mt-2 text-sm text-muted-teal">
              <span class="color-name-label">{{ 'product.selected_color' | t }}:</span>
              <span id="current-color-name" class="font-medium text-charcoal-black">
                {{ product.selected_or_first_available_variant.option2 | default: product.options_with_values[1].values.first }}
              </span>
            </div>
          </div>
        {% endif %}

        <!-- Design/Style Selector -->
        {% if option.name == 'Design' or option.name == 'Style' %}
          <div class="variant-selector design-selector">
            <label class="variant-label text-lg font-medium text-charcoal-black mb-3 block">
              {{ option.name }}
              {% if settings.show_tamil_labels %}
                <span class="text-deep-maroon font-tamil ml-2">(வடிவமைப்பு)</span>
              {% endif %}
            </label>

            <div class="design-options grid grid-cols-2 md:grid-cols-3 gap-3">
              {% for value in option.values %}
                {% assign design_image = product.images | where: 'alt', value | first %}

                <input type="radio"
                       name="options[{{ option.name }}]"
                       id="design-{{ value | handle }}"
                       value="{{ value }}"
                       class="sr-only design-input"
                       {% if option.selected_value == value %}checked{% endif %}>

                <label for="design-{{ value | handle }}"
                       class="design-option relative border-2 border-gray-300 rounded-lg p-3 cursor-pointer transition-all hover:border-deep-maroon
                              {% if option.selected_value == value %}border-deep-maroon bg-deep-maroon/5{% endif %}">

                  {% if design_image %}
                    <img src="{{ design_image | img_url: '150x150' }}"
                         alt="{{ value }}"
                         class="w-full h-24 object-cover rounded mb-2">
                  {% endif %}

                  <span class="design-name text-sm font-medium text-center block">
                    {{ value }}
                  </span>

                  <!-- Cultural context if available -->
                  {% assign tamil_name = settings['design_tamil_' | append: value | handle] %}
                  {% if tamil_name %}
                    <span class="tamil-name text-xs font-tamil text-deep-maroon text-center block mt-1">
                      {{ tamil_name }}
                    </span>
                  {% endif %}
                </label>
              {% endfor %}
            </div>
          </div>
        {% endif %}
      {% endfor %}

    {% endunless %}

    <!-- Price and Add to Cart -->
    <div class="product-price-cart space-y-4">
      <div class="price-display">
        <span id="variant-price" class="text-3xl font-bold text-charcoal-black">
          {{ product.selected_or_first_available_variant.price | money }}
        </span>

        {% if product.selected_or_first_available_variant.compare_at_price > product.selected_or_first_available_variant.price %}
          <span id="variant-compare-price" class="text-lg text-gray-500 line-through ml-2">
            {{ product.selected_or_first_available_variant.compare_at_price | money }}
          </span>
        {% endif %}
      </div>

      <!-- Stock Status -->
      <div id="variant-availability" class="availability-status">
        {% if product.selected_or_first_available_variant.available %}
          <span class="in-stock text-green-600 font-medium">{{ 'product.in_stock' | t }}</span>
        {% else %}
          <span class="out-of-stock text-red-600 font-medium">{{ 'product.out_of_stock' | t }}</span>
        {% endif %}
      </div>

      <!-- Add to Cart Button -->
      <button type="submit"
              id="add-to-cart-btn"
              class="btn btn-gold btn-lg w-full {% unless product.selected_or_first_available_variant.available %}opacity-50 cursor-not-allowed{% endunless %}"
              {% unless product.selected_or_first_available_variant.available %}disabled{% endunless %}>

        <span class="btn-text">
          {% if product.selected_or_first_available_variant.available %}
            {{ 'product.add_to_cart' | t }}
          {% else %}
            {{ 'product.sold_out' | t }}
          {% endif %}
        </span>

        <span class="btn-text-tamil font-tamil ml-2">
          {% if product.selected_or_first_available_variant.available %}
            (வண்டியில் சேர்க்கவும்)
          {% else %}
            (விற்பனையானது)
          {% endif %}
        </span>
      </button>
    </div>

    <!-- Hidden variant ID -->
    <input type="hidden" name="id" id="variant-id" value="{{ product.selected_or_first_available_variant.id }}">
  </div>
</form>
```

### JavaScript Variant Logic (assets/product-variants.js)

```javascript
class ProductVariants {
  constructor(form) {
    this.form = form;
    this.product = window.productData || {};
    this.currentVariant = this.product.selected_or_first_available_variant;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    // Variant option changes
    this.form.addEventListener('change', e => {
      if (e.target.matches('input[name^="options"]')) {
        this.handleVariantChange();
      }
    });

    // Size guide modal trigger
    const sizeGuideBtn = this.form.querySelector('.size-guide-trigger');
    if (sizeGuideBtn) {
      sizeGuideBtn.addEventListener('click', () => this.openSizeGuide());
    }
  }

  handleVariantChange() {
    const selectedOptions = this.getSelectedOptions();
    const variant = this.findVariantByOptions(selectedOptions);

    if (variant) {
      this.currentVariant = variant;
      this.updateUI();
      this.updateURL();
      this.trackVariantSelection();
    }

    this.updateAvailability();
  }

  getSelectedOptions() {
    const options = {};
    const inputs = this.form.querySelectorAll('input[name^="options"]:checked');

    inputs.forEach(input => {
      const optionName = input.name.match(/options\\[(.*?)\\]/)[1];
      options[optionName] = input.value;
    });

    return options;
  }

  findVariantByOptions(options) {
    return this.product.variants.find(variant => {
      return variant.options.every((option, index) => {
        const optionName = this.product.options[index];
        return options[optionName] === option;
      });
    });
  }

  updateUI() {
    this.updatePrice();
    this.updateImage();
    this.updateStock();
    this.updateAddToCartButton();
    this.updateVariantId();
  }

  updatePrice() {
    const priceElement = document.getElementById('variant-price');
    const comparePriceElement = document.getElementById('variant-compare-price');

    if (priceElement && this.currentVariant) {
      priceElement.textContent = this.formatMoney(this.currentVariant.price);

      if (comparePriceElement) {
        if (this.currentVariant.compare_at_price > this.currentVariant.price) {
          comparePriceElement.textContent = this.formatMoney(this.currentVariant.compare_at_price);
          comparePriceElement.style.display = 'inline';
        } else {
          comparePriceElement.style.display = 'none';
        }
      }
    }
  }

  updateImage() {
    if (!this.currentVariant || !this.currentVariant.featured_image) return;

    const mainImage = document.querySelector('.product-image-main img');
    if (mainImage) {
      mainImage.src = this.currentVariant.featured_image.src;
      mainImage.alt = this.currentVariant.featured_image.alt || this.product.title;
    }

    // Update thumbnails selection
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    thumbnails.forEach(thumb => {
      thumb.classList.remove('active');
      if (thumb.dataset.imageId == this.currentVariant.featured_image.id) {
        thumb.classList.add('active');
      }
    });
  }

  updateStock() {
    const availabilityElement = document.getElementById('variant-availability');

    if (availabilityElement && this.currentVariant) {
      const isAvailable = this.currentVariant.available;
      const stockClass = isAvailable ? 'in-stock text-green-600' : 'out-of-stock text-red-600';
      const stockText = isAvailable
        ? this.getTranslation('product.in_stock')
        : this.getTranslation('product.out_of_stock');

      availabilityElement.innerHTML = `<span class="${stockClass} font-medium">${stockText}</span>`;
    }
  }

  updateAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const btnText = addToCartBtn.querySelector('.btn-text');
    const btnTextTamil = addToCartBtn.querySelector('.btn-text-tamil');

    if (this.currentVariant && this.currentVariant.available) {
      addToCartBtn.disabled = false;
      addToCartBtn.classList.remove('opacity-50', 'cursor-not-allowed');

      btnText.textContent = this.getTranslation('product.add_to_cart');
      btnTextTamil.textContent = '(வண்டியில் சேர்க்கவும்)';
    } else {
      addToCartBtn.disabled = true;
      addToCartBtn.classList.add('opacity-50', 'cursor-not-allowed');

      btnText.textContent = this.getTranslation('product.sold_out');
      btnTextTamil.textContent = '(விற்பனையானது)';
    }
  }

  updateVariantId() {
    const variantIdInput = document.getElementById('variant-id');
    if (variantIdInput && this.currentVariant) {
      variantIdInput.value = this.currentVariant.id;
    }
  }

  updateAvailability() {
    // Update option availability based on current selections
    const selectedOptions = this.getSelectedOptions();

    this.product.options.forEach((option, optionIndex) => {
      const inputs = this.form.querySelectorAll(`input[name="options[${option}]"]`);

      inputs.forEach(input => {
        const testOptions = { ...selectedOptions, [option]: input.value };
        const variant = this.findVariantByOptions(testOptions);
        const label = input.nextElementSibling;

        if (!variant || !variant.available) {
          label.classList.add('unavailable', 'opacity-50', 'cursor-not-allowed');
          input.disabled = true;
        } else {
          label.classList.remove('unavailable', 'opacity-50', 'cursor-not-allowed');
          input.disabled = false;
        }
      });
    });
  }

  updateURL() {
    if (this.currentVariant && window.history && window.history.replaceState) {
      const url = new URL(window.location);
      url.searchParams.set('variant', this.currentVariant.id);
      window.history.replaceState({}, '', url);
    }
  }

  trackVariantSelection() {
    if (typeof gtag !== 'undefined' && this.currentVariant) {
      gtag('event', 'variant_select', {
        event_category: 'ecommerce',
        event_label: this.currentVariant.sku,
        variant_id: this.currentVariant.id,
        product_id: this.product.id,
      });
    }
  }

  formatMoney(cents) {
    return (cents / 100).toLocaleString(undefined, {
      style: 'currency',
      currency: window.shopCurrency || 'USD',
    });
  }

  getTranslation(key) {
    return window.translations?.[key] || key;
  }

  openSizeGuide() {
    // Open size guide modal
    const modal = document.getElementById('size-guide-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('product-form');
  if (productForm) {
    new ProductVariants(productForm);
  }
});
```

## Definition of Done

- [ ] All variant options functional and update correctly
- [ ] Price, image, and stock status update with variant changes
- [ ] Unavailable combinations properly disabled
- [ ] Size guide accessible and functional
- [ ] Tamil labels and cultural elements display properly
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsive design tested
- [ ] Analytics tracking implemented

## Dependencies

- Product data structure with proper variants
- Product images with variant associations
- Tamil translations for variant labels
- Size guide content and modal component

## Files Created/Modified

- `templates/product.liquid` (variant selectors)
- `assets/product-variants.js`
- `assets/product-variants.css`
- `snippets/size-guide-modal.liquid`
- `locales/en.default.json` (product keys)
- `locales/ta.json` (Tamil translations)

## Accessibility Requirements

- [ ] Proper ARIA labels and roles
- [ ] Keyboard navigation support
- [ ] Screen reader friendly option descriptions
- [ ] High contrast mode compatibility
- [ ] Focus management for interactive elements

## Performance Considerations

- [ ] Efficient DOM updates
- [ ] Debounced variant changes
- [ ] Optimized image loading
- [ ] Minimal JavaScript footprint

## Testing Checklist

- [ ] All variant combinations work correctly
- [ ] Price updates accurately
- [ ] Images change with color selection
- [ ] Stock status updates properly
- [ ] Add to cart functionality works
- [ ] Size guide modal opens correctly
- [ ] Tamil text displays properly
- [ ] Mobile responsiveness verified

## Estimate Breakdown

- Variant selector markup: 2 hours
- JavaScript variant logic: 2 hours
- Styling and responsive design: 45 min
- Testing and refinement: 15 min
- **Total: 5 story points**
