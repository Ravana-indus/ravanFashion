# US6.3: POD Integration

**Story Points:** 5 **Section:** App Integrations **Priority:** Medium **Status:** Ready

## User Story

As an operator, I want POD (Printful/Printify) integrated so orders auto-fulfill.

## Acceptance Criteria

✅ **Primary Acceptance:** Products sync correctly, test order flows through POD.

### Detailed Acceptance Criteria:

1. **POD Service Integration**
   - [ ] Printful/Printify API properly configured and authenticated
   - [ ] Product catalog synchronization working
   - [ ] Mockup generation and display functional
   - [ ] Inventory synchronization and stock management

2. **Order Processing**
   - [ ] Automatic order forwarding to POD provider
   - [ ] Order status synchronization with Shopify
   - [ ] Shipping rate calculation and tracking
   - [ ] Error handling for failed order submissions

3. **Product Customization**
   - [ ] Design file upload and management
   - [ ] Print file specifications and requirements
   - [ ] Color variant and size options synchronization
   - [ ] Cultural design template management

4. **Quality Control**
   - [ ] Print quality verification process
   - [ ] Shipping quality monitoring
   - [ ] Customer satisfaction tracking
   - [ ] Returns and exchanges handling

## Technical Implementation

### POD Configuration (config/pod-config.js)

```javascript
// POD Service Configuration
const POD_CONFIG = {
  provider: '{{ settings.pod_provider }}', // 'printful' or 'printify'
  apiKey: '{{ settings.pod_api_key }}',
  shopId: '{{ settings.pod_shop_id }}',

  // Printful specific
  printful: {
    apiUrl: 'https://api.printful.com',
    webhookSecret: '{{ settings.printful_webhook_secret }}',
    syncEnabled: true,
    inventorySync: true,
    orderSync: true
  },

  // Printify specific
  printify: {
    apiUrl: 'https://api.printify.com',
    shopId: '{{ settings.printify_shop_id }}',
    webhookKey: '{{ settings.printify_webhook_key }}',
    syncEnabled: true,
    inventorySync: true,
    orderSync: true
  },

  // Common settings
  settings: {
    autoFulfill: true,
    trackInventory: true,
    sendEmails: true,
    culturalDesigns: true,
    qualityCheck: true
  }
};
```

### POD Service Integration (assets/pod-service.js)

