# 2) Theme Structure (File Tree)

```
/theme
  ├─ assets/
  │   ├─ theme.css            # compiled Tailwind + custom
  │   ├─ theme.js             # entry, dynamic imports
  │   ├─ kolam.svg            # motif assets
  │   ├─ temple-divider.svg
  │   └─ ... images/webp/avif
  ├─ config/
  │   ├─ settings_schema.json
  │   └─ settings_data.json
  ├─ layout/
  │   └─ theme.liquid         # header/footer, global includes
  ├─ locales/
  │   ├─ en.default.json
  │   └─ ta.default.json      # Tamil translations
  ├─ sections/
  │   ├─ hero.liquid
  │   ├─ drop-countdown.liquid
  │   ├─ proverb-rotator.liquid
  │   ├─ featured-collections.liquid
  │   ├─ ugc-feed.liquid
  │   ├─ newsletter.liquid
  │   ├─ collection-grid.liquid
  │   ├─ product-main.liquid  # PDP core
  │   ├─ design-story.liquid
  │   ├─ size-guide-modal.liquid
  │   └─ related-items.liquid
  ├─ snippets/
  │   ├─ price.liquid
  │   ├─ badges.liquid
  │   ├─ variant-pickers.liquid
  │   ├─ market-selectors.liquid
  │   └─ accessibility-helpers.liquid
  ├─ templates/
  │   ├─ index.json           # home
  │   ├─ collection.json
  │   ├─ product.json
  │   ├─ page.about.json
  │   ├─ page.culture.json
  │   └─ page.lookbook.json
  └─ customers/, sections/* app blocks as needed
```

---
