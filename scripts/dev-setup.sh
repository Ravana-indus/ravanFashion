#!/bin/bash

# Local Development Setup Script for Ravan Fashion Shopify Theme

echo "🚀 Setting up local development environment for Ravan Fashion..."

# Check if Shopify CLI is installed
if ! command -v shopify &> /dev/null; then
    echo "❌ Shopify CLI not found. Please install it first:"
    echo "npm install -g @shopify/cli @shopify/theme"
    exit 1
fi

# Create necessary directories
echo "📁 Creating development directories..."
mkdir -p .dev/cache
mkdir -p .dev/logs
mkdir -p .dev/preview

# Copy environment template if .env doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.local .env
    echo "⚠️  Please update .env with your actual Shopify store credentials"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build assets
echo "🔨 Building assets..."
npm run build:dev

# Start Shopify CLI dev server
echo "🛍️  Starting Shopify development server..."
echo "🌐 Your site will be available at: http://localhost:9292"
echo "📱 Theme preview: shopify theme dev --port 9292"
echo "⏹️  Press Ctrl+C to stop the server"

# Check if we have Shopify credentials
if grep -q "your-store" .env; then
    echo ""
    echo "⚠️  IMPORTANT: Please update your .env file with actual Shopify credentials:"
    echo "   - SHOPIFY_STORE_URL: Your Shopify store URL"
    echo "   - SHOPIFY_THEME_ID: Your theme ID (or leave blank for new theme)"
    echo "   - SHOPIFY_API_KEY: Your API key"
    echo "   - SHOPIFY_PASSWORD: Your API password"
    echo ""
    echo "   You can get these from your Shopify Admin > Apps > Develop apps"
fi

# Start development server
shopify theme dev --port 9292 --live-reload