/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'us': '504px',
      'xs': '600px',
      'sm': '640px',
      'md': '768px',
      'lg': '1130px',
      'xl': '1280px',
      '2xl': '1536px',
      'custom': '1750px',
    },
    extend: {
      extend: {
        gridAutoFlow: ['dense']
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-50': '#88BDBC',
        'primary-100': '#b6c4c3',
        'primary-200': '#56a4a1',
        'primary-300': '#39988a',
        'primary-400': '#0c6761',
        'primary-500': '#168f8a',
        'secondary-100': '#1256a9',
        'secondary-300': '#7a96b4',
        'secondary-400': '#104e6e',
        'secondary-500': '#00809D6B',
        'primary-orange': '#FF5722',
      },
    },
  },
  plugins: [],
}
