# Dev Handoff Package — Tamil Cultural Streetwear (Shopify OS 2.0)

This package gives engineering a ready path to bootstrap, build, and ship the theme.

---

## 1) Prereqs & Environment Setup

### Install
```bash
# Shopify CLI
npm i -g @shopify/cli @shopify/theme

# Create project folder
mkdir tamil-streetwear-theme && cd tamil-streetwear-theme

# Init theme (use Dawn as reference or start blank)
shopify theme init -n tamil-streetwear --clone-url https://github.com/Shopify/dawn
cd tamil-streetwear

# Node deps for tooling
npm init -y
npm i -D tailwindcss postcss autoprefixer prettier eslint stylelint @shopify/stylelint-plugin theme-check
npx tailwindcss init -p
```

> Log into the target development store:
```bash
shopify login --store <your-dev-store.myshopify.com>
```

---

## 2) Project Scripts (package.json)
```json
{
  "name": "tamil-streetwear-theme",
  "private": true,
  "scripts": {
    "dev": "shopify theme dev --host=127.0.0.1",
    "build:css": "tailwindcss -i ./assets/theme.css -o ./assets/theme.build.css --minify",
    "watch:css": "tailwindcss -i ./assets/theme.css -o ./assets/theme.build.css --watch",
    "lint": "theme-check && eslint . || true && stylelint \"**/*.{css,liquid}\"",
    "push": "npm run build:css && shopify theme push --allow-live",
    "preview": "shopify theme preview"
  }
}
```

---

## 3) Tailwind & PostCSS

### tailwind.config.js
```js
module.exports = {
  content: [
    "./layout/**/*.liquid",
    "./templates/**/*.json",
    "./sections/**/*.liquid",
    "./snippets/**/*.liquid"
  ],
  theme: {
    extend: {
      colors: {
        maroon: "#6A1B1B",
        gold: "#D4AF37",
        charcoal: "#1C1C1C",
        cream: "#FDF6EC",
        teal: "#3A6A6A"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        tamil: ["Latha", "Adyuthan Tamil", "Noto Sans Tamil", "sans-serif"]
      }
    }
  },
  plugins: []
}
```

### postcss.config.js
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

### assets/theme.css (entry)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Tamil headline utility */
.tamil-font{ font-family: theme('fontFamily.tamil'); }
```

> Include built CSS in `theme.liquid` (see below). During dev, you can reference `theme.build.css` directly.

---

## 4) Layout & Locales

### layout/theme.liquid (essentials)
```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{% if page_title %}{{ page_title }} — {% endif %}{{ shop.name }}</title>
    {{ 'theme.build.css' | asset_url | stylesheet_tag }}
    {{ content_for_header }}
  </head>
  <body class="bg-cream text-charcoal">
    {% section 'header' %}
    <main id="MainContent" role="main">{{ content_for_layout }}</main>
    {% section 'footer' %}
    <script src="{{ 'theme.js' | asset_url }}" defer></script>
  </body>
