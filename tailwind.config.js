const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/react/**/*.js',
    './resources/react/**/*.jsx',
    './resources/react/**/*.ts',
    './resources/react/**/*.tsx',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', ...defaultTheme.fontFamily.sans],
      },
    },
  },

  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },

  corePlugins: {
    fontFamily: false,
  },
  plugins: [require('@tailwindcss/forms')],
};
