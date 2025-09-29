# US5.1: Mobile Performance Optimization

**Story Points:** 5 **Section:** Performance & Accessibility **Priority:** High **Status:** Ready

## User Story

As a mobile shopper, I want the site to load fast so I don't abandon the session.

## Acceptance Criteria

✅ **Primary Acceptance:** Lighthouse score ≥90 mobile, LCP ≤2.5s, CLS ≤0.1.

### Detailed Acceptance Criteria:

1. **Core Web Vitals**
   - [ ] Largest Contentful Paint (LCP) ≤ 2.5 seconds
   - [ ] First Input Delay (FID) ≤ 100 milliseconds
   - [ ] Cumulative Layout Shift (CLS) ≤ 0.1
   - [ ] First Contentful Paint (FCP) ≤ 1.8 seconds

2. **Lighthouse Scores**
   - [ ] Performance: ≥90 (mobile)
   - [ ] Accessibility: ≥95
   - [ ] Best Practices: ≥90
   - [ ] SEO: ≥95

3. **Image Optimization**
   - [ ] WebP format with fallbacks
   - [ ] Proper sizing and compression
   - [ ] Lazy loading for below-fold images
   - [ ] Critical images preloaded

4. **Code Optimization**
   - [ ] Critical CSS inlined
   - [ ] JavaScript code splitting
   - [ ] Font loading optimization
   - [ ] Resource bundling and minification

## Performance Targets

### Mobile Performance Benchmarks

```
Target Metrics (Mobile):
├── LCP: ≤ 2.5s
├── FID: ≤ 100ms
├── CLS: ≤ 0.1
├── FCP: ≤ 1.8s
├── TTI: ≤ 3.8s
├── Speed Index: ≤ 3.4s
└── Total Blocking Time: ≤ 200ms
```

### Page Load Budget

- **HTML**: ≤ 14KB (compressed)
- **Critical CSS**: ≤ 8KB (inlined)
- **Above-fold images**: ≤ 150KB total
- **JavaScript (initial)**: ≤ 50KB (compressed)
- **Fonts**: ≤ 30KB (critical subset)

## Technical Implementation

### Performance Optimization Script (scripts/performance-optimize.js)

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

class PerformanceOptimizer {
  constructor() {
    this.config = {
      imageQuality: 85,
      webpQuality: 80,
      maxImageWidth: 1200,
      criticalCSSThreshold: 8000, // 8KB
      jsChunkSize: 50000, // 50KB
    };
  }

  async optimizeImages() {
    console.log('🖼️  Optimizing images...');

    const imageDir = path.join(__dirname, '../assets');
    const images = fs.readdirSync(imageDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));

    for (const image of images) {
      const inputPath = path.join(imageDir, image);
      const outputPath = path.join(imageDir, image.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

      try {
        // Generate WebP version
        await sharp(inputPath).webp({ quality: this.config.webpQuality }).toFile(outputPath);

        // Optimize original
        const { width } = await sharp(inputPath).metadata();
        if (width > this.config.maxImageWidth) {
          await sharp(inputPath)
            .resize(this.config.maxImageWidth)
            .jpeg({ quality: this.config.imageQuality })
            .toFile(inputPath.replace(/\.(jpg|jpeg|png)$/i, '-optimized.$1'));
        }

        console.log(`✅ Optimized: ${image}`);
      } catch (error) {
        console.error(`❌ Failed to optimize ${image}:`, error.message);
      }
    }
  }

  async extractCriticalCSS() {
    console.log('🎨 Extracting critical CSS...');

    const criticalSelectors = [
      // Above-fold selectors
      'header',
      '.header',
      '#header',
      '.hero',
      '.hero-banner',
      '.container',
      '.wrapper',
      'h1',
      'h2',
      '.btn',
      '.button',
      // Layout essentials
      '.grid',
      '.flex',
      '.block',
      '.hidden',
      // Typography
      '.font-tamil',
      '.text-*',
      // Critical utilities
      '.bg-*',
      '.text-*',
      '.p-*',
      '.m-*',
      // Mobile-first breakpoints
      '@media (max-width: 768px)',
    ];

    const cssFile = path.join(__dirname, '../assets/theme.css');
    const css = fs.readFileSync(cssFile, 'utf8');

    // Extract critical CSS (simplified - in production use critical package)
    const criticalCSS = this.extractMatchingRules(css, criticalSelectors);

    if (criticalCSS.length < this.config.criticalCSSThreshold) {
      const minified = new CleanCSS().minify(criticalCSS).styles;

      // Save critical CSS for inlining
      fs.writeFileSync(
        path.join(__dirname, '../snippets/critical-css.liquid'),
        `<style>${minified}</style>`
      );

      console.log(`✅ Critical CSS extracted: ${minified.length} bytes`);
    } else {
      console.warn('⚠️  Critical CSS exceeds size threshold');
    }
  }

