// Global teardown for E2E tests
module.exports = async () => {
  console.log('🧹 Cleaning up E2E test environment...');

  try {
    // Close browser if it exists
    if (global.browser) {
      await global.browser.close();
      console.log('✅ Browser closed');
    }

    // Additional cleanup
    if (global.context) {
      await global.context.close();
      console.log('✅ Context closed');
    }

    console.log('✅ E2E test environment cleaned up');
  } catch (error) {
    console.error('❌ Error during E2E test cleanup:', error);
    throw error;
  }
};