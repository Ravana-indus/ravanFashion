# Front-End Architecture Blueprint — Tamil Cultural Streetwear (Shopify OS 2.0)

## 0) Goals & Constraints

- **Goals**: Modular OS 2.0 theme; Tamil-first UI; high-perf mobile UX; clean integration with POD
  apps (Printful/Printify); easy content ops via metaobjects/metafields.
- **Constraints**: Shopify theme runtime (Liquid/JS/CSS), app-block compatibility, no checkout
  customizations (non-Plus), lean third-party deps.

---

## 1) Tech Stack & Tooling

- **Platform**: Shopify Online Store 2.0 (sections everywhere, app blocks, JSON templates)
- **Languages**: Liquid, HTML5, CSS (Tailwind via compiled CSS), JavaScript (ES6 modules)
- **Tooling**: Shopify CLI (`theme init/dev/push`), Theme Check, Prettier, Stylelint, ESLint
- **Optional libs**: Swiper.js (galleries), dayjs (countdown), Alpine.js (lightweight interactivity)
  — loaded conditionally per section

---

## 2) Theme Structure (File Tree)

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

## 3) Sections & Component APIs

### 3.1 `hero.liquid`

- **Settings**: media (image/video), title (rich text; Tamil-capable), subtitle, CTA label+link,
  overlay color, alignment
- **Behavior**: optional GSAP/Alpine fade-in; responsive focal points

### 3.2 `drop-countdown.liquid`

- **Settings**: target datetime (ISO), message pre/post
- **JS**: dynamic countdown (dayjs); SSR-safe fallback text

### 3.3 `proverb-rotator.liquid`

- **Settings**: array of items { tamil_text, translation }
- **A11y**: aria-live="polite" for updates; pause on reduced motion

### 3.4 `collection-grid.liquid`

- **Inputs**: collection reference; filter toggles; pagination mode (infinite/load-more)
- **Snippets**: `badges`, `price`

### 3.5 `product-main.liquid`

- **Includes**: gallery (Swiper), `variant-pickers`, `design-story`, reviews app block slot,
  `size-guide-modal`, `related-items`
- **Metafields**: materials, care_instructions, print_method, shipping_note, fit_notes, badge

### 3.6 `design-story.liquid`

- **Metaobject**: `design_story` with fields { tamil_term, translation, story_md, artist_credit,
  symbols[] }
- **Render**: Tamil header + English subheader; markdown to HTML with safe whitelist

---

## 4) Content Model (Metafields & Metaobjects)

### Metaobjects

- `design_story`
  - `tamil_term` (single line text)
  - `translation` (single line text)
  - `story_md` (rich text/markdown)
  - `artist_credit` (single line/link)
  - `symbol_references` (list single line)
- `drop`
  - `name`, `launch_datetime`, `lookbook_images[]`, `cta_link`, `limited_quantity` (bool)

### Product Metafields

- `custom.materials` (list)
- `custom.care_instructions` (multi-line)
- `custom.print_method` (single line)
- `custom.shipping_note` (multi-line)
- `custom.fit_notes` (multi-line)
- `custom.badge` (enum: new|limited|bestseller)

---

## 5) Internationalization (i18n) & Markets

- **Locales**: `en.default.json`, `ta.default.json` for static strings. Dynamic content via
  metaobjects provides both Tamil + English fields when relevant.
- **Language Switcher**: snippet `market-selectors.liquid` shows language + country selectors.
  Persist selection in Shopify Markets context.
- **Currency**: enable USD, CAD, GBP, EUR. Price formatting via Liquid `money_with_currency` filter.
- **Regional Copy**: `shipping_note` metafield supports per-market overrides using `shop.locale` /
  `request.country` logic.

---

## 6) Performance Strategy

- **Images**: `<img srcset>` responsive sizes, AVIF/WebP variants, lazy-load (`loading="lazy"`),
  prefetch hero
- **CSS**: Tailwind compiled to single `theme.css`; critical CSS inlined for above-the-fold; purge
  unused utilities
- **JS**: Split by section; dynamic import per section render; avoid blocking scripts; respect
  `prefers-reduced-motion`
- **Fonts**: System stack for Latin; Tamil webfont subset with `font-display: swap` and
  unicode-range to reduce payload
- **Budgets**: LCP ≤ 2.5s (mobile 4G); total JS ≤ 150KB gzipped; CLS ≤ 0.1

---

## 7) Accessibility (WCAG AA)

- Semantic landmarks (header/nav/main/footer), proper heading hierarchy
- Focus-visible styles; skip-to-content link
- Contrast tested for maroon/gold/cream combos
- Alt text required in CMS; Tamil text always paired with English visible or `aria-label`
- Keyboard operable menus, modals, sliders; reduce-motion support on animations

---

## 8) Security & Privacy

- Native Shopify checkout (PCI handled by Shopify)
- No PII in client-side logs; consent banner for tracking
- CSP headers via app if needed; only approved domains for UGC embeds

---

## 9) App Integrations & Slots

- **POD**: Printful/Printify — no theme code required beyond PDP messaging blocks
- **Reviews**: App block placeholder on PDP below `design-story`
- **Email**: Klaviyo embed in `newsletter.liquid`
- **UGC**: App block region in `ugc-feed.liquid`

