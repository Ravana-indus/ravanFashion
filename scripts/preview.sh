#!/bin/bash

# Preview Script for Ravan Fashion Shopify Theme

echo "🎭 Preview Ravan Fashion Theme"

# Check if we have a running dev server
if ! curl -s http://localhost:9292 > /dev/null; then
    echo "🚀 Starting development server..."
    ./scripts/dev-setup.sh &
    sleep 5
fi

echo "🌐 Opening preview in browser..."
echo "📱 Desktop: http://localhost:9292"
echo "📱 Mobile: Use browser dev tools or resize window"

# Open in default browser
if command -v open &> /dev/null; then
    open http://localhost:9292
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:9292
else
    echo "Please open http://localhost:9292 in your browser"
fi

echo ""
echo "🎯 Key Features to Test:"
echo "  🔄 Language toggle (English/Tamil)"
echo "  🎨 Cultural design elements"
echo "  🛍️  Product catalog with Tamil descriptions"
echo "  📱 Mobile responsiveness"
echo "  ♿ Accessibility features"
echo ""
echo "🔧 Development Commands:"
echo "  npm run dev        - Start development server"
echo "  npm run test       - Run tests"
echo "  npm run build      - Build for production"
echo "  npm run lint       - Check code quality"