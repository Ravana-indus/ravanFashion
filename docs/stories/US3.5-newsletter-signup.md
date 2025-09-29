# US3.5: Newsletter Signup

**Story Points:** 3 **Section:** Homepage Experience **Priority:** Medium **Status:** Ready

## User Story

As a shopper, I want a newsletter signup so I can get notified about drops.

## Acceptance Criteria

✅ **Primary Acceptance:** Form submits to Shopify + Klaviyo, confirmation message shown.

### Detailed Acceptance Criteria:

1. **Form Design**
   - [ ] Prominent placement on homepage (footer and/or dedicated section)
   - [ ] Clean, minimal design with cultural accents
   - [ ] Email input field with validation
   - [ ] Clear CTA button with Tamil + English text

2. **Integration Requirements**
   - [ ] Form submits to Shopify customer list
   - [ ] Data syncs to Klaviyo for email marketing
   - [ ] GDPR-compliant consent handling
   - [ ] Double opt-in process configured

3. **User Experience**
   - [ ] Real-time email validation
   - [ ] Success/error state feedback
   - [ ] Loading state during submission
   - [ ] Thank you message with cultural touch

4. **Cultural Elements**
   - [ ] Tamil welcome message option
   - [ ] Cultural incentive (first drop access, etc.)
   - [ ] Brand-consistent styling
   - [ ] Respectful data collection messaging

## Design Specifications

### Newsletter Section Layout

```
┌─────────────────────────────────────┐
│    Stay Connected to Our Culture    │
│                                     │
│  "அடுத்த கலாச்சார வெளியீட்டை முதலில்  │
│        பெற பதிவு செய்யுங்கள்"         │
│                                     │
│  ┌─────────────────┐ ┌──────────────┐ │
│  │ Email Address   │ │   Subscribe  │ │
│  │                 │ │  (பதிவு செய்)  │ │
│  └─────────────────┘ └──────────────┘ │
│                                     │
│    ✓ Early access to new drops      │
│    ✓ Cultural stories & heritage    │
│    ✓ Exclusive member discounts     │
│                                     │
│   We respect your privacy 🔒       │
└─────────────────────────────────────┘
```

### Inline Footer Version

```
📧 Join our cultural community: [email] [Subscribe]
```

## Technical Implementation

### Newsletter Section (sections/newsletter-signup.liquid)

