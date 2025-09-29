// Unit tests for language-toggle.js
import { jest } from '@jest/globals';
import LanguageToggle from '../../../assets/language-toggle.js';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = mockLocalStorage;

// Mock document translations
global.translations = {
  en: {
    'common.shop_name': 'Ravan Fashion',
    'common.welcome': 'Welcome',
    'collections.all': 'All Collections',
    'cart.title': 'Shopping Cart',
    'cart.added': 'Added to Cart',
    'cart.error': 'Error adding to cart',
  },
  ta: {
    'common.shop_name': 'ராவன் பேஷன்',
    'common.welcome': 'வரவேற்கிறோம்',
    'collections.all': 'அனைத்து தொகுப்புகள்',
    'cart.title': 'ஷாப்பிங் கார்ட்',
    'cart.added': 'கார்ட்டில் சேர்க்கப்பட்டது',
    'cart.error': 'கார்ட்டில் சேர்க்க முடியவில்லை',
  },
};

describe('LanguageToggle', () => {
  let languageToggle;
  let mockContainer;
  let mockButtonEn;
  let mockButtonTa;

  beforeEach(() => {
    // Setup DOM
    mockContainer = document.createElement('div');
    mockContainer.className = 'language-toggle';
    mockContainer.innerHTML = `
      <button class="lang-btn active" data-lang="en">EN</button>
      <button class="lang-btn" data-lang="ta">தமிழ்</button>
    `;
    document.body.appendChild(mockContainer);

    mockButtonEn = mockContainer.querySelector('[data-lang="en"]');
    mockButtonTa = mockContainer.querySelector('[data-lang="ta"]');

    // Clear mocks
    jest.clearAllMocks();
    mockLocalStorage.clear();

    // Create new instance
    languageToggle = new LanguageToggle(mockContainer);
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
  });

  describe('constructor', () => {
    test('should initialize with default English language', () => {
      expect(languageToggle.currentLanguage).toBe('en');
      expect(languageToggle.container).toBe(mockContainer);
    });

    test('should load language from localStorage if available', () => {
      mockLocalStorage.getItem.mockReturnValue('ta');
      const toggleWithSavedLang = new LanguageToggle(mockContainer);
      expect(toggleWithSavedLang.currentLanguage).toBe('ta');
    });

    test('should initialize event listeners', () => {
      expect(languageToggle.container).not.toBeNull();
    });
  });

  describe('setLanguage', () => {
    test('should change language to Tamil', () => {
      languageToggle.setLanguage('ta');
      expect(languageToggle.currentLanguage).toBe('ta');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('preferredLanguage', 'ta');
    });

    test('should change language to English', () => {
      languageToggle.setLanguage('en');
      expect(languageToggle.currentLanguage).toBe('en');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('preferredLanguage', 'en');
    });

    test('should update button states', () => {
      languageToggle.setLanguage('ta');
      expect(mockButtonEn).not.toHaveClass('active');
      expect(mockButtonTa).toHaveClass('active');

      languageToggle.setLanguage('en');
      expect(mockButtonEn).toHaveClass('active');
      expect(mockButtonTa).not.toHaveClass('active');
    });

    test('should update document language attribute', () => {
      languageToggle.setLanguage('ta');
      expect(document.documentElement.lang).toBe('ta');

      languageToggle.setLanguage('en');
      expect(document.documentElement.lang).toBe('en');
    });

    test('should trigger custom event on language change', () => {
      const mockCallback = jest.fn();
      document.addEventListener('languageChanged', mockCallback);

      languageToggle.setLanguage('ta');

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            oldLanguage: 'en',
            newLanguage: 'ta',
          }),
        })
      );
    });
  });

  describe('translateElement', () => {
    test('should translate element with data-translate attribute', () => {
      const element = document.createElement('div');
      element.setAttribute('data-translate', 'common.shop_name');
      element.textContent = 'Ravan Fashion';

      languageToggle.translateElement(element, 'ta');
      expect(element.textContent).toBe('ராவன் பேஷன்');
    });

    test('should translate element placeholder', () => {
      const element = document.createElement('input');
      element.setAttribute('data-translate-placeholder', 'cart.title');
      element.placeholder = 'Shopping Cart';

      languageToggle.translateElement(element, 'ta');
      expect(element.placeholder).toBe('ஷாப்பிங் கார்ட்');
    });

    test('should translate element alt text', () => {
      const element = document.createElement('img');
      element.setAttribute('data-translate-alt', 'common.welcome');
      element.alt = 'Welcome';

      languageToggle.translateElement(element, 'ta');
      expect(element.alt).toBe('வரவேற்கிறோம்');
    });

    test('should handle missing translation', () => {
      const element = document.createElement('div');
      element.setAttribute('data-translate', 'missing.key');
      element.textContent = 'Original Text';

      languageToggle.translateElement(element, 'ta');
      expect(element.textContent).toBe('Original Text');
    });

    test('should handle missing target language', () => {
      const element = document.createElement('div');
      element.setAttribute('data-translate', 'common.shop_name');
      element.textContent = 'Ravan Fashion';

      languageToggle.translateElement(element, 'fr');
      expect(element.textContent).toBe('Ravan Fashion');
    });
  });

  describe('translatePage', () => {
    beforeEach(() => {
      // Add test elements to DOM
      const elements = [
        { tag: 'div', attr: 'data-translate', key: 'common.shop_name', text: 'Ravan Fashion' },
        { tag: 'input', attr: 'data-translate-placeholder', key: 'cart.title', placeholder: 'Shopping Cart' },
        { tag: 'img', attr: 'data-translate-alt', key: 'common.welcome', alt: 'Welcome' },
      ];

      elements.forEach(({ tag, attr, key, text, placeholder, alt }) => {
        const element = document.createElement(tag);
        element.setAttribute(attr, key);
        if (text) element.textContent = text;
        if (placeholder) element.placeholder = placeholder;
        if (alt) element.alt = alt;
        document.body.appendChild(element);
      });
    });

    test('should translate all elements on page', () => {
      languageToggle.translatePage('ta');

      const shopNameElement = document.querySelector('[data-translate="common.shop_name"]');
      const cartInput = document.querySelector('[data-translate-placeholder="cart.title"]');
      const welcomeImg = document.querySelector('[data-translate-alt="common.welcome"]');

      expect(shopNameElement.textContent).toBe('ராவன் பேஷன்');
      expect(cartInput.placeholder).toBe('ஷாப்பிங் கார்ட்');
      expect(welcomeImg.alt).toBe('வரவேற்கிறோம்');
    });

    test('should translate page to English', () => {
      // First switch to Tamil
      languageToggle.setLanguage('ta');

      // Then translate back to English
      languageToggle.translatePage('en');

      const shopNameElement = document.querySelector('[data-translate="common.shop_name"]');
      expect(shopNameElement.textContent).toBe('Ravan Fashion');
    });
  });

  describe('event handling', () => {
    test('should handle button click events', () => {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });

      mockButtonTa.dispatchEvent(clickEvent);

      expect(languageToggle.currentLanguage).toBe('ta');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('preferredLanguage', 'ta');
    });

    test('should prevent default button behavior', () => {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });

      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
      mockButtonTa.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('utility methods', () => {
    test('should detect if language is Tamil', () => {
      expect(LanguageToggle.isTamil('ta')).toBe(true);
      expect(LanguageToggle.isTamil('en')).toBe(false);
      expect(LanguageToggle.isTamil('fr')).toBe(false);
    });

    test('should get direction for language', () => {
      expect(LanguageToggle.getDirection('en')).toBe('ltr');
      expect(LanguageToggle.getDirection('ta')).toBe('ltr');
      expect(LanguageToggle.getDirection('ar')).toBe('rtl');
    });

    test('should format language name', () => {
      expect(LanguageToggle.formatLanguageName('en')).toBe('English');
      expect(LanguageToggle.formatLanguageName('ta')).toBe('தமிழ்');
      expect(LanguageToggle.formatLanguageName('fr')).toBe('Français');
    });
  });

  describe('error handling', () => {
    test('should handle invalid language codes', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      languageToggle.setLanguage('invalid');

      expect(consoleSpy).toHaveBeenCalledWith('Invalid language code: invalid');
      expect(languageToggle.currentLanguage).toBe('en'); // Should not change

      consoleSpy.mockRestore();
    });

    test('should handle missing container', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const invalidToggle = new LanguageToggle(null);

      expect(consoleSpy).toHaveBeenCalledWith('Language toggle container is required');
      expect(invalidToggle.currentLanguage).toBe('en');

      consoleSpy.mockRestore();
    });

    test('should handle missing buttons', () => {
      const emptyContainer = document.createElement('div');
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const toggleWithNoButtons = new LanguageToggle(emptyContainer);

      expect(consoleSpy).toHaveBeenCalledWith('No language buttons found');

      consoleSpy.mockRestore();
    });
  });
});