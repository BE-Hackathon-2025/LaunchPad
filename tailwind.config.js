/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFF8F0',
        primary: {
          DEFAULT: '#F44336',
          hover: '#D32F2F',
        },
        secondary: {
          DEFAULT: '#1565C0',
          hover: '#0D47A1',
        },
        accent: {
          orange: '#FFB74D',
          pink: '#F06263',
          cream: '#F4E1C1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
