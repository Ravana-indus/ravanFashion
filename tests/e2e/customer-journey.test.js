// E2E tests for customer journey
const { test, expect } = require('@playwright/test');

test.describe('Customer Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and cookies before each test
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();
  });

  test.describe('Homepage Experience', () => {
    test('should load homepage with all key elements', async ({ page }) => {
      await page.goto('/');

      // Check title and meta tags
      await expect(page).toHaveTitle(/Ravan Fashion/);

      // Check header elements
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('.header__logo')).toBeVisible();
      await expect(page.locator('.header__nav')).toBeVisible();

      // Check main content
      await expect(page.locator('main')).toBeVisible();

      // Check footer
      await expect(page.locator('footer')).toBeVisible();

      // Check language toggle
      await expect(page.locator('.lang-toggle')).toBeVisible();
      await expect(page.locator('[data-lang="en"]')).toBeVisible();
      await expect(page.locator('[data-lang="ta"]')).toBeVisible();
    });

    test('should navigate between pages correctly', async ({ page }) => {
      await page.goto('/');

      // Test navigation to collections
      await page.click('a[href="/collections"]');
      await expect(page).toHaveURL(/\/collections/);
      await expect(page.locator('h1')).toContainText('Collections');

      // Test navigation back to home
      await page.click('a[href="/"]');
      await expect(page).toHaveURL(/\//);
      await expect(page.locator('h1')).toContainText('Ravan Fashion');
    });

    test('should handle Tamil language toggle', async ({ page }) => {
      await page.goto('/');

      // Click Tamil language button
      await page.click('[data-lang="ta"]');

      // Check language attribute changes
      await expect(page.locator('html')).toHaveAttribute('lang', 'ta');

      // Check active button state
      await expect(page.locator('[data-lang="ta"]')).toHaveClass(/active/);
      await expect(page.locator('[data-lang="en"]')).not.toHaveClass(/active/);

      // Test language persistence in localStorage
      const storedLanguage = await page.evaluate(() => {
        return localStorage.getItem('preferredLanguage');
      });
      expect(storedLanguage).toBe('ta');
    });
  });

  test.describe('Product Discovery', () => {
    test('should browse product collections', async ({ page }) => {
      await page.goto('/collections');

      // Wait for products to load
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Check product cards are visible
      const productCards = await page.locator('.product-card').count();
      expect(productCards).toBeGreaterThan(0);

      // Test product card elements
      const firstProduct = await page.locator('.product-card').first();
      await expect(firstProduct.locator('.product-card__image')).toBeVisible();
      await expect(firstProduct.locator('.product-card__title')).toBeVisible();
      await expect(firstProduct.locator('.product-card__price')).toBeVisible();
    });

    test('should use product filtering and sorting', async ({ page }) => {
      await page.goto('/collections/all');

      // Wait for collection to load
      await page.waitForSelector('.collection-controls', { timeout: 10000 });

      // Test filter functionality
      if (await page.locator('.filter-toggle').isVisible()) {
        await page.click('.filter-toggle');
        await page.waitForSelector('.filter-options', { timeout: 5000 });

        // Select a filter option
        const firstFilter = await page.locator('.filter-option').first();
        await firstFilter.click();

        // Wait for products to update
        await page.waitForTimeout(2000);
      }

      // Test sort functionality
      if (await page.locator('.sort-select').isVisible()) {
        await page.selectOption('.sort-select', 'price-ascending');
        await page.waitForTimeout(2000);
      }
    });

    test('should view product details', async ({ page }) => {
      await page.goto('/collections/all');

      // Wait for products to load
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Click on first product
      await page.click('.product-card:first-child .product-card__link');

      // Wait for product page to load
      await page.waitForSelector('.product-page', { timeout: 10000 });

      // Check product page elements
      await expect(page.locator('.product__title')).toBeVisible();
      await expect(page.locator('.product__price')).toBeVisible();
      await expect(page.locator('.product__description')).toBeVisible();
      await expect(page.locator('.product__image')).toBeVisible();
    });
  });

  test.describe('Shopping Cart Experience', () => {
    test('should add product to cart', async ({ page }) => {
      await page.goto('/collections/all');

      // Wait for products to load
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Click add to cart on first product
      await page.click('.product-card:first-child .product-card__add-to-cart');

      // Wait for cart notification
      await page.waitForSelector('.cart-notification', { timeout: 10000 });

      // Check cart notification appears
      await expect(page.locator('.cart-notification')).toBeVisible();
      await expect(page.locator('.cart-notification')).toContainText('Added to Cart');

      // Check cart count updates
      const cartCount = await page.locator('.header__cart-count').textContent();
      expect(parseInt(cartCount)).toBeGreaterThan(0);
    });

    test('should view and update cart', async ({ page }) => {
      // Add product to cart first
      await page.goto('/collections/all');
      await page.waitForSelector('.product-card', { timeout: 10000 });
      await page.click('.product-card:first-child .product-card__add-to-cart');
      await page.waitForSelector('.cart-notification', { timeout: 10000 });

      // Click to view cart
      await page.click('.header__cart-toggle');

      // Wait for cart drawer/modal
      await page.waitForSelector('.cart-drawer', { timeout: 10000 });

      // Check cart contents
      await expect(page.locator('.cart-item')).toBeVisible();
      await expect(page.locator('.cart-total')).toBeVisible();

      // Test quantity update if available
      const quantityInput = page.locator('.cart-item__quantity');
      if (await quantityInput.isVisible()) {
        await quantityInput.fill('2');
        await page.waitForTimeout(1000);
      }
    });

    test('should proceed to checkout', async ({ page }) => {
      // Add product to cart first
      await page.goto('/collections/all');
      await page.waitForSelector('.product-card', { timeout: 10000 });
      await page.click('.product-card:first-child .product-card__add-to-cart');
      await page.waitForSelector('.cart-notification', { timeout: 10000 });

      // Click to view cart
      await page.click('.header__cart-toggle');
      await page.waitForSelector('.cart-drawer', { timeout: 10000 });

      // Click checkout button
      await page.click('.cart-checkout-btn');

      // Should redirect to Shopify checkout
      await expect(page).toHaveURL(/\/checkout/);
    });
  });

  test.describe('Quick View Experience', () => {
    test('should open and use quick view', async ({ page }) => {
      await page.goto('/collections/all');

      // Wait for products to load
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Click quick view on first product
      await page.click('.product-card:first-child .product-card__quick-view');

      // Wait for quick view modal
      await page.waitForSelector('.quick-view-modal', { timeout: 10000 });

      // Check modal elements
      await expect(page.locator('.quick-view-modal')).toBeVisible();
      await expect(page.locator('.quick-view-modal__content')).toBeVisible();
      await expect(page.locator('.quick-view-modal__close')).toBeVisible();

      // Test modal close
      await page.click('.quick-view-modal__close');
      await page.waitForSelector('.quick-view-modal', { state: 'hidden', timeout: 5000 });
    });
  });

  test.describe('Wishlist Experience', () => {
    test('should add and remove products from wishlist', async ({ page }) => {
      await page.goto('/collections/all');

      // Wait for products to load
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Click wishlist toggle on first product
      await page.click('.product-card:first-child .wishlist-toggle');

      // Check wishlist state updates
      await expect(page.locator('.product-card:first-child .wishlist-toggle')).toHaveClass(/active/);

      // Check localStorage for wishlist data
      const wishlistData = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('wishlist') || '[]');
      });
      expect(wishlistData.length).toBeGreaterThan(0);

      // Remove from wishlist
      await page.click('.product-card:first-child .wishlist-toggle');
      await expect(page.locator('.product-card:first-child .wishlist-toggle')).not.toHaveClass(/active/);
    });
  });

  test.describe('Search Experience', () => {
    test('should perform product search', async ({ page }) => {
      await page.goto('/');

      // Click search toggle
      await page.click('.header__search-toggle');

      // Wait for search overlay
      await page.waitForSelector('.search-overlay', { timeout: 10000 });

      // Enter search term
      await page.fill('.search-input', 'saree');
      await page.waitForTimeout(1000);

      // Check for search results
      const searchResults = await page.locator('.search-result').count();
      if (searchResults > 0) {
        await expect(page.locator('.search-result')).toBeVisible();
      }
    });

    test('should handle predictive search', async ({ page }) => {
      await page.goto('/');

      // Click search toggle
      await page.click('.header__search-toggle');

      // Wait for search overlay
      await page.waitForSelector('.search-overlay', { timeout: 10000 });

      // Type search term slowly for predictive results
      await page.type('.search-input', 'silk', { delay: 200 });

      // Wait for predictive search results
      await page.waitForSelector('.predictive-search-results', { timeout: 5000 });

      // Check predictive results appear
      await expect(page.locator('.predictive-search-results')).toBeVisible();
    });
  });

  test.describe('Mobile Experience', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should work correctly on mobile', async ({ page }) => {
      await page.goto('/');

      // Check mobile navigation
      await expect(page.locator('.mobile-menu-toggle')).toBeVisible();

      // Test mobile menu
      await page.click('.mobile-menu-toggle');
      await page.waitForSelector('.mobile-menu', { timeout: 5000 });
      await expect(page.locator('.mobile-menu')).toBeVisible();

      // Test mobile product grid
      await page.goto('/collections/all');
      await page.waitForSelector('.product-card', { timeout: 10000 });

      const productCards = await page.locator('.product-card').count();
      expect(productCards).toBeGreaterThan(0);

      // Test mobile cart
      await page.click('.product-card:first-child .product-card__add-to-cart');
      await page.waitForSelector('.cart-notification', { timeout: 10000 });
    });
  });

  test.describe('Error Handling', () => {
    test('should handle 404 pages gracefully', async ({ page }) => {
      await page.goto('/non-existent-page');

      // Should show 404 page
      await expect(page.locator('.error-404')).toBeVisible();
      await expect(page.locator('.error-404')).toContainText('Page Not Found');

      // Should provide navigation options
      await expect(page.locator('a[href="/"]')).toBeVisible();
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network error
      await page.route('**/api/**', route => route.abort('failed'));

      await page.goto('/collections/all');

      // Should show error message
      await expect(page.locator('.error-message')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should meet basic accessibility requirements', async ({ page }) => {
      await page.goto('/');

      // Check for skip links
      await expect(page.locator('.skip-link')).toBeVisible();

      // Check for alt text on images
      const images = await page.locator('img').all();
      for (const image of images) {
        const alt = await image.getAttribute('alt');
        expect(alt).not.toBe('');
      }

      // Check for ARIA labels on interactive elements
      const buttons = await page.locator('button').all();
      for (const button of buttons) {
        const ariaLabel = await button.getAttribute('aria-label');
        if (!await button.textContent()) {
          expect(ariaLabel).not.toBe(null);
        }
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/');

      // Test tab navigation
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();

      // Test Enter key on links
      await page.keyboard.press('Enter');

      // Test keyboard navigation in product grid
      await page.goto('/collections/all');
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Navigate to first product
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }
      await expect(page.locator(':focus')).toBeVisible();
    });
  });
});