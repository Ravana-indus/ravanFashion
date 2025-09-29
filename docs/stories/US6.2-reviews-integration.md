# US6.2: Reviews App Integration

**Story Points:** 3 **Section:** App Integrations **Priority:** Medium **Status:** Ready

## User Story

As a shopper, I want reviews powered by Loox/Judge.me so I can see authentic feedback.

## Acceptance Criteria

✅ **Primary Acceptance:** PDP renders reviews widget via app block.

### Detailed Acceptance Criteria:

1. **Review Display**
   - [ ] Reviews widget displays on product pages
   - [ ] Star ratings visible on collection pages
   - [ ] Review photos and videos supported
   - [ ] Filter and sort review options available

2. **Review Collection**
   - [ ] Post-purchase review request emails automated
   - [ ] Photo/video review incentives configured
   - [ ] Review moderation system active
   - [ ] Cultural sensitivity guidelines enforced

3. **Integration Features**
   - [ ] App block properly configured in theme
   - [ ] Review syndication to Google/Facebook
   - [ ] Import existing reviews if applicable
   - [ ] Shopify customer data sync

4. **Cultural Considerations**
   - [ ] Support for Tamil customer names
   - [ ] Cultural product appreciation in reviews
   - [ ] Respectful review display and moderation
   - [ ] Multilingual review support where possible

## Technical Implementation

### App Block Integration (sections/product-reviews.liquid)

```liquid
<!-- Product Reviews Section -->
<div class="product-reviews py-12" id="product-reviews">
  <div class="container mx-auto px-4">

    <!-- Reviews Header -->
    <div class="reviews-header text-center mb-8">
      <h2 class="text-2xl md:text-3xl font-bold text-charcoal-black mb-2">
        {{ 'reviews.customer_reviews' | t }}
      </h2>
      <p class="text-lg font-tamil text-deep-maroon mb-4">
        {{ 'reviews.customer_reviews_tamil' | t }}
      </p>
      <p class="text-muted-teal">
        {{ 'reviews.authentic_feedback' | t }}
      </p>
    </div>

    <!-- App Block for Reviews -->
    {% comment %} Loox Reviews Integration {% endcomment %}
    {% if settings.reviews_app == 'loox' %}
      <div class="loox-reviews-wrapper">
        {% render 'loox-product-reviews', product: product %}
      </div>

    {% comment %} Judge.me Reviews Integration {% endcomment %}
    {% elsif settings.reviews_app == 'judgeme' %}
      <div class="judgeme-reviews-wrapper">
        {% render 'judgeme-product-reviews', product: product %}
      </div>

    {% comment %} Shopify Native Reviews {% endcomment %}
    {% else %}
      <div class="native-reviews-wrapper">
        {% render 'native-product-reviews', product: product %}
      </div>
    {% endif %}

    <!-- Review Submission Encouragement -->
    <div class="review-encouragement bg-gold/10 rounded-lg p-6 mt-8 text-center">
      <h3 class="text-lg font-bold text-charcoal-black mb-2">
        {{ 'reviews.share_experience' | t }}
      </h3>
      <p class="text-muted-teal mb-4">
        {{ 'reviews.help_community' | t }}
      </p>
      <button class="btn btn-gold write-review-btn"
              onclick="openReviewForm()">
        {{ 'reviews.write_review' | t }}
      </button>
    </div>

  </div>
</div>
```

### Loox Integration (snippets/loox-product-reviews.liquid)

```liquid
<!-- Loox Product Reviews Integration -->
<div class="loox-reviews" data-product-id="{{ product.id }}">

  <!-- Reviews Summary -->
  <div class="loox-rating-summary mb-6">
    <div id="loox-product-reviews-rating"
         data-product-id="{{ product.id }}"
         data-show-if-no-reviews="true">
    </div>
  </div>

  <!-- Reviews List -->
  <div class="loox-reviews-list">
    <div id="loox-product-reviews"
         data-product-id="{{ product.id }}"
         data-per-page="10"
         data-max-width="100%"
         data-hide-write-review-button="false">
    </div>
  </div>

  <!-- Write Review Button -->
  <div class="loox-write-review-wrapper mt-6 text-center">
    <div id="loox-write-review-button"
         data-product-id="{{ product.id }}">
    </div>
  </div>

</div>

<!-- Loox Script Integration -->
<script>
  // Loox configuration
  window.looxSettings = {
    productId: {{ product.id }},
    shopDomain: '{{ shop.permanent_domain }}',
    customCSS: `
      .loox-rating {
        color: #D4AF37;
      }
      .loox-review-text {
        font-family: inherit;
        line-height: 1.6;
      }
      .loox-reviewer-name {
        color: #6A1B1B;
        font-weight: 600;
      }
    `,
    translations: {
      writeReview: '{{ "reviews.write_review" | t }}',
      helpful: '{{ "reviews.helpful" | t }}',
      verified: '{{ "reviews.verified_purchase" | t }}'
    }
  };

  // Load Loox script
  (function() {
    if (window.looxLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://loox.io/widget/{{ settings.loox_shop_id }}/script.js';
    script.async = true;
    document.head.appendChild(script);

    window.looxLoaded = true;
  })();
</script>
```

