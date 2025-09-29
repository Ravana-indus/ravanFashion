// Integration tests for POD integration
import { jest } from '@jest/globals';
import PODService from '../../../assets/pod-service.js';

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock Shopify AJAX API
global.ShopifyAJAX = {
  cart: {
    get: jest.fn(),
    add: jest.fn(),
    update: jest.fn(),
    change: jest.fn(),
    clear: jest.fn(),
  },
};

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = mockLocalStorage;

describe('PODService Integration', () => {
  let podService;
  const mockPrintfulConfig = {
    apiKey: 'test_printful_key',
    shopId: 'test_shop_123',
    webhookSecret: 'test_webhook_secret',
  };

  const mockPrintifyConfig = {
    apiKey: 'test_printify_key',
    shopId: 'test_shop_456',
    webhookKey: 'test_webhook_key',
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    mockLocalStorage.clear();

    // Setup DOM
    document.body.innerHTML = `
      <div class="pod-mockup-display" data-product-id="123456789">
        <div class="mockup-gallery">
          <img src="mockup1.jpg" alt="Mockup 1" data-view="front">
          <img src="mockup2.jpg" alt="Mockup 2" data-view="back">
        </div>
        <div class="pod-controls">
          <select class="pod-provider-select">
            <option value="printful">Printful</option>
            <option value="printify">Printify</option>
          </select>
          <button class="pod-sync-btn">Sync Mockups</button>
        </div>
      </div>
    `;

    // Create new instance
    podService = new PODService();
  });

  afterEach(() => {
    // Cleanup
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    test('should initialize with default provider', () => {
      expect(podService.provider).toBe('printful');
      expect(podService.isInitialized).toBe(true);
    });

    test('should initialize with specific provider', () => {
      const printifyService = new PODService('printify');
      expect(printifyService.provider).toBe('printify');
    });
  });

  describe('configureProvider', () => {
    test('should configure Printful provider', () => {
      podService.configureProvider('printful', mockPrintfulConfig);

      expect(podService.config.printful).toEqual(mockPrintfulConfig);
    });

    test('should configure Printify provider', () => {
      podService.configureProvider('printify', mockPrintifyConfig);

      expect(podService.config.printify).toEqual(mockPrintfulConfig);
    });

    test('should handle invalid provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      podService.configureProvider('invalid', {});

      expect(consoleSpy).toHaveBeenCalledWith('Invalid POD provider: invalid');

      consoleSpy.mockRestore();
    });
  });

  describe('generateMockups', () => {
    const mockProduct = {
      id: 123456789,
      title: 'Traditional Silk Saree',
      handle: 'traditional-silk-saree',
      images: [
        {
          id: 1,
          src: 'https://cdn.shopify.com/s/files/1/0000/0000/0000/products/saree.jpg',
          alt: 'Traditional Silk Saree',
        },
      ],
      variants: [
        {
          id: 123456789,
          title: 'Default',
          price: 4999,
          available: true,
        },
      ],
      metafields: {
        pod: {
          designFiles: [
            {
              type: 'front',
              url: 'design_front.png',
              position: { x: 100, y: 100 },
              size: { width: 800, height: 800 },
            },
            {
              type: 'back',
              url: 'design_back.png',
              position: { x: 100, y: 100 },
              size: { width: 800, height: 800 },
            },
          ],
          printProvider: 'printful',
          productId: 'printful_123',
        },
      },
    };

    test('should generate mockups for Printful', async () => {
      const mockResponse = {
        result: {
          mockup_task_id: 'task_123',
          status: 'pending',
        },
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await podService.generateMockups(mockProduct);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.printful.com/mockup-generator/create-task',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockPrintfulConfig.apiKey}`,
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    test('should generate mockups for Printify', async () => {
      podService.configureProvider('printify', mockPrintifyConfig);
      podService.provider = 'printify';

      const mockResponse = {
        id: 'task_456',
        status: 'processing',
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await podService.generateMockups(mockProduct);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.printify.com/v1/shops/${mockPrintifyConfig.shopId}/mockups/generate`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockPrintifyConfig.apiKey}`,
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    test('should handle mockup generation errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await podService.generateMockups(mockProduct);

      expect(consoleSpy).toHaveBeenCalledWith('Mockup generation failed:', expect.any(Error));
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe('getMockupStatus', () => {
    test('should check Printful mockup status', async () => {
      const mockResponse = {
        result: {
          status: 'completed',
          mockups: [
            {
              type: 'front',
              url: 'mockup_front.jpg',
            },
            {
              type: 'back',
              url: 'mockup_back.jpg',
            },
          ],
        },
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await podService.getMockupStatus('task_123');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.printful.com/mockup-generator/task?task_key=task_123',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockPrintfulConfig.apiKey}`,
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    test('should check Printify mockup status', async () => {
      podService.configureProvider('printify', mockPrintifyConfig);
      podService.provider = 'printify';

      const mockResponse = {
        status: 'completed',
        mockups: [
          {
            type: 'front',
            url: 'mockup_front.jpg',
          },
        ],
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await podService.getMockupStatus('task_456');

      expect(fetch).toHaveBeenCalledWith(
        `https://api.printify.com/v1/shops/${mockPrintifyConfig.shopId}/mockups/task_456`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockPrintifyConfig.apiKey}`,
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('processOrder', () => {
    const mockOrder = {
      id: '12345',
      email: 'test@example.com',
      items: [
        {
          productId: 123456789,
          variantId: 123456789,
          quantity: 1,
          price: 4999,
          title: 'Traditional Silk Saree',
        },
      ],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'Anytown',
        zip: '12345',
        country: 'US',
      },
    };

    test('should process order with Printful', async () => {
      podService.configureProvider('printful', mockPrintfulConfig);

      const mockResponse = {
        result: {
          id: 'printful_order_123',
          status: 'pending',
        },
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await podService.processOrder(mockOrder);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.printful.com/orders',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockPrintfulConfig.apiKey}`,
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    test('should process order with Printify', async () => {
      podService.configureProvider('printify', mockPrintifyConfig);
      podService.provider = 'printify';

      const mockResponse = {
        id: 'printify_order_456',
        status: 'pending',
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await podService.processOrder(mockOrder);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.printify.com/v1/shops/${mockPrintifyConfig.shopId}/orders`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockPrintifyConfig.apiKey}`,
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    test('should handle cultural order processing', async () => {
      const culturalOrder = {
        ...mockOrder,
        culturalContext: {
          festival: 'Diwali',
          culturalDesigns: true,
          specialInstructions: 'Please use traditional packaging',
        },
      };

      podService.configureProvider('printful', mockPrintfulConfig);

      const mockResponse = {
        result: {
          id: 'printful_order_123',
          status: 'pending',
        },
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await podService.processOrder(culturalOrder);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.printful.com/orders',
        expect.objectContaining({
          body: expect.stringContaining('culturalContext'),
        })
      );
    });
  });

  describe('syncInventory', () => {
    test('should sync inventory with Printful', async () => {
      podService.configureProvider('printful', mockPrintfulConfig);

      const mockResponse = {
        result: [
          {
            id: 123456789,
            stock: 10,
            sync_status: 'synced',
          },
        ],
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await podService.syncInventory();

      expect(fetch).toHaveBeenCalledWith(
        'https://api.printful.com/store/products',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockPrintfulConfig.apiKey}`,
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    test('should sync inventory with Printify', async () => {
      podService.configureProvider('printify', mockPrintifyConfig);
      podService.provider = 'printify';

      const mockResponse = [
        {
          id: 123456789,
          inventory: 10,
          status: 'published',
        },
      ];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await podService.syncInventory();

      expect(fetch).toHaveBeenCalledWith(
        `https://api.printify.com/v1/shops/${mockPrintifyConfig.shopId}/products.json`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockPrintifyConfig.apiKey}`,
          }),
        })
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('webhook handling', () => {
    test('should handle Printful webhook', () => {
      const mockWebhookData = {
        type: 'package_shipped',
        data: {
          order: {
            id: 'printful_order_123',
            status: 'shipped',
            tracking: {
              number: 'TRK123456789',
              url: 'https://tracking.example.com',
            },
          },
        },
      };

      const result = podService.handleWebhook('printful', mockWebhookData);

      expect(result).toBe(true);
      expect(podService.webhookEvents).toContainEqual(
        expect.objectContaining({
          provider: 'printful',
          type: 'package_shipped',
        })
      );
    });

    test('should handle Printify webhook', () => {
      const mockWebhookData = {
        type: 'order:created',
        payload: {
          order: {
            id: 'printify_order_456',
            status: 'pending',
          },
        },
      };

      const result = podService.handleWebhook('printify', mockWebhookData);

      expect(result).toBe(true);
      expect(podService.webhookEvents).toContainEqual(
        expect.objectContaining({
          provider: 'printify',
          type: 'order:created',
        })
      );
    });

    test('should handle cultural design webhook', () => {
      const mockWebhookData = {
        type: 'design_approved',
        data: {
          design: {
            id: 'design_123',
            type: 'cultural',
            status: 'approved',
            culturalTheme: 'traditional',
          },
        },
      };

      const result = podService.handleWebhook('printful', mockWebhookData);

      expect(result).toBe(true);
      expect(podService.webhookEvents).toContainEqual(
        expect.objectContaining({
          provider: 'printful',
          type: 'design_approved',
          culturalTheme: 'traditional',
        })
      );
    });

    test('should validate webhook signature', () => {
      const mockWebhookData = {
        type: 'test',
        data: {},
      };

      const mockSignature = 'valid_signature';
      const mockPayload = JSON.stringify(mockWebhookData);

      const isValid = podService.validateWebhookSignature(
        'printful',
        mockPayload,
        mockSignature,
        mockPrintfulConfig.webhookSecret
      );

      expect(isValid).toBe(true);
    });
  });

  describe('cultural design features', () => {
    test('should validate cultural design requirements', () => {
      const design = {
        type: 'traditional',
        patterns: ['kolam', 'temple'],
        colors: ['#d4af37', '#6a1b1b'],
        culturalTheme: 'tamil',
      };

      const isValid = podService.validateCulturalDesign(design);

      expect(isValid).toBe(true);
    });

    test('should reject invalid cultural designs', () => {
      const design = {
        type: 'modern',
        patterns: ['geometric'],
        colors: ['#ff0000', '#00ff00'],
      };

      const isValid = podService.validateCulturalDesign(design);

      expect(isValid).toBe(false);
    });

    test('should enhance mockups with cultural elements', () => {
      const mockupUrl = 'https://example.com/mockup.jpg';
      const culturalElements = {
        border: 'temple',
        background: 'silk',
        overlay: 'traditional',
      };

      const enhancedUrl = podService.enhanceCulturalMockup(mockupUrl, culturalElements);

      expect(enhancedUrl).toContain('cultural=true');
      expect(enhancedUrl).toContain('border=temple');
      expect(enhancedUrl).toContain('background=silk');
    });
  });

  describe('error handling', () => {
    test('should handle missing configuration', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      podService.configureProvider('printful', null);

      expect(consoleSpy).toHaveBeenCalledWith('Provider configuration is required');

      consoleSpy.mockRestore();
    });

    test('should handle API errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      const result = await podService.syncInventory();

      expect(consoleSpy).toHaveBeenCalledWith('POD API error:', expect.any(Error));
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });

    test('should handle invalid webhook data', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = podService.handleWebhook('printful', null);

      expect(consoleSpy).toHaveBeenCalledWith('Invalid webhook data');
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });
  });
});