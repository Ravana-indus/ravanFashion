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
    this.enhanceProductPages();
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

  findShopifyProduct(podProductId) {
    // This would typically search through Shopify product data
    // For now, we'll use a simplified approach
    return window.productData && window.productData.id === podProductId;
  }

  updateProductVariants(shopifyProduct, podProduct) {
    // Update variant information based on POD data
    if (podProduct.variants) {
      podProduct.variants.forEach(variant => {
        const shopifyVariant = shopifyProduct.variants.find(v => v.sku === variant.sku);
        if (shopifyVariant) {
          // Update inventory, pricing, etc.
          shopifyVariant.inventory_quantity = variant.inventory;
          shopifyVariant.price = variant.retail_price;
        }
      });
    }
  }

  updateMockups(shopifyProduct, podProduct) {
    // Update product mockups
    if (this.config.settings.showMockups && podProduct.mockups) {
      shopifyProduct.mockups = podProduct.mockups;
    }
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

  // Create Printful Order
  async createPrintfulOrder(orderData) {
    const printfulOrder = {
      external_id: orderData.id,
      shipping: this.mapShippingAddress(orderData.shipping_address),
      items: orderData.line_items.map(item => this.mapPrintfulItem(item)),
      retail_costs: {
        currency: orderData.currency,
        subtotal: parseFloat(orderData.subtotal_price),
        shipping: parseFloat(orderData.shipping_price),
        tax: parseFloat(orderData.total_tax),
        discount: parseFloat(orderData.total_discounts)
      }
    };

    const response = await fetch(`${this.config.printful.apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(printfulOrder)
    });

    if (!response.ok) {
      throw new Error(`Printful order creation failed: ${response.status}`);
    }

    return await response.json();
  }

  // Create Printify Order
  async createPrintifyOrder(orderData) {
    const printifyOrder = {
      external_id: orderData.id.toString(),
      line_items: orderData.line_items.map(item => this.mapPrintifyItem(item)),
      shipping_method: 1, // Default shipping method
      send_shipping_notification: true,
      address_to: this.mapPrintifyAddress(orderData.shipping_address)
    };

    const response = await fetch(`${this.config.printify.apiUrl}/v1/shops/${this.shopId}/orders.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(printifyOrder)
    });

    if (!response.ok) {
      throw new Error(`Printify order creation failed: ${response.status}`);
    }

    return await response.json();
  }

  // Map shipping address for Printful
  mapShippingAddress(address) {
    return {
      name: `${address.first_name} ${address.last_name}`,
      company: address.company,
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      state_code: address.province_code,
      country_code: address.country_code,
      zip: address.zip
    };
  }

  // Map shipping address for Printify
  mapPrintifyAddress(address) {
    return {
      first_name: address.first_name,
      last_name: address.last_name,
      email: address.email,
      phone: address.phone,
      country: address.country,
      region: address.province,
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      zip: address.zip
    };
  }

  // Map item for Printful
  mapPrintfulItem(item) {
    return {
      external_id: item.id.toString(),
      variant_id: item.sku,
      quantity: item.quantity,
      files: item.custom_files || []
    };
  }

  // Map item for Printify
  mapPrintifyItem(item) {
    return {
      variant_id: item.sku,
      quantity: item.quantity
    };
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

    // Setup webhook handlers for real-time updates
    this.setupPODWebhooks();
  }

  // Setup POD webhooks
  async setupPODWebhooks() {
    if (this.provider === 'printful') {
      await this.setupPrintfulWebhooks();
    } else if (this.provider === 'printify') {
      await this.setupPrintifyWebhooks();
    }
  }

  async setupPrintfulWebhooks() {
    // Configure Printful webhooks for order status updates
    const webhookConfig = {
      url: `${window.location.origin}/webhooks/printful`,
      events: ['package_shipped', 'order_updated'],
      secret: this.config.printful.webhookSecret
    };

    // Implementation would register webhooks with Printful
    console.log('Printful webhooks configured:', webhookConfig);
  }

  async setupPrintifyWebhooks() {
    // Configure Printify webhooks for order status updates
    const webhookConfig = {
      url: `${window.location.origin}/webhooks/printify`,
      events: ['order.created', 'order.updated', 'order.sent_to_production'],
      key: this.config.printify.webhookKey
    };

    // Implementation would register webhooks with Printify
    console.log('Printify webhooks configured:', webhookConfig);
  }

  // Update Shopify order status based on POD updates
  updateShopifyOrderStatus(podOrderData) {
    // This would update Shopify order status based on POD provider updates
    console.log('Updating Shopify order status:', podOrderData);

    // Track status change
    if (window.trackKlaviyoEvent) {
      window.trackKlaviyoEvent('POD Order Status Updated', {
        order_id: podOrderData.external_id,
        provider: this.provider,
        status: podOrderData.status,
        tracking_number: podOrderData.tracking_number
      });
    }
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

  // Enhance product pages with POD features
  enhanceProductPages() {
    // Add POD-specific features to product pages
    if (this.config.settings.culturalDesigns) {
      this.addCulturalDesignFeatures();
    }

    if (this.config.settings.showMockups) {
      this.addMockupGalleries();
    }
  }

  addCulturalDesignFeatures() {
    // Add cultural design information and customization options
    const culturalSections = document.querySelectorAll('.cultural-design-section');
    culturalSections.forEach(section => {
      this.enhanceCulturalDesignSection(section);
    });
  }

  enhanceCulturalDesignSection(section) {
    // Add interactive cultural design features
    const designOptions = section.querySelectorAll('.cultural-design-option');
    designOptions.forEach(option => {
      option.addEventListener('click', () => {
        this.selectCulturalDesign(option);
      });
    });
  }

  selectCulturalDesign(option) {
    // Handle cultural design selection
    const designId = option.dataset.designId;
    const designName = option.dataset.designName;

    console.log('Selected cultural design:', designId, designName);

    // Track design selection
    if (window.trackKlaviyoEvent) {
      window.trackKlaviyoEvent('Cultural Design Selected', {
        design_id: designId,
        design_name: designName
      });
    }
  }

  addMockupGalleries() {
    // Add interactive mockup galleries to product pages
    const mockupGalleries = document.querySelectorAll('.mockup-gallery');
    mockupGalleries.forEach(gallery => {
      this.enhanceMockupGallery(gallery);
    });
  }

  enhanceMockupGallery(gallery) {
    // Add mockup view switching and zoom functionality
    const mockupImages = gallery.querySelectorAll('.mockup-image');
    const viewButtons = gallery.querySelectorAll('.view-btn');

    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const view = button.dataset.view;
        this.switchGalleryView(gallery, view);
      });
    });

    // Add zoom functionality
    mockupImages.forEach(image => {
      image.addEventListener('click', () => {
        this.zoomMockup(image);
      });
    });
  }

  switchGalleryView(gallery, view) {
    const mockupImages = gallery.querySelectorAll('.mockup-image');
    mockupImages.forEach(image => {
      if (image.dataset.view === view) {
        image.style.display = 'block';
      } else {
        image.style.display = 'none';
      }
    });
  }

  zoomMockup(image) {
    // Create zoom modal for mockup
    const modal = document.createElement('div');
    modal.className = 'mockup-zoom-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <img src="${image.src}" alt="${image.alt}" class="zoomed-image">
        <button class="close-zoom">&times;</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal on click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('close-zoom')) {
        modal.remove();
      }
    });
  }

  // Load POD provider scripts
  loadPODScript() {
    // Load any necessary POD provider scripts
    if (this.provider === 'printful') {
      this.loadPrintfulScript();
    } else if (this.provider === 'printify') {
      this.loadPrintifyScript();
    }
  }

  loadPrintfulScript() {
    // Load Printful-specific scripts if needed
    console.log('Printful script loaded');
  }

  loadPrintifyScript() {
    // Load Printify-specific scripts if needed
    console.log('Printify script loaded');
  }

  // Public methods for external use
  async submitOrder(orderData) {
    return await this.processOrder(orderData);
  }

  async uploadDesign(designData) {
    return await this.uploadCulturalDesign(designData);
  }

  getProviderStatus() {
    return {
      provider: this.provider,
      configured: !!(this.apiKey && this.shopId),
      settings: this.config.settings
    };
  }
}

// Initialize POD service
document.addEventListener('DOMContentLoaded', () => {
  window.podService = new PODService();
});

// Global functions for easy access
window.submitPODOrder = (orderData) => {
  return window.podService?.submitOrder(orderData);
};

window.uploadPODDesign = (designData) => {
  return window.podService?.uploadDesign(designData);
};

window.getPODStatus = () => {
  return window.podService?.getProviderStatus();
};