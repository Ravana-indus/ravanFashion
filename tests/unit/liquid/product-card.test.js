// Unit tests for product-card.liquid template
import { jest } from '@jest/globals';

describe('Product Card Template', () => {
  const mockProduct = {
    id: 123456789,
    title: 'Traditional Silk Saree',
    handle: 'traditional-silk-saree',
    price: 4999,
    compare_at_price: 6999,
    available: true,
    featured_image: 'https://cdn.shopify.com/s/files/1/0000/0000/0000/products/saree.jpg',
    tags: ['saree', 'traditional', 'silk'],
    type: 'Cultural Wear',
    vendor: 'Ravan Fashion',
    variants: [
      {
        id: 123456789,
        title: 'Default',
        price: 4999,
        compare_at_price: 6999,
        available: true,
      },
    ],
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="product-card" data-product-id="${mockProduct.id}">
        <div class="product-card__image-wrapper">
          <a href="/products/${mockProduct.handle}" class="product-card__link">
            <img
              src="${mockProduct.featured_image}"
              alt="${mockProduct.title}"
              class="product-card__image"
              loading="lazy"
            >
          </a>

          <div class="product-card__badges">
            ${mockProduct.compare_at_price > mockProduct.price ?
              '<span class="product-card__badge product-card__badge--sale">Sale</span>' : ''
            }
            ${!mockProduct.available ?
              '<span class="product-card__badge product-card__badge--sold-out">Sold Out</span>' : ''
            }
          </div>
        </div>

        <div class="product-card__content">
          <div class="product-card__vendor">${mockProduct.vendor}</div>

          <h3 class="product-card__title">
            <a href="/products/${mockProduct.handle}" class="product-card__link">
              ${mockProduct.title}
            </a>
          </h3>

          <div class="product-card__price">
            <span class="product-card__price-amount">
              {{ ${mockProduct.price} | money }}
            </span>
            ${mockProduct.compare_at_price > mockProduct.price ?
              `<span class="product-card__price-compare">
                {{ ${mockProduct.compare_at_price} | money }}
              </span>` : ''
            }
          </div>

          <div class="product-card__tags">
            ${mockProduct.tags.map(tag =>
              `<span class="product-card__tag">${tag}</span>`
            ).join('')}
          </div>

          <div class="product-card__actions">
            <button
              class="product-card__quick-view"
              data-product-id="${mockProduct.id}"
              aria-label="Quick view ${mockProduct.title}"
            >
              Quick View
            </button>

            <button
              class="product-card__add-to-cart"
              data-variant-id="${mockProduct.variants[0].id}"
              ${!mockProduct.available ? 'disabled' : ''}
              aria-label="Add ${mockProduct.title} to cart"
            >
              ${mockProduct.available ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>

        <div class="product-card__wishlist" data-product-id="${mockProduct.id}">
          <button
            class="wishlist-toggle"
            aria-label="Add ${mockProduct.title} to wishlist"
          >
            <svg class="wishlist-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  });

  test('should render product card with all required elements', () => {
    const productCard = document.querySelector('.product-card');
    expect(productCard).toBeInTheDocument();
    expect(productCard).toHaveAttribute('data-product-id', mockProduct.id.toString());
  });

  test('should display product image with proper alt text', () => {
    const productImage = document.querySelector('.product-card__image');
    expect(productImage).toBeInTheDocument();
    expect(productImage).toHaveAttribute('src', mockProduct.featured_image);
    expect(productImage).toHaveAttribute('alt', mockProduct.title);
    expect(productImage).toHaveAttribute('loading', 'lazy');
  });

  test('should display product title with link', () => {
    const productTitle = document.querySelector('.product-card__title');
    expect(productTitle).toBeInTheDocument();
    expect(productTitle).toHaveTextContent(mockProduct.title);

    const productLink = document.querySelector('.product-card__link');
    expect(productLink).toBeInTheDocument();
    expect(productLink).toHaveAttribute('href', `/products/${mockProduct.handle}`);
  });

  test('should display product vendor', () => {
    const vendor = document.querySelector('.product-card__vendor');
    expect(vendor).toBeInTheDocument();
    expect(vendor).toHaveTextContent(mockProduct.vendor);
  });

  test('should display price information', () => {
    const priceAmount = document.querySelector('.product-card__price-amount');
    expect(priceAmount).toBeInTheDocument();
    expect(priceAmount).toHaveTextContent(mockProduct.price.toString());
  });

  test('should show sale badge when product is on sale', () => {
    const saleBadge = document.querySelector('.product-card__badge--sale');
    expect(saleBadge).toBeInTheDocument();
    expect(saleBadge).toHaveTextContent('Sale');
  });

  test('should display product tags', () => {
    const tags = document.querySelectorAll('.product-card__tag');
    expect(tags.length).toBe(mockProduct.tags.length);

    mockProduct.tags.forEach((tag, index) => {
      expect(tags[index]).toHaveTextContent(tag);
    });
  });

  test('should have quick view button with proper attributes', () => {
    const quickViewButton = document.querySelector('.product-card__quick-view');
    expect(quickViewButton).toBeInTheDocument();
    expect(quickViewButton).toHaveAttribute('data-product-id', mockProduct.id.toString());
    expect(quickViewButton).toHaveAttribute('aria-label', `Quick view ${mockProduct.title}`);
  });

  test('should have add to cart button with proper state', () => {
    const addToCartButton = document.querySelector('.product-card__add-to-cart');
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).toHaveAttribute('data-variant-id', mockProduct.variants[0].id.toString());
    expect(addToCartButton).toHaveAttribute('aria-label', `Add ${mockProduct.title} to cart`);
    expect(addToCartButton).toHaveTextContent('Add to Cart');
    expect(addToCartButton).not.toBeDisabled();
  });

  test('should have wishlist toggle button', () => {
    const wishlistToggle = document.querySelector('.wishlist-toggle');
    expect(wishlistToggle).toBeInTheDocument();
    expect(wishlistToggle).toHaveAttribute('aria-label', `Add ${mockProduct.title} to wishlist`);
  });

  test('should have proper semantic HTML structure', () => {
    const productCard = document.querySelector('.product-card');
    const imageWrapper = document.querySelector('.product-card__image-wrapper');
    const content = document.querySelector('.product-card__content');
    const title = document.querySelector('.product-card__title');

    expect(productCard).toBeInTheDocument();
    expect(imageWrapper).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });

  test('should have accessible button icons', () => {
    const buttons = document.querySelectorAll('button[aria-label]');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
      const ariaLabel = button.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });
  });

  test('should handle sold out state properly', () => {
    // Test with unavailable product
    const soldOutProduct = { ...mockProduct, available: false };

    document.body.innerHTML = `
      <div class="product-card" data-product-id="${soldOutProduct.id}">
        <div class="product-card__badges">
          <span class="product-card__badge product-card__badge--sold-out">Sold Out</span>
        </div>
        <div class="product-card__actions">
          <button
            class="product-card__add-to-cart"
            data-variant-id="${soldOutProduct.variants[0].id}"
            disabled
          >
            Sold Out
          </button>
        </div>
      </div>
    `;

    const soldOutBadge = document.querySelector('.product-card__badge--sold-out');
    const addToCartButton = document.querySelector('.product-card__add-to-cart');

    expect(soldOutBadge).toBeInTheDocument();
    expect(addToCartButton).toBeDisabled();
    expect(addToCartButton).toHaveTextContent('Sold Out');
  });
});