---

## 10) CI/CD & Environments

- **Git**: main/dev branches; PR reviews run Theme Check + lint
- **Deploy**: `shopify theme push` from main to Live; dev to Draft theme
- **Pre-release checklist**: perf audit (Lighthouse), a11y audit, cross-browser matrix

---

## 11) Sample Snippets

### 11.1 `proverb-rotator.liquid`

```liquid
{% schema %}
{
  "name": "Proverb Rotator",
  "settings": [
    {"type": "text", "id": "interval_ms", "label": "Interval (ms)", "default": "3000"},
    {"type": "list", "id": "items", "label": "Proverbs", "limit": 10, "default": [],
     "item": {
       "type": "object",
       "properties": [
         {"type": "text", "id": "tamil", "label": "Tamil"},
         {"type": "text", "id": "english", "label": "English"}
       ]
     }}
  ]
}
{% endschema %}
<div class="proverb-rotator" aria-live="polite">
  {% for p in section.settings.items %}
    <div class="proverb {% if forloop.first %}is-active{% endif %}" data-index="{{ forloop.index0 }}">
      <h3 class="text-2xl font-bold text-maroon tamil-font">{{ p.tamil }}</h3>
      <p class="text-base text-neutral-700">{{ p.english }}</p>
    </div>
  {% endfor %}
</div>
<script>
(function(){
  const root = document.currentScript.previousElementSibling;
  const items = root.querySelectorAll('.proverb');
  const interval = Number('{{ section.settings.interval_ms }}' || 3000);
  let i=0; const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce || items.length < 2) return;
  setInterval(()=>{ items[i].classList.remove('is-active'); i=(i+1)%items.length; items[i].classList.add('is-active'); }, interval);
})();
</script>
```

### 11.2 `design-story.liquid`

```liquid
{% assign ds = product.metafields.custom.design_story.value %}
{% if ds %}
<section class="design-story border-t border-cream pt-6">
  <h2 class="text-2xl tamil-font text-maroon">{{ ds.tamil_term }}</h2>
  <h3 class="text-base text-neutral-800">{{ ds.translation }}</h3>
  <div class="prose max-w-none">{{ ds.story_md | metafield_tag }}</div>
  {% if ds.artist_credit %}
    <p class="mt-2 text-sm text-neutral-600">Artist: {{ ds.artist_credit }}</p>
  {% endif %}
</section>
{% endif %}
```

### 11.3 `drop-countdown.liquid`

```liquid
{% schema %}{"name":"Drop Countdown","settings":[{"type":"text","id":"target_iso","label":"Target ISO","default":"2025-11-01T00:00:00Z"}]}{% endschema %}
<div id="drop-countdown" data-target="{{ section.settings.target_iso }}" class="countdown text-3xl font-black"></div>
<script>
(function(){
  const el=document.getElementById('drop-countdown'); const t=el.dataset.target?new Date(el.dataset.target):null; if(!t) return;
  const pad=n=>String(n).padStart(2,'0');
  function tick(){
    const d=t - new Date(); if(d<=0){ el.textContent='Live Now'; return; }
    const days=Math.floor(d/864e5), hrs=Math.floor(d/36e5)%24, mins=Math.floor(d/6e4)%60, secs=Math.floor(d/1e3)%60;
    el.textContent=`${days}d ${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
    requestAnimationFrame(()=>setTimeout(tick, 1000));
  }
  tick();
})();
</script>
```

---

## 12) Theming & Tailwind

- Tailwind compiled locally → `assets/theme.css` (no CDN). Purge paths include
  `sections/**/*.liquid`, `snippets/**/*.liquid`, `templates/**/*.json`.
- Utility classes aliased to cultural palette: `.text-maroon { color: #6A1B1B }`,
  `.bg-gold { background: #D4AF37 }` via Tailwind config.

---

## 13) QA Matrix

- **Devices**: iPhone 12–15, Pixel 6–8, iPad, common desktop sizes
- **Browsers**: Chrome, Safari, Firefox, Edge (latest 2 versions)
- **Scenarios**: EN↔TA toggle; Markets currency switch; slow 3G throttling; no-JS fallbacks

---

## 14) Risks & Mitigations

- **Tamil font payload size** → Use subset + unicode-range; preload only key weights
- **UGC privacy/CDN hotlinks** → Proxy or restrict domains in embeds
- **POD SLA variance** → Dynamic shipping notes per market; clear comms on PDP

---

## 15) Dev Task Breakdown (High Level)

1. Bootstrap theme repo + CLI, Tailwind config
2. Implement global layout, selectors (lang/currency)
3. Build sections: Hero, Countdown, Proverb, Featured Collections, Newsletter, UGC
4. Build PLP grid + filters, badges, quick-add
5. Build PDP (gallery, variant pickers, Design Story, size guide, reviews slot)
6. Wire metaobjects/metafields; seed content
7. i18n (ta/en) + Markets setup
8. Perf/A11y passes; Theme Check clean
9. App block placements (reviews, UGC, Klaviyo)
10. UAT + sign-off

---

**End of Architecture Blueprint**