```javascript
class PODService {
  constructor() {
    this.config = window.POD_CONFIG;
    this.provider = this.config.provider;
    this.apiKey = this.config.apiKey;
    this.shopId = this.config.shopId;

    this.init();
  }

  init() {
    if (!this.apiKey || !this.provider) {
      console.warn('POD service not configured');
      return;
    }

    this.setupWebhookListeners();
    this.loadPODScript();
    this.syncProducts();
  }

  // Product Synchronization
  async syncProducts() {
    try {
      switch (this.provider) {
        case 'printful':
          await this.syncPrintfulProducts();
          break;
        case 'printify':
          await this.syncPrintifyProducts();
          break;
        default:
          throw new Error(`Unsupported POD provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('POD product sync failed:', error);
    }
  }

  // Printful Integration
  async syncPrintfulProducts() {
    const response = await fetch(`${this.config.printful.apiUrl}/store/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }

    const data = await response.json();
    this.updateShopifyProducts(data.result);
  }

  // Printify Integration
  async syncPrintifyProducts() {
    const response = await fetch(`${this.config.printify.apiUrl}/v1/shops/${this.shopId}/products.json`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.status}`);
    }

    const data = await response.json();
    this.updateShopifyProducts(data.data);
  }

  // Update Shopify Products with POD Data
  updateShopifyProducts(podProducts) {
    podProducts.forEach(podProduct => {
      const shopifyProduct = this.findShopifyProduct(podProduct.id);
      if (shopifyProduct) {
        this.updateProductVariants(shopifyProduct, podProduct);
        this.updateMockups(shopifyProduct, podProduct);
      }
    });
  }

  // Order Processing
  async processOrder(orderData) {
    try {
      let podOrder;

      switch (this.provider) {
        case 'printful':
          podOrder = await this.createPrintfulOrder(orderData);
          break;
        case 'printify':
          podOrder = await this.createPrintifyOrder(orderData);
          break;
        default:
          throw new Error(`Unsupported POD provider: ${this.provider}`);
      }

      // Track order submission
      if (window.trackKlaviyoEvent) {
        window.trackKlaviyoEvent('POD Order Submitted', {
          order_id: orderData.id,
          provider: this.provider,
          pod_order_id: podOrder.id,
          total_items: orderData.line_items.length
        });
      }

      return podOrder;
    } catch (error) {
      console.error('POD order processing failed:', error);
      throw error;
    }
  }

  // Cultural Design Management
  async uploadCulturalDesign(designData) {
    try {
      const formData = new FormData();
      formData.append('file', designData.file);
      formData.append('name', designData.name);
      formData.append('type', designData.type);
      formData.append('cultural_context', JSON.stringify(designData.culturalContext));

      const endpoint = this.provider === 'printful'
        ? `${this.config.printful.apiUrl}/files`
        : `${this.config.printify.apiUrl}/v1/uploads.json`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`${this.provider} design upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Cultural design upload failed:', error);
      throw error;
    }
  }

  // Webhook Handlers
  setupWebhookListeners() {
    // Listen for Shopify order created events
    document.addEventListener('shopify:order.created', (event) => {
      if (this.config.settings.autoFulfill) {
        this.processOrder(event.detail.order);
      }
    });

    // Listen for POD order status updates
    document.addEventListener('pod:order.updated', (event) => {
      this.updateShopifyOrderStatus(event.detail);
    });
  }

  // Mockup Display Enhancement
  enhanceMockupDisplay(productElement, productId) {
    const mockupContainer = productElement.querySelector('.mockup-container');
    if (!mockupContainer) return;

    // Add cultural design indicators
    const culturalIndicator = document.createElement('div');
    culturalIndicator.className = 'cultural-design-indicator';
    culturalIndicator.innerHTML = `
      <span class="cultural-badge">🌾 Cultural Design</span>
      <div class="mockup-controls">
        <button class="mockup-view-btn" data-view="front">Front</button>
        <button class="mockup-view-btn" data-view="back">Back</button>
        <button class="mockup-view-btn" data-view="detail">Detail</button>
      </div>
    `;

    mockupContainer.appendChild(culturalIndicator);

    // Add mockup view switching
    const viewButtons = culturalIndicator.querySelectorAll('.mockup-view-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchMockupView(productElement, btn.dataset.view);
      });
    });
  }

  switchMockupView(productElement, view) {
    const mockupImage = productElement.querySelector('.mockup-image');
    if (!mockupImage) return;

    // Update mockup image based on view
    const productId = productElement.dataset.productId;
    const viewUrl = this.getMockupUrl(productId, view);

    if (viewUrl) {
      mockupImage.src = viewUrl;
      mockupImage.alt = `${productElement.dataset.productName} - ${view} view`;
    }
  }

  getMockupUrl(productId, view) {
    // Return appropriate mockup URL based on provider and view
    const baseUrl = this.provider === 'printful'
      ? `https://api.printful.com/mockup-generator`
      : `https://api.printify.com/v1/mockups`;

    return `${baseUrl}/${productId}/${view}`;
  }
}