```liquid
<section class="newsletter-section bg-gradient-to-br from-deep-maroon to-charcoal-black text-cream-white py-16">
  <div class="container mx-auto px-4">
    <div class="max-w-2xl mx-auto text-center">

      <!-- Section Header -->
      <header class="mb-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          {{ section.settings.heading_english | default: 'Stay Connected to Our Culture' }}
        </h2>

        {% if section.settings.heading_tamil %}
          <p class="text-xl font-tamil text-gold mb-4">
            {{ section.settings.heading_tamil }}
          </p>
        {% endif %}

        {% if section.settings.description %}
          <p class="text-lg text-cream-white/80 mb-6">
            {{ section.settings.description }}
          </p>
        {% endif %}
      </header>

      <!-- Newsletter Form -->
      <form class="newsletter-form mb-8"
            action="{{ routes.root_url }}contact"
            method="post"
            id="newsletter-form"
            data-klaviyo-list="{{ section.settings.klaviyo_list_id }}">

        <input type="hidden" name="form_type" value="customer">
        <input type="hidden" name="utf8" value="✓">
        <input type="hidden" name="contact[tags]" value="newsletter">

        <div class="form-group flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
          <div class="flex-1">
            <label for="newsletter-email" class="sr-only">
              {{ 'newsletter.email_placeholder' | t }}
            </label>

            <input type="email"
                   id="newsletter-email"
                   name="contact[email]"
                   placeholder="{{ 'newsletter.email_placeholder' | t }}"
                   class="w-full px-4 py-3 rounded-lg border-2 border-transparent bg-white text-charcoal-black placeholder-gray-500 focus:border-gold focus:outline-none transition-colors"
                   required
                   aria-describedby="email-error">

            <div id="email-error" class="text-red-300 text-sm mt-1 hidden" role="alert"></div>
          </div>

          <button type="submit"
                  class="btn btn-gold px-8 py-3 font-medium flex items-center justify-center min-w-[140px]"
                  disabled>

            <span class="btn-text">{{ 'newsletter.subscribe_button' | t }}</span>
            <span class="btn-text-tamil font-tamil ml-2 text-sm">(பதிவு செய்)</span>

            <!-- Loading spinner -->
            <svg class="animate-spin h-5 w-5 ml-2 hidden loading-spinner" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>

        <!-- GDPR Consent -->
        <div class="consent-wrapper mt-4">
          <label class="flex items-start text-sm text-cream-white/80 max-w-lg mx-auto">
            <input type="checkbox"
                   name="contact[accepts_marketing]"
                   value="1"
                   class="mt-1 mr-3 rounded border-gray-400"
                   required>

            <span>
              {{ 'newsletter.consent_text' | t }}
              <a href="{{ pages.privacy-policy.url }}" class="text-gold hover:underline">
                {{ 'newsletter.privacy_policy' | t }}
              </a>
            </span>
          </label>
        </div>
      </form>

      <!-- Benefits List -->
      {% if section.settings.show_benefits %}
        <div class="benefits-list grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="benefit flex items-center justify-center">
            <svg class="w-5 h-5 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ 'newsletter.benefit_1' | t }}</span>
          </div>

          <div class="benefit flex items-center justify-center">
            <svg class="w-5 h-5 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ 'newsletter.benefit_2' | t }}</span>
          </div>

          <div class="benefit flex items-center justify-center">
            <svg class="w-5 h-5 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ 'newsletter.benefit_3' | t }}</span>
          </div>
        </div>
      {% endif %}

      <!-- Privacy Notice -->
      <footer class="mt-6 text-xs text-cream-white/60 flex items-center justify-center">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
        </svg>
        {{ 'newsletter.privacy_notice' | t }}
      </footer>
    </div>

    <!-- Success/Error Messages -->
    <div id="newsletter-success" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <div class="text-green-600 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>

        <h3 class="text-xl font-bold text-charcoal-black mb-2">
          {{ 'newsletter.success_title' | t }}
        </h3>

        <p class="text-muted-teal mb-2">
          {{ 'newsletter.success_message' | t }}
        </p>

        <p class="text-sm font-tamil text-deep-maroon mb-4">
          {{ 'newsletter.success_message_tamil' | t }}
        </p>

        <button class="btn btn-gold" onclick="closeSuccessModal()">
          {{ 'newsletter.close' | t }}
        </button>
      </div>
    </div>
  </div>
</section>
```

### JavaScript Form Handler (assets/newsletter-signup.js)

