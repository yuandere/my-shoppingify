/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        fadeInFromLeft: 'fadeInFromLeft 0.3s ease-in-out forwards',
        fadeInFromBottom: 'fadeInFromBottom 0.3s ease-in-out forwards',
        opacityIn: 'opacityIn 0.2s ease-in-out forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'center': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      colors: {
        'theme-1': '#f9a109',
        'warning': '#eb5757',
        'complete': '#56ccf2',
      },
      fontFamily: {
        sans: ['var(--font-poppins)'],
      },
      keyframes: {
        fadeInFromLeft: {
          '0%': { opacity: 0, transform: 'translateX(-50%)' },
          '100%': { opacity: 1, transform: 'translateX(0%)' }
        },
        fadeInFromBottom: {
          '0%': { opacity: 0, transform: 'translateY(50%)' },
          '100%': { opacity: 1, transform: 'translateY(0%)' }
        },
        opacityIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 0.5 }
        }
      },
      screens: {
        'xs': '450px'
      }
    },
  },
  plugins: [],
}
