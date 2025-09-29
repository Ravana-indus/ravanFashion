// Integration tests for Klaviyo email integration
import { jest } from '@jest/globals';
import KlaviyoService from '../../../assets/klaviyo-service.js';

// Mock global Klaviyo object
global._learnq = jest.fn();

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = mockLocalStorage;

describe('KlaviyoService Integration', () => {
  let klaviyoService;
  const mockApiKey = 'test_public_key_123';
  const mockPrivateKey = 'test_private_key_456';

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    mockLocalStorage.clear();

    // Setup DOM
    document.body.innerHTML = `
      <div class="klaviyo-form">
        <form id="newsletter-form">
          <input type="email" name="email" required>
          <button type="submit">Subscribe</button>
        </form>
      </div>
    `;

    // Create new instance
    klaviyoService = new KlaviyoService(mockApiKey, mockPrivateKey);
  });

  afterEach(() => {
    // Cleanup
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    test('should initialize with API keys', () => {
      expect(klaviyoService.publicKey).toBe(mockApiKey);
      expect(klaviyoService.privateKey).toBe(mockPrivateKey);
      expect(klaviyoService.isInitialized).toBe(true);
    });

    test('should initialize Klaviyo script', () => {
      expect(global._learnq).toHaveBeenCalledWith(['account', mockApiKey]);
    });
  });

  describe('identifyCustomer', () => {
    const mockCustomer = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    };

    test('should identify customer with basic info', () => {
      klaviyoService.identifyCustomer(mockCustomer);

      expect(global._learnq).toHaveBeenCalledWith([
        'identify',
        {
          $email: mockCustomer.email,
          $first_name: mockCustomer.firstName,
          $last_name: mockCustomer.lastName,
          $phone_number: mockCustomer.phone,
        },
      ]);
    });

    test('should identify customer with cultural preferences', () => {
      const customerWithPrefs = {
        ...mockCustomer,
        languagePreference: 'ta',
        culturalInterests: ['traditional', 'festival'],
        prefersTamilContent: true,
      };

      klaviyoService.identifyCustomer(customerWithPrefs);

      expect(global._learnq).toHaveBeenCalledWith([
        'identify',
        expect.objectContaining({
          $email: mockCustomer.email,
          language_preference: 'ta',
          cultural_interests: ['traditional', 'festival'],
          prefers_tamil_content: true,
        }),
      ]);
    });

    test('should store customer identification in localStorage', () => {
      klaviyoService.identifyCustomer(mockCustomer);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'klaviyo_customer',
        JSON.stringify(mockCustomer)
      );
    });
  });

  describe('trackEvent', () => {
    test('should track custom event', () => {
      const eventData = {
        productName: 'Traditional Silk Saree',
        productId: '123456789',
        price: 4999,
        currency: 'USD',
      };

      klaviyoService.trackEvent('Product Viewed', eventData);

      expect(global._learnq).toHaveBeenCalledWith([
        'track',
        'Product Viewed',
        eventData,
      ]);
    });

    test('should track cultural event', () => {
      const culturalEventData = {
        festival: 'Pongal',
        culturalCategory: 'Traditional Wear',
        language: 'ta',
      };

      klaviyoService.trackEvent('Cultural Event Viewed', culturalEventData);

      expect(global._learnq).toHaveBeenCalledWith([
        'track',
        'Cultural Event Viewed',
        culturalEventData,
      ]);
    });

    test('should add timestamp to events', () => {
      const eventData = { productName: 'Test Product' };
      const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1640995200000);

      klaviyoService.trackEvent('Test Event', eventData);

      expect(global._learnq).toHaveBeenCalledWith([
        'track',
        'Test Event',
        expect.objectContaining({
          ...eventData,
          timestamp: 1640995200000,
        }),
      ]);

      dateSpy.mockRestore();
    });
  });

  describe('addToCart', () => {
    const mockCartItem = {
      productId: '123456789',
      variantId: '123456789',
      name: 'Traditional Silk Saree',
      price: 4999,
      quantity: 1,
      imageUrl: 'https://cdn.shopify.com/s/files/1/0000/0000/0000/products/saree.jpg',
      url: '/products/traditional-silk-saree',
    };

    test('should track add to cart event', () => {
      klaviyoService.addToCart(mockCartItem);

      expect(global._learnq).toHaveBeenCalledWith([
        'track',
        'Added to Cart',
        {
          $value: mockCartItem.price,
          AddedItemProductName: mockCartItem.name,
          AddedItemProductID: mockCartItem.productId,
          AddedItemSKU: mockCartItem.variantId,
          AddedItemCategories: ['Cultural Wear'],
          AddedItemImageURL: mockCartItem.imageUrl,
          AddedItemURL: mockCartItem.url,
          AddedItemPrice: mockCartItem.price,
          AddedItemQuantity: mockCartItem.quantity,
        },
      ]);
    });

    test('should handle cultural product categorization', () => {
      const culturalCartItem = {
        ...mockCartItem,
        tags: ['traditional', 'festival-wear', 'saree'],
      };

      klaviyoService.addToCart(culturalCartItem);

      expect(global._learnq).toHaveBeenCalledWith([
        'track',
        'Added to Cart',
        expect.objectContaining({
          AddedItemCategories: ['Traditional', 'Festival Wear', 'Saree'],
        }),
      ]);
    });
  });

  describe('trackPurchase', () => {
    const mockOrder = {
      orderId: '12345',
      total: 4999,
      discountCode: 'FESTIVAL10',
      items: [
        {
          productId: '123456789',
          name: 'Traditional Silk Saree',
          price: 4999,
          quantity: 1,
          sku: 'SAREE-001',
        },
      ],
    };

    test('should track purchase event', () => {
      klaviyoService.trackPurchase(mockOrder);

      expect(global._learnq).toHaveBeenCalledWith([
        'track',
        'Placed Order',
        {
          $event_id: mockOrder.orderId,
          $value: mockOrder.total,
          $currency: 'USD',
          Items: [
            {
              ProductID: mockOrder.items[0].productId,
              SKU: mockOrder.items[0].sku,
              ProductName: mockOrder.items[0].name,
              Quantity: mockOrder.items[0].quantity,
              ItemPrice: mockOrder.items[0].price,
              RowTotal: mockOrder.items[0].price * mockOrder.items[0].quantity,
            },
          ],
          Discounts: mockOrder.discountCode,
        },
      ]);
    });

    test('should handle cultural purchase attribution', () => {
      const culturalOrder = {
        ...mockOrder,
        culturalContext: {
          festival: 'Diwali',
          culturalCategory: 'Traditional Wear',
          language: 'ta',
        },
      };

      klaviyoService.trackPurchase(culturalOrder);

      expect(global._learnq).toHaveBeenCalledWith([
        'track',
        'Placed Order',
        expect.objectContaining({
          cultural_context: culturalOrder.culturalContext,
        }),
      ]);
    });
  });

  describe('newsletterSubscription', () => {
    const mockEmail = 'test@example.com';
    const mockListId = 'test_list_123';

    test('should subscribe to newsletter', async () => {
      const mockResponse = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await klaviyoService.newsletterSubscription(mockEmail, mockListId);

      expect(fetch).toHaveBeenCalledWith(
        'https://a.klaviyo.com/client/subscriptions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': `Klaviyo-API-Key ${mockPrivateKey}`,
          }),
        })
      );

      expect(result).toBe(mockResponse);
    });

    test('should handle subscription errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await klaviyoService.newsletterSubscription(mockEmail, mockListId);

      expect(consoleSpy).toHaveBeenCalledWith('Newsletter subscription failed:', expect.any(Error));
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe('abandonedCartRecovery', () => {
    const mockCart = {
      items: [
        {
          productId: '123456789',
          name: 'Traditional Silk Saree',
          price: 4999,
          quantity: 1,
        },
      ],
      total: 4999,
    };

    test('should track abandoned cart', () => {
      klaviyoService.abandonedCartRecovery(mockCart);

      expect(global._learnq).toHaveBeenCalledWith([
        'track',
        'Started Checkout',
        {
          $event_id: expect.any(String),
          $value: mockCart.total,
          ItemNames: mockCart.items.map(item => item.name),
          CheckoutURL: '/checkout',
          Categories: ['Cultural Wear'],
        },
      ]);
    });

    test('should track cart with cultural items', () => {
      const culturalCart = {
        ...mockCart,
        items: [
          {
            ...mockCart.items[0],
            tags: ['traditional', 'festival-wear'],
          },
        ],
      };

      klaviyoService.abandonedCartRecovery(culturalCart);

      expect(global._learnq).toHaveBeenCalledWith([
        'track',
        'Started Checkout',
        expect.objectContaining({
          Categories: ['Traditional', 'Festival Wear'],
        }),
      ]);
    });
  });

  describe('updateCulturalPreferences', () => {
    const mockPreferences = {
      language: 'ta',
      interests: ['traditional', 'festival', 'heritage'],
      prefersTamil: true,
      festivalNotifications: true,
      heritageProducts: true,
    };

    test('should update cultural preferences', () => {
      klaviyoService.updateCulturalPreferences(mockPreferences);

      expect(global._learnq).toHaveBeenCalledWith([
        'identify',
        expect.objectContaining({
          language_preference: mockPreferences.language,
          cultural_interests: mockPreferences.interests,
          prefers_tamil_content: mockPreferences.prefersTamil,
          festival_notifications: mockPreferences.festivalNotifications,
          heritage_product_interest: mockPreferences.heritageProducts,
        }),
      ]);
    });

    test('should store preferences in localStorage', () => {
      klaviyoService.updateCulturalPreferences(mockPreferences);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'klaviyo_cultural_preferences',
        JSON.stringify(mockPreferences)
      );
    });
  });

  describe('getCulturalSegment', () => {
    test('should identify Tamil cultural segment', () => {
      const segment = klaviyoService.getCulturalSegment({
        language: 'ta',
        interests: ['traditional'],
        prefersTamil: true,
      });

      expect(segment).toBe('tamil-traditional');
    });

    test('should identify festival segment', () => {
      const segment = klaviyoService.getCulturalSegment({
        interests: ['festival', 'traditional'],
        language: 'en',
      });

      expect(segment).toBe('festival-traditional');
    });

    test('should identify heritage segment', () => {
      const segment = klaviyoService.getCulturalSegment({
        interests: ['heritage'],
        language: 'en',
      });

      expect(segment).toBe('heritage');
    });

    test('should return general segment for no cultural interests', () => {
      const segment = klaviyoService.getCulturalSegment({
        language: 'en',
        interests: [],
      });

      expect(segment).toBe('general');
    });
  });

  describe('error handling', () => {
    test('should handle missing API keys', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const invalidService = new KlaviyoService();

      expect(consoleSpy).toHaveBeenCalledWith('Klaviyo API keys are required');
      expect(invalidService.isInitialized).toBe(false);

      consoleSpy.mockRestore();
    });

    test('should handle missing customer data', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      klaviyoService.identifyCustomer(null);

      expect(consoleSpy).toHaveBeenCalledWith('Customer data is required for identification');

      consoleSpy.mockRestore();
    });

    test('should handle invalid event data', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      klaviyoService.trackEvent(null, null);

      expect(consoleSpy).toHaveBeenCalledWith('Event name and data are required');

      consoleSpy.mockRestore();
    });
  });

  describe('DOM integration', () => {
    test('should initialize newsletter form tracking', () => {
      const form = document.getElementById('newsletter-form');
      const submitSpy = jest.spyOn(form, 'addEventListener');

      klaviyoService.initializeNewsletterForm();

      expect(submitSpy).toHaveBeenCalledWith('submit', expect.any(Function));
    });

    test('should handle newsletter form submission', async () => {
      const mockResponse = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const form = document.getElementById('newsletter-form');
      const emailInput = form.querySelector('input[name="email"]');
      emailInput.value = 'test@example.com';

      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(fetch).toHaveBeenCalledWith(
        'https://a.klaviyo.com/client/subscriptions',
        expect.any(Object)
      );
    });
  });
});