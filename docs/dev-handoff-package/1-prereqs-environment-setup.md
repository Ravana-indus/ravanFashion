# 1) Prereqs & Environment Setup

## Install

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
