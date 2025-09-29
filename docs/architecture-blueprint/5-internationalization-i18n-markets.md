# 5) Internationalization (i18n) & Markets

- **Locales**: `en.default.json`, `ta.default.json` for static strings. Dynamic content via
  metaobjects provides both Tamil + English fields when relevant.
- **Language Switcher**: snippet `market-selectors.liquid` shows language + country selectors.
  Persist selection in Shopify Markets context.
- **Currency**: enable USD, CAD, GBP, EUR. Price formatting via Liquid `money_with_currency` filter.
- **Regional Copy**: `shipping_note` metafield supports per-market overrides using `shop.locale` /
  `request.country` logic.

---