</html>
```

### locales/en.default.json (snippet)
```json
{
  "general": {
    "shop_now": "Shop the Drop",
    "proverb": "Proverb"
  },
  "culture": {
    "design_story": "Design Story",
    "translation": "Translation"
  }
}
```

### locales/ta.default.json (snippet)
```json
{
  "general": {
    "shop_now": "இப்போ வாங்க",
    "proverb": "பழமொழி"
  },
  "culture": {
    "design_story": "வடிவமைப்பு கதை",
    "translation": "மொழிபெயர்ப்பு"
  }
}
```

---

## 5) Theme Settings (config)

### config/settings_schema.json (minimal)
```json
[
  {
    "name": "Theme settings",
    "settings": [
      {"type":"color","id":"brand_maroon","label":"Brand Maroon","default":"#6A1B1B"},
      {"type":"color","id":"brand_gold","label":"Brand Gold","default":"#D4AF37"},
      {"type":"checkbox","id":"enable_animations","label":"Enable animations","default":true}
    ]
  }
]
```

---

## 6) Sections (Skeletons)

### sections/hero.liquid
```liquid
{% schema %}{
  "name":"Hero",
  "settings":[
    {"type":"image_picker","id":"bg","label":"Background"},
    {"type":"text","id":"title","label":"Title"},
    {"type":"text","id":"subtitle","label":"Subtitle"},
    {"type":"url","id":"cta_link","label":"CTA Link"},
    {"type":"text","id":"cta_label","label":"CTA Label","default":"{{ 'general.shop_now' | t }}"}
  ]
}{% endschema %}
<section class="relative grid place-items-center text-center py-16">
  {% if section.settings.bg %}
    <img src="{{ section.settings.bg | image_url: width:2000 }}" alt="" class="absolute inset-0 w-full h-full object-cover" loading="eager">
  {% endif %}
  <div class="relative z-10 max-w-3xl px-6">
    <h1 class="text-4xl md:text-6xl font-extrabold tamil-font text-maroon">{{ section.settings.title }}</h1>
    <p class="mt-4 text-lg text-charcoal/80">{{ section.settings.subtitle }}</p>
    {% if section.settings.cta_link %}
      <a href="{{ section.settings.cta_link }}" class="mt-6 inline-block bg-gold text-charcoal font-bold px-6 py-3 rounded-xl">{{ section.settings.cta_label }}</a>
    {% endif %}
  </div>
