module.exports = {
  extends: [
    'plugin:astro/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  plugins: ['tailwindcss'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {},
    },
  ],
}
