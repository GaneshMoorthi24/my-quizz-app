/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'card-light': 'var(--color-card-light)',
        'card-dark': 'var(--color-card-dark)',
        'text-light': 'var(--color-text-light)',
        'text-dark': 'var(--color-text-dark)',
        'border-light': 'var(--color-border-light)',
        'border-dark': 'var(--color-border-dark)',
        'background-light': 'var(--color-background-light)',
        'background-dark': 'var(--color-background-dark)',
      },
    },
  },
  plugins: [],
}

