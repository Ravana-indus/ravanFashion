# 2) Project Scripts (package.json)

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
