class KlaviyoService {
  constructor() {
    this.publicKey = window.klaviyoPublicKey;
    this.apiVersion = '2024-02-15';
    this.baseUrl = 'https://a.klaviyo.com/api';

    this.init();
  }

  init() {
    if (!this.publicKey) {
      console.warn('Klaviyo public key not configured');
      return;
    }

    this.setupEventTracking();
    this.loadKlaviyoScript();
  }

  async loadKlaviyoScript() {
    if (window._learnq) return; // Already loaded

    const script = document.createElement('script');
    script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this.publicKey}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize tracking queue
    window._learnq = window._learnq || [];
    window._learnq.push(['account', this.publicKey]);
  }

  // Newsletter Subscription
  async subscribeToNewsletter(email, properties = {}) {
    try {
      const profileData = {
        type: 'profile',
        attributes: {
          email: email,
          subscriptions: {
            email: {
              marketing: {
                consent: 'SUBSCRIBED',
              },
            },
          },
          ...properties,
        },
      };

      const response = await fetch(`${this.baseUrl}/profiles/`, {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${this.publicKey}`,
          'Content-Type': 'application/json',
          revision: this.apiVersion,
        },
        body: JSON.stringify({ data: profileData }),
      });

      if (!response.ok) {
        throw new Error(`Klaviyo API error: ${response.status}`);
      }

      const result = await response.json();

      // Add to newsletter list
      await this.addToList(email, window.klaviyoNewsletterList);

      // Track signup event
      this.trackEvent('Newsletter Signup', { email: email });

      return result;
    } catch (error) {
      console.error('Klaviyo subscription failed:', error);
      throw error;
    }
  }

  // Add profile to specific list
  async addToList(email, listId) {
    if (!listId) return;

    try {
      const response = await fetch(`${this.baseUrl}/list-memberships/`, {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${this.publicKey}`,
          'Content-Type': 'application/json',
          revision: this.apiVersion,
        },
        body: JSON.stringify({
          data: {
            type: 'list-membership',
            attributes: {
              list_id: listId,
              profiles: [
                {
                  email: email,
                },
              ],
            },
          },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to add to Klaviyo list:', error);
      return false;
    }
  }

  // Event Tracking
  trackEvent(eventName, properties = {}) {
    if (!window._learnq) return;

    const eventData = {
      event: eventName,
      properties: {
        ...properties,
        $source: 'shopify',
        timestamp: new Date().toISOString(),
      },
    };

    window._learnq.push(['track', eventName, eventData.properties]);
  }

  // Customer Identification
  identifyCustomer(customerData) {
    if (!window._learnq) return;

    const profileData = {
      $email: customerData.email,
      $first_name: customerData.firstName,
      $last_name: customerData.lastName,
      $phone_number: customerData.phone,
      $organization: customerData.company,

      // Custom properties
      customer_id: customerData.id,
      total_spent: customerData.totalSpent,
      order_count: customerData.orderCount,
      language_preference: customerData.languagePreference || 'en',
      cultural_interests: customerData.culturalInterests || [],

      // Tamil-specific properties
      prefers_tamil_content: customerData.prefersTamilContent || false,
      cultural_affinity: customerData.culturalAffinity || 'diaspora',
    };

    window._learnq.push(['identify', profileData]);
  }

  // E-commerce Event Tracking
  setupEventTracking() {
    // Track page views
    this.trackEvent('Viewed Page', {
      page_title: document.title,
      page_url: window.location.href,
      page_type: document.body.className,
    });

    // Track product views
    if (window.productData) {
      this.trackEvent('Viewed Product', {
        product_id: window.productData.id,
        product_name: window.productData.title,
        product_price: window.productData.price / 100,
        product_url: window.location.href,
        product_type: window.productData.type,
        product_vendor: window.productData.vendor,
        cultural_design: window.productData.metafields?.cultural_category,
      });
    }
  }

  // Abandoned Cart Recovery
  trackCartAbandonment() {
    if (!window.cartData) return;

    const cartItems = window.cartData.items.map(item => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product_title,
      quantity: item.quantity,
      price: item.price / 100,
      line_price: item.line_price / 100,
    }));

    this.trackEvent('Started Checkout', {
      cart_id: window.cartData.token,
      checkout_url: `${window.location.origin}/cart`,
      items: cartItems,
      total_price: window.cartData.total_price / 100,
      item_count: window.cartData.item_count,
    });

    // Set up abandonment timer
    this.setupAbandonmentTimer();
  }

  setupAbandonmentTimer() {
    // Clear existing timer
    if (this.abandonmentTimer) {
      window.clearTimeout(this.abandonmentTimer);
    }

    // Set 30-minute abandonment timer
    this.abandonmentTimer = window.setTimeout(
      () => {
        this.trackEvent('Abandoned Cart', {
          cart_id: window.cartData?.token,
          abandonment_time: new Date().toISOString(),
          items: window.cartData?.items?.map(item => ({
            product_name: item.product_title,
            quantity: item.quantity,
            price: item.price / 100,
          })),
        });
      },
      30 * 60 * 1000
    ); // 30 minutes
  }

  // Post-Purchase Tracking
  trackPurchase(orderData) {
    const items = orderData.line_items.map(item => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.title,
      quantity: item.quantity,
      price: parseFloat(item.price),
      line_price: parseFloat(item.price) * item.quantity,
    }));

    this.trackEvent('Placed Order', {
      order_id: orderData.order_number,
      order_name: orderData.name,
      total_price: parseFloat(orderData.total_price),
      subtotal_price: parseFloat(orderData.subtotal_price),
      total_tax: parseFloat(orderData.total_tax),
      currency: orderData.currency,
      items: items,
      customer_email: orderData.email,
      order_date: orderData.created_at,
    });

    // Update customer profile
    this.identifyCustomer({
      email: orderData.email,
      firstName: orderData.billing_address?.first_name,
      lastName: orderData.billing_address?.last_name,
      phone: orderData.billing_address?.phone,
      totalSpent: parseFloat(orderData.total_price),
      orderCount: 1, // Would need to calculate from customer history
    });
  }

  // Cultural Segmentation
  updateCulturalPreferences(preferences) {
    if (!window._learnq) return;

    window._learnq.push([
      'identify',
      {
        language_preference: preferences.language,
        cultural_interests: preferences.interests,
        prefers_tamil_content: preferences.prefersTamil,
        festival_notifications: preferences.festivalNotifications,
        heritage_product_interest: preferences.heritageProducts,
      },
    ]);
  }
}

// Initialize Klaviyo service
document.addEventListener('DOMContentLoaded', () => {
  window.klaviyoService = new KlaviyoService();
});

// Global functions for easy access
window.trackKlaviyoEvent = (eventName, properties) => {
  window.klaviyoService?.trackEvent(eventName, properties);
};

window.identifyKlaviyoCustomer = customerData => {
  window.klaviyoService?.identifyCustomer(customerData);
};