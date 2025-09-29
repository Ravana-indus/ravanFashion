// Global setup for E2E tests
const { chromium } = require('@playwright/test');

module.exports = async (config) => {
  console.log('🚀 Starting E2E test suite setup...');

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
    slowMo: 0,
  });

  // Create a new context
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  });

  // Create a new page
  const page = await context.newPage();

  // Store browser instance for global teardown
  global.browser = browser;

  // Test environment setup
  try {
    // Navigate to the store
    await page.goto(config.projects[0].use.baseURL, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Check if the store is accessible
    const title = await page.title();
    console.log(`📱 Store loaded: ${title}`);

    // Wait for key elements to be ready
    await page.waitForSelector('header', { timeout: 10000 });
    await page.waitForSelector('main', { timeout: 10000 });

    // Clear any existing cookies/localStorage for clean testing
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    console.log('✅ E2E test environment ready');

    // Return global state for tests
    return {
      browser,
      context,
      page,
    };
  } catch (error) {
    console.error('❌ E2E test setup failed:', error);
    await browser.close();
    throw error;
  }
};