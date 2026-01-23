/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3466AF',
          50: '#E8EDF7',
          100: '#D1DBEF',
          200: '#A3B7DF',
          300: '#7593CF',
          400: '#476FBF',
          500: '#3466AF',
          600: '#29528C',
          700: '#1F3D69',
          800: '#142946',
          900: '#0A1423',
        },
      },
    },
  },
  plugins: [],
}
