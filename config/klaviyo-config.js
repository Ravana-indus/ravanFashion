// Klaviyo Configuration
const KLAVIYO_CONFIG = {
  publicKey: '{{ settings.klaviyo_public_key }}',
  privateKey: '{{ settings.klaviyo_private_key }}', // Server-side only
  apiVersion: '2024-02-15',
  baseUrl: 'https://a.klaviyo.com/api',

  // List IDs
  lists: {
    newsletter: '{{ settings.klaviyo_newsletter_list }}',
    customers: '{{ settings.klaviyo_customer_list }}',
    vip: '{{ settings.klaviyo_vip_list }}',
  },

  // Event tracking
  events: {
    signUp: 'Newsletter Signup',
    purchase: 'Placed Order',
    viewedProduct: 'Viewed Product',
    addedToCart: 'Added to Cart',
    startedCheckout: 'Started Checkout',
  },
};

// Export for global use
window.KLAVIYO_CONFIG = KLAVIYO_CONFIG;