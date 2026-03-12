/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF8',
          100: '#FFF8F0',
          200: '#FFF0E0',
          300: '#FFE8D0',
          400: '#F8DCC0',
          500: '#E8C8A0',
          600: '#C8A880',
          700: '#A08060',
          800: '#785840',
          900: '#503020',
        },
        warm: {
          50: '#FFF8F5',
          100: '#FFF0EA',
          200: '#FFE0D4',
          300: '#F8C8B4',
          400: '#E8A88C',
          500: '#D08868',
          600: '#B06848',
          700: '#8A4830',
          800: '#643020',
          900: '#3E1810',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 16px rgba(120, 80, 40, 0.06)',
        'soft-md': '0 4px 24px rgba(120, 80, 40, 0.08)',
        'soft-lg': '0 8px 32px rgba(120, 80, 40, 0.1)',
        'soft-xl': '0 12px 48px rgba(120, 80, 40, 0.12)',
        'glow': '0 0 20px rgba(120, 80, 40, 0.15)',
      },
    },
  },
  plugins: [],
}
