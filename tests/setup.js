// Jest setup file for Shopify theme testing
import '@testing-library/jest-dom';

// Mock Shopify global objects
global.Shopify = {
  currency: {
    active: 'USD',
    rate: '1.0',
    format: '${{amount}}',
  },
  locale: 'en',
  routes: {
    root: '/',
    cart_url: '/cart',
    cart_add_url: '/cart/add',
    cart_change_url: '/cart/change',
    cart_update_url: '/cart/update',
    predictive_search_url: '/search/suggest',
    search_url: '/search',
  },
  theme: {
    id: 123456789,
    name: 'Ravan Fashion',
    role: 'main',
  },
};

// Mock Liquid template globals
global.liquid = {
  filters: {
    money: (value) => `$${value.toFixed(2)}`,
    money_with_currency: (value) => `$${value.toFixed(2)} USD`,
    money_without_trailing_zeros: (value) => `$${Math.floor(value)}`,
    money_without_currency: (value) => value.toFixed(2),
    date: (value, format) => new Date(value).toLocaleDateString(),
    time_tag: (value) => `<time datetime="${value}">${new Date(value).toLocaleString()}</time>`,
    img_url: (url, size) => `${url}?width=${size.width}&height=${size.height}`,
    asset_url: (url) => `https://cdn.shopify.com/s/files/1/0000/0000/0000/t/1/assets/${url}`,
    script_tag: (url) => `<script src="${url}"></script>`,
    stylesheet_tag: (url) => `<link rel="stylesheet" href="${url}">`,
    link_to: (url, text) => `<a href="${url}">${text}</a>`,
    escape: (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    strip_html: (html) => html.replace(/<[^>]*>/g, ''),
    strip_newlines: (text) => text.replace(/\n/g, ' '),
    newline_to_br: (text) => text.replace(/\n/g, '<br>'),
    replace: (text, search, replace) => text.replace(new RegExp(search, 'g'), replace),
    replace_first: (text, search, replace) => text.replace(search, replace),
    remove: (text, substring) => text.replace(new RegExp(substring, 'g'), ''),
    remove_first: (text, substring) => text.replace(substring, ''),
    truncate: (text, length = 50, ellipsis = '...') => {
      if (text.length <= length) return text;
      return text.slice(0, length - ellipsis.length) + ellipsis;
    },
    truncatewords: (text, words = 15, ellipsis = '...') => {
      const wordArray = text.split(' ');
      if (wordArray.length <= words) return text;
      return wordArray.slice(0, words).join(' ') + ellipsis;
    },
    capitalize: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    downcase: (text) => text.toLowerCase(),
    upcase: (text) => text.toUpperCase(),
  },
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Setup DOM for testing
beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
  localStorage.getItem.mockClear();
  localStorage.setItem.mockClear();
  localStorage.removeItem.mockClear();
  localStorage.clear.mockClear();

  // Clear fetch mock before each test
  fetch.mockClear();

  // Reset Shopify globals
  Shopify.currency.active = 'USD';
  Shopify.locale = 'en';
});

// Global test utilities
global.createTestProduct = (overrides = {}) => ({
  id: 123456789,
  title: 'Test Product',
  handle: 'test-product',
  description: 'Test product description',
  price: 4999,
  compare_at_price: 6999,
  available: true,
  variants: [
    {
      id: 123456789,
      title: 'Default',
      price: 4999,
      compare_at_price: 6999,
      available: true,
      option1: 'Default',
    },
  ],
  images: [
    {
      id: 123456789,
      src: 'https://cdn.shopify.com/s/files/1/0000/0000/0000/products/test.jpg',
      alt: 'Test Product',
    },
  ],
  featured_image: 'https://cdn.shopify.com/s/files/1/0000/0000/0000/products/test.jpg',
  options: [
    {
      name: 'Size',
      position: 1,
      values: ['S', 'M', 'L'],
    },
  ],
  tags: ['test', 'cultural'],
  type: 'Cultural Wear',
  vendor: 'Ravan Fashion',
  ...overrides,
});

global.createTestCollection = (overrides = {}) => ({
  id: 123456789,
  title: 'Test Collection',
  handle: 'test-collection',
  description: 'Test collection description',
  products: [],
  products_count: 0,
  published_at: '2024-01-01T00:00:00Z',
  image: {
    src: 'https://cdn.shopify.com/s/files/1/0000/0000/0000/collections/test.jpg',
    alt: 'Test Collection',
  },
  ...overrides,
});

// Mock Shopify AJAX API
global.ShopifyAJAX = {
  cart: {
    get: jest.fn(() => Promise.resolve({ items: [], total_price: 0 })),
    add: jest.fn(() => Promise.resolve({})),
    update: jest.fn(() => Promise.resolve({})),
    change: jest.fn(() => Promise.resolve({})),
    clear: jest.fn(() => Promise.resolve({})),
  },
  product: {
    get: jest.fn(() => Promise.resolve({})),
  },
  search: {
    predictive: jest.fn(() => Promise.resolve({ results: [] })),
  },
};

// Test helpers
global.waitForPromises = () => new Promise(resolve => setTimeout(resolve, 0));

global.simulateUserEvent = {
  click: (element) => {
    element.click();
    return waitForPromises();
  },
  input: (element, value) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return waitForPromises();
  },
  focus: (element) => {
    element.focus();
    return waitForPromises();
  },
  blur: (element) => {
    element.blur();
    return waitForPromises();
  },
};