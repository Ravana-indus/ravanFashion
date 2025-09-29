# US5.2: ARIA Labels for Tamil Text

**Story Points:** 3 **Section:** Performance & Accessibility **Priority:** High **Status:** Ready

## User Story

As a visually impaired user, I want ARIA labels on Tamil text so I can use screen readers.

## Acceptance Criteria

✅ **Primary Acceptance:** All Tamil-only text includes `aria-label` with English translation.

### Detailed Acceptance Criteria:

1. **Screen Reader Support**
   - [ ] All Tamil text has English `aria-label` attributes
   - [ ] Proper pronunciation guidance for Tamil terms
   - [ ] Semantic HTML structure with headings
   - [ ] Skip navigation links for main content

2. **WCAG AA Compliance**
   - [ ] Color contrast ratios ≥4.5:1 for normal text
   - [ ] Color contrast ratios ≥3:1 for large text
   - [ ] Text resizable up to 200% without loss of functionality
   - [ ] No information conveyed by color alone

3. **Keyboard Navigation**
   - [ ] All interactive elements accessible via keyboard
   - [ ] Visible focus indicators on all focusable elements
   - [ ] Logical tab order throughout the site
   - [ ] ESC key functionality for modals/dropdowns

4. **Cultural Accessibility**
   - [ ] Tamil text readable by English screen readers
   - [ ] Cultural context provided for screen readers
   - [ ] Inclusive language in all accessibility features
   - [ ] Multiple language support for assistive technologies

## Technical Implementation

### Accessibility Utils (snippets/accessibility-helpers.liquid)

```liquid
{% comment %}
  Accessibility helper snippets for Tamil text and cultural elements
{% endcomment %}

{% comment %} Tamil Text with ARIA Support {% endcomment %}
{% capture tamil_with_aria %}
  {% assign tamil_text = tamil_text | default: '' %}
  {% assign english_translation = english_translation | default: '' %}
  {% assign pronunciation = pronunciation | default: '' %}

  <span class="tamil-text font-tamil"
        aria-label="{{ english_translation }}{% if pronunciation %} (pronounced {{ pronunciation }}){% endif %}"
        lang="ta">
    {{ tamil_text }}
  </span>
{% endcapture %}

{% comment %} Skip Navigation {% endcomment %}
{% capture skip_navigation %}
  <div class="skip-navigation">
    <a href="#main-content" class="skip-link sr-only focus:not-sr-only">
      {{ 'accessibility.skip_to_content' | t }}
    </a>
    <a href="#navigation" class="skip-link sr-only focus:not-sr-only">
      {{ 'accessibility.skip_to_navigation' | t }}
    </a>
  </div>
{% endcapture %}

{% comment %} Cultural Term with Context {% endcomment %}
{% capture cultural_term %}
  {% assign term = term | default: '' %}
  {% assign meaning = meaning | default: '' %}
  {% assign context = context | default: '' %}

  <span class="cultural-term"
        aria-label="{{ meaning }}. {{ context }}"
        title="{{ meaning }}"
        lang="ta">
    {{ term }}
  </span>
{% endcapture %}

{% comment %} Accessible Button with Tamil {% endcomment %}
{% capture accessible_button %}
  {% assign button_text_tamil = button_text_tamil | default: '' %}
  {% assign button_text_english = button_text_english | default: '' %}
  {% assign button_action = button_action | default: '' %}

  <button type="button"
          aria-label="{{ button_text_english }}. {{ button_action }}"
          class="btn">
    <span class="tamil-text font-tamil" aria-hidden="true">{{ button_text_tamil }}</span>
    <span class="english-text">{{ button_text_english }}</span>
  </button>
{% endcapture %}
```

### Enhanced Header with Accessibility (layout/header.liquid)

