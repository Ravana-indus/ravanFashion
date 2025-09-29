# Ravan Fashion - Tamil Theme

Tamil-inspired Shopify theme for the diaspora community.

## 📖 Documentation

See [/docs](./docs) for all PRD, sprint, and UX docs. Start here →
[/docs/README.md](./docs/README.md)

## Quick Start

### Prerequisites

- Node.js v22.16.0+
- Shopify CLI installed globally
- Shopify Partner account access

### Setup

```bash
# Install Shopify CLI (if not already installed)
npm install -g @shopify/cli @shopify/theme

# Login to Shopify
shopify login --store your-dev-store.myshopify.com

# Install dependencies
npm install

# Start development server
shopify theme dev
```

## Project Structure

```
├── docs/                   # All project documentation
├── src/                    # Theme source files
│   ├── assets/            # CSS, JS, images
│   ├── config/            # Theme settings
│   ├── layout/            # Theme layout files
│   ├── sections/          # Theme sections
│   ├── snippets/          # Reusable code snippets
│   └── templates/         # Page templates
├── tests/                 # Test files
├── shopify.theme.yml      # Theme configuration
└── package.json           # Dependencies and scripts
```

## Development Commands

```bash
# Start development server with hot reload
shopify theme dev

# Pull theme from store
shopify theme pull

# Push theme to store
shopify theme push

# Build project (when configured)
npm run build

# Run tests (when configured)
npm run test

# Lint code (when configured)
npm run lint
```

## Dev Store Setup

See [docs/dev-store-setup.md](./docs/dev-store-setup.md) for detailed development store
configuration instructions.

## Team

- **PM**: Sarah
- **Architect**: Winston
- **UX Designer**: Anita
- **Dev Lead**: Ravi