  extractMatchingRules(css, selectors) {
    // Simplified CSS extraction - implement proper CSS AST parsing
    let criticalCSS = '';

    selectors.forEach(selector => {
      const regex = new RegExp(`${selector.replace('*', '[\\w-]+')}[^{}]*{[^}]*}`, 'gi');
      const matches = css.match(regex) || [];
      criticalCSS += matches.join('\n');
    });

    return criticalCSS;
  }

  async optimizeJavaScript() {
    console.log('⚡ Optimizing JavaScript...');

    const jsDir = path.join(__dirname, '../assets');
    const jsFiles = fs
      .readdirSync(jsDir)
      .filter(file => file.endsWith('.js') && !file.includes('.min.'));

    for (const jsFile of jsFiles) {
      const inputPath = path.join(jsDir, jsFile);
      const outputPath = path.join(jsDir, jsFile.replace('.js', '.min.js'));

      try {
        const code = fs.readFileSync(inputPath, 'utf8');
        const result = await minify(code, {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
          },
          mangle: true,
          format: {
            comments: false,
          },
        });

        fs.writeFileSync(outputPath, result.code);
        console.log(`✅ Minified: ${jsFile} -> ${result.code.length} bytes`);
      } catch (error) {
        console.error(`❌ Failed to minify ${jsFile}:`, error.message);
      }
    }
  }

  async generateResourceHints() {
    console.log('🔗 Generating resource hints...');

    const resourceHints = `
<!-- Resource Hints for Performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="//cdn.shopify.com">
<link rel="dns-prefetch" href="//a.klaviyo.com">

<!-- Preload Critical Resources -->
<link rel="preload" as="font" href="{{ 'tamil-font.woff2' | asset_url }}" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="{{ 'logo.svg' | asset_url }}">

<!-- Preload Critical CSS -->
<link rel="preload" as="style" href="{{ 'theme.css' | asset_url }}">
`;

    fs.writeFileSync(
      path.join(__dirname, '../snippets/resource-hints.liquid'),
      resourceHints.trim()
    );

    console.log('✅ Resource hints generated');
  }

  async run() {
    console.log('🚀 Starting performance optimization...\n');

    try {
      await this.optimizeImages();
      await this.extractCriticalCSS();
      await this.optimizeJavaScript();
      await this.generateResourceHints();

      console.log('\n✅ Performance optimization complete!');
      console.log('\nNext steps:');
      console.log('1. Test with Lighthouse');
      console.log('2. Update theme.liquid with critical CSS');
      console.log('3. Implement lazy loading');
      console.log('4. Add resource hints to head');
    } catch (error) {
      console.error('❌ Optimization failed:', error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  new PerformanceOptimizer().run();
}

module.exports = PerformanceOptimizer;
```

### Critical CSS Integration (layout/theme.liquid)

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <!-- Resource Hints -->
  {% render 'resource-hints' %}

  <!-- Critical CSS (Inlined) -->
  {% render 'critical-css' %}

  <!-- Non-critical CSS (Async) -->
  <link rel="preload" href="{{ 'theme.css' | asset_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="{{ 'theme.css' | asset_url }}"></noscript>

  <!-- Font Loading Strategy -->
  <link rel="preload" href="{{ 'tamil-font.woff2' | asset_url }}" as="font" type="font/woff2" crossorigin>

  <style>
    /* Font loading optimization */
    @font-face {
      font-family: 'Tamil';
      src: url('{{ 'tamil-font.woff2' | asset_url }}') format('woff2');
      font-display: swap;
    }

    /* Layout shift prevention */
    img, video {
      height: auto;
      max-width: 100%;
    }

    .aspect-ratio-16-9 {
      aspect-ratio: 16/9;
    }

    .aspect-ratio-4-3 {
      aspect-ratio: 4/3;
    }

    .aspect-ratio-1-1 {
      aspect-ratio: 1/1;
    }
  </style>

  {{ content_for_header }}
</head>
<body class="{{ template.name }}">
  {{ content_for_layout }}

  <!-- JavaScript Loading Strategy -->
  <script>
    // Critical JS inline for immediate execution
    (function() {
      // Web font loading optimization
      if ('fonts' in document) {
        document.fonts.load('1em Tamil').then(function() {
          document.documentElement.classList.add('fonts-loaded');
        });
      }

      // Intersection Observer polyfill check
      if (!('IntersectionObserver' in window)) {
        var script = document.createElement('script');
        script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
        document.head.appendChild(script);
      }
    })();
  </script>

  <!-- Non-critical JS (Async) -->
  <script src="{{ 'theme.min.js' | asset_url }}" async></script>

  {{ 'app.js' | asset_url | script_tag: 'async' }}
</body>
</html>
```

### Image Optimization Component (snippets/responsive-image.liquid)

```liquid
{% comment %}
  Responsive image with WebP support and lazy loading

  Usage:
  {% render 'responsive-image',
     image: product.featured_image,
     sizes: '(max-width: 768px) 100vw, 50vw',
     aspect_ratio: '4/3',
     loading: 'lazy' %}
{% endcomment %}

{% assign image = image | default: blank %}
{% assign sizes = sizes | default: '100vw' %}
{% assign aspect_ratio = aspect_ratio | default: 'auto' %}
{% assign loading = loading | default: 'lazy' %}
{% assign alt = alt | default: image.alt | default: '' %}

{% if image != blank %}
  <picture class="responsive-image">
    <!-- WebP sources -->
    <source media="(max-width: 768px)"
            srcset="
              {{ image | img_url: '400x400' | replace: '.jpg', '.webp' | replace: '.png', '.webp' }} 400w,
              {{ image | img_url: '600x600' | replace: '.jpg', '.webp' | replace: '.png', '.webp' }} 600w
            "
            type="image/webp">

    <source media="(min-width: 769px)"
            srcset="
              {{ image | img_url: '600x600' | replace: '.jpg', '.webp' | replace: '.png', '.webp' }} 600w,
              {{ image | img_url: '800x800' | replace: '.jpg', '.webp' | replace: '.png', '.webp' }} 800w,
              {{ image | img_url: '1200x1200' | replace: '.jpg', '.webp' | replace: '.png', '.webp' }} 1200w
            "
            type="image/webp">

    <!-- Fallback sources -->
    <source media="(max-width: 768px)"
            srcset="
              {{ image | img_url: '400x400' }} 400w,
              {{ image | img_url: '600x600' }} 600w
            ">

    <source media="(min-width: 769px)"
            srcset="
              {{ image | img_url: '600x600' }} 600w,
              {{ image | img_url: '800x800' }} 800w,
              {{ image | img_url: '1200x1200' }} 1200w
            ">

    <!-- Final img element -->
    <img src="{{ image | img_url: '600x600' }}"
         alt="{{ alt }}"
         sizes="{{ sizes }}"
         loading="{{ loading }}"
         decoding="async"
         {% if aspect_ratio != 'auto' %}
           style="aspect-ratio: {{ aspect_ratio }}"
         {% endif %}
         class="w-full h-auto object-cover">
  </picture>
{% else %}
  <!-- Placeholder for missing images -->
  <div class="responsive-image-placeholder bg-gray-200 flex items-center justify-center"
       {% if aspect_ratio != 'auto' %}
         style="aspect-ratio: {{ aspect_ratio }}"
       {% endif %}>
    <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
    </svg>
  </div>
{% endif %}
```

### Lazy Loading Implementation (assets/lazy-loading.js)

```javascript
class LazyLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }

  setupIntersectionObserver() {
    const imageObserverConfig = {
      rootMargin: '50px 0px',
      threshold: 0.01,
    };

    this.imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, imageObserverConfig);

    // Observe all lazy images
    this.observeImages();
  }

  observeImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  loadImage(img) {
    // Handle responsive images with srcset
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }

    if (img.dataset.src) {
      img.src = img.dataset.src;
    }

    img.classList.add('loaded');

    // Fade in animation
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
  }

  loadAllImages() {
    // Fallback for browsers without IntersectionObserver
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => this.loadImage(img));
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new LazyLoader();
});
```

### Performance Monitoring (assets/performance-monitor.js)

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    if ('performance' in window) {
      this.measureCoreWebVitals();
      this.setupPerformanceObserver();
    }
  }

  measureCoreWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.reportMetric('FID', this.metrics.fid);
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cls = clsValue;
        this.reportMetric('CLS', clsValue);
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  setupPerformanceObserver() {
    // Navigation timing
    window.addEventListener('load', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0];

      this.metrics.ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
      this.metrics.domLoad = navigationTiming.loadEventEnd - navigationTiming.navigationStart;

      this.reportMetric('TTFB', this.metrics.ttfb);
      this.reportMetric('DOM Load', this.metrics.domLoad);

      // Send all metrics after page load
      setTimeout(() => this.sendMetrics(), 1000);
    });
  }

  reportMetric(name, value) {
    console.log(`📊 ${name}: ${Math.round(value)}ms`);

    // Visual indicator for poor performance
    if (this.isMetricPoor(name, value)) {
      console.warn(`⚠️ Poor ${name} performance: ${Math.round(value)}ms`);
    }
  }

  isMetricPoor(name, value) {
    const thresholds = {
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      TTFB: 600,
      'DOM Load': 3000,
    };

    return value > (thresholds[name] || Infinity);
  }

  sendMetrics() {
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      Object.keys(this.metrics).forEach(metric => {
        gtag('event', 'performance_metric', {
          event_category: 'performance',
          event_label: metric,
          value: Math.round(this.metrics[metric]),
        });
      });
    }

    // Send to custom performance endpoint (optional)
    if (window.PERFORMANCE_ENDPOINT) {
      fetch(window.PERFORMANCE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          metrics: this.metrics,
          timestamp: Date.now(),
        }),
      }).catch(err => console.warn('Performance data upload failed:', err));
    }
  }
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
  new PerformanceMonitor();
});
```

## Package.json Scripts

```json
{
  "scripts": {
    "perf:optimize": "node scripts/performance-optimize.js",
    "perf:test": "lighthouse --chrome-flags='--headless' --output=json --output-path=./lighthouse-report.json",
    "perf:budget": "lighthouse --budget-path=./performance-budget.json",
    "perf:ci": "npm run perf:optimize && npm run perf:test",
    "images:optimize": "find assets -name '*.{jpg,png}' -exec imageoptim {} \\;",
    "css:critical": "critical --src template.html --dest critical.css",
    "js:analyze": "webpack-bundle-analyzer dist/stats.json"
  }
}
```

## Performance Budget (performance-budget.json)

```json
{
  "budget": [
    {
      "resourceType": "total",
      "budget": 500
    },
    {
      "resourceType": "image",
      "budget": 200
    },
    {
      "resourceType": "script",
      "budget": 100
    },
    {
      "resourceType": "stylesheet",
      "budget": 50
    },
    {
      "resourceType": "font",
      "budget": 30
    }
  ]
}
```

## Definition of Done

- [ ] Lighthouse mobile performance score ≥90
- [ ] Core Web Vitals meet Google's "Good" thresholds
- [ ] Images optimized and converted to WebP
- [ ] Critical CSS extracted and inlined
- [ ] JavaScript code split and minified
- [ ] Font loading optimized
- [ ] Lazy loading implemented for below-fold content
- [ ] Performance monitoring in place

## Dependencies

- Image optimization tools (Sharp, ImageOptim)
- Build process integration
- Lighthouse CI setup
- Performance monitoring infrastructure

## Files Created/Modified

- `scripts/performance-optimize.js`
- `snippets/critical-css.liquid`
- `snippets/resource-hints.liquid`
- `snippets/responsive-image.liquid`
- `assets/lazy-loading.js`
- `assets/performance-monitor.js`
- `layout/theme.liquid` (performance updates)
- `performance-budget.json`

## Testing & Validation

- [ ] Lighthouse audits on all major pages
- [ ] Real device testing (3G throttling)
- [ ] Performance regression testing
- [ ] Bundle size monitoring
- [ ] Core Web Vitals tracking in production

## Estimate Breakdown

- Performance optimization scripts: 2 hours
- Critical CSS extraction: 1 hour
- Image optimization implementation: 1 hour
- Monitoring and testing setup: 1 hour
- **Total: 5 story points**
