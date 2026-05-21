/** @type {import('tailwindcss').Config} */
export default {
  // Aggiungi questa riga:
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cinzel': ['"Cinzel"', 'serif'],
        'cinzel-dec': ['"Cinzel Decorative"', 'serif'],
        'crimson': ['"Crimson Text"', 'serif'],
        'display': ['"Cinzel Decorative"', 'serif'],
      }
    }
  }
}