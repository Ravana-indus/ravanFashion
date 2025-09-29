# Shopify Dev Store Configuration

## Store Information

- **Store Name**: Ravan Fashion Development Store
- **Store URL**: [To be created in Shopify Partner Dashboard]
- **Theme ID**: [To be generated after theme creation]
- **Access Level**: Theme Development

## Setup Instructions

### 1. Create Development Store

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com/)
2. Navigate to Stores → Add store
3. Select "Development store"
4. Store name: `ravan-fashion-dev`
5. Store address: `ravan-fashion-dev.myshopify.com`
6. Complete store setup with basic products

### 2. Configure Theme Development

```bash
# Login to your Shopify account
shopify login

# Navigate to project directory
cd /Users/patu/DEV/001 Websites/001 Internal/003 ravanFashion

# Create new theme
shopify theme create --name "Ravan Fashion" --path src/

# Start development server
shopify theme dev
```

### 3. Theme Preview URL

Once development server starts, you'll get:

- **Preview URL**: https://ravan-fashion-dev.myshopify.com?preview_theme_id=[THEME_ID]
- **Editor URL**: https://ravan-fashion-dev.myshopify.com/admin/themes/[THEME_ID]/editor

## Testing Products to Configure

1. **Sample Saree** - Traditional wear with variants
2. **Sample Kurta** - Men's traditional wear
3. **Sample Jewelry** - Accessories category
4. **Sample Collection** - Featured collections for homepage

## Development Team Access

- **Theme Access**: All developers need Shopify Partner account access
- **Preview Access**: Share preview URL with team members
- **Editor Access**: Configure appropriate permissions in Shopify Partner dashboard