```javascript
class NewsletterSignup {
  constructor() {
    this.form = document.getElementById('newsletter-form');
    this.emailInput = document.getElementById('newsletter-email');
    this.submitBtn = this.form?.querySelector('button[type="submit"]');
    this.klaviyoListId = this.form?.dataset.klaviyoListId;

    this.init();
  }

  init() {
    if (!this.form) return;

    this.setupEventListeners();
    this.setupValidation();
  }

  setupEventListeners() {
    // Form submission
    this.form.addEventListener('submit', e => this.handleSubmit(e));

    // Real-time email validation
    this.emailInput.addEventListener('input', () => this.validateEmail());
    this.emailInput.addEventListener('blur', () => this.validateEmail());

    // Consent checkbox
    const consentCheckbox = this.form.querySelector('input[name="contact[accepts_marketing]"]');
    if (consentCheckbox) {
      consentCheckbox.addEventListener('change', () => this.updateSubmitButton());
    }
  }

  setupValidation() {
    this.updateSubmitButton();
  }

  validateEmail() {
    const email = this.emailInput.value.trim();
    const errorDiv = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      this.showEmailError('Please enter a valid email address');
      return false;
    } else {
      this.hideEmailError();
      return true;
    }
  }

  showEmailError(message) {
    const errorDiv = document.getElementById('email-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    this.emailInput.classList.add('border-red-500');
  }

  hideEmailError() {
    const errorDiv = document.getElementById('email-error');
    errorDiv.classList.add('hidden');
    this.emailInput.classList.remove('border-red-500');
  }

  updateSubmitButton() {
    const email = this.emailInput.value.trim();
    const consent = this.form.querySelector('input[name="contact[accepts_marketing]"]').checked;
    const isValid = email && this.validateEmail() && consent;

    this.submitBtn.disabled = !isValid;

    if (isValid) {
      this.submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      this.submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateEmail()) return;

    this.setLoadingState(true);

    try {
      // Submit to Shopify
      const shopifyResponse = await this.submitToShopify();

      // Submit to Klaviyo if configured
      if (this.klaviyoListId) {
        await this.submitToKlaviyo();
      }

      this.showSuccess();
      this.resetForm();

      // Analytics
      this.trackSignup();
    } catch (error) {
      console.error('Newsletter signup error:', error);
      this.showError('Subscription failed. Please try again.');
    } finally {
      this.setLoadingState(false);
    }
  }

  async submitToShopify() {
    const formData = new FormData(this.form);

    const response = await fetch(this.form.action, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Shopify submission failed');
    }

    return response.json();
  }

  async submitToKlaviyo() {
    const email = this.emailInput.value.trim();

    const klaviyoData = {
      profiles: [
        {
          email: email,
          subscriptions: {
            email: {
              marketing: {
                consent: 'SUBSCRIBED',
              },
            },
          },
        },
      ],
    };

    const response = await fetch(
      `https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${window.klaviyoApiKey}`,
          'Content-Type': 'application/json',
          revision: '2024-02-15',
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              list_id: this.klaviyoListId,
              subscriptions: klaviyoData.profiles,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn('Klaviyo submission failed, but Shopify signup succeeded');
    }
  }

  setLoadingState(loading) {
    const btnText = this.submitBtn.querySelector('.btn-text');
    const spinner = this.submitBtn.querySelector('.loading-spinner');

    if (loading) {
      this.submitBtn.disabled = true;
      btnText.textContent = 'Subscribing...';
      spinner.classList.remove('hidden');
    } else {
      this.submitBtn.disabled = false;
      btnText.textContent = this.getTranslation('newsletter.subscribe_button');
      spinner.classList.add('hidden');
      this.updateSubmitButton(); // Restore proper disabled state
    }
  }

  showSuccess() {
    const successModal = document.getElementById('newsletter-success');
    successModal.classList.remove('hidden');

    // Close on background click
    successModal.addEventListener('click', e => {
      if (e.target === successModal) {
        this.closeSuccessModal();
      }
    });
  }

  closeSuccessModal() {
    const successModal = document.getElementById('newsletter-success');
    successModal.classList.add('hidden');
  }

  showError(message) {
    // Simple error display - could be enhanced with modal
    alert(message);
  }

  resetForm() {
    this.form.reset();
    this.hideEmailError();
    this.updateSubmitButton();
  }

  trackSignup() {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'newsletter_signup', {
        event_category: 'engagement',
        event_label: 'homepage_newsletter',
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Subscribe');
    }
  }

  getTranslation(key) {
    return window.translations?.[key] || key;
  }
}

// Global function for modal close
function closeSuccessModal() {
  const successModal = document.getElementById('newsletter-success');
  successModal.classList.add('hidden');
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new NewsletterSignup();
});
```

## Shopify Section Schema

```json
{
  "name": "Newsletter Signup",
  "tag": "section",
  "class": "newsletter-section",
  "settings": [
    {
      "type": "text",
      "id": "heading_english",
      "label": "Heading (English)",
      "default": "Stay Connected to Our Culture"
    },
    {
      "type": "text",
      "id": "heading_tamil",
      "label": "Heading (Tamil)",
      "default": "அடுத்த கலாச்சார வெளியீட்டை முதலில் பெற பதிவு செய்யுங்கள்"
    },
    {
      "type": "textarea",
      "id": "description",
      "label": "Description",
      "default": "Be the first to know about new drops, cultural stories, and exclusive member benefits."
    },
    {
      "type": "text",
      "id": "klaviyo_list_id",
      "label": "Klaviyo List ID",
      "info": "Enter your Klaviyo list ID for email marketing integration"
    },
    {
      "type": "checkbox",
      "id": "show_benefits",
      "label": "Show Benefits List",
      "default": true
    }
  ],
  "presets": [
    {
      "name": "Newsletter Signup"
    }
  ]
}
```

