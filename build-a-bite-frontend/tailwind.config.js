/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        farmGreenLight: '#A8E6A1',
        farmGreen: '#53B175',
        farmGreenDark: '#3D8B35',
        skyBlue: '#83C5FF',
        sunnyYellow: '#FFEA65',
        earthBrown: '#8B5E3C',
        softWhite: '#FFFDF9',
      },
      fontFamily: {
        // Use kid-friendly fun fonts, e.g., Baloo or Comic Sans fallback
        kidsFont: ['"Baloo 2"', 'Comic Sans MS', 'cursive', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
