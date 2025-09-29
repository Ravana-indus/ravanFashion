# US2.1: Header/Footer Branding

**Story Points:** 5 **Section:** Global Layout & Branding **Priority:** High **Status:** Ready

## User Story

As a shopper, I want to see a branded header/footer with Tamil script so I recognize cultural
identity.

## Acceptance Criteria

✅ **Primary Acceptance:** Sticky header renders with logo, nav links, Tamil font; footer includes
policy links.

### Detailed Acceptance Criteria:

1. **Header Components**
   - [ ] Branded logo with Tamil script elements
   - [ ] Main navigation menu with cultural sections
   - [ ] Language toggle (EN ↔ தமிழ்) integration
   - [ ] Shopping cart icon with item count
   - [ ] Search functionality
   - [ ] Mobile hamburger menu

2. **Header Behavior**
   - [ ] Sticky positioning on scroll
   - [ ] Responsive design across all devices
   - [ ] Tamil fonts load correctly
   - [ ] Smooth hover states and transitions
   - [ ] Proper z-index layering

3. **Footer Structure**
   - [ ] Company information with Tamil business name
   - [ ] Quick links (About, Contact, Size Guide)
   - [ ] Legal links (Privacy Policy, Terms of Service)
   - [ ] Social media icons
   - [ ] Newsletter signup integration
   - [ ] Cultural elements (subtle Kolam patterns)

4. **Cultural Branding Elements**
   - [ ] Tamil script in logo/branding
   - [ ] Consistent use of brand color palette
   - [ ] Cultural motifs integrated tastefully
   - [ ] Professional yet authentic presentation

## Design Specifications

### Header Layout

```
[Logo + Tamil Text] [Nav: Home|Collections|About] [Search] [Lang] [Cart]
```

### Navigation Structure

- **Home** (முகப்பு)
- **Collections** (தொகுப்புகள்)
  - Men's (ஆண்கள்)
  - Women's (பெண்கள்)
  - Accessories (துணைக் கருவிகள்)
- **About** (எங்களைப் பற்றி)
- **Contact** (தொடர்பு)

### Color Scheme

- Background: Cream White (#FDF6EC)
- Text: Charcoal Black (#1C1C1C)
- Accent: Deep Maroon (#6A1B1B)
- CTA: Gold (#D4AF37)

## Technical Implementation

### Header Structure (layout/header.liquid)

```liquid
<header class="sticky top-0 z-50 bg-cream-white border-b border-deep-maroon/20">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Logo with Tamil script -->
      <div class="flex items-center space-x-2">
        <img src="{{ 'logo.svg' | asset_url }}" alt="{{ shop.name }}" class="h-8">
        <span class="font-tamil text-xl text-deep-maroon">{{ settings.tamil_brand_name }}</span>
      </div>

      <!-- Navigation -->
      <nav class="hidden md:flex space-x-8">
        {% for link in linklists.main-menu.links %}
          <a href="{{ link.url }}" class="text-charcoal-black hover:text-deep-maroon transition-colors">
            {{ link.title }}
          </a>
        {% endfor %}
      </nav>

      <!-- Actions -->
      <div class="flex items-center space-x-4">
        {% render 'language-toggle' %}
        {% render 'search-toggle' %}
        {% render 'cart-icon' %}
        {% render 'mobile-menu-toggle' %}
      </div>
    </div>
  </div>
</header>
```

### Footer Structure (layout/footer.liquid)

```liquid
<footer class="bg-charcoal-black text-cream-white pt-12 pb-6">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <!-- Brand Column -->
      <div class="space-y-4">
        <div class="flex items-center space-x-2">
          <span class="font-tamil text-xl text-gold">{{ settings.tamil_brand_name }}</span>
        </div>
        <p class="text-sm text-gray-300">{{ settings.brand_description }}</p>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="font-semibold mb-4">Quick Links</h3>
        <ul class="space-y-2 text-sm">
          {% for link in linklists.footer-quick.links %}
            <li><a href="{{ link.url }}" class="hover:text-gold transition-colors">{{ link.title }}</a></li>
          {% endfor %}
        </ul>
      </div>

      <!-- Legal -->
      <div>
        <h3 class="font-semibold mb-4">Legal</h3>
        <ul class="space-y-2 text-sm">
          {% for link in linklists.footer-legal.links %}
            <li><a href="{{ link.url }}" class="hover:text-gold transition-colors">{{ link.title }}</a></li>
          {% endfor %}
        </ul>
      </div>

      <!-- Newsletter -->
      <div>
        <h3 class="font-semibold mb-4">Stay Connected</h3>
        {% render 'newsletter-signup' %}
        {% render 'social-icons' %}
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
      <p>&copy; {{ 'now' | date: '%Y' }} {{ shop.name }}. All rights reserved.</p>
    </div>
  </div>
</footer>
```

## Theme Settings Configuration

```json
{
  "name": "Header & Footer",
  "settings": [
    {
      "type": "text",
      "id": "tamil_brand_name",
      "label": "Tamil Brand Name",
      "default": "ரவன் ஃபேஷன்"
    },
    {
      "type": "text",
      "id": "brand_description",
      "label": "Brand Description",
      "default": "Authentic Tamil heritage streetwear for the global diaspora"
    },
    {
      "type": "image_picker",
      "id": "logo",
      "label": "Logo Image"
    }
  ]
}
```

## Mobile Responsive Design

- **Breakpoints**: Mobile-first approach
- **Navigation**: Hamburger menu with slide-out drawer
- **Typography**: Scalable Tamil fonts
- **Touch Targets**: Minimum 44px for accessibility

## Definition of Done

- [ ] Header renders correctly with sticky behavior
- [ ] All navigation links functional
- [ ] Tamil fonts display properly across browsers
- [ ] Footer contains all required sections
- [ ] Mobile responsive design tested
- [ ] Cross-browser compatibility verified
- [ ] Performance impact minimal (< 2s load time)
- [ ] Accessibility standards met (WCAG AA)

## Dependencies

- US1.2: Tailwind CSS configuration (for styling)
- US2.2: Language toggle component
- Logo design and Tamil branding assets
- Navigation menu structure defined

## Files Created/Modified

- `layout/header.liquid`
- `layout/footer.liquid`
- `snippets/language-toggle.liquid`
- `snippets/cart-icon.liquid`
- `snippets/mobile-menu.liquid`
- `snippets/newsletter-signup.liquid`
- `snippets/social-icons.liquid`
- `config/settings_schema.json` (header/footer settings)
- `assets/header-footer.css` (if needed)

## Accessibility Requirements

- [ ] Proper heading hierarchy (h1-h6)
- [ ] ARIA labels for navigation landmarks
- [ ] Focus management for mobile menu
- [ ] Screen reader friendly link text
- [ ] Keyboard navigation support
- [ ] High contrast mode compatibility

## Performance Considerations

- [ ] Optimize logo and icon file sizes
- [ ] Lazy load footer elements below fold
- [ ] Minimize CSS/JS impact on header
- [ ] Efficient font loading strategy
- [ ] Critical CSS inlined for header

## Testing Checklist

- [ ] Header sticky behavior on scroll
- [ ] Mobile menu functionality
- [ ] Language toggle integration
- [ ] Cart icon updates with items
- [ ] Footer links all functional
- [ ] Tamil text renders correctly
- [ ] Cross-device testing completed

## Estimate Breakdown

- Header layout and styling: 2 hours
- Footer structure and content: 1.5 hours
- Mobile responsive implementation: 1 hour
- Testing and refinement: 30 min
- **Total: 5 story points**
