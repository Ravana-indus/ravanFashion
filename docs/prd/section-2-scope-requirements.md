# Section 2: Scope & Requirements

## 2.1 Functional Scope (MVP)

**Storefront features**

- **Homepage**: Hero (image/video), Drop countdown, Featured collections, Brand story block, UGC
  feed, Newsletter signup.
- **Collections (PLP)**: Filter/sort (type, size, price), badges (Limited, New, Bestseller), quick
  add, infinite scroll.
- **Product (PDP)**: Variant pickers, sticky ATC, Design Story panel (Tamil term + translation +
  backstory), care & material notes, shipping note, size guide modal, related items.
- **Static pages**: About, Culture (design story index/blog), Lookbook (by drop), FAQ, Contact,
  Shipping & Returns.

**Globalization**

- Multilingual: **English + Tamil** (via Shopify Translate & Adapt).
- Multi-currency: USD, CAD, GBP, EUR (Shopify Markets).
- Market-aware shipping logic.

**Integrations**

- Printful + Printify apps for POD fulfillment.
- Reviews app (Loox/Judge.me) via app block.
- Klaviyo for email.
- UGC/social feed via app block.

**CMS/Data**

- Metaobjects for `Design Story` and `Drop`.
- Metafields for care, materials, fit notes, shipping.

## 2.2 Non-functional Requirements

- **Performance**: LCP ≤ 2.5s, CLS ≤ 0.1, FID ≤ 100ms on 4G mobile.
- **Accessibility**: WCAG AA compliance.
- **SEO**: schema.org markup for products, collections, articles.
- **Maintainability**: Built with Shopify CLI workflow; modular sections.
- **Branding**: Theme typography must support **Tamil Unicode** fonts.
- **Scalability**: App-block ready for future features.

## 2.3 Out of Scope (MVP)

- Custom checkout modifications.
- Non-POD custom-manufactured SKUs.
- Advanced personalization.
- Wholesale/B2B features.

---
