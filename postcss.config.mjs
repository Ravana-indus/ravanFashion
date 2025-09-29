export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {
      overrideBrowserslist: ['last 2 versions', 'ie >= 11', 'ios >= 9', 'android >= 4.4'],
    },
  },
};
