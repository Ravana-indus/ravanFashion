# US2.2: Language Toggle (EN ↔ தமிழ்)

**Story Points:** 3 **Section:** Global Layout & Branding **Priority:** High **Status:** Ready

## User Story

As a bilingual user, I want language toggles (EN ↔ தமிழ்) so I can shop in my preferred language.

## Acceptance Criteria

✅ **Primary Acceptance:** Switching locale updates visible UI text; Tamil/English JSON locales
loaded correctly.

### Detailed Acceptance Criteria:

1. **Language Toggle UI**
   - [ ] Toggle button/dropdown visible in header
   - [ ] Current language clearly indicated
   - [ ] Smooth transition when switching languages
   - [ ] Toggle accessible via keyboard navigation

2. **Locale Functionality**
   - [ ] English (EN) and Tamil (தமிழ்) locales configured
   - [ ] URL structure updates with language parameter
   - [ ] Language preference persists across sessions
   - [ ] All UI text updates when language switched

3. **Content Translation**
   - [ ] Navigation menu items translated
   - [ ] Product information (where applicable) translated
   - [ ] Form labels and buttons translated
   - [ ] Error messages and notifications translated

4. **Technical Implementation**
   - [ ] Shopify Markets/Languages configured correctly
   - [ ] Proper locale JSON files structure
   - [ ] SEO-friendly URL structure (e.g., /en/, /ta/)
   - [ ] No broken layouts when switching languages

## Translation Coverage

**Core UI Elements:**

- Navigation: Home, Collections, About, Contact
- Cart: Add to Cart, Checkout, Cart Items
- Product: Size, Color, Quantity, Price
- Forms: Email, Subscribe, Search
- Common: New, Sale, Limited, Bestseller

## Technical Implementation

```liquid
<!-- Language toggle component -->
<div class="language-toggle">
  <button class="lang-btn {% if request.locale.iso_code == 'en' %}active{% endif %}"
          onclick="switchLanguage('en')">EN</button>
  <button class="lang-btn {% if request.locale.iso_code == 'ta' %}active{% endif %}"
          onclick="switchLanguage('ta')">தமிழ்</button>
</div>
```

## Locale Files Structure

```
locales/
├── en.default.json
├── ta.json
└── en.json (if needed)
```

## SEO Considerations

- Implement `hreflang` tags for language versions
- Ensure proper canonical URLs
- Configure Google Search Console for multilingual site
- Set up proper redirects for language detection

## Definition of Done

- [ ] Language toggle UI implemented and functional
- [ ] All target UI elements properly translated
- [ ] Language preference persists correctly
- [ ] No layout breaks when switching languages
- [ ] SEO tags properly configured
- [ ] URL structure follows best practices
- [ ] Cross-browser compatibility verified

## Dependencies

- Shopify Markets configuration
- Tamil translation content
- US2.1: Header/footer implementation (for toggle placement)

## Files Created/Modified

- `snippets/language-toggle.liquid`
- `locales/en.default.json`
- `locales/ta.json`
- `layout/theme.liquid` (hreflang tags)
- `assets/language-toggle.js`

## Testing Checklist

- [ ] Switch between languages works smoothly
- [ ] All translated text displays correctly
- [ ] Tamil Unicode characters render properly
- [ ] URL structure updates appropriately
- [ ] Language preference persists after browser restart
- [ ] No JavaScript errors in console

## Translation Quality Assurance

- [ ] Tamil translations reviewed by native speaker
- [ ] Cultural appropriateness verified
- [ ] Technical terms properly localized
- [ ] Consistent terminology across all translations

## Estimate Breakdown

- Language toggle UI: 1 hour
- Locale configuration: 1 hour
- Translation implementation: 45 min
- Testing and fixes: 15 min
- **Total: 3 story points**
