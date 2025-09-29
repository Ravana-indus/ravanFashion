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
    autoFulfill: {{ settings.pod_auto_fulfill | default: true }},
    trackInventory: {{ settings.pod_sync_inventory | default: true }},
    sendEmails: true,
    culturalDesigns: {{ settings.pod_cultural_designs | default: true }},
    qualityCheck: true,
    showMockups: {{ settings.pod_show_mockups | default: true }}
  }
};

// Export for global use
window.POD_CONFIG = POD_CONFIG;