</section>
```

### sections/drop-countdown.liquid
```liquid
{% schema %}{"name":"Drop Countdown","settings":[{"type":"text","id":"target_iso","label":"Target ISO","default":"2025-11-01T00:00:00Z"}]}{% endschema %}
<div id="drop-countdown" data-target="{{ section.settings.target_iso }}" class="text-2xl md:text-3xl font-black"></div>
<script>
(function(){const el=document.currentScript.previousElementSibling;const t=new Date(el.dataset.target);function pad(n){return String(n).padStart(2,'0')}function tick(){const d=t-new Date();if(d<=0){el.textContent='Live Now';return}const days=Math.floor(d/864e5),h=Math.floor(d/36e5)%24,m=Math.floor(d/6e4)%60,s=Math.floor(d/1e3)%60;el.textContent=`${days}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;setTimeout(tick,1000)}tick()})();
</script>
```

### sections/proverb-rotator.liquid
```liquid
{% schema %}{
  "name":"Proverb Rotator",
  "settings":[{"type":"richtext","id":"items","label":"Tamil/English lines","default":"<p>ஒன்றுபட்டால் உயர்வு — United we rise</p>"}]
}{% endschema %}
<div class="prose text-center">
  {{ section.settings.items }}
</div>
```

### sections/product-main.liquid (slot for app blocks)
```liquid
{% schema %}{"name":"Product Main","settings":[],"blocks":[{"type":"reviews","name":"Reviews","limit":1,"settings":{}}],"target":"section"}{% endschema %}
<section class="grid md:grid-cols-2 gap-8">
  {% render 'gallery' %}
  <div>
    <h1 class="text-3xl font-bold">{{ product.title }}</h1>
    {% render 'variant-pickers', product: product %}
    <button class="mt-4 bg-gold text-charcoal font-bold px-6 py-3 rounded-xl">Add to cart</button>
    {% section 'design-story' %}
    {% for block in section.blocks %}
      {% if block.type == 'reviews' %}
        {% render 'reviews-app-slot' %}
      {% endif %}
    {% endfor %}
  </div>
</section>
```

### sections/design-story.liquid
```liquid
{% assign ds = product.metafields.custom.design_story.value %}
{% if ds %}
<section class="mt-10 border-t border-cream pt-6">
  <h2 class="text-2xl tamil-font text-maroon">{{ ds.tamil_term }}</h2>
  <p class="text-sm text-neutral-700">{{ ds.translation }}</p>
  <div class="prose mt-4">{{ ds.story_md | metafield_tag }}</div>
  {% if ds.artist_credit %}<p class="mt-2 text-xs">Artist: {{ ds.artist_credit }}</p>{% endif %}
</section>
{% endif %}
```

### sections/collection-grid.liquid (simplified)
```liquid
{% schema %}{"name":"Collection Grid","settings":[{"type":"collection","id":"coll","label":"Collection"}]}{% endschema %}
{% assign coll = section.settings.coll | default: collection %}
<div class="grid grid-cols-2 md:grid-cols-3 gap-6">
  {% for product in coll.products %}
    <a href="{{ product.url }}" class="block">
      {{ product.featured_image | image_url: width:800 | image_tag: class: 'w-full h-auto' }}
      <div class="mt-2 flex items-center justify-between">
        <span class="text-sm">{{ product.title }}</span>
        <span class="text-sm font-semibold">{{ product.price | money }}</span>
      </div>
    </a>
  {% endfor %}
</div>
```

---

## 7) Snippets (placeholders)

### snippets/variant-pickers.liquid
```liquid
{% for option in product.options_with_values %}
  <label class="block text-sm font-medium mt-4">{{ option.name }}</label>
  <select name="options[{{ option.name }}]" class="border rounded p-2 w-full">
    {% for value in option.values %}<option value="{{ value }}">{{ value }}</option>{% endfor %}
  </select>
{% endfor %}
```

### snippets/reviews-app-slot.liquid
```liquid
<!-- App block placeholder: insert Loox/Judge.me widget here via app block UI -->
<div id="reviews-slot"></div>
```

---

## 8) Templates (JSON)

### templates/index.json
```json
{
  "sections": {
    "hero": {"type": "hero", "settings": {"title": "Tamil Streetwear", "subtitle": "Wear your culture"}},
    "count": {"type": "drop-countdown"},
    "prov": {"type": "proverb-rotator"},
    "feat": {"type": "featured-collections"},
    "ugc": {"type": "ugc-feed"},
    "news": {"type": "newsletter"}
  },
  "order": ["hero", "count", "prov", "feat", "ugc", "news"]
}
```

### templates/product.json
```json
{ "sections": { "main": { "type": "product-main" } }, "order": ["main"] }
```

### templates/collection.json
```json
{ "sections": { "grid": { "type": "collection-grid" } }, "order": ["grid"] }
```

---

## 9) Metafields & Metaobjects (Create in Admin)
- **Product metafields** (namespace `custom`): `materials` (list), `care_instructions` (multi-line), `print_method`, `shipping_note`, `fit_notes`, `badge` (enum)
- **Metaobject** `design_story`: fields `tamil_term`, `translation`, `story_md`, `artist_credit`, `symbol_references[]`

---

## 10) Markets & Translations
- Enable Markets: USD, CAD, GBP, EUR
- Add **Translate & Adapt**; populate `locales/ta.default.json`
- Add language & country selectors via header snippet (or a markets app block)

---

## 11) Build & Deploy Flow
```bash
# 1) Run local preview (one terminal)
npm run watch:css & shopify theme dev

# 2) When ready to publish
git add . && git commit -m "feat: initial theme skeleton"
npm run push
```

---

## 12) QA Checklist (Dev)
- [ ] Lighthouse mobile LCP ≤ 2.5s, CLS ≤ 0.1
- [ ] EN↔TA toggle works across templates
- [ ] Markets currency shows correct price format
- [ ] PDP: variant selection + add-to-cart works
- [ ] Proverb rotator animates with reduced-motion respected
- [ ] Reviews app block visible in PDP
- [ ] UGC/feed loads safely (CSP domains approved)

---

## 13) Known TODOs for Sprint 1
- Implement header/footer sections (with language/currency selectors)
- Size guide modal (content + trigger)
- Featured collections section (configurable)
- Lookbook page template
- Connect Klaviyo and reviews app blocks in customizer

---

## 14) Notes
- Keep Tamil font payload minimal: prefer `Noto Sans Tamil` subset; `font-display: swap`
- Use SVG for Kolam/temple dividers; inline for color control
- All Tamil strings accompanied by English translation where appropriate

---

**End of Dev Handoff Package**

