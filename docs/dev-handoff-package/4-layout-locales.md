# 4) Layout & Locales

## layout/theme.liquid (essentials)

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

## locales/en.default.json (snippet)

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

## locales/ta.default.json (snippet)

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
