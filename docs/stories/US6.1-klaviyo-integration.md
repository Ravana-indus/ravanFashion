# US6.1: Klaviyo Email Integration

**Story Points:** 3 **Section:** App Integrations **Priority:** Medium **Status:** Ready

## User Story

As a marketer, I want Klaviyo email integration so I can build campaigns.

## Acceptance Criteria

✅ **Primary Acceptance:** Newsletter signups sync to Klaviyo list.

### Detailed Acceptance Criteria:

1. **API Integration**
   - [ ] Klaviyo API properly configured and authenticated
   - [ ] Newsletter signups sync to designated Klaviyo list
   - [ ] Customer data mapping between Shopify and Klaviyo
   - [ ] Error handling for failed API calls

2. **Customer Journey Automation**
   - [ ] Welcome email series for new subscribers
   - [ ] Abandoned cart recovery emails
   - [ ] Browse abandonment tracking
   - [ ] Post-purchase follow-up sequences

3. **Segmentation & Personalization**
   - [ ] Customer segments based on purchase behavior
   - [ ] Cultural preference tagging (Tamil vs English)
   - [ ] Product category interest tracking
   - [ ] Lifecycle stage segmentation

4. **Campaign Analytics**
   - [ ] Email open and click tracking
   - [ ] Revenue attribution from emails
   - [ ] Campaign performance reporting
   - [ ] A/B testing capabilities

## Technical Implementation

### Klaviyo Configuration (config/klaviyo-config.js)

```javascript
// Klaviyo Configuration
const KLAVIYO_CONFIG = {
  publicKey: '{{ settings.klaviyo_public_key }}',
  privateKey: '{{ settings.klaviyo_private_key }}', // Server-side only
  apiVersion: '2024-02-15',
  baseUrl: 'https://a.klaviyo.com/api',

  // List IDs
  lists: {
    newsletter: '{{ settings.klaviyo_newsletter_list }}',
    customers: '{{ settings.klaviyo_customer_list }}',
    vip: '{{ settings.klaviyo_vip_list }}',
  },

  // Event tracking
  events: {
    signUp: 'Newsletter Signup',
    purchase: 'Placed Order',
    viewedProduct: 'Viewed Product',
    addedToCart: 'Added to Cart',
    startedCheckout: 'Started Checkout',
  },
};
```

### Klaviyo Service Integration (assets/klaviyo-service.js)

