# US7.1 - Test Scripts & Validation Framework

**Epic**: Quality Assurance & Testing **Story Points**: 8 **Priority**: High **Sprint**: 1

## 📋 User Story

As a **QA Engineer and Developer** I want **comprehensive test scripts and validation frameworks**
So that **the Tamil cultural theme is thoroughly tested for functionality, performance, and cultural
accuracy before launch**

## 🎯 Acceptance Criteria

### ✅ Test Script Development

- [ ] Unit tests for all Liquid templates and snippets
- [ ] Integration tests for Shopify app connections (Klaviyo, Reviews)
- [ ] Tamil text rendering and Unicode validation tests
- [ ] Cultural content accuracy validation scripts
- [ ] Performance testing automation (Lighthouse CI)
- [ ] Accessibility testing (WCAG AA compliance)
- [ ] Cross-browser compatibility test suite
- [ ] Mobile responsiveness validation

### ✅ Test Data Management

- [ ] Tamil product data fixtures for testing
- [ ] Cultural festival date validation datasets
- [ ] Multi-language test content (Tamil/English)
- [ ] Test customer profiles with Tamil preferences
- [ ] Sample order scenarios for cultural products

### ✅ Automated Testing Pipeline

- [ ] GitHub Actions workflow for continuous testing
- [ ] Pre-commit hooks for code quality
- [ ] Automated Shopify CLI theme validation
- [ ] Performance regression testing
- [ ] Security vulnerability scanning

## 🔧 Technical Implementation

### Test Directory Structure

```
tests/
├── unit/
│   ├── liquid/
│   │   ├── templates.test.js
│   │   ├── snippets.test.js
│   │   └── tamil-helpers.test.js
│   └── javascript/
│       ├── language-toggle.test.js
│       └── cultural-features.test.js
├── integration/
│   ├── shopify-api.test.js
│   ├── klaviyo-integration.test.js
│   └── reviews-app.test.js
├── e2e/
│   ├── customer-journey.test.js
│   ├── cultural-experience.test.js
│   └── mobile-performance.test.js
├── fixtures/
│   ├── tamil-products.json
│   ├── cultural-content.json
│   └── test-customers.json
└── utils/
    ├── tamil-validator.js
    ├── performance-metrics.js
    └── accessibility-checker.js
```

### Package.json Test Configuration

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:performance": "lighthouse-ci autorun",
    "test:accessibility": "axe-core tests/",
    "test:tamil": "node tests/utils/tamil-validator.js",
    "lint": "eslint . && stylelint **/*.css",
    "validate": "shopify theme check"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "playwright": "^1.40.0",
    "lighthouse-ci": "^0.12.0",
    "axe-core": "^4.8.0",
    "@shopify/theme-check": "^2.0.0",
    "eslint": "^8.0.0",
    "stylelint": "^15.0.0"
  }
}
```

### Jest Configuration (jest.config.js)

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  collectCoverageFrom: [
    'assets/**/*.js',
    'snippets/**/*.liquid',
    'templates/**/*.liquid',
    '!**/*.min.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
```

### Tamil Text Validation Utility

