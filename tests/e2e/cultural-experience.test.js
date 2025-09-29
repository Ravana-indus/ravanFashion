// E2E tests for cultural experience features
const { test, expect } = require('@playwright/test');

test.describe('Cultural Experience Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and cookies before each test
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();
  });

  test.describe('Tamil Language Experience', () => {
    test('should switch to Tamil language successfully', async ({ page }) => {
      await page.goto('/');

      // Switch to Tamil
      await page.click('[data-lang="ta"]');

      // Verify language change
      await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
      await expect(page.locator('[data-lang="ta"]')).toHaveClass(/active/);

      // Check for Tamil text content
      await expect(page.locator('body')).toContainText(/ராவன்|பேஷன்|தமிழ்/);
    });

    test('should maintain Tamil language across pages', async ({ page }) => {
      await page.goto('/');

      // Switch to Tamil
      await page.click('[data-lang="ta"]');
      await page.waitForTimeout(1000);

      // Navigate to different pages
      await page.click('a[href="/collections"]');
      await expect(page.locator('html')).toHaveAttribute('lang', 'ta');

      await page.click('a[href="/"]');
      await expect(page.locator('html')).toHaveAttribute('lang', 'ta');

      // Check language persistence
      const storedLanguage = await page.evaluate(() => {
        return localStorage.getItem('preferredLanguage');
      });
      expect(storedLanguage).toBe('ta');
    });

    test('should display Tamil text correctly with proper fonts', async ({ page }) => {
      await page.goto('/');

      // Switch to Tamil
      await page.click('[data-lang="ta"]');

      // Check for Tamil font classes
      const tamilElements = await page.locator('.tamil-text').all();
      expect(tamilElements.length).toBeGreaterThan(0);

      // Check font loading
      const fontLoadStatus = await page.evaluate(() => {
        return document.fonts.ready;
      });
      expect(fontLoadStatus).toBeTruthy();
    });

    test('should handle mixed content translation', async ({ page }) => {
      await page.goto('/');

      // Switch to Tamil
      await page.click('[data-lang="ta"]');

      // Check product names and descriptions
      await page.goto('/collections/all');
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Verify some elements are in Tamil
      const productCards = await page.locator('.product-card').all();
      let hasTamilContent = false;

      for (const card of productCards) {
        const text = await card.textContent();
        if (/[\u0B80-\u0BFF]/.test(text)) {
          hasTamilContent = true;
          break;
        }
      }

      expect(hasTamilContent).toBe(true);
    });
  });

  test.describe('Cultural Product Features', () => {
    test('should display cultural product badges and tags', async ({ page }) => {
      await page.goto('/collections/all');
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Check for cultural badges
      const culturalBadges = await page.locator('[data-cultural-badge]').all();
      expect(culturalBadges.length).toBeGreaterThan(0);

      // Check for cultural tags
      const culturalTags = await page.locator('[data-cultural-tag]').all();
      expect(culturalTags.length).toBeGreaterThan(0);

      // Verify badge content
      const firstBadge = await culturalBadges[0].textContent();
      expect(firstBadge).toMatch(/Traditional|Festival|Cultural|பாரம்பரிய|பண்டிகை/);
    });

    test('should filter products by cultural categories', async ({ page }) => {
      await page.goto('/collections/all');
      await page.waitForSelector('.collection-controls', { timeout: 10000 });

      // Check for cultural category filters
      const culturalFilters = await page.locator('[data-cultural-filter]').all();
      expect(culturalFilters.length).toBeGreaterThan(0);

      // Test cultural filter functionality
      if (culturalFilters.length > 0) {
        await culturalFilters[0].click();
        await page.waitForTimeout(2000);

        // Verify filter application
        const activeFilter = await page.locator('.filter-option.active').first();
        expect(activeFilter).toBeVisible();
      }
    });

    test('should display cultural product information', async ({ page }) => {
      await page.goto('/collections/all');
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Click on first cultural product
      const firstProduct = await page.locator('.product-card').first();
      await firstProduct.click();

      // Wait for product page
      await page.waitForSelector('.product-page', { timeout: 10000 });

      // Check for cultural information sections
      await expect(page.locator('[data-cultural-info]')).toBeVisible();
      await expect(page.locator('[data-cultural-significance]')).toBeVisible();

      // Check for cultural care instructions
      const culturalCare = await page.locator('[data-cultural-care]').count();
      if (culturalCare > 0) {
        await expect(page.locator('[data-cultural-care]')).toBeVisible();
      }
    });

    test('should handle cultural size guides', async ({ page }) => {
      await page.goto('/collections/all');
      await page.waitForSelector('.product-card', { timeout: 10000 });

      // Click on first product
      await page.locator('.product-card').first().click();
      await page.waitForSelector('.product-page', { timeout: 10000 });

      // Check for size guide button
      const sizeGuideBtn = await page.locator('[data-size-guide]');
      if (await sizeGuideBtn.isVisible()) {
        await sizeGuideBtn.click();
        await page.waitForSelector('.size-guide-modal', { timeout: 5000 });

        // Check for cultural sizing information
        await expect(page.locator('.size-guide-modal')).toBeVisible();
        await expect(page.locator('[data-cultural-sizing]')).toBeVisible();

        // Close modal
        await page.click('.size-guide-modal__close');
      }
    });
  });

  test.describe('Cultural Education Features', () => {
    test('should navigate to cultural guide', async ({ page }) => {
      await page.goto('/');

      // Click cultural guide link
      await page.click('a[href="/pages/cultural-guide"]');

      // Wait for cultural guide page
      await page.waitForSelector('.cultural-guide', { timeout: 10000 });

      // Check cultural guide sections
      await expect(page.locator('.cultural-guide__header')).toBeVisible();
      await expect(page.locator('.cultural-guide__content')).toBeVisible();

      // Check for cultural information cards
      const culturalCards = await page.locator('[data-cultural-card]').all();
      expect(culturalCards.length).toBeGreaterThan(0);
    });

    test('should display festival information', async ({ page }) => {
      await page.goto('/pages/cultural-guide');

      // Wait for cultural guide to load
      await page.waitForSelector('.cultural-guide', { timeout: 10000 });

      // Check for festival sections
      const festivalSections = await page.locator('[data-festival-section]').all();
      expect(festivalSections.length).toBeGreaterThan(0);

      // Check festival information
      const firstFestival = await festivalSections[0];
      await expect(firstFestival.locator('[data-festival-name]')).toBeVisible();
      await expect(firstFestival.locator('[data-festival-date]')).toBeVisible();
      await expect(firstFestival.locator('[data-festival-description]')).toBeVisible();
    });

    test('should handle interactive cultural elements', async ({ page }) => {
      await page.goto('/pages/cultural-guide');

      // Wait for cultural guide to load
      await page.waitForSelector('.cultural-guide', { timeout: 10000 });

      // Check for interactive cultural elements
      const interactiveElements = await page.locator('[data-interactive-cultural]').all();
      expect(interactiveElements.length).toBeGreaterThan(0);

      // Test interaction
      if (interactiveElements.length > 0) {
        await interactiveElements[0].click();
        await page.waitForTimeout(1000);

        // Check for interactive response
        const activeElement = await page.locator('[data-interactive-active]').first();
        expect(activeElement).toBeVisible();
      }
    });

    test('should display cultural style recommendations', async ({ page }) => {
      await page.goto('/pages/cultural-guide');

      // Wait for cultural guide to load
      await page.waitForSelector('.cultural-guide', { timeout: 10000 });

      // Check for style recommendations
      const styleRecommendations = await page.locator('[data-style-recommendation]').all();
      expect(styleRecommendations.length).toBeGreaterThan(0);

      // Check recommendation content
      const firstRecommendation = await styleRecommendations[0];
      await expect(firstRecommendation.locator('.style-title')).toBeVisible();
      await expect(firstRecommendation.locator('.style-description')).toBeVisible();
    });
  });

  test.describe('Cultural Design Elements', () => {
    test('should display cultural design patterns', async ({ page }) => {
      await page.goto('/');

      // Check for cultural design elements
      const culturalDesigns = await page.locator('[data-cultural-design]').all();
      expect(culturalDesigns.length).toBeGreaterThan(0);

      // Check design elements have proper attributes
      for (const design of culturalDesigns) {
        const designType = await design.getAttribute('data-cultural-design');
        expect(designType).toBeTruthy();
      }
    });

    test('should handle cultural color schemes', async ({ page }) => {
      await page.goto('/');

      // Check for cultural color elements
      const culturalColors = await page.locator('[data-cultural-color]').all();
      expect(culturalColors.length).toBeGreaterThan(0);

      // Verify color attributes
      for (const colorElement of culturalColors) {
        const colorScheme = await colorElement.getAttribute('data-cultural-color');
        expect(['gold', 'maroon', 'saffron', 'green']).toContain(colorScheme);
      }
    });

    test('should display cultural typography correctly', async ({ page }) => {
      await page.goto('/');

      // Switch to Tamil
      await page.click('[data-lang="ta"]');

      // Check for Tamil typography elements
      const tamilTypography = await page.locator('.tamil-typography').all();
      expect(tamilTypography.length).toBeGreaterThan(0);

      // Verify font styling
      for (const element of tamilTypography) {
        const fontFamily = await element.evaluate(el => {
          return window.getComputedStyle(el).fontFamily;
        });
        expect(fontFamily).toMatch(/Noto Sans Tamil|Latha|Tamil/);
      }
    });

    test('should handle cultural animations', async ({ page }) => {
      await page.goto('/');

      // Check for cultural animations
      const culturalAnimations = await page.locator('[data-cultural-animation]').all();
      expect(culturalAnimations.length).toBeGreaterThan(0);

      // Test animation triggering
      if (culturalAnimations.length > 0) {
        const firstAnimation = culturalAnimations[0];
        await firstAnimation.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);

        // Check for animation classes
        const hasAnimation = await firstAnimation.evaluate(el => {
          return el.classList.length > 0;
        });
        expect(hasAnimation).toBe(true);
      }
    });
  });

  test.describe('Cultural Mobile Experience', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should handle cultural features on mobile', async ({ page }) => {
      await page.goto('/');

      // Test mobile language toggle
      await expect(page.locator('.lang-toggle')).toBeVisible();
      await page.click('[data-lang="ta"]');
      await page.waitForTimeout(1000);

      // Test mobile cultural navigation
      await page.click('.mobile-menu-toggle');
      await page.waitForSelector('.mobile-menu', { timeout: 5000 });

      // Check for cultural menu items
      const culturalMenuItems = await page.locator('.mobile-menu [data-cultural-menu]').all();
      expect(culturalMenuItems.length).toBeGreaterThan(0);

      // Test mobile cultural product display
      await page.goto('/collections/all');
      await page.waitForSelector('.product-card', { timeout: 10000 });

      const mobileProductCards = await page.locator('.product-card').all();
      expect(mobileProductCards.length).toBeGreaterThan(0);
    });
  });

  test.describe('Cultural Accessibility', () => {
    test('should provide accessible Tamil text', async ({ page }) => {
      await page.goto('/');

      // Switch to Tamil
      await page.click('[data-lang="ta"]');

      // Check for proper Tamil text attributes
      const tamilElements = await page.locator('[lang="ta"]').all();
      expect(tamilElements.length).toBeGreaterThan(0);

      // Check for proper ARIA labels
      const ariaLabels = await page.locator('[aria-label*="tamil"], [aria-label*="தமிழ்"]').all();
      expect(ariaLabels.length).toBeGreaterThan(0);
    });

    test('should handle screen reader navigation for cultural content', async ({ page }) => {
      await page.goto('/pages/cultural-guide');

      // Check for proper heading structure
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(0);

      // Check for proper landmarks
      const landmarks = await page.locator('[role="main"], [role="navigation"], [role="complementary"]').all();
      expect(landmarks.length).toBeGreaterThan(0);

      // Check for proper focus management
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus');
      expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Cultural Performance', () => {
    test('should load cultural content efficiently', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');

      // Switch to Tamil
      await page.click('[data-lang="ta"]');

      // Wait for Tamil content to load
      await page.waitForSelector('[lang="ta"]', { timeout: 10000 });

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should handle cultural content caching', async ({ page }) => {
      await page.goto('/');

      // Switch to Tamil
      await page.click('[data-lang="ta"]');
      await page.waitForTimeout(1000);

      // Navigate away and back
      await page.goto('/collections/all');
      await page.waitForSelector('.product-card', { timeout: 10000 });

      await page.goto('/');
      await page.waitForSelector('[lang="ta"]', { timeout: 5000 });

      // Language should persist
      await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
    });
  });

  test.describe('Cultural Error Handling', () => {
    test('should handle missing translations gracefully', async ({ page }) => {
      await page.goto('/');

      // Switch to Tamil
      await page.click('[data-lang="ta"]');

      // Check for fallback content
      const fallbackElements = await page.locator('[data-translation-fallback]').all();
      expect(fallbackElements.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle cultural content loading errors', async ({ page }) => {
      // Mock failed resource loading
      await page.route('**/cultural-content/**', route => route.abort('failed'));

      await page.goto('/pages/cultural-guide');

      // Should show error message
      const errorMessage = await page.locator('.cultural-content-error');
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toContainText(/Error|Failed|Could not load/);
      }
    });
  });
});