// Initialize POD service
document.addEventListener('DOMContentLoaded', () => {
  window.podService = new PODService();
});
```

### POD Product Template (templates/product.pod.liquid)

```liquid
<!-- POD Product Template -->
<div class="pod-product-template" data-product-id="{{ product.id }}">

  <!-- Product Mockups -->
  <div class="pod-mockups">
    <div class="mockup-container">
      {% for variant in product.variants %}
        {% if variant.metafields.pod.mockup_url %}
          <img src="{{ variant.metafields.pod.mockup_url }}"
               alt="{{ product.title }} - {{ variant.title }}"
               class="mockup-image"
               data-variant-id="{{ variant.id }}"
               loading="lazy">
        {% endif %}
      {% endfor %}
    </div>

    <!-- Mockup Controls -->
    <div class="mockup-controls">
      <button class="mockup-btn" data-view="front">Front View</button>
      <button class="mockup-btn" data-view="back">Back View</button>
      <button class="mockup-btn" data-view="side">Side View</button>
      <button class="mockup-btn" data-view="detail">Detail View</button>
    </div>
  </div>

  <!-- Cultural Design Information -->
  {% if product.metafields.pod.cultural_design %}
    <div class="cultural-design-info">
      <h3 class="cultural-title">🌾 Cultural Design Story</h3>
      <div class="cultural-content">
        <p class="cultural-description">
          {{ product.metafields.pod.cultural_design.description }}
        </p>

        {% if product.metafields.pod.cultural_design.symbols %}
          <div class="cultural-symbols">
            <h4>Traditional Symbols:</h4>
            <ul>
              {% for symbol in product.metafields.pod.cultural_design.symbols %}
                <li>{{ symbol.name }} - {{ symbol.meaning }}</li>
              {% endfor %}
            </ul>
          </div>
        {% endif %}
      </div>
    </div>
  {% endif %}

  <!-- POD Information -->
  <div class="pod-info">
    <div class="production-info">
      <h4>Production Details</h4>
      <ul>
        <li>🏭 Made to order</li>
        <li>⏱️ Production time: {{ product.metafields.pod.production_time | default: '2-5 business days' }}</li>
        <li>🌍 Shipped from {{ product.metafields.pod.production_location | default: 'nearest facility' }}</li>
        <li>♻️ {{ product.metafields.pod.sustainability_info | default: 'Sustainable materials' }}</li>
      </ul>
    </div>

    <div class="quality-guarantee">
      <h4>Quality Guarantee</h4>
      <p>
        Each piece is carefully crafted with attention to cultural authenticity
        and modern quality standards. We stand behind our products with a
        satisfaction guarantee.
      </p>
    </div>
  </div>

  <!-- Size Guide with Cultural Fit -->
  <div class="cultural-size-guide">
    <h4>📏 Cultural Fit Guide</h4>
    <p>
      Our sizes are designed to accommodate both traditional and modern styling.
      Please refer to our detailed size guide for the perfect fit.
    </p>
    <button class="size-guide-btn" onclick="openCulturalSizeGuide()">
      View Cultural Size Guide
    </button>
  </div>

</div>

<script>
// POD Product Template JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const productId = {{ product.id }};
  const mockupButtons = document.querySelectorAll('.mockup-btn');
  const mockupImages = document.querySelectorAll('.mockup-image');

  // Mockup view switching
  mockupButtons.forEach(button => {
    button.addEventListener('click', function() {
      const view = this.dataset.view;

      // Update active button
      mockupButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Update mockup images
      mockupImages.forEach(img => {
        const variantId = img.dataset.variantId;
        const newSrc = getMockupUrl(variantId, view);
        if (newSrc) {
          img.src = newSrc;
          img.alt = img.alt.replace(/- \w+ view/, `- ${view} view`);
        }
      });
    });
  });

  // Enhance mockup display
  if (window.podService) {
    const productElement = document.querySelector('.pod-product-template');
    window.podService.enhanceMockupDisplay(productElement, productId);
  }
});

function getMockupUrl(variantId, view) {
  // Generate mockup URL based on variant and view
  return `/mockups/${variantId}/${view}.jpg`;
}

function openCulturalSizeGuide() {
  // Open cultural size guide modal or page
  window.open('/pages/cultural-size-guide', '_blank');
}
</script>

<style>
.pod-product-template {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
}

.pod-mockups {
  text-align: center;
  margin-bottom: 2rem;
}

.mockup-container {
  position: relative;
  margin-bottom: 1rem;
}

.mockup-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.mockup-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mockup-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #D4AF37;
  background: white;
  color: #6A1B1B;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.mockup-btn:hover,
.mockup-btn.active {
  background: #D4AF37;
  color: white;
}