```javascript
// tests/utils/tamil-validator.js
const fs = require('fs');
const path = require('path');

class TamilValidator {
  constructor() {
    this.tamilUnicodeRange = /[\u0B80-\u0BFF]/;
    this.commonErrors = [
      { pattern: /க்ஷ/g, correct: 'க்‌ஷ', error: 'Missing ZWNJ in க்ஷ' },
      { pattern: /ஶ்ரீ/g, correct: 'ஸ்ரீ', error: 'Use ஸ instead of ஶ' },
    ];
  }

  validateTamilText(text) {
    const errors = [];

    // Check for common Tamil typing errors
    this.commonErrors.forEach(({ pattern, correct, error }) => {
      if (pattern.test(text)) {
        errors.push({ error, suggestion: correct });
      }
    });

    // Validate Unicode normalization
    if (text !== text.normalize('NFC')) {
      errors.push({
        error: 'Text not in NFC normalized form',
        suggestion: 'Use Unicode NFC normalization',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      tamilCharCount: (text.match(this.tamilUnicodeRange) || []).length,
    };
  }

  validateFiles() {
    const results = [];
    const liquidFiles = this.findLiquidFiles();

    liquidFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const validation = this.validateTamilText(content);

      if (!validation.isValid) {
        results.push({
          file,
          errors: validation.errors,
        });
      }
    });

    return results;
  }

  findLiquidFiles() {
    const files = [];
    const scanDir = dir => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.liquid')) {
          files.push(fullPath);
        }
      });
    };

    ['templates', 'snippets', 'sections'].forEach(dir => {
      if (fs.existsSync(dir)) scanDir(dir);
    });

    return files;
  }
}

module.exports = TamilValidator;

// CLI usage
if (require.main === module) {
  const validator = new TamilValidator();
  const results = validator.validateFiles();

  if (results.length === 0) {
    console.log('✅ All Tamil text validation passed!');
    process.exit(0);
  } else {
    console.log('❌ Tamil text validation errors found:');
    results.forEach(({ file, errors }) => {
      console.log(`\n📁 ${file}:`);
      errors.forEach(({ error, suggestion }) => {
        console.log(`  • ${error}`);
        if (suggestion) console.log(`    💡 ${suggestion}`);
      });
    });
    process.exit(1);
  }
}
```

### Performance Test Suite

```javascript
// tests/integration/performance.test.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

describe('Performance Tests', () => {
  let chrome;
  let baseUrl;

  beforeAll(async () => {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    baseUrl = process.env.SHOPIFY_STORE_URL || 'https://dev-ravan-fashion.myshopify.com';
  });

  afterAll(async () => {
    await chrome.kill();
  });

  test('Homepage Core Web Vitals', async () => {
    const runnerResult = await lighthouse(baseUrl, {
      port: chrome.port,
      onlyCategories: ['performance'],
    });

    const { lhr } = runnerResult;
    const scores = {
      performance: lhr.categories.performance.score * 100,
      fcp: lhr.audits['first-contentful-paint'].numericValue,
      lcp: lhr.audits['largest-contentful-paint'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      fid: lhr.audits['max-potential-fid'] ? lhr.audits['max-potential-fid'].numericValue : null,
    };

    // Performance thresholds
    expect(scores.performance).toBeGreaterThan(90);
    expect(scores.fcp).toBeLessThan(1800); // First Contentful Paint < 1.8s
    expect(scores.lcp).toBeLessThan(2500); // Largest Contentful Paint < 2.5s
    expect(scores.cls).toBeLessThan(0.1); // Cumulative Layout Shift < 0.1

    console.log('📊 Performance Scores:', scores);
  });

  test('Tamil Font Loading Performance', async () => {
    const runnerResult = await lighthouse(`${baseUrl}/collections/sarees`, {
      port: chrome.port,
      onlyAudits: ['font-display', 'unused-css-rules'],
    });

    const fontDisplay = runnerResult.lhr.audits['font-display'];
    const unusedCSS = runnerResult.lhr.audits['unused-css-rules'];

    expect(fontDisplay.score).toBe(1); // Font-display: swap should be used
    expect(unusedCSS.details.overallSavingsMs).toBeLessThan(500);
  });
});
```

### E2E Cultural Experience Test

