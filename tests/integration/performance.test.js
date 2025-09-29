// Performance tests using Lighthouse CI
const { test, expect } = require('@playwright/test');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

test.describe('Performance Tests', () => {
  let chrome;
  let baseUrl;

  test.beforeAll(async () => {
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-setuid-sandbox'],
    });
    baseUrl = process.env.SHOPIFY_STORE_URL || 'https://dev-ravan-fashion.myshopify.com';
  });

  test.afterAll(async () => {
    await chrome.kill();
  });

  test.describe('Core Web Vitals', () => {
    test('Homepage should meet Core Web Vitals thresholds', async () => {
      const runnerResult = await lighthouse(baseUrl, {
        port: chrome.port,
        onlyCategories: ['performance'],
        output: 'json',
      });

      const { lhr } = runnerResult;
      const performanceScore = lhr.categories.performance.score * 100;

      // Performance Score threshold
      expect(performanceScore).toBeGreaterThan(90);

      // Core Web Vitals thresholds
      const audits = lhr.audits;

      // First Contentful Paint < 1.8s
      expect(audits['first-contentful-paint'].numericValue).toBeLessThan(1800);

      // Largest Contentful Paint < 2.5s
      expect(audits['largest-contentful-paint'].numericValue).toBeLessThan(2500);

      // Cumulative Layout Shift < 0.1
      expect(audits['cumulative-layout-shift'].numericValue).toBeLessThan(0.1);

      // Time to Interactive < 3.5s
      expect(audits['interactive'].numericValue).toBeLessThan(3500);

      // Speed Index < 3.4s
      expect(audits['speed-index'].numericValue).toBeLessThan(3400);

      console.log(`📊 Performance Score: ${performanceScore}`);
      console.log(`📈 LCP: ${audits['largest-contentful-paint'].displayValue}`);
      console.log(`🔄 CLS: ${audits['cumulative-layout-shift'].displayValue}`);
      console.log(`⚡ FCP: ${audits['first-contentful-paint'].displayValue}`);
      console.log(`🖱️ TTI: ${audits['interactive'].displayValue}`);
    });

    test('Product page should meet performance thresholds', async () => {
      const productUrl = `${baseUrl}/products/traditional-silk-saree`;
      const runnerResult = await lighthouse(productUrl, {
        port: chrome.port,
        onlyCategories: ['performance'],
        output: 'json',
      });

      const { lhr } = runnerResult;
      const performanceScore = lhr.categories.performance.score * 100;

      expect(performanceScore).toBeGreaterThan(85);

      const audits = lhr.audits;

      // Slightly relaxed thresholds for product pages with images
      expect(audits['largest-contentful-paint'].numericValue).toBeLessThan(3000);
      expect(audits['cumulative-layout-shift'].numericValue).toBeLessThan(0.15);
      expect(audits['interactive'].numericValue).toBeLessThan(4000);

      console.log(`📊 Product Page Performance Score: ${performanceScore}`);
    });

    test('Collection page should meet performance thresholds', async () => {
      const collectionUrl = `${baseUrl}/collections/sarees`;
      const runnerResult = await lighthouse(collectionUrl, {
        port: chrome.port,
        onlyCategories: ['performance'],
        output: 'json',
      });

      const { lhr } = runnerResult;
      const performanceScore = lhr.categories.performance.score * 100;

      expect(performanceScore).toBeGreaterThan(85);

      const audits = lhr.audits;

      // Relaxed thresholds for collection pages
      expect(audits['largest-contentful-paint'].numericValue).toBeLessThan(3500);
      expect(audits['cumulative-layout-shift'].numericValue).toBeLessThan(0.2);
      expect(audits['interactive'].numericValue).toBeLessThan(4500);

      console.log(`📊 Collection Page Performance Score: ${performanceScore}`);
    });
  });

  test.describe('Asset Loading Performance', () => {
    test('should load Tamil fonts efficiently', async () => {
      const runnerResult = await lighthouse(baseUrl, {
        port: chrome.port,
        onlyAudits: ['font-display', 'unused-css-rules', 'render-blocking-resources'],
        output: 'json',
      });

      const { lhr } = runnerResult;

      // Font display should be swap
      expect(lhr.audits['font-display'].score).toBe(1);

      // Should have minimal unused CSS
      expect(lhr.audits['unused-css-rules'].details.overallSavingsMs).toBeLessThan(500);

      // Should minimize render-blocking resources
      expect(lhr.audits['render-blocking-resources'].score).toBeGreaterThan(0.8);

      console.log(`🔤 Font Loading Score: ${lhr.audits['font-display'].score}`);
      console.log(`🎨 Unused CSS Savings: ${lhr.audits['unused-css-rules'].details.overallSavingsMs}ms`);
    });

    test('should optimize image loading', async () => {
      const runnerResult = await lighthouse(baseUrl, {
        port: chrome.port,
        onlyAudits: ['modern-image-formats', 'uses-responsive-images', 'efficient-animated-content'],
        output: 'json',
      });

      const { lhr } = runnerResult;

      // Should use modern image formats
      expect(lhr.audits['modern-image-formats'].score).toBeGreaterThan(0.8);

      // Should use responsive images
      expect(lhr.audits['uses-responsive-images'].score).toBeGreaterThan(0.8);

      // Should optimize animated content
      expect(lhr.audits['efficient-animated-content'].score).toBeGreaterThan(0.8);

      console.log(`🖼️ Modern Image Formats Score: ${lhr.audits['modern-image-formats'].score}`);
      console.log(`📱 Responsive Images Score: ${lhr.audits['uses-responsive-images'].score}`);
    });

    test('should minimize JavaScript execution time', async () => {
      const runnerResult = await lighthouse(baseUrl, {
        port: chrome.port,
        onlyAudits: ['bootup-time', 'mainthread-work-breakdown', 'no-document-write'],
        output: 'json',
      });

      const { lhr } = runnerResult;

      // Should have reasonable bootup time
      expect(lhr.audits['bootup-time'].numericValue).toBeLessThan(3000);

      // Should not use document.write
      expect(lhr.audits['no-document-write'].score).toBe(1);

      console.log(`⚡ Bootup Time: ${lhr.audits['bootup-time'].displayValue}`);
      console.log(`🔧 Main Thread Work: ${lhr.audits['mainthread-work-breakdown'].displayValue}`);
    });
  });

  test.describe('Cultural Performance Features', () => {
    test('should handle Tamil font loading performance', async () => {
      const runnerResult = await lighthouse(`${baseUrl}/?lang=ta`, {
        port: chrome.port,
        onlyAudits: ['font-display', 'network-requests'],
        output: 'json',
      });

      const { lhr } = runnerResult;

      // Check font loading requests
      const requests = lhr.audits['network-requests'].details.items;
      const fontRequests = requests.filter(req => req.url.includes('font') || req.url.includes('googleapis'));

      expect(fontRequests.length).toBeGreaterThan(0);

      // Should load fonts efficiently
      const totalFontBytes = fontRequests.reduce((sum, req) => sum + req.resourceSize, 0);
      expect(totalFontBytes).toBeLessThan(2000000); // 2MB for Tamil fonts

      console.log(`🔤 Tamil Font Requests: ${fontRequests.length}`);
      console.log(`📦 Total Font Size: ${(totalFontBytes / 1024).toFixed(2)}KB`);
    });

    test('should optimize cultural image loading', async () => {
      const runnerResult = await lighthouse(`${baseUrl}/collections/sarees`, {
        port: chrome.port,
        onlyAudits: ['uses-responsive-images', 'modern-image-formats'],
        output: 'json',
      });

      const { lhr } = runnerResult;

      // Should optimize cultural product images
      expect(lhr.audits['uses-responsive-images'].score).toBeGreaterThan(0.7);
      expect(lhr.audits['modern-image-formats'].score).toBeGreaterThan(0.7);

      console.log(`🎭 Cultural Image Optimization Score: ${lhr.audits['uses-responsive-images'].score}`);
    });
  });

  test.describe('Mobile Performance', () => {
    test('should perform well on mobile devices', async () => {
      const runnerResult = await lighthouse(baseUrl, {
        port: chrome.port,
        onlyCategories: ['performance'],
        formFactor: 'mobile',
        output: 'json',
      });

      const { lhr } = runnerResult;
      const performanceScore = lhr.categories.performance.score * 100;

      // Mobile performance thresholds
      expect(performanceScore).toBeGreaterThan(80);

      const audits = lhr.audits;

      // Mobile-specific thresholds
      expect(audits['first-contentful-paint'].numericValue).toBeLessThan(2200);
      expect(audits['largest-contentful-paint'].numericValue).toBeLessThan(4000);
      expect(audits['speed-index'].numericValue).toBeLessThan(4300);

      console.log(`📱 Mobile Performance Score: ${performanceScore}`);
      console.log(`📱 Mobile LCP: ${audits['largest-contentful-paint'].displayValue}`);
    });

    test('should handle mobile cultural features efficiently', async () => {
      const runnerResult = await lighthouse(`${baseUrl}/?lang=ta`, {
        port: chrome.port,
        onlyCategories: ['performance'],
        formFactor: 'mobile',
        output: 'json',
      });

      const { lhr } = runnerResult;
      const performanceScore = lhr.categories.performance.score * 100;

      expect(performanceScore).toBeGreaterThan(75);

      console.log(`📱 Mobile Tamil Performance Score: ${performanceScore}`);
    });
  });

  test.describe('SEO Performance', () => {
    test('should meet SEO requirements', async () => {
      const runnerResult = await lighthouse(baseUrl, {
        port: chrome.port,
        onlyCategories: ['seo'],
        output: 'json',
      });

      const { lhr } = runnerResult;
      const seoScore = lhr.categories.seo.score * 100;

      expect(seoScore).toBeGreaterThan(90);

      // Key SEO audits
      expect(lhr.audits['meta-description'].score).toBe(1);
      expect(lhr.audits['http-status-code'].score).toBe(1);
      expect(lhr.audits['is-crawlable'].score).toBe(1);
      expect(lhr.audits['robots-txt'].score).toBe(1);
      expect(lhr.audits['canonical'].score).toBe(1);

      console.log(`🔍 SEO Score: ${seoScore}`);
    });

    test('should handle multilingual SEO', async () => {
      const runnerResult = await lighthouse(`${baseUrl}/?lang=ta`, {
        port: chrome.port,
        onlyAudits: ['hreflang', 'lang'],
        output: 'json',
      });

      const { lhr } = runnerResult;

      // Should have proper language attributes
      expect(lhr.audits['lang'].score).toBe(1);

      console.log(`🌐 Multilingual SEO Score: ${lhr.audits['lang'].score}`);
    });
  });

  test.describe('Best Practices', () => {
    test('should follow web development best practices', async () => {
      const runnerResult = await lighthouse(baseUrl, {
        port: chrome.port,
        onlyCategories: ['best-practices'],
        output: 'json',
      });

      const { lhr } = runnerResult;
      const bestPracticesScore = lhr.categories.bestPractices.score * 100;

      expect(bestPracticesScore).toBeGreaterThan(90);

      // Key best practices
      expect(lhr.audits['doctype'].score).toBe(1);
      expect(lhr.audits['charset'].score).toBe(1);
      expect(lhr.audits['viewport'].score).toBe(1);
      expect(lhr.audits['https'].score).toBe(1);

      console.log(`⭐ Best Practices Score: ${bestPracticesScore}`);
    });

    test('should handle accessibility best practices', async () => {
      const runnerResult = await lighthouse(baseUrl, {
        port: chrome.port,
        onlyAudits: ['aria-allowed-attr', 'aria-required-attr', 'button-name', 'image-alt'],
        output: 'json',
      });

      const { lhr } = runnerResult;

      // Key accessibility checks
      expect(lhr.audits['aria-allowed-attr'].score).toBe(1);
      expect(lhr.audits['aria-required-attr'].score).toBe(1);
      expect(lhr.audits['button-name'].score).toBe(1);
      expect(lhr.audits['image-alt'].score).toBe(1);

      console.log(`♿ Accessibility Score: ${Object.values(lhr.audits).reduce((sum, audit) => sum + audit.score, 0) / Object.values(lhr.audits).length}`);
    });
  });

  test.describe('Performance Regression Testing', () => {
    test('should detect performance regressions', async () => {
      const baselineMetrics = {
        lcp: 2000,
        cls: 0.05,
        fcp: 1500,
        tti: 3000,
      };

      const runnerResult = await lighthouse(baseUrl, {
        port: chrome.port,
        onlyCategories: ['performance'],
        output: 'json',
      });

      const { lhr } = runnerResult;
      const audits = lhr.audits;

      // Check for regressions (allow 10% tolerance)
      expect(audits['largest-contentful-paint'].numericValue).toBeLessThan(baselineMetrics.lcp * 1.1);
      expect(audits['cumulative-layout-shift'].numericValue).toBeLessThan(baselineMetrics.cls * 1.1);
      expect(audits['first-contentful-paint'].numericValue).toBeLessThan(baselineMetrics.fcp * 1.1);
      expect(audits['interactive'].numericValue).toBeLessThan(baselineMetrics.tti * 1.1);

      console.log(`📈 Performance Regression Check: PASSED`);
    });

    test('should monitor critical rendering path', async () => {
      const runnerResult = await lighthouse(baseUrl, {
        port: chrome.port,
        onlyAudits: ['critical-request-chains', 'uses-rel-preconnect', 'uses-rel-preload'],
        output: 'json',
      });

      const { lhr } = runnerResult;

      // Should optimize critical rendering path
      expect(lhr.audits['critical-request-chains'].score).toBeGreaterThan(0.8);

      console.log(`🛤️ Critical Rendering Path Score: ${lhr.audits['critical-request-chains'].score}`);
    });
  });
});