```liquid
<!-- Skip Navigation -->
{% render 'accessibility-helpers' with 'skip_navigation' %}

<header class="site-header sticky top-0 z-50 bg-cream-white border-b border-deep-maroon/20"
        role="banner">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">

      <!-- Logo with Proper Semantics -->
      <div class="site-branding">
        <a href="{{ routes.root_url }}"
           class="logo-link flex items-center space-x-2"
           aria-label="{{ 'accessibility.home_link' | t }}">

          <img src="{{ 'logo.svg' | asset_url }}"
               alt="{{ shop.name }} logo"
               class="h-8 w-auto">

          <span class="brand-name tamil-text font-tamil text-xl text-deep-maroon"
                aria-label="{{ shop.name }} in English"
                lang="ta">
            {{ settings.tamil_brand_name | default: 'ரவன் ஃபேஷன்' }}
          </span>
        </a>
      </div>

      <!-- Main Navigation -->
      <nav class="main-navigation hidden md:flex space-x-8"
           role="navigation"
           aria-label="{{ 'accessibility.main_navigation' | t }}">

        {% for link in linklists.main-menu.links %}
          <a href="{{ link.url }}"
             class="nav-link text-charcoal-black hover:text-deep-maroon transition-colors focus:outline-none focus:ring-2 focus:ring-deep-maroon focus:ring-offset-2"
             {% if link.active %}aria-current="page"{% endif %}>
            {{ link.title }}
          </a>
        {% endfor %}
      </nav>

      <!-- Utility Navigation -->
      <div class="utility-nav flex items-center space-x-4">

        <!-- Language Toggle with Accessibility -->
        <div class="language-toggle" role="group" aria-label="{{ 'accessibility.language_selection' | t }}">
          <button class="lang-btn {% if request.locale.iso_code == 'en' %}active{% endif %}"
                  onclick="switchLanguage('en')"
                  aria-pressed="{% if request.locale.iso_code == 'en' %}true{% else %}false{% endif %}"
                  aria-label="{{ 'accessibility.switch_to_english' | t }}">
            EN
          </button>

          <button class="lang-btn {% if request.locale.iso_code == 'ta' %}active{% endif %}"
                  onclick="switchLanguage('ta')"
                  aria-pressed="{% if request.locale.iso_code == 'ta' %}true{% else %}false{% endif %}"
                  aria-label="{{ 'accessibility.switch_to_tamil' | t }}">
            <span class="tamil-text font-tamil" aria-hidden="true">தமிழ்</span>
          </button>
        </div>

        <!-- Search with Accessibility -->
        <button class="search-toggle p-2 text-charcoal-black hover:text-deep-maroon focus:outline-none focus:ring-2 focus:ring-deep-maroon focus:ring-offset-2"
                aria-label="{{ 'accessibility.open_search' | t }}"
                aria-expanded="false"
                aria-controls="search-drawer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>

        <!-- Cart with Accessibility -->
        <a href="{{ routes.cart_url }}"
           class="cart-link p-2 text-charcoal-black hover:text-deep-maroon focus:outline-none focus:ring-2 focus:ring-deep-maroon focus:ring-offset-2 relative"
           aria-label="{{ 'accessibility.shopping_cart' | t }} ({{ cart.item_count }} {{ 'accessibility.items' | t }})">

          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m.5 8L8 21h8"></path>
          </svg>

          {% if cart.item_count > 0 %}
            <span class="cart-count absolute -top-1 -right-1 bg-deep-maroon text-cream-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  aria-label="{{ cart.item_count }} {{ 'accessibility.items_in_cart' | t }}">
              {{ cart.item_count }}
            </span>
          {% endif %}
        </a>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle md:hidden p-2 text-charcoal-black hover:text-deep-maroon focus:outline-none focus:ring-2 focus:ring-deep-maroon focus:ring-offset-2"
                aria-label="{{ 'accessibility.open_menu' | t }}"
                aria-expanded="false"
                aria-controls="mobile-menu">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>

<!-- Mobile Menu with Accessibility -->
<div id="mobile-menu"
     class="mobile-navigation md:hidden fixed inset-0 z-50 bg-white transform translate-x-full transition-transform"
     role="dialog"
     aria-modal="true"
     aria-labelledby="mobile-menu-title"
     aria-hidden="true">

  <div class="mobile-menu-header flex items-center justify-between p-4 border-b">
    <h2 id="mobile-menu-title" class="text-lg font-bold text-charcoal-black">
      {{ 'accessibility.navigation_menu' | t }}
    </h2>

    <button class="close-mobile-menu p-2 text-charcoal-black hover:text-deep-maroon focus:outline-none focus:ring-2 focus:ring-deep-maroon focus:ring-offset-2"
            aria-label="{{ 'accessibility.close_menu' | t }}">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div>

  <nav class="mobile-menu-nav p-4" role="navigation" aria-label="{{ 'accessibility.mobile_navigation' | t }}">
    <ul class="space-y-4">
      {% for link in linklists.main-menu.links %}
        <li>
          <a href="{{ link.url }}"
             class="block py-2 text-lg text-charcoal-black hover:text-deep-maroon focus:outline-none focus:ring-2 focus:ring-deep-maroon focus:ring-offset-2"
             {% if link.active %}aria-current="page"{% endif %}>
            {{ link.title }}
          </a>
        </li>
      {% endfor %}
    </ul>
  </nav>
</div>
```