```javascript
// tests/e2e/cultural-experience.test.js
const { test, expect } = require('@playwright/test');

test.describe('Cultural Experience Journey', () => {
  test('Tamil customer journey', async ({ page }) => {
    await page.goto('/');

    // Test language toggle
    await page.click('[data-language-toggle="tamil"]');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ta');

    // Verify Tamil text rendering
    const tamilHeading = page.locator('h1:has-text("ராவன் பேஷன்")');
    await expect(tamilHeading).toBeVisible();

    // Test cultural product filtering
    await page.click('[data-cultural-filter="festival"]');
    await expect(page.locator('.product-card')).toContainText(['தீபாவளி', 'பொங்கல்']);

    // Test product page with Tamil descriptions
    await page.click('.product-card:first-child');
    await expect(page.locator('[data-tamil-description]')).toBeVisible();

    // Test size guide in Tamil
    await page.click('[data-size-guide-tamil]');
    await expect(page.locator('.size-guide-modal')).toContainText('அளவு வழிகாட்டி');

    // Test add to cart with cultural preferences
    await page.selectOption('[data-cultural-occasion]', 'wedding');
    await page.click('[data-add-to-cart]');
    await expect(page.locator('.cart-notification')).toContainText('கார்ட்டில் சேர்க்கப்பட்டது');
  });

  test('Cultural content accuracy', async ({ page }) => {
    await page.goto('/pages/cultural-guide');

    // Verify festival information accuracy
    const festivals = await page.locator('[data-festival-info]').all();
    for (const festival of festivals) {
      const name = await festival.getAttribute('data-festival-name');
      const date = await festival.getAttribute('data-festival-date');

      // Validate festival dates are current year
      expect(new Date(date).getFullYear()).toBe(new Date().getFullYear());
    }

    // Test cultural styling recommendations
    await page.click('[data-cultural-style="traditional"]');
    const recommendations = page.locator('.style-recommendations .product-card');
    await expect(recommendations).toHaveCount.greaterThan(3);
  });
});
```

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Quality Assurance

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Validate Shopify theme
        run: npm run validate

      - name: Run unit tests
        run: npm run test:coverage

      - name: Tamil text validation
        run: npm run test:tamil

      - name: Run accessibility tests
        run: npm run test:accessibility

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          SHOPIFY_STORE_URL: ${{ secrets.SHOPIFY_STORE_URL }}

      - name: Upload E2E artifacts
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  performance:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Lighthouse CI
        run: npm run test:performance
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

## 🧪 Testing Checklist

### Pre-Launch Validation

- [ ] All unit tests passing (>80% coverage)
- [ ] Integration tests for Shopify apps
- [ ] E2E customer journey tests
- [ ] Performance benchmarks met
- [ ] Accessibility compliance verified
- [ ] Tamil text rendering validated
- [ ] Cultural content accuracy confirmed
- [ ] Cross-browser compatibility tested
- [ ] Mobile responsiveness verified
- [ ] Security vulnerability scan completed

### Test Data Requirements

- [ ] 50+ Tamil product descriptions
- [ ] Cultural festival calendar (current year)
- [ ] Sample customer profiles
- [ ] Test order scenarios
- [ ] Multi-language content variations

### Performance Targets

- [ ] Lighthouse Performance Score: >90
- [ ] First Contentful Paint: <1.8s
- [ ] Largest Contentful Paint: <2.5s
- [ ] Cumulative Layout Shift: <0.1
- [ ] Time to Interactive: <3.5s

## 📊 Success Metrics

- **Test Coverage**: >80% for all critical paths
- **Performance Score**: >90 Lighthouse rating
- **Accessibility**: WCAG AA compliance
- **Cultural Accuracy**: 100% Tamil text validation
- **Browser Support**: Latest 2 versions of major browsers
- **Mobile Performance**: Same targets as desktop

## 🔗 Dependencies

- **Prerequisite**: US1.3 (CI/CD Pipeline Setup)
- **Blocks**: US7.2 (Pre-Launch Checklist)
- **Related**: All previous user stories for comprehensive testing

## 📝 Notes

- Tests should cover both English and Tamil user experiences
- Cultural content accuracy is critical - involve Tamil speakers in review
- Performance tests should simulate real-world Tamil font loading
- Accessibility tests must validate Tamil text screen reader compatibility
- Security tests should include cultural data privacy considerations
