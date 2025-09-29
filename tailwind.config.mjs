/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{liquid,js,ts,jsx,tsx}',
    './src/**/*.{html,htm}',
    './src/**/*.liquid',
    './src/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        // Tamil Brand Color Palette
        'deep-maroon': '#6A1B1B',
        gold: '#D4AF37',
        'charcoal-black': '#1C1C1C',
        'cream-white': '#FDF6EC',
        'muted-teal': '#3A6A6A',

        // Extended brand colors
        'tamil-red': '#8B0000',
        'temple-gold': '#FFD700',
        saffron: '#FF9933',
        ash: '#4A4A4A',
        silk: '#F5F5DC',

        // Semantic colors
        primary: {
          50: '#FDF6EC',
          100: '#F7E4D3',
          200: '#E8C4A0',
          300: '#D4A574',
          400: '#C19660',
          500: '#8B4513',
          600: '#6A1B1B',
          700: '#4A0F0F',
          800: '#2D0909',
          900: '#1A0505',
        },
        secondary: {
          50: '#FFFBF0',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D4AF37',
          600: '#B8941F',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
      },
      fontFamily: {
        tamil: ['Latha', 'Adyuthan Tamil', 'Noto Sans Tamil', 'serif'],
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'tamil-sm': ['0.875rem', { lineHeight: '1.5' }],
        'tamil-base': ['1rem', { lineHeight: '1.6' }],
        'tamil-lg': ['1.125rem', { lineHeight: '1.6' }],
        'tamil-xl': ['1.25rem', { lineHeight: '1.5' }],
        'tamil-2xl': ['1.5rem', { lineHeight: '1.4' }],
        'tamil-3xl': ['1.875rem', { lineHeight: '1.3' }],
        'tamil-4xl': ['2.25rem', { lineHeight: '1.2' }],
      },
      spacing: {
        tamil: '0.5rem',
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '3/4': '75%',
      },
      borderRadius: {
        tamil: '0.25rem',
        temple: '0.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'tamil-pattern':
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: ['@tailwindcss/typography'],
  corePlugins: {
    preflight: false, // Disable preflight to avoid conflicts with Shopify's base styles
  },
};
