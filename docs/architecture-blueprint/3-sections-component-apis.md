# 3) Sections & Component APIs

## 3.1 `hero.liquid`

- **Settings**: media (image/video), title (rich text; Tamil-capable), subtitle, CTA label+link,
  overlay color, alignment
- **Behavior**: optional GSAP/Alpine fade-in; responsive focal points

## 3.2 `drop-countdown.liquid`

- **Settings**: target datetime (ISO), message pre/post
- **JS**: dynamic countdown (dayjs); SSR-safe fallback text

## 3.3 `proverb-rotator.liquid`

- **Settings**: array of items { tamil_text, translation }
- **A11y**: aria-live="polite" for updates; pause on reduced motion

## 3.4 `collection-grid.liquid`

- **Inputs**: collection reference; filter toggles; pagination mode (infinite/load-more)
- **Snippets**: `badges`, `price`

## 3.5 `product-main.liquid`

- **Includes**: gallery (Swiper), `variant-pickers`, `design-story`, reviews app block slot,
  `size-guide-modal`, `related-items`
- **Metafields**: materials, care_instructions, print_method, shipping_note, fit_notes, badge

## 3.6 `design-story.liquid`

- **Metaobject**: `design_story` with fields { tamil_term, translation, story_md, artist_credit,
  symbols[] }
- **Render**: Tamil header + English subheader; markdown to HTML with safe whitelist

---
