const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'media',
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx,json}'],
  theme: {
    backgroundColor: (theme) => ({
      ...theme('colors'),
      'space-purple-400': 'var(--space-purple-400',
      'space-purple-600': 'var(--space-purple-600)',
      'space-purple-900': 'var(--space-purple-900)',
    }),
    extend: {
      fontWeight: ['hover', 'focus'],
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'space-purple': {
          400: 'var(--space-purple-400',
          600: 'var(--space-purple-600)',
          900: 'var(--space-purple-900)',
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