## Localization Support

```json
// locales/en.default.json
{
  "newsletter": {
    "email_placeholder": "Enter your email address",
    "subscribe_button": "Subscribe",
    "consent_text": "I agree to receive marketing emails and accept the",
    "privacy_policy": "Privacy Policy",
    "privacy_notice": "We respect your privacy and will never spam you",
    "benefit_1": "Early access to new drops",
    "benefit_2": "Cultural stories & heritage",
    "benefit_3": "Exclusive member discounts",
    "success_title": "Welcome to Our Community!",
    "success_message": "Thank you for subscribing. Check your email for confirmation.",
    "success_message_tamil": "எங்கள் கலாச்சார சமூகத்திற்கு வரவேற்கிறோம்!",
    "close": "Close"
  }
}

// locales/ta.json
{
  "newsletter": {
    "email_placeholder": "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்",
    "subscribe_button": "பதிவு செய்யுங்கள்",
    "consent_text": "நான் மார்க்கெட்டிங் மின்னஞ்சல்களைப் பெற ஒப்புக்கொள்கிறேன்",
    "privacy_policy": "தனியுரிமை கொள்கை",
    "privacy_notice": "நாங்கள் உங்கள் தனியுரிமையை மதிக்கிறோம்",
    "benefit_1": "புதிய வெளியீடுகளுக்கு முன்னதாக அணுகல்",
    "benefit_2": "கலாச்சார கதைகள் மற்றும் பாரம்பரியம்",
    "benefit_3": "பிரத்யேக உறுப்பினர் தள்ளுபடிகள்",
    "success_title": "எங்கள் சமூகத்திற்கு வரவேற்கிறோம்!",
    "success_message": "பதிவு செய்ததற்கு நன்றி. உறுதிப்படுத்தலுக்கு உங்கள் மின்னஞ்சலைச் சரிபார்க்கவும்.",
    "close": "மூடு"
  }
}
```

## Definition of Done

- [ ] Newsletter form submits to Shopify successfully
- [ ] Klaviyo integration working (if configured)
- [ ] Email validation working in real-time
- [ ] Success/error states display properly
- [ ] GDPR consent handling implemented
- [ ] Tamil translations display correctly
- [ ] Mobile responsive design tested
- [ ] Analytics tracking functional

## Dependencies

- Shopify customer account setup
- Klaviyo account and API configuration
- Privacy policy page created
- Tamil translations reviewed

## Files Created/Modified

- `sections/newsletter-signup.liquid`
- `assets/newsletter-signup.js`
- `assets/newsletter-signup.css` (if needed)
- `locales/en.default.json` (newsletter keys)
- `locales/ta.json` (Tamil translations)

## Klaviyo Integration Setup

1. **API Key Configuration**

   ```javascript
   // In theme.liquid head
   window.klaviyoApiKey = '{{ settings.klaviyo_api_key }}';
   ```

2. **List ID Setup**
   - Create dedicated list in Klaviyo
   - Add list ID to section settings
   - Configure signup flow and welcome series

## GDPR Compliance

- [ ] Explicit consent checkbox required
- [ ] Privacy policy link provided
- [ ] Double opt-in process (handled by Klaviyo)
- [ ] Unsubscribe mechanism available
- [ ] Data retention policy documented

## Testing Checklist

- [ ] Form submits successfully to Shopify
- [ ] Klaviyo receives subscriber data
- [ ] Email validation prevents invalid submissions
- [ ] Success message displays correctly
- [ ] Error handling works for failed submissions
- [ ] Consent checkbox required for submission
- [ ] Mobile form usability tested
- [ ] Tamil text renders properly

## Estimate Breakdown

- Form markup and styling: 1 hour
- JavaScript validation and submission: 1.5 hours
- Klaviyo integration: 30 min
- Testing and refinement: 0 min
- **Total: 3 story points**