### Judge.me Integration (snippets/judgeme-product-reviews.liquid)

```liquid
<!-- Judge.me Product Reviews Integration -->
<div class="judgeme-reviews" data-product-id="{{ product.id }}">

  <!-- Reviews Summary -->
  <div class="jdgm-rev-widg"
       data-id="{{ product.id }}"
       data-auto-install="false">
    {{ product.metafields.judgeme.badge }}
  </div>

  <!-- Reviews List -->
  <div class="jdgm-review-widget"
       data-product-title="{{ product.title }}"
       data-product-id="{{ product.id }}"
       data-auto-install="false">
    {{ product.metafields.judgeme.widget }}
  </div>

</div>

<!-- Judge.me Script Integration -->
<script>
  // Judge.me configuration
  window.jdgmSettings = {
    shopDomain: '{{ shop.permanent_domain }}',
    platform: 'shopify',
    customizations: {
      primaryColor: '#6A1B1B',
      accentColor: '#D4AF37',
      backgroundColor: '#FDF6EC',
      fontFamily: 'Inter, sans-serif'
    },
    filters: {
      showVerifiedOnly: false,
      showPhotoReviews: true,
      sortBy: 'newest'
    }
  };

  // Load Judge.me script
  (function() {
    if (window.jdgmLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.judge.me/{{ settings.judgeme_shop_domain }}/widget.js';
    script.async = true;
    document.head.appendChild(script);

    window.jdgmLoaded = true;
  })();
</script>
```

### Collection Page Rating Display (snippets/product-card-rating.liquid)

```liquid
<!-- Product Card Rating Display -->
<div class="product-rating mt-2">

  {% if settings.reviews_app == 'loox' %}
    <!-- Loox Rating Display -->
    <div class="loox-rating-display"
         data-product-id="{{ product.id }}"
         data-show-rating-only="true">
      <div id="loox-product-reviews-rating-{{ product.id }}"
           data-product-id="{{ product.id }}"
           data-rating-only="true">
      </div>
    </div>

  {% elsif settings.reviews_app == 'judgeme' %}
    <!-- Judge.me Rating Display -->
    <div class="jdgm-preview-badge"
         data-id="{{ product.id }}"
         data-template="collection"
         data-auto-install="false">
      {{ product.metafields.judgeme.badge }}
    </div>

  {% else %}
    <!-- Native Rating Fallback -->
    {% assign review_count = product.metafields.reviews.count | default: 0 %}
    {% assign average_rating = product.metafields.reviews.average | default: 0 %}

    {% if review_count > 0 %}
      <div class="native-rating flex items-center text-sm">
        <div class="stars flex mr-2">
          {% for i in (1..5) %}
            <svg class="w-4 h-4 {% if i <= average_rating %}text-gold{% else %}text-gray-300{% endif %}"
                 fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          {% endfor %}
        </div>
        <span class="text-muted-teal">({{ review_count }})</span>
      </div>
    {% endif %}
  {% endif %}

</div>
```

### Review Email Automation (email-templates/review-request.liquid)

```liquid
<!-- Review Request Email Template -->
<div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', sans-serif;">

  <!-- Header -->
  <div style="background: linear-gradient(135deg, #6A1B1B, #D4AF37); padding: 40px 20px; text-align: center;">
    <img src="{{ 'logo-white.png' | asset_url }}" alt="{{ shop.name }}" style="height: 40px; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 24px;">How was your experience?</h1>
    <p style="color: #FDF6EC; margin: 10px 0 0 0;">வாங்கிய பொருள் எப்படி இருந்தது?</p>
  </div>

  <!-- Content -->
  <div style="padding: 40px 20px; background-color: white;">

    <p style="color: #3A6A6A; line-height: 1.6; margin: 0 0 20px 0;">
      Hi {{ customer.first_name }},
    </p>

    <p style="color: #3A6A6A; line-height: 1.6; margin: 0 0 20px 0;">
      Thank you for your recent purchase! We hope you're loving your new Tamil heritage pieces.
      Your feedback helps our community discover authentic cultural designs.
    </p>

    <!-- Product Review Cards -->
    {% for line_item in order.line_items %}
      <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          {% if line_item.image %}
            <img src="{{ line_item.image | img_url: '80x80' }}"
                 alt="{{ line_item.title }}"
                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px;">
          {% endif %}
          <div>
            <h3 style="margin: 0; color: #1C1C1C; font-size: 16px;">{{ line_item.title }}</h3>
            <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">{{ line_item.variant_title }}</p>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="{{ settings.reviews_app_review_url }}?product_id={{ line_item.product_id }}&order_id={{ order.id }}"
             style="background-color: #D4AF37; color: #1C1C1C; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
            Rate & Review This Item
          </a>
        </div>
      </div>
    {% endfor %}

    <!-- Incentive -->
    <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
      <h3 style="color: #6A1B1B; margin: 0 0 10px 0;">📸 Photo Review Bonus!</h3>
      <p style="color: #3A6A6A; margin: 0; font-size: 14px;">
        Upload a photo with your review and get 10% off your next order
      </p>
    </div>

    <p style="color: #3A6A6A; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">
      Your honest feedback helps other members of our Tamil community make confident purchases.
      Thank you for being part of our heritage fashion family!
    </p>

  </div>

  <!-- Footer -->
  <div style="background-color: #F9FAFB; padding: 20px; text-align: center;">
    <p style="color: #6B7280; font-size: 12px; margin: 0;">
      Need help? <a href="mailto:{{ shop.email }}" style="color: #6A1B1B;">Contact our support team</a>
    </p>
  </div>

</div>
```

