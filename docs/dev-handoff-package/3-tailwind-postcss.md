# 3) Tailwind & PostCSS

## tailwind.config.js

```js
module.exports = {
  content: [
    './layout/**/*.liquid',
    './templates/**/*.json',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
  ],
  theme: {
    extend: {
      colors: {
        maroon: '#6A1B1B',
        gold: '#D4AF37',
        charcoal: '#1C1C1C',
        cream: '#FDF6EC',
        teal: '#3A6A6A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        tamil: ['Latha', 'Adyuthan Tamil', 'Noto Sans Tamil', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

## postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## assets/theme.css (entry)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Tamil headline utility */
.tamil-font {
  font-family: theme('fontFamily.tamil');
}
```

> Include built CSS in `theme.liquid` (see below). During dev, you can reference `theme.build.css`
> directly.

---
