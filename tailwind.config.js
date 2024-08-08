/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/primereact/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'us': '504px',
      'xs': '600px',
      'sm': '640px',
      'md': '768px',
      'mob': '941px',
      'lg': '1130px',
      'xl': '1280px',
      '2xl': '1536px',
      'custom': '1750px',
    },
    extend: {
      zIndex: {
        '3000': '3000',
        '5000': '5000',
      },
      extend: {
        gridAutoFlow: ['dense'],
        borderWidth: ['focus'],
        borderColor: ['focus'],
        borderRadius: ['focus'],
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        }
      },
      backdropBlur: {
        lg: '16px z-10',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mulish: ['Mulish', 'sans-serif'],
      },
      fontSize: {
        '7xs': '8px',
        '6xs': '10px',
        '5xs': '12px',
        '4xs': '14px',
        '3xs': '16px',
        '2xs': '18px',
        'xs': '20px',
      },
      colors: {
        'primary-50': '#88BDBC',
        'primary-100': '#b6c4c3',
        'primary-200': '#56a4a1',
        'primary-300': '#39988a',
        'primary-400': '#0c6761',
        'primary-500': '#168f8a',
        'primary-600': '#A1C7C7',
        'primary-700': '#38747a',
        'primary-800': '#055564',
        'primary-900': '#0294a5',
        'secondary-50': '#270101',
        'secondary-100': '#1256a9',
        'secondary-300': '#7a96b4',
        'secondary-400': '#104e6e',
        'secondary-500': '#00809D6B',
        'secondary-600': '#77A8A3',
        'secondary-700': '#1D323F',
        'secondary-800': '#03353e',
        'secondary-900': '#04060f',
        'primary-orange': '#FF5722',
        customIndigo: {
          DEFAULT: '#5c6ac4',
          hover: '#4a56a0',
          active: '#3b4479',
        },
        customBlue: {
          DEFAULT: '#4299e1',
          hover: '#3182ce',
          active: '#2b6cb0',
        },
        customAmber: {
          DEFAULT: '#d69e2e',
          hover: '#b7791f',
          active: '#975a16',
        },
        customRed: {
          DEFAULT: '#f56565',
          hover: '#e53e3e',
          active: '#c53030',
        },
        titaniumGreen: {
          DEFAULT: '#6C7D47',  // Основной цвет зеленого титана
          hover: '#5A6938',    // Цвет при наведении
          active: '#4A5730',   // Цвет при активации
        },
        titaniumBlue: {
          DEFAULT: '#4A5E75',  // Основной цвет синего титана
          hover: '#3B4D60',    // Цвет при наведении
          active: '#2E3D4A',   // Цвет при активации
        },
        titaniumAmber: {
          DEFAULT: '#7C6E43',  // Основной цвет янтарного титана
          hover: '#6B5D38',    // Цвет при наведении
          active: '#5A4D30',   // Цвет при активации
        },
        titaniumRed: {
          DEFAULT: '#7A4443',  // Основной цвет красного титана
          hover: '#693938',    // Цвет при наведении
          active: '#583030',   // Цвет при активации
        },
      },
    },
  },
  plugins: [],
}
