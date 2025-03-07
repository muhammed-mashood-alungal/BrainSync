// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          archivo: ['var(--font-archivo)', 'sans-serif'],
        }
      },
        colors: {
            'main': '#e002a2',
            'second': '#47019d',
            'three': '#e00256',
            'black': '#212121',
            'white': '#ffffff',
            'gray': '#808080e2'
          }
    },
    plugins: [],
  };