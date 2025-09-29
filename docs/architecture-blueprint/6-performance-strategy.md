# 6) Performance Strategy

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
