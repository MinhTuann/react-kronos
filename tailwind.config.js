/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#34656D',
        'secondary': '#F1E5AC',
        'tertiary': '#D1CCC0',
        'quaternary': '#6B99A1',
        'black': '#0D0D0D',
        'white': '#FFFFFF',
      },
      // colors: {
      //   'primary': '#34656D',
      //   'secondary': '#334443',
      //   'tertiary': '#C98986',
      //   'black': '#0D0D0D',
      //   'white': '#FFFFFF',
      // },
    },
  },
  plugins: [],
}

