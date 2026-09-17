/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8edf5',
          100: '#c5d0e6',
          200: '#9eb3d4',
          300: '#7796c2',
          400: '#587fb5',
          500: '#1a2a6c',
          600: '#16245e',
          700: '#111d4e',
          800: '#0d163e',
          900: '#08102e',
          950: '#050a1e',
        },
        gold: {
          50: '#fdf8f0',
          100: '#f5e6ca',
          200: '#ead4a0',
          300: '#dcc07a',
          400: '#c9a84c',
          500: '#b8963a',
          600: '#a8893a',
          700: '#8a6f2e',
          800: '#6b5522',
          900: '#4d3b16',
        },
      },
    },
  },
  plugins: [],
};