.cultural-design-info {
  background: #FDF6EC;
  border-left: 4px solid #D4AF37;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 0 8px 8px 0;
}

.cultural-title {
  color: #6A1B1B;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.cultural-symbols ul {
  list-style: none;
  padding: 0;
}

.cultural-symbols li {
  padding: 0.25rem 0;
  color: #3A6A6A;
}

.pod-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.production-info ul {
  list-style: none;
  padding: 0;
}

.production-info li {
  padding: 0.5rem 0;
  color: #4B5563;
}

.cultural-size-guide {
  text-align: center;
  padding: 1.5rem;
  background: #F3F4F6;
  border-radius: 8px;
}

.size-guide-btn {
  background: #6A1B1B;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;
}

.size-guide-btn:hover {
  background: #8B0000;
}

@media (max-width: 768px) {
  .pod-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .mockup-controls {
    flex-wrap: wrap;
  }

  .mockup-btn {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
  }
}
</style>
```

### Theme Settings (config/settings_schema.json)

```json
{
  "name": "POD Integration",
  "settings": [
    {
      "type": "select",
      "id": "pod_provider",
      "label": "POD Provider",
      "options": [
        {
          "value": "printful",
          "label": "Printful"
        },
        {
          "value": "printify",
          "label": "Printify"
        }
      ],
      "default": "printful"
    },
    {
      "type": "text",
      "id": "pod_api_key",
      "label": "API Key",
      "info": "Your POD provider API key"
    },
    {
      "type": "text",
      "id": "pod_shop_id",
      "label": "Shop ID",
      "info": "Your POD provider shop ID"
    },
    {
      "type": "text",
      "id": "printful_webhook_secret",
      "label": "Printful Webhook Secret",
      "info": "Webhook secret for Printful integration"
    },
    {
      "type": "text",
      "id": "printify_shop_id",
      "label": "Printify Shop ID",
      "info": "Your Printify shop ID"
    },
    {
      "type": "text",
      "id": "printify_webhook_key",
      "label": "Printify Webhook Key",
      "info": "Webhook key for Printify integration"
    },
    {
      "type": "checkbox",
      "id": "pod_auto_fulfill",
      "label": "Auto-fulfill Orders",
      "default": true,
      "info": "Automatically send orders to POD provider"
    },
    {
      "type": "checkbox",
      "id": "pod_sync_inventory",
      "label": "Sync Inventory",
      "default": true,
      "info": "Keep inventory levels synchronized"
    },
    {
      "type": "checkbox",
      "id": "pod_show_mockups",
      "label": "Show Product Mockups",
      "default": true,
      "info": "Display generated product mockups"
    },
    {
      "type": "checkbox",
      "id": "pod_cultural_designs",
      "label": "Cultural Design Support",
      "default": true,
      "info": "Enable cultural design features and templates"
    }
  ]
}
```

## Definition of Done

- [ ] POD provider API configured and authenticated
- [ ] Product catalog synchronization working
- [ ] Order processing and fulfillment automated
- [ ] Mockup generation and display functional
- [ ] Cultural design features implemented
- [ ] Quality control processes in place
- [ ] Error handling and monitoring working
- [ ] Performance impact minimal

## Dependencies

- POD provider account setup (Printful/Printify)
- API keys and authentication
- Product catalog setup in POD platform
- Shipping and tax configuration
- Cultural design templates prepared

## Files Created/Modified

- `config/pod-config.js`
- `assets/pod-service.js`
- `templates/product.pod.liquid`
- `config/settings_schema.json` (POD settings)
- `snippets/pod-mockup-display.liquid`

## Testing Checklist

- [ ] Product synchronization working correctly
- [ ] Order processing test successful
- [ ] Mockup generation and display
- [ ] Cultural design upload functionality
- [ ] Webhook integration working
- [ ] Error handling graceful
- [ ] Performance acceptable
- [ ] Mobile responsive design

## Estimate Breakdown

- API integration setup: 2 hours
- Product synchronization: 1 hour
- Order processing: 1 hour
- Cultural design features: 45 min
- Testing and validation: 15 min
- **Total: 5 story points**
```