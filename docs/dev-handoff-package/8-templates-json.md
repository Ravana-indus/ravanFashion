# 8) Templates (JSON)

## templates/index.json

```json
{
  "sections": {
    "hero": {
      "type": "hero",
      "settings": { "title": "Tamil Streetwear", "subtitle": "Wear your culture" }
    },
    "count": { "type": "drop-countdown" },
    "prov": { "type": "proverb-rotator" },
    "feat": { "type": "featured-collections" },
    "ugc": { "type": "ugc-feed" },
    "news": { "type": "newsletter" }
  },
  "order": ["hero", "count", "prov", "feat", "ugc", "news"]
}
```

## templates/product.json

```json
{ "sections": { "main": { "type": "product-main" } }, "order": ["main"] }
```

## templates/collection.json

```json
{ "sections": { "grid": { "type": "collection-grid" } }, "order": ["grid"] }
```

---