```javascript
class KlaviyoService {
  constructor() {
    this.publicKey = window.klaviyoPublicKey;
    this.apiVersion = '2024-02-15';
    this.baseUrl = 'https://a.klaviyo.com/api';

    this.init();
  }

  init() {
    if (!this.publicKey) {
      console.warn('Klaviyo public key not configured');
      return;
    }

    this.setupEventTracking();
    this.loadKlaviyoScript();
  }

  async loadKlaviyoScript() {
    if (window._learnq) return; // Already loaded

    const script = document.createElement('script');
    script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this.publicKey}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize tracking queue
    window._learnq = window._learnq || [];
    window._learnq.push(['account', this.publicKey]);
  }

  // Newsletter Subscription
  async subscribeToNewsletter(email, properties = {}) {
    try {
      const profileData = {
        type: 'profile',
        attributes: {
          email: email,
          subscriptions: {
            email: {
              marketing: {
                consent: 'SUBSCRIBED',
              },
            },
          },
          ...properties,
        },
      };

      const response = await fetch(`${this.baseUrl}/profiles/`, {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${this.publicKey}`,
          'Content-Type': 'application/json',
          revision: this.apiVersion,
        },
        body: JSON.stringify({ data: profileData }),
      });

      if (!response.ok) {
        throw new Error(`Klaviyo API error: ${response.status}`);
      }

      const result = await response.json();

      // Add to newsletter list
      await this.addToList(email, window.klaviyoNewsletterList);

      // Track signup event
      this.trackEvent('Newsletter Signup', { email: email });

      return result;
    } catch (error) {
      console.error('Klaviyo subscription failed:', error);
      throw error;
    }
  }

  // Add profile to specific list
  async addToList(email, listId) {
    if (!listId) return;

    try {
      const response = await fetch(`${this.baseUrl}/list-memberships/`, {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${this.publicKey}`,
          'Content-Type': 'application/json',
          revision: this.apiVersion,
        },
        body: JSON.stringify({
          data: {
            type: 'list-membership',
            attributes: {
              list_id: listId,
              profiles: [
                {
                  email: email,
                },
              ],
            },
          },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to add to Klaviyo list:', error);
      return false;
    }
  }

  // Event Tracking
  trackEvent(eventName, properties = {}) {
    if (!window._learnq) return;

    const eventData = {
      event: eventName,
      properties: {
        ...properties,
        $source: 'shopify',
        timestamp: new Date().toISOString(),
      },
    };

    window._learnq.push(['track', eventName, eventData.properties]);
  }

  // Customer Identification
  identifyCustomer(customerData) {
    if (!window._learnq) return;

    const profileData = {
      $email: customerData.email,
      $first_name: customerData.firstName,
      $last_name: customerData.lastName,
      $phone_number: customerData.phone,
      $organization: customerData.company,

      // Custom properties
      customer_id: customerData.id,
      total_spent: customerData.totalSpent,
      order_count: customerData.orderCount,
      language_preference: customerData.languagePreference || 'en',
      cultural_interests: customerData.culturalInterests || [],

      // Tamil-specific properties
      prefers_tamil_content: customerData.prefersTamilContent || false,
      cultural_affinity: customerData.culturalAffinity || 'diaspora',
    };

    window._learnq.push(['identify', profileData]);
  }

  // E-commerce Event Tracking
  setupEventTracking() {
    // Track page views
    this.trackEvent('Viewed Page', {
      page_title: document.title,
      page_url: window.location.href,
      page_type: document.body.className,
    });

    // Track product views
    if (window.productData) {
      this.trackEvent('Viewed Product', {
        product_id: window.productData.id,
        product_name: window.productData.title,
        product_price: window.productData.price / 100,
        product_url: window.location.href,
        product_type: window.productData.type,
        product_vendor: window.productData.vendor,
        cultural_design: window.productData.metafields?.cultural_category,
      });
    }
  }

  // Abandoned Cart Recovery
  trackCartAbandonment() {
    if (!window.cartData) return;

    const cartItems = window.cartData.items.map(item => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product_title,
      quantity: item.quantity,
      price: item.price / 100,
      line_price: item.line_price / 100,
    }));

    this.trackEvent('Started Checkout', {
      cart_id: window.cartData.token,
      checkout_url: `${window.location.origin}/cart`,
      items: cartItems,
      total_price: window.cartData.total_price / 100,
      item_count: window.cartData.item_count,
    });

    // Set up abandonment timer
    this.setupAbandonmentTimer();
  }

  setupAbandonmentTimer() {
    // Clear existing timer
    if (this.abandonmentTimer) {
      clearTimeout(this.abandonmentTimer);
    }

    // Set 30-minute abandonment timer
    this.abandonmentTimer = setTimeout(
      () => {
        this.trackEvent('Abandoned Cart', {
          cart_id: window.cartData?.token,
          abandonment_time: new Date().toISOString(),
          items: window.cartData?.items?.map(item => ({
            product_name: item.product_title,
            quantity: item.quantity,
            price: item.price / 100,
          })),
        });
      },
      30 * 60 * 1000
    ); // 30 minutes
  }

  // Post-Purchase Tracking
  trackPurchase(orderData) {
    const items = orderData.line_items.map(item => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.title,
      quantity: item.quantity,
      price: parseFloat(item.price),
      line_price: parseFloat(item.price) * item.quantity,
    }));

    this.trackEvent('Placed Order', {
      order_id: orderData.order_number,
      order_name: orderData.name,
      total_price: parseFloat(orderData.total_price),
      subtotal_price: parseFloat(orderData.subtotal_price),
      total_tax: parseFloat(orderData.total_tax),
      currency: orderData.currency,
      items: items,
      customer_email: orderData.email,
      order_date: orderData.created_at,
    });

    // Update customer profile
    this.identifyCustomer({
      email: orderData.email,
      firstName: orderData.billing_address?.first_name,
      lastName: orderData.billing_address?.last_name,
      phone: orderData.billing_address?.phone,
      totalSpent: parseFloat(orderData.total_price),
      orderCount: 1, // Would need to calculate from customer history
    });
  }

  // Cultural Segmentation
  updateCulturalPreferences(preferences) {
    if (!window._learnq) return;

    window._learnq.push([
      'identify',
      {
        language_preference: preferences.language,
        cultural_interests: preferences.interests,
        prefers_tamil_content: preferences.prefersTamil,
        festival_notifications: preferences.festivalNotifications,
        heritage_product_interest: preferences.heritageProducts,
      },
    ]);
  }
}

// Initialize Klaviyo service
document.addEventListener('DOMContentLoaded', () => {
  window.klaviyoService = new KlaviyoService();
});

// Global functions for easy access
window.trackKlaviyoEvent = (eventName, properties) => {
  window.klaviyoService?.trackEvent(eventName, properties);
};

window.identifyKlaviyoCustomer = customerData => {
  window.klaviyoService?.identifyCustomer(customerData);
};
```

### Enhanced Newsletter Form with Klaviyo (sections/newsletter-klaviyo.liquid)

```liquid
<!-- Enhanced Newsletter Form -->
<form class="newsletter-form klaviyo-newsletter"
      action="/contact"
      method="post"
      id="klaviyo-newsletter-form"
      data-klaviyo-list="{{ section.settings.klaviyo_list_id }}">

  <input type="hidden" name="form_type" value="customer">
  <input type="hidden" name="utf8" value="✓">
  <input type="hidden" name="contact[tags]" value="newsletter,klaviyo">

  <div class="form-group">
    <label for="newsletter-email" class="sr-only">Email Address</label>
    <input type="email"
           id="newsletter-email"
           name="contact[email]"
           placeholder="{{ 'newsletter.email_placeholder' | t }}"
           required>
  </div>

  <!-- Cultural Preferences -->
  <div class="cultural-preferences">
    <fieldset>
      <legend class="sr-only">{{ 'newsletter.preferences' | t }}</legend>

      <label class="preference-option">
        <input type="checkbox"
               name="contact[accepts_marketing]"
               value="1"
               required>
        <span>{{ 'newsletter.marketing_consent' | t }}</span>
      </label>

      <label class="preference-option">
        <input type="checkbox"
               name="preferences[tamil_content]"
               value="true">
        <span>{{ 'newsletter.tamil_content_preference' | t }}</span>
      </label>

      <label class="preference-option">
        <input type="checkbox"
               name="preferences[festival_notifications]"
               value="true">
        <span>{{ 'newsletter.festival_notifications' | t }}</span>
      </label>
    </fieldset>
  </div>

  <button type="submit" class="btn btn-gold">
    {{ 'newsletter.subscribe' | t }}
  </button>
</form>

<script>
document.getElementById('klaviyo-newsletter-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const email = formData.get('contact[email]');
  const preferences = {
    prefersTamil: formData.get('preferences[tamil_content]') === 'true',
    festivalNotifications: formData.get('preferences[festival_notifications]') === 'true'
  };

  try {
    // Subscribe to Klaviyo
    await window.klaviyoService.subscribeToNewsletter(email, {
      source: 'website_newsletter',
      language_preference: preferences.prefersTamil ? 'ta' : 'en',
      festival_notifications: preferences.festivalNotifications,
      signup_date: new Date().toISOString()
    });

    // Also submit to Shopify for backup
    await fetch(this.action, {
      method: 'POST',
      body: formData
    });

    // Show success message
    showNewsletterSuccess();

  } catch (error) {
    console.error('Newsletter signup failed:', error);
    showNewsletterError();
  }
});
</script>
```

### Theme Settings Integration (config/settings_schema.json)

```json
{
  "name": "Klaviyo Integration",
  "settings": [
    {
      "type": "text",
      "id": "klaviyo_public_key",
      "label": "Klaviyo Public Key",
      "info": "Your Klaviyo public API key"
    },
    {
      "type": "text",
      "id": "klaviyo_private_key",
      "label": "Klaviyo Private Key",
      "info": "Your Klaviyo private API key (server-side only)"
    },
    {
      "type": "text",
      "id": "klaviyo_newsletter_list",
      "label": "Newsletter List ID",
      "info": "Klaviyo list ID for newsletter subscribers"
    },
    {
      "type": "text",
      "id": "klaviyo_customer_list",
      "label": "Customer List ID",
      "info": "Klaviyo list ID for all customers"
    },
    {
      "type": "text",
      "id": "klaviyo_vip_list",
      "label": "VIP List ID",
      "info": "Klaviyo list ID for VIP customers"
    }
  ]
}
```

### Email Templates (klaviyo-templates/welcome-series.html)

```html
<!-- Klaviyo Welcome Email Template -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome to Our Tamil Heritage Community</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDF6EC;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <!-- Header -->
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="background-color: white; border-radius: 12px; overflow: hidden;"
          >
            <tr>
              <td
                align="center"
                style="padding: 40px 20px; background: linear-gradient(135deg, #6A1B1B, #D4AF37);"
              >
                <img
                  src="https://your-domain.com/logo-white.png"
                  alt="Ravan Fashion"
                  style="height: 40px;"
                />
                <h1 style="color: white; margin: 20px 0 0 0; font-size: 28px;">
                  வணக்கம்! Welcome!
                </h1>
                <p style="color: #FDF6EC; margin: 10px 0 0 0; font-size: 16px;">
                  You're now part of our Tamil heritage community
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #1C1C1C; margin: 0 0 20px 0; font-size: 24px;">
                  Thank you for joining us!
                </h2>

                <p style="color: #3A6A6A; line-height: 1.6; margin: 0 0 20px 0;">
                  We're excited to share authentic Tamil heritage designs and cultural stories with
                  you. As a member of our community, you'll be the first to know about:
                </p>

                <ul
                  style="color: #3A6A6A; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;"
                >
                  <li>New cultural collections inspired by Tamil traditions</li>
                  <li>Stories behind each design and their cultural significance</li>
                  <li>Exclusive member discounts and early access</li>
                  <li>Festival celebrations and special collections</li>
                </ul>

                <div style="text-align: center; margin: 30px 0;">
                  <a
                    href="https://your-domain.com/collections/featured"
                    style="background-color: #D4AF37; color: #1C1C1C; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; display: inline-block;"
                  >
                    Explore Our Heritage Collection
                  </a>
                </div>

                <div
                  style="background-color: #F8F9FA; padding: 20px; border-radius: 8px; margin: 30px 0;"
                >
                  <h3 style="color: #6A1B1B; margin: 0 0 15px 0; font-size: 18px;">
                    தமிழ் பாரம்பரியம் (Tamil Heritage)
                  </h3>
                  <p style="color: #3A6A6A; line-height: 1.6; margin: 0; font-size: 14px;">
                    Each piece in our collection tells a story of Tamil culture, from ancient Kolam
                    patterns to modern interpretations of traditional motifs. We honor our heritage
                    while creating contemporary designs for the global Tamil diaspora.
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 30px; background-color: #F8F9FA; text-align: center;">
                <p style="color: #6B7280; font-size: 14px; margin: 0 0 15px 0;">
                  Follow us for daily inspiration and cultural stories
                </p>

                <div style="margin: 0 0 20px 0;">
                  <a href="#" style="margin: 0 10px;"
                    ><img
                      src="https://your-domain.com/instagram-icon.png"
                      alt="Instagram"
                      style="width: 24px; height: 24px;"
                  /></a>
                  <a href="#" style="margin: 0 10px;"
                    ><img
                      src="https://your-domain.com/facebook-icon.png"
                      alt="Facebook"
                      style="width: 24px; height: 24px;"
                  /></a>
                  <a href="#" style="margin: 0 10px;"
                    ><img
                      src="https://your-domain.com/tiktok-icon.png"
                      alt="TikTok"
                      style="width: 24px; height: 24px;"
                  /></a>
                </div>

                <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                  You're receiving this because you subscribed to our newsletter.<br />
                  <a href="{% unsubscribe_url %}" style="color: #6B7280;">Unsubscribe</a> |
                  <a href="{% manage_preferences_url %}" style="color: #6B7280;"
                    >Manage Preferences</a
                  >
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

## Definition of Done

- [ ] Klaviyo API integration working correctly
- [ ] Newsletter signups sync to Klaviyo lists
- [ ] Customer identification and tracking functional
- [ ] E-commerce events properly tracked
- [ ] Welcome email series configured
- [ ] Cultural segmentation implemented
- [ ] Error handling for API failures
- [ ] Analytics and reporting accessible

## Dependencies

- Klaviyo account setup
- API keys configuration
- Email templates design and approval
- Cultural content review for emails

## Files Created/Modified

- `config/klaviyo-config.js`
- `assets/klaviyo-service.js`
- `sections/newsletter-klaviyo.liquid`
- `config/settings_schema.json` (Klaviyo settings)
- `klaviyo-templates/welcome-series.html`

## Testing Checklist

- [ ] Newsletter signup creates Klaviyo profile
- [ ] Customer events tracked correctly
- [ ] Email automation flows working
- [ ] Cultural preferences properly saved
- [ ] Error handling graceful
- [ ] Analytics data flowing to Klaviyo
- [ ] Unsubscribe functionality working

## Estimate Breakdown

- API integration setup: 1 hour
- Event tracking implementation: 1 hour
- Email templates and automation: 45 min
- Testing and validation: 15 min
- **Total: 3 story points**