### Accessibility CSS (assets/accessibility.css)

```css
/* Screen Reader Only Text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Skip Navigation Links */
.skip-navigation {
  position: relative;
  z-index: 9999;
}

.skip-link {
  @apply bg-deep-maroon text-cream-white px-4 py-2 rounded-md;
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 10px;
}

/* Focus Indicators */
*:focus {
  outline: 2px solid #6a1b1b;
  outline-offset: 2px;
}

/* Enhanced Focus for Interactive Elements */
button:focus,
a:focus,
input:focus,
select:focus,
textarea:focus {
  @apply ring-2 ring-deep-maroon ring-offset-2;
  outline: none;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .tamil-text,
  .cultural-term {
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  }

  .btn {
    border: 2px solid currentColor;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Font Size Scaling */
@media (min-resolution: 192dpi) {
  .tamil-text {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Color Contrast Helpers */
.contrast-aa {
  color: #1c1c1c;
  background-color: #fdf6ec;
}

.contrast-aaa {
  color: #000000;
  background-color: #ffffff;
}

/* Accessible Form Elements */
.form-group label {
  @apply block font-medium mb-2;
}

.form-group input:invalid {
  @apply border-red-500;
}

.form-group .error-message {
  @apply text-red-600 text-sm mt-1;
}

/* Screen Reader Announcements */
.sr-announcement {
  @apply sr-only;
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.sr-announcement[aria-live] {
  position: static;
  width: auto;
  height: auto;
}
```

### Accessibility JavaScript (assets/accessibility.js)

```javascript
class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupSkipNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderAnnouncements();
    this.setupKeyboardNavigation();
    this.enhanceTamilTextAccessibility();
  }

  setupSkipNavigation() {
    const skipLinks = document.querySelectorAll('.skip-link');

    skipLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  setupFocusManagement() {
    // Modal focus trap
    const modals = document.querySelectorAll('[role="dialog"]');

    modals.forEach(modal => {
      modal.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
          this.trapFocus(e, modal);
        }
      });
    });
  }

  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  setupScreenReaderAnnouncements() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-announcement';
    document.body.appendChild(liveRegion);

    this.liveRegion = liveRegion;
  }

  announce(message, priority = 'polite') {
    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;
    }
  }

  setupKeyboardNavigation() {
    // ESC key handling
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }
    });

    // Arrow key navigation for certain components
    const radioGroups = document.querySelectorAll('[role="radiogroup"]');
    radioGroups.forEach(group => {
      this.setupArrowKeyNavigation(group);
    });
  }

  handleEscapeKey() {
    // Close any open modals
    const openModals = document.querySelectorAll('[role="dialog"]:not(.hidden)');
    openModals.forEach(modal => {
      const closeBtn = modal.querySelector('.close-modal, [aria-label*="close"]');
      if (closeBtn) {
        closeBtn.click();
      }
    });

    // Close mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
      const closeBtn = mobileMenu.querySelector('.close-mobile-menu');
      if (closeBtn) {
        closeBtn.click();
      }
    }
  }

  setupArrowKeyNavigation(container) {
    const items = container.querySelectorAll('[role="radio"]');

    container.addEventListener('keydown', e => {
      let index = Array.from(items).indexOf(document.activeElement);

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          index = (index + 1) % items.length;
          items[index].focus();
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          index = index === 0 ? items.length - 1 : index - 1;
          items[index].focus();
          break;
      }
    });
  }

  enhanceTamilTextAccessibility() {
    // Add pronunciation hints to Tamil text
    const tamilElements = document.querySelectorAll('.tamil-text[lang="ta"]');

    tamilElements.forEach(element => {
      const text = element.textContent.trim();
      const ariaLabel = element.getAttribute('aria-label');

      if (!ariaLabel) {
        // Provide basic pronunciation guidance
        const pronunciation = this.getTamilPronunciation(text);
        if (pronunciation) {
          element.setAttribute('aria-label', `${text} in Tamil, pronounced ${pronunciation}`);
        }
      }
    });
  }

  getTamilPronunciation(tamilText) {
    // Basic pronunciation mapping for common Tamil words
    const pronunciationMap = {
      கோலம்: 'kolam',
      தமிழ்: 'tamizh',
      ரவன்: 'ravan',
      ஃபேஷன்: 'fashion',
      நன்றி: 'nanri',
      வணக்கம்: 'vanakkam',
      அளவு: 'alavu',
      நிறம்: 'niram',
      விலை: 'vilai',
    };

    return pronunciationMap[tamilText] || null;
  }

  // Utility method for external announcements
  static announce(message, priority = 'polite') {
    const enhancer = window.accessibilityEnhancer;
    if (enhancer) {
      enhancer.announce(message, priority);
    }
  }
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', () => {
  window.accessibilityEnhancer = new AccessibilityEnhancer();
});

// Export for use in other scripts
window.AccessibilityEnhancer = AccessibilityEnhancer;
```