### Theme Settings (config/settings_schema.json)

```json
{
  "name": "Reviews Integration",
  "settings": [
    {
      "type": "select",
      "id": "reviews_app",
      "label": "Reviews App",
      "options": [
        {
          "value": "loox",
          "label": "Loox"
        },
        {
          "value": "judgeme",
          "label": "Judge.me"
        },
        {
          "value": "native",
          "label": "Native Reviews"
        }
      ],
      "default": "loox"
    },
    {
      "type": "text",
      "id": "loox_shop_id",
      "label": "Loox Shop ID",
      "info": "Your Loox shop identifier"
    },
    {
      "type": "text",
      "id": "judgeme_shop_domain",
      "label": "Judge.me Shop Domain",
      "info": "Your shop domain for Judge.me integration"
    },
    {
      "type": "url",
      "id": "reviews_app_review_url",
      "label": "Review Submission URL",
      "info": "URL for customers to submit reviews"
    },
    {
      "type": "checkbox",
      "id": "show_reviews_on_collection",
      "label": "Show ratings on collection pages",
      "default": true
    },
    {
      "type": "number",
      "id": "reviews_per_page",
      "label": "Reviews per page",
      "default": 10
    }
  ]
}
```

## Localization Support

```json
// locales/en.default.json
{
  "reviews": {
    "customer_reviews": "Customer Reviews",
    "customer_reviews_tamil": "வாடிக்கையாளர் மதிப்புரைகள்",
    "authentic_feedback": "Authentic feedback from our community",
    "share_experience": "Share Your Experience",
    "help_community": "Help our Tamil heritage community by sharing your thoughts",
    "write_review": "Write a Review",
    "helpful": "Helpful",
    "verified_purchase": "Verified Purchase",
    "photo_review_bonus": "Photo Review Bonus",
    "sort_by": "Sort by",
    "filter_by": "Filter by",
    "all_reviews": "All Reviews",
    "photo_reviews": "Photo Reviews",
    "verified_only": "Verified Only"
  }
}

// locales/ta.json
{
  "reviews": {
    "customer_reviews": "வாடிக்கையாளர் மதிப்புரைகள்",
    "write_review": "மதிப்புரை எழுதுங்கள்",
    "helpful": "உதவிகரமானது",
    "verified_purchase": "சரிபார்க்கப்பட்ட வாங்குதல்"
  }
}
```

## App Configuration Guides

### Loox Setup Checklist

- [ ] Install Loox app from Shopify App Store
- [ ] Configure photo review incentives
- [ ] Set up automated review request emails
- [ ] Enable Google/Facebook review syndication
- [ ] Configure review moderation settings
- [ ] Add Loox app blocks to product template

### Judge.me Setup Checklist

- [ ] Install Judge.me app from Shopify App Store
- [ ] Configure review request timing
- [ ] Set up review widgets for product/collection pages
- [ ] Enable photo/video reviews
- [ ] Configure review import from other platforms
- [ ] Set up automated email sequences

## Definition of Done

- [ ] Reviews app properly installed and configured
- [ ] Review widgets display on product pages
- [ ] Star ratings show on collection pages
- [ ] Automated review request emails working
- [ ] Photo review incentives configured
- [ ] Review moderation system active
- [ ] Cultural guidelines enforced
- [ ] Performance impact minimal

## Dependencies

- Reviews app selection and installation
- Email template design and approval
- Cultural moderation guidelines
- Customer email automation setup

## Files Created/Modified

- `sections/product-reviews.liquid`
- `snippets/loox-product-reviews.liquid`
- `snippets/judgeme-product-reviews.liquid`
- `snippets/product-card-rating.liquid`
- `email-templates/review-request.liquid`
- `config/settings_schema.json` (reviews settings)

## Testing Checklist

- [ ] Reviews display correctly on product pages
- [ ] Star ratings show on collection pages
- [ ] Review submission process working
- [ ] Email automation triggering properly
- [ ] Photo upload functionality tested
- [ ] Moderation workflow functional
- [ ] Mobile responsive design verified

## Estimate Breakdown

- App integration setup: 1 hour
- Widget configuration and styling: 1 hour
- Email automation setup: 45 min
- Testing and validation: 15 min
- **Total: 3 story points**
