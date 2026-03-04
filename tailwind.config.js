/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black': '#0D0D0D',
        'white': '#FFFFFF',
        'stormy': '#34656D',
        'vanilla': '#F1E5AC',
        'golden': '#B69A45',
        'bone': '#D1CCC0',
        'blue': '#6B99A1',
        'gunmetal': '#2C3032',
      },
      fontFamily: {
        branding: ['"Krona One"', 'sans-serif'],
      }
    }
  },
  plugins: []
}

