/**
 * Ravan Fashion Theme - Main JavaScript
 * Tamil-inspired Shopify theme for the diaspora community
 */

// Global variables for timer management
let autoRotateInterval; // eslint-disable-line no-unused-vars -- Used in TamilProverbs setup
const countdownIntervals = {}; // eslint-disable-line no-unused-vars -- Used in CountdownTimers setup

class RavanFashionTheme {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupLanguageToggle();
    this.setupMobileMenu();
    this.setupNewsletterForm();
    this.setupCountdownTimers();
    this.setupTamilProverbs();
    this.setupCart();
    this.setupSearch();
    this.animateOnScroll();
  }

  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeComponents();
    });

    window.addEventListener(
      'scroll',
      this.throttle(() => {
        this.handleScroll();
      }, 16)
    );
  }

  setupLanguageToggle() {
    const langToggle = document.querySelector('.lang-toggle');
    if (!langToggle) return;

    const buttons = langToggle.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();

        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Store language preference
        const lang = button.dataset.lang;
        localStorage.setItem('preferred-language', lang);

        // Dispatch language change event
        document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
      });
    });

    // Set initial language from localStorage or default
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    const activeButton = langToggle.querySelector(`[data-lang="${savedLang}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
  }

  setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (!mobileMenuToggle || !mobileMenu) return;

    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');

      if (isOpen) {
        mobileMenu.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.add('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', e => {
      if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setupNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form form');

    newsletterForms.forEach(form => {
      form.addEventListener('submit', async e => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Show loading state
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;

        try {
          // Use Klaviyo service if available, otherwise fallback to simulation
          if (window.klaviyoService) {
            await window.klaviyoService.subscribeToNewsletter(emailInput.value, {
              source: 'website_newsletter_legacy',
              language_preference: localStorage.getItem('preferred-language') || 'en',
              signup_date: new Date().toISOString()
            });
          } else {
            // Fallback simulation
            await this.simulateNewsletterSignup(emailInput.value);
          }

          // Show success message
          this.showNotification('Successfully subscribed to newsletter!', 'success');
          form.reset();
        } catch (error) {
          console.error('Newsletter signup failed:', error);
          this.showNotification('Failed to subscribe. Please try again.', 'error');
        } finally {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }
      });
    });
  }

  setupCountdownTimers() {
    const countdownDisplays = document.querySelectorAll('.countdown-display');

    countdownDisplays.forEach(display => {
      const targetDate = new Date(display.dataset.targetDate).getTime();
      const progressBar = display.closest('.countdown-timer').querySelector('.countdown-progress-bar');

      // Calculate total duration for progress bar
      const totalDuration = targetDate - new Date().getTime();

      const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
          // Timer expired
          display.querySelectorAll('.countdown-number').forEach(el => {
            el.textContent = '00';
          });
          if (progressBar) {
            progressBar.style.width = '0%';
          }
          return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update display
        const daysEl = display.querySelector('[data-unit="days"]');
        const hoursEl = display.querySelector('[data-unit="hours"]');
        const minutesEl = display.querySelector('[data-unit="minutes"]');
        const secondsEl = display.querySelector('[data-unit="seconds"]');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

        // Update progress bar
        if (progressBar && totalDuration > 0) {
          const progress = Math.max(0, (distance / totalDuration) * 100);
          progressBar.style.width = `${progress}%`;
        }
      };

      updateTimer();
      setInterval(updateTimer, 1000);
    });
  }

  setupTamilProverbs() {
    const proverbRotators = document.querySelectorAll('.tamil-proverbs');

    proverbRotators.forEach(rotator => {
      const proverbsData = JSON.parse(rotator.querySelector('.proverbs-data').textContent);
      const content = rotator.querySelector('.proverb-content');
      const dotsContainer = rotator.querySelector('.proverb-dots');
      const prevBtn = rotator.querySelector('.proverb-prev');
      const nextBtn = rotator.querySelector('.proverb-next');
      const autoRotateBtn = rotator.querySelector('.auto-rotate-toggle');

      let currentIndex = 0;
      let autoRotateInterval;

      // Create navigation dots
      proverbsData.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `w-3 h-3 rounded-full transition-colors duration-300 ${
          index === 0 ? 'bg-gold' : 'bg-gray-300'
        }`;
        dot.setAttribute('aria-label', `Go to proverb ${index + 1}`);
        dot.addEventListener('click', () => showProverb(index));
        dotsContainer.appendChild(dot);
      });

      const dots = dotsContainer.querySelectorAll('button');

      const showProverb = (index) => {
        // Fade out
        content.style.opacity = '0';

        setTimeout(() => {
          const proverb = proverbsData[index];

          // Update content
          content.querySelector('.proverb-tamil').textContent = `"${proverb.tamil}"`;
          content.querySelector('.proverb-english').textContent = proverb.english;
          content.querySelector('.proverb-meaning').textContent = proverb.meaning;
          content.querySelector('.cultural-context p').innerHTML =
            `<span class="font-semibold">Cultural Context:</span> ${proverb.cultural_context}`;

          // Update active dot
          dots.forEach((dot, i) => {
            dot.className = `w-3 h-3 rounded-full transition-colors duration-300 ${
              i === index ? 'bg-gold' : 'bg-gray-300'
            }`;
          });

          // Fade in
          content.style.opacity = '1';
        }, 300);

        currentIndex = index;
      };

      const nextProverb = () => {
        const nextIndex = (currentIndex + 1) % proverbsData.length;
        showProverb(nextIndex);
      };

      const prevProverb = () => {
        const prevIndex = (currentIndex - 1 + proverbsData.length) % proverbsData.length;
        showProverb(prevIndex);
      };

      const startAutoRotate = () => {
        autoRotateInterval = window.setInterval(nextProverb, 5000); // Rotate every 5 seconds
        autoRotateBtn.setAttribute('data-active', 'true');
        autoRotateBtn.textContent = 'Auto-rotate: ON';
      };

      const stopAutoRotate = () => {
        window.clearInterval(autoRotateInterval);
        autoRotateBtn.setAttribute('data-active', 'false');
        autoRotateBtn.textContent = 'Auto-rotate: OFF';
      };

      // Event listeners
      prevBtn.addEventListener('click', () => {
        stopAutoRotate();
        prevProverb();
      });

      nextBtn.addEventListener('click', () => {
        stopAutoRotate();
        nextProverb();
      });

      autoRotateBtn.addEventListener('click', () => {
        const isActive = autoRotateBtn.getAttribute('data-active') === 'true';
        if (isActive) {
          stopAutoRotate();
        } else {
          startAutoRotate();
        }
      });

      // Show first proverb
      setTimeout(() => {
        showProverb(0);
        startAutoRotate();
      }, 500);

      // Pause on hover
      rotator.addEventListener('mouseenter', stopAutoRotate);
      rotator.addEventListener('mouseleave', () => {
        if (autoRotateBtn.getAttribute('data-active') === 'true') {
          startAutoRotate();
        }
      });
    });
  }

  animateOnScroll() {
    const animatedElements = document.querySelectorAll('[data-animate-on-scroll]');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  handleScroll() {
    const header = document.querySelector('[data-header]');
    if (!header) return;

    const scrolled = window.pageYOffset;
    const headerHeight = header.offsetHeight;

    if (scrolled > headerHeight) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  initializeComponents() {
    // Initialize any components that require DOM to be ready
    this.setupProductCards();
    this.setupImageGalleries();
    this.setupAccessibility();

    // Initialize global theme functions
    window.theme = {
      setLanguage: (lang) => this.setLanguage(lang),
      toggleMobileMenu: () => this.toggleMobileMenu(),
      toggleCart: () => this.toggleCart(),
      toggleSearch: () => this.toggleSearch(),
      handleNewsletterSubmit: (e) => this.handleNewsletterSubmit(e)
    };
  }

  setupProductCards() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });
    });
  }

  setupImageGalleries() {
    const galleries = document.querySelectorAll('[data-gallery]');

    galleries.forEach(gallery => {
      const images = gallery.querySelectorAll('img');
      const thumbnails = gallery.querySelectorAll('[data-thumbnail]');

      thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
          // Update main image
          const mainImage = gallery.querySelector('[data-main-image]');
          if (mainImage && images[index]) {
            mainImage.src = images[index].src;
            mainImage.alt = images[index].alt;
          }

          // Update active thumbnail
          thumbnails.forEach(t => t.classList.remove('active'));
          thumbnail.classList.add('active');
        });
      });
    });
  }

  setupAccessibility() {
    // Add keyboard navigation support
    const interactiveElements = document.querySelectorAll('button, a, [tabindex]');

    interactiveElements.forEach(element => {
      element.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });

    // Add focus management
    document.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  }

  async simulateNewsletterSignup(_email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate random success/failure
    if (Math.random() > 0.1) {
      // 90% success rate
      return { success: true };
    } else {
      throw new Error('Network error');
    }
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  setupCart() {
    // Cart toggle functionality
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartButtons = document.querySelectorAll('.close-cart');

    closeCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.toggleCart();
      });
    });

    // Close cart when clicking outside
    cartDrawer.addEventListener('click', (e) => {
      if (e.target === cartDrawer) {
        this.toggleCart();
      }
    });
  }

  setupSearch() {
    // Search toggle functionality - placeholder for future implementation
    // TODO: Implement search functionality in US3.x
  }

  toggleMobileMenu() {
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');

    if (!mobileMenu || !mobileMenuToggle) return;

    const isOpen = mobileMenu.classList.contains('hidden');

    if (isOpen) {
      mobileMenu.classList.remove('hidden');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  toggleCart() {
    const cartDrawer = document.getElementById('cart-drawer');
    cartDrawer.classList.toggle('hidden');
  }

  toggleSearch() {
    // Placeholder for search modal implementation
    this.showNotification('Search feature coming soon!', 'info');
  }

  handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;

    this.simulateNewsletterSignup(emailInput.value)
      .then(() => {
        this.showNotification('Successfully subscribed to newsletter!', 'success');
        form.reset();
      })
      .catch(() => {
        this.showNotification('Failed to subscribe. Please try again.', 'error');
      })
      .finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      });
  }

  handleEnhancedNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    // Get form values (will be used in actual implementation)
    const email = form.email.value;
    const firstName = form.first_name?.value || '';
    const lastName = form.last_name?.value || '';

    // Get selected interests
    const interests = Array.from(form.querySelectorAll('input[name="interests[]"]:checked'))
      .map(checkbox => checkbox.value);

    // These variables will be used when implementing the actual API call
    void email, firstName, lastName, interests;

    // Simulate enhanced form submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span>Subscribing...</span>
      <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
    `;

    setTimeout(() => {
      // Success message with cultural touch
      this.showNotification(
        'Welcome to the Ravan Fashion family! 🎉',
        'success'
      );

      // Reset form
      form.reset();

      // Restore button
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;

      // Show success message in form
      const messagesContainer = document.getElementById('enhanced-newsletter-messages');
      if (messagesContainer) {
        messagesContainer.innerHTML = `
          <div class="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-green-400 font-medium">
                Thank you for joining our community! Check your email for a special welcome gift.
              </span>
            </div>
          </div>
        `;
      }

      // Hide success message after 5 seconds
      setTimeout(() => {
        if (messagesContainer) {
          messagesContainer.innerHTML = '';
        }
      }, 5000);

    }, 2000);
  }
}

// Initialize theme when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new RavanFashionTheme());
} else {
  new RavanFashionTheme();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RavanFashionTheme;
}
