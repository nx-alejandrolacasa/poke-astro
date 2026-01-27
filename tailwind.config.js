/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Pastel color palette
        primary: {
          DEFAULT: '#8BADD9',
          50: '#F5F7FB',
          100: '#E8EEF7',
          200: '#D1DDEF',
          300: '#B4C9E5',
          400: '#8BADD9',
          500: '#7A9FD1',
          600: '#6B8FC4',
          700: '#5A7DB0',
          800: '#4A6A99',
          900: '#3A5580',
        },
        pastel: {
          blue: '#8BADD9',
          purple: '#B8A9D9',
          pink: '#E8B4C8',
          rose: '#E8A9A9',
          green: '#A3D9C9',
          teal: '#8ED1C5',
          yellow: '#F0D9A0',
          orange: '#F0C4A0',
          red: '#E8A9A9',
        },
      },
    },
  },
  plugins: [],
}
