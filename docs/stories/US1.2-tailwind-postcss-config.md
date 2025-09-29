# US1.2: Tailwind & PostCSS Configuration

**Story Points:** 3 **Section:** Theme Setup & Environment **Priority:** High **Status:** Ready

## User Story

As a developer, I want Tailwind & PostCSS configured so I can apply the Tamil-inspired design
system.

## Acceptance Criteria

✅ **Primary Acceptance:** `theme.build.css` compiles with brand colors, fonts, and utilities.

### Detailed Acceptance Criteria:

1. **Tailwind CSS Setup**
   - [ ] Tailwind CSS installed and configured
   - [ ] Tamil brand color palette defined in config
   - [ ] Tamil typography (Latha/Adyuthan) fonts configured
   - [ ] Custom utilities for cultural elements created

2. **PostCSS Pipeline**
   - [ ] PostCSS configured for Shopify theme structure
   - [ ] CSS compilation working from `src/` to `assets/`
   - [ ] Autoprefixer configured for browser compatibility
   - [ ] CSS minification enabled for production builds

3. **Design System Integration**
   - [ ] Brand colors available as Tailwind utilities
   - [ ] Tamil font families accessible via utility classes
   - [ ] Cultural spacing and sizing utilities defined
   - [ ] Responsive breakpoints configured for mobile-first design

## Brand Color Palette

```css
colors: {
  'deep-maroon': '#6A1B1B',
  'gold': '#D4AF37',
  'charcoal-black': '#1C1C1C',
  'cream-white': '#FDF6EC',
  'muted-teal': '#3A6A6A'
}
```

## Typography Configuration

```css
fontFamily: {
  'tamil':['Latha','Adyuthan Tamil', 'serif'],
  'sans':
    [ 'Inter',
    'Helvetica Neue',
    'sans-serif'];
}
```

## Technical Implementation

- Configure `tailwind.config.js` with custom theme
- Set up `postcss.config.js` for Shopify compatibility
- Create build script to compile CSS from `src/css/` to `assets/`
- Integrate with existing Shopify theme structure

## Definition of Done

- [x] Tailwind CSS compiles without errors
- [x] Brand colors and fonts accessible via custom classes
- [x] CSS output optimized and compiled to assets/theme.build.css
- [x] Build process configured with package.json scripts
- [x] Custom cultural components and utilities created
- [x] PostCSS pipeline configured for Shopify compatibility
- [ ] Tamil font integration tested (requires dev store for full validation)

## Dependencies

- US1.1: Dev store setup (for testing)
- Brand guidelines and design tokens
- Tamil font files sourced

## Files Modified/Created

- `tailwind.config.js`
- `postcss.config.js`
- `package.json` (dependencies)
- `src/css/theme.css`
- `assets/theme.build.css` (generated)

## Estimate Breakdown

- Tailwind setup and configuration: 1 hour
- Custom brand theme configuration: 1 hour
- PostCSS pipeline setup: 30 min
- Testing and optimization: 30 min
- **Total: 3 story points**