## Localization Support

```json
// locales/en.default.json
{
  "accessibility": {
    "skip_to_content": "Skip to main content",
    "skip_to_navigation": "Skip to navigation",
    "home_link": "Go to homepage",
    "main_navigation": "Main navigation",
    "language_selection": "Language selection",
    "switch_to_english": "Switch to English",
    "switch_to_tamil": "Switch to Tamil",
    "open_search": "Open search",
    "shopping_cart": "Shopping cart",
    "items": "items",
    "items_in_cart": "items in cart",
    "open_menu": "Open navigation menu",
    "close_menu": "Close navigation menu",
    "navigation_menu": "Navigation Menu",
    "mobile_navigation": "Mobile navigation"
  }
}

// locales/ta.json
{
  "accessibility": {
    "skip_to_content": "முக்கிய உள்ளடக்கத்திற்கு செல்லुங்கள்",
    "skip_to_navigation": "வழிசெலுத்தலுக்கு செல்லுங்கள்",
    "home_link": "முகப்பு பக்கத்திற்கு செல்லுங்கள்",
    "shopping_cart": "கொள்முதல் கூடை",
    "items": "பொருட்கள்",
    "open_menu": "மெனுவைத் திறக்கவும்",
    "close_menu": "மெனுவை மூடவும்"
  }
}
```

## Definition of Done

- [ ] All Tamil text has appropriate ARIA labels
- [ ] WCAG AA color contrast compliance verified
- [ ] Keyboard navigation functional throughout site
- [ ] Screen reader testing completed
- [ ] Skip navigation links working
- [ ] Focus indicators visible and accessible
- [ ] Mobile accessibility tested
- [ ] Reduced motion preferences respected

## Dependencies

- Screen reader testing tools (NVDA, JAWS, VoiceOver)
- Color contrast analyzer tools
- Tamil pronunciation reference guide
- Accessibility testing checklist

## Files Created/Modified

- `snippets/accessibility-helpers.liquid`
- `layout/header.liquid` (accessibility enhancements)
- `assets/accessibility.css`
- `assets/accessibility.js`
- `locales/en.default.json` (accessibility keys)
- `locales/ta.json` (Tamil accessibility terms)

## Testing Checklist

- [ ] Screen reader compatibility (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation testing
- [ ] Color contrast validation
- [ ] Tamil text pronunciation testing
- [ ] Mobile accessibility verification
- [ ] Focus indicator visibility
- [ ] Skip navigation functionality
- [ ] Form accessibility validation

## Estimate Breakdown

- ARIA label implementation: 1 hour
- Keyboard navigation enhancements: 1 hour
- Screen reader optimizations: 45 min
- Testing and validation: 15 min
- **Total: 3 story points**
