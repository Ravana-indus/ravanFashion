# Sprint 1 PRD: Tamil Cultural Streetwear Shopify Theme

## Section 1: Theme Setup & Environment

- **US1.1** (2 pts): As a developer, I want a Shopify dev store linked so I can preview theme
  changes in real-time.  
  ✅ Acceptance: CLI login works, theme preview available at dev store URL.
- **US1.2** (3 pts): As a developer, I want Tailwind & PostCSS configured so I can apply the
  Tamil-inspired design system.  
  ✅ Acceptance: `theme.build.css` compiles with brand colors, fonts, and utilities.
- **US1.3** (5 pts): As a developer, I want CI/CD pipelines so every push runs lint/build/deploy
  checks.  
  ✅ Acceptance: GitHub Actions pipeline runs lint, style check, and pushes theme without errors.

---

## Section 2: Global Layout & Branding

- **US2.1** (5 pts): As a shopper, I want to see a branded header/footer with Tamil script so I
  recognize cultural identity.  
  ✅ Acceptance: Sticky header renders with logo, nav links, Tamil font; footer includes policy
  links.
- **US2.2** (3 pts): As a bilingual user, I want language toggles (EN ↔ தமிழ்) so I can shop in my
  preferred language.  
  ✅ Acceptance: Switching locale updates visible UI text; Tamil/English JSON locales loaded
  correctly.

---

## Section 3: Homepage Experience

- **US3.1** (5 pts): As a shopper, I want a hero banner with Tamil text headline so I feel cultural
  pride.  
  ✅ Acceptance: Hero image/video renders with Tamil H1, English subheader, CTA working.
- **US3.2** (3 pts): As a shopper, I want a countdown timer so I know when the next drop launches.  
  ✅ Acceptance: Timer counts down accurately, shows “Live Now” after target time.
- **US3.3** (3 pts): As a shopper, I want Tamil proverbs with English translations so I understand
  the cultural storytelling.  
  ✅ Acceptance: Proverbs rotate every 3–5 seconds, accessible with aria-live announcements.
- **US3.4** (5 pts): As a shopper, I want featured collections displayed so I can quickly browse key
  products.  
  ✅ Acceptance: Grid loads selected collection, hover zoom works on images.
- **US3.5** (3 pts): As a shopper, I want a newsletter signup so I can get notified about drops.  
  ✅ Acceptance: Form submits to Shopify + Klaviyo, confirmation message shown.
- **US3.6** (5 pts): As a shopper, I want to see UGC feeds (Instagram/TikTok) so I can trust
  community engagement.  
  ✅ Acceptance: Social feed displays correctly via app block, responsive on mobile.

---

## Section 4: Collection & Product Pages

- **US4.1** (5 pts): As a shopper, I want to filter/sort a collection so I can find products
  faster.  
  ✅ Acceptance: Filter/sort updates PLP without full reload, results accurate.
- **US4.2** (5 pts): As a shopper, I want to choose product variants (size, color) so I can
  personalize my purchase.  
  ✅ Acceptance: Variant selector updates price, SKU, and featured image.
- **US4.3** (3 pts): As a shopper, I want to read the cultural design story so I know the meaning
  behind the piece.  
  ✅ Acceptance: Design Story section shows Tamil term, English translation, and description.
- **US4.4** (3 pts): As a shopper, I want a size guide modal so I can confirm fit before purchase.  
  ✅ Acceptance: Modal opens/closes smoothly, responsive layout, includes measurements.
- **US4.5** (3 pts): As a shopper, I want to read reviews so I can feel confident about product
  quality.  
  ✅ Acceptance: Reviews app block renders and loads user-submitted reviews.

---

## Section 5: Performance & Accessibility

- **US5.1** (5 pts): As a mobile shopper, I want the site to load fast so I don’t abandon the
  session.  
  ✅ Acceptance: Lighthouse score ≥90 mobile, LCP ≤2.5s, CLS ≤0.1.
- **US5.2** (3 pts): As a visually impaired user, I want ARIA labels on Tamil text so I can use
  screen readers.  
  ✅ Acceptance: All Tamil-only text includes `aria-label` with English translation.
- **US5.3** (2 pts): As a keyboard user, I want visible focus states so I can navigate without a
  mouse.  
  ✅ Acceptance: Focus outlines clearly visible on all inputs, links, and buttons.

---

## Section 6: App Integrations

- **US6.1** (3 pts): As a marketer, I want Klaviyo email integration so I can build campaigns.  
  ✅ Acceptance: Newsletter signups sync to Klaviyo list.
- **US6.2** (3 pts): As a shopper, I want reviews powered by Loox/Judge.me so I can see authentic
  feedback.  
  ✅ Acceptance: PDP renders reviews widget via app block.
- **US6.3** (5 pts): As an operator, I want POD (Printful/Printify) integrated so orders
  auto-fulfill.  
  ✅ Acceptance: Products sync correctly, test order flows through POD.

---

## Section 7: QA & Launch Readiness

- **US7.1** (3 pts): As QA, I want test scripts for homepage, checkout, PDP so I can validate
  flows.  
  ✅ Acceptance: Manual/automated tests pass for main user flows.
- **US7.2** (2 pts): As PM, I want a pre-launch checklist so I can ensure readiness before going
  live.  
  ✅ Acceptance: Checklist completed with content, links, policies, translations confirmed.

---

### Sprint 1 Story Point Summary

Total: **~79 Story Points**

---

## Burndown Chart Template

**X-axis**: Sprint Days (Day 1 → Day 14)  
**Y-axis**: Remaining Story Points (79 → 0)

| Day | Planned Remaining | Actual Remaining |
| --- | ----------------- | ---------------- |
| 1   | 79                | 79               |
| 2   | 74                |                  |
| 3   | 69                |                  |
| 4   | 64                |                  |
| 5   | 59                |                  |
| 6   | 54                |                  |
| 7   | 49                |                  |
| 8   | 44                |                  |
| 9   | 39                |                  |
| 10  | 34                |                  |
| 11  | 29                |                  |
| 12  | 24                |                  |
| 13  | 19                |                  |
| 14  | 0                 |                  |

---

## Velocity Tracking Template

**Sprint Velocity Table**

| Sprint | Planned Points | Completed Points | Velocity (pts) | Notes             |
| ------ | -------------- | ---------------- | -------------- | ----------------- |
| 1      | 79             |                  |                | Initial baseline  |
| 2      | TBD            |                  |                | Based on Sprint 1 |
| 3      | TBD            |                  |                |                   |

**Forecasting Rule**: Take average of last 2–3 completed sprints’ velocities to predict next sprint
capacity.

---

✅ Final PRD includes **user stories, acceptance criteria, story points, burndown chart, and
velocity tracking templates** for complete Sprint 1 planning and monitoring.
