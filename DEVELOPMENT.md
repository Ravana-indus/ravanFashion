# 🚀 Development Guide - Ravan Fashion Shopify Theme

## 📋 Prerequisites

Before starting development, ensure you have:

- **Node.js** (v20 or higher)
- **Shopify CLI** installed globally
- **Shopify Partner Account** or **Shopify Store** access
- **API credentials** for your Shopify store

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
npm install -g @shopify/cli @shopify/theme
```

### 2. Configure Environment
```bash
cp .env.local .env
# Edit .env with your actual Shopify credentials
```

### 3. Start Development Server
```bash
# Method 1: Using our setup script
./scripts/dev-setup.sh

# Method 2: Using Shopify CLI directly
shopify theme dev --port 9292 --live-reload

# Method 3: Using npm scripts
npm run dev
```

### 4. Preview Your Site
```bash
./scripts/preview.sh
# Or open http://localhost:9292 in your browser
```

## 🎯 Key Features to Test

### 🌐 **Multilingual Experience**
- **Language Toggle**: Switch between English and Tamil
- **RTL Support**: Tamil text renders correctly
- **SEO Tags**: Proper hreflang implementation

### 🎭 **Cultural Design Elements**
- **Tamil Typography**: Custom fonts and text rendering
- **Cultural Colors**: Traditional Tamil color palette
- **Festival Themes**: Dynamic cultural theming

### 🛍️ **E-commerce Features**
- **Product Catalog**: Browse Tamil cultural products
- **Product Details**: Rich product descriptions in Tamil
- **Shopping Cart**: Add to cart functionality
- **Wishlist**: Save favorite items

### 📱 **Mobile Experience**
- **Responsive Design**: Works on all devices
- **Touch Gestures**: Swipe and tap interactions
- **Performance**: Fast loading on mobile

### ♿ **Accessibility**
- **Screen Reader**: Proper ARIA labels
- **Keyboard Navigation**: Full keyboard support
- **WCAG Compliance**: Meets accessibility standards

## 🔨 Development Commands

### 🚀 **Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### 🧪 **Testing**
```bash
npm run test         # Run all tests
npm run test:unit    # Run unit tests only
npm run test:e2e     # Run E2E tests only
npm run test:tamil   # Validate Tamil text
```

### 📊 **Quality Assurance**
```bash
npm run lint         # Check code quality
npm run lint:css     # Check CSS styles
npm run format       # Format code
npm run security     # Security audit
```

### 📈 **Performance**
```bash
npm run analyze      # Bundle analysis
npm run perf         # Performance testing
npm run accessibility # Accessibility testing
```

## 🎨 **Design System**

### Colors
- **Primary**: `#FF6B35` (Tamil orange)
- **Secondary**: `#4ECDC4` (Tamil blue)
- **Accent**: `#45B7D1` (Cultural blue)
- **Neutral**: `#2C3E50` (Dark text)

### Typography
- **English**: Inter, Playfair Display
- **Tamil**: Noto Sans Tamil, Mukta Malar

### Components
- **Header**: Navigation, language toggle, search
- **Product Cards**: Cultural product display
- **Language Toggle**: Smooth language switching
- **Cultural Banner**: Festival and cultural announcements

## 🧪 **Testing Checklist**

### ✅ **Before Marking Stories Complete**

1. **Local Testing**
   - [ ] Site loads at http://localhost:9292
   - [ ] All pages render without errors
   - [ ] Language toggle works correctly
   - [ ] Mobile responsive design works
   - [ ] Tamil text displays properly

2. **Functional Testing**
   - [ ] Product browsing works
   - [ ] Add to cart functionality
   - [ ] Wishlist features
   - [ ] Search functionality
   - [ ] Navigation menus

3. **Accessibility Testing**
   - [ ] Screen reader compatible
   - [ ] Keyboard navigation works
   - [ ] Color contrast meets WCAG standards
   - [ ] ARIA labels present

4. **Performance Testing**
   - [ ] Load time under 3 seconds
   - [ ] Images optimized
   - [ ] CSS/JS minified
   - [ ] Core Web Vitals met

## 🔍 **Debugging**

### Common Issues

1. **Shopify CLI Connection Issues**
   ```bash
   # Logout and re-login
   shopify logout
   shopify login --store your-store.myshopify.com
   ```

2. **Asset Build Issues**
   ```bash
   # Clean and rebuild
   rm -rf .dev/cache
   npm run build:clean
   npm run build:dev
   ```

3. **Tamil Font Issues**
   ```bash
   # Check font loading
   curl -I https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil
   ```

### Developer Tools

- **Shopify CLI Debug**: `shopify theme dev --debug`
- **Network Tab**: Check API calls and asset loading
- **Console**: Check for JavaScript errors
- **Accessibility Audit**: Use browser accessibility tools

## 🚀 **Deployment**

### Production Build
```bash
npm run build:prod
shopify theme push
```

### Rollback
```bash
shopify theme list
shopify theme serve --theme THEME_ID
```

## 📞 **Support**

- **Shopify CLI Documentation**: https://shopify.dev/docs/cli
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Testing Issues**: Check test logs in `/tests/reports/`
- **Performance Issues**: Use Lighthouse CI reports

---

**Remember**: Only mark stories as completed after successfully testing all features locally! 🎯