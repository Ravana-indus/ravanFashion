// Unit tests for quick-view.js
import { jest } from '@jest/globals';
import QuickView from '../../../assets/quick-view.js';

// Mock Shopify AJAX API
global.ShopifyAJAX = {
  product: {
    get: jest.fn(),
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

describe('QuickView', () => {
  let quickView;
  let mockButton;
  let mockModal;
  let mockContainer;

  const mockProduct = {
    id: 123456789,
    title: 'Traditional Silk Saree',
    handle: 'traditional-silk-saree',
    description: 'Beautiful traditional silk saree with intricate designs',
    price: 4999,
    compare_at_price: 6999,
    available: true,
    featured_image: 'https://cdn.shopify.com/s/files/1/0000/0000/0000/products/saree.jpg',
    images: [
      {
        id: 123456789,
        src: 'https://cdn.shopify.com/s/files/1/0000/0000/0000/products/saree.jpg',
        alt: 'Traditional Silk Saree',
      },
    ],
    variants: [
      {
        id: 123456789,
        title: 'Default',
        price: 4999,
        compare_at_price: 6999,
        available: true,
        option1: 'Default',
        sku: 'SAREE-001',
      },
    ],
    options: [
      {
        name: 'Size',
        position: 1,
        values: ['S', 'M', 'L'],
      },
    ],
    tags: ['saree', 'traditional', 'silk'],
    type: 'Cultural Wear',
    vendor: 'Ravan Fashion',
  };

  beforeEach(() => {
    // Setup DOM
    mockContainer = document.createElement('div');
    mockContainer.className = 'quick-view-container';
    mockContainer.innerHTML = `
      <button class="quick-view-btn" data-product-id="123456789">
        Quick View
      </button>
    `;
    document.body.appendChild(mockContainer);

    mockButton = mockContainer.querySelector('.quick-view-btn');

    // Create modal element
    mockModal = document.createElement('div');
    mockModal.className = 'quick-view-modal';
    mockModal.style.display = 'none';
    mockModal.innerHTML = `
      <div class="quick-view-modal__content">
        <button class="quick-view-modal__close">&times;</button>
        <div class="quick-view-modal__body">
          <!-- Product content will be inserted here -->
        </div>
      </div>
    `;
    document.body.appendChild(mockModal);

    // Clear mocks
    jest.clearAllMocks();
    mockLocalStorage.clear();

    // Create new instance
    quickView = new QuickView(mockContainer);
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
    document.body.removeChild(mockModal);
  });

  describe('constructor', () => {
    test('should initialize with container and modal', () => {
      expect(quickView.container).toBe(mockContainer);
      expect(quickView.modal).toBe(mockModal);
      expect(quickView.isOpen).toBe(false);
    });

    test('should initialize event listeners', () => {
      expect(quickView.container).not.toBeNull();
    });
  });

  describe('open', () => {
    test('should open modal and fetch product data', async () => {
      const mockResponse = { product: mockProduct };
      ShopifyAJAX.product.get.mockResolvedValue(mockResponse);

      await quickView.open(123456789);

      expect(ShopifyAJAX.product.get).toHaveBeenCalledWith(123456789);
      expect(quickView.isOpen).toBe(true);
      expect(mockModal.style.display).toBe('block');
    });

    test('should display product information in modal', async () => {
      const mockResponse = { product: mockProduct };
      ShopifyAJAX.product.get.mockResolvedValue(mockResponse);

      await quickView.open(123456789);

      const modalBody = mockModal.querySelector('.quick-view-modal__body');
      expect(modalBody.innerHTML).toContain(mockProduct.title);
      expect(modalBody.innerHTML).toContain(mockProduct.description);
      expect(modalBody.innerHTML).toContain(mockProduct.price.toString());
    });

    test('should handle product fetch error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      ShopifyAJAX.product.get.mockRejectedValue(new Error('Product not found'));

      await quickView.open(123456789);

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching product:', expect.any(Error));
      expect(quickView.isOpen).toBe(false);

      consoleSpy.mockRestore();
    });

    test('should add aria-hidden attribute to other elements', async () => {
      const mockResponse = { product: mockProduct };
      ShopifyAJAX.product.get.mockResolvedValue(mockResponse);

      // Add some other elements to test
      const otherElement = document.createElement('div');
      otherElement.className = 'other-element';
      document.body.appendChild(otherElement);

      await quickView.open(123456789);

      expect(otherElement).toHaveAttribute('aria-hidden', 'true');

      document.body.removeChild(otherElement);
    });
  });

  describe('close', () => {
    test('should close modal', () => {
      // First open the modal
      quickView.isOpen = true;
      mockModal.style.display = 'block';

      quickView.close();

      expect(quickView.isOpen).toBe(false);
      expect(mockModal.style.display).toBe('none');
    });

    test('should remove aria-hidden attribute from other elements', () => {
      // Setup
      const otherElement = document.createElement('div');
      otherElement.className = 'other-element';
      otherElement.setAttribute('aria-hidden', 'true');
      document.body.appendChild(otherElement);

      quickView.close();

      expect(otherElement).not.toHaveAttribute('aria-hidden');

      document.body.removeChild(otherElement);
    });

    test('should reset modal content', () => {
      const modalBody = mockModal.querySelector('.quick-view-modal__body');
      modalBody.innerHTML = '<div>Previous content</div>';

      quickView.close();

      expect(modalBody.innerHTML).toBe('');
    });
  });

  describe('renderProduct', () => {
    test('should render product with all details', () => {
      quickView.renderProduct(mockProduct);

      const modalBody = mockModal.querySelector('.quick-view-modal__body');
      const htmlContent = modalBody.innerHTML;

      expect(htmlContent).toContain(mockProduct.title);
      expect(htmlContent).toContain(mockProduct.description);
      expect(htmlContent).toContain(mockProduct.price.toString());
      expect(htmlContent).toContain(mockProduct.featured_image);
      expect(htmlContent).toContain('Add to Cart');
    });

    test('should render product variants', () => {
      quickView.renderProduct(mockProduct);

      const modalBody = mockModal.querySelector('.quick-view-modal__body');
      const htmlContent = modalBody.innerHTML;

      expect(htmlContent).toContain('Size');
      mockProduct.variants.forEach(variant => {
        expect(htmlContent).toContain(variant.option1);
      });
    });

    test('should render sale badge when applicable', () => {
      const saleProduct = { ...mockProduct, compare_at_price: 7999 };
      quickView.renderProduct(saleProduct);

      const modalBody = mockModal.querySelector('.quick-view-modal__body');
      const htmlContent = modalBody.innerHTML;

      expect(htmlContent).toContain('Sale');
    });

    test('should render sold out badge when applicable', () => {
      const soldOutProduct = { ...mockProduct, available: false };
      quickView.renderProduct(soldOutProduct);

      const modalBody = mockModal.querySelector('.quick-view-modal__body');
      const htmlContent = modalBody.innerHTML;

      expect(htmlContent).toContain('Sold Out');
    });
  });

  describe('event handling', () => {
    test('should handle quick view button click', async () => {
      const mockResponse = { product: mockProduct };
      ShopifyAJAX.product.get.mockResolvedValue(mockResponse);

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });

      mockButton.dispatchEvent(clickEvent);

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(ShopifyAJAX.product.get).toHaveBeenCalledWith('123456789');
    });

    test('should handle close button click', () => {
      const closeButton = mockModal.querySelector('.quick-view-modal__close');
      quickView.isOpen = true;
      mockModal.style.display = 'block';

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });

      closeButton.dispatchEvent(clickEvent);

      expect(quickView.isOpen).toBe(false);
      expect(mockModal.style.display).toBe('none');
    });

    test('should handle modal overlay click', () => {
      quickView.isOpen = true;
      mockModal.style.display = 'block';

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });

      mockModal.dispatchEvent(clickEvent);

      expect(quickView.isOpen).toBe(false);
      expect(mockModal.style.display).toBe('none');
    });

    test('should prevent modal content click from closing', () => {
      const modalContent = mockModal.querySelector('.quick-view-modal__content');
      quickView.isOpen = true;
      mockModal.style.display = 'block';

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });

      modalContent.dispatchEvent(clickEvent);

      expect(quickView.isOpen).toBe(true);
      expect(mockModal.style.display).toBe('block');
    });

    test('should handle escape key press', () => {
      quickView.isOpen = true;
      mockModal.style.display = 'block';

      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });

      document.dispatchEvent(keydownEvent);

      expect(quickView.isOpen).toBe(false);
      expect(mockModal.style.display).toBe('none');
    });
  });

  describe('utility methods', () => {
    test('should format currency correctly', () => {
      expect(QuickView.formatCurrency(4999)).toBe('$49.99');
      expect(QuickView.formatCurrency(100)).toBe('$1.00');
      expect(QuickView.formatCurrency(0)).toBe('$0.00');
    });

    test('should format product images correctly', () => {
      const imageUrl = 'https://cdn.shopify.com/s/files/1/0000/0000/0000/products/saree.jpg';
      const formattedUrl = QuickView.formatImageUrl(imageUrl, '800x800');
      expect(formattedUrl).toBe(imageUrl + '?width=800&height=800');
    });

    test('should generate variant selector HTML', () => {
      const variantHtml = QuickView.generateVariantSelector(mockProduct.options[0]);
      expect(variantHtml).toContain('Size');
      expect(variantHtml).toContain('S');
      expect(variantHtml).toContain('M');
      expect(variantHtml).toContain('L');
    });

    test('should generate image gallery HTML', () => {
      const galleryHtml = QuickView.generateImageGallery(mockProduct.images);
      expect(galleryHtml).toContain(mockProduct.images[0].src);
      expect(galleryHtml).toContain('alt="' + mockProduct.images[0].alt + '"');
    });
  });

  describe('error handling', () => {
    test('should handle missing product data', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      quickView.renderProduct(null);

      expect(consoleSpy).toHaveBeenCalledWith('Product data is required');

      consoleSpy.mockRestore();
    });

    test('should handle missing container', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const invalidQuickView = new QuickView(null);

      expect(consoleSpy).toHaveBeenCalledWith('Quick view container is required');

      consoleSpy.mockRestore();
    });

    test('should handle missing modal', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const modalLessContainer = document.createElement('div');
      modalLessContainer.innerHTML = '<button class="quick-view-btn">Quick View</button>';
      document.body.appendChild(modalLessContainer);

      const invalidQuickView = new QuickView(modalLessContainer);

      expect(consoleSpy).toHaveBeenCalledWith('Quick view modal not found');

      document.body.removeChild(modalLessContainer);
      consoleSpy.mockRestore();
    });
  });

  describe('accessibility', () => {
    test('should set focus management', async () => {
      const mockResponse = { product: mockProduct };
      ShopifyAJAX.product.get.mockResolvedValue(mockResponse);

      await quickView.open(123456789);

      expect(document.activeElement).toBe(mockModal.querySelector('.quick-view-modal__close'));
    });

    test('should trap focus within modal', async () => {
      const mockResponse = { product: mockProduct };
      ShopifyAJAX.product.get.mockResolvedValue(mockResponse);

      await quickView.open(123456789);

      const focusableElements = mockModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });
});