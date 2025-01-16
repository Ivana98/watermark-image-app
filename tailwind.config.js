/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        xs: '0px 2px 8px 0px rgba(74, 85, 120, 0.12)',
        sm: '0px 2px 12px 0px rgba(74, 85, 120, 0.16)',
        md: '0px 2px 24px 0px rgba(74, 85, 120, 0.16)',
        lg: '0px 2px 40px 0px rgba(74, 85, 120, 0.16)',
        xl: '0px 2px 52px 0px rgba(74, 85, 120, 0.20)',
        '2xl': '0px 2px 64px 0px rgba(74, 85, 120, 0.24)',
      },
    },
  },
  plugins: [],
};
