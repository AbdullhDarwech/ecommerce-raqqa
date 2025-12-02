/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  darkMode: 'class', // تفعيل الوضع الليلي

  theme: {
    extend: {
      colors: {
        // مجموعة raqqa
        raqqa: {
          sand: '#D3D3D3',
          river: '#4682B4',
          green: '#228B22',
        },

        // مجموعة syrazo
        syrazo: {
          yellow: '#FFD700',
          blue: '#1E90FF',
          green: '#32CD32',
        },

        // ألوان فردية
        'raqqa-sand': '#F7EFD9',
        'raqqa-river': '#0B5D6B',
        'raqqa-green': '#16A34A',

        'syrazo-blue': '#0ea5e9',
        'syrazo-yellow': '#F59E0B',
      },

      // خط عربي
      fontFamily: {
        amiri: ['Amiri', 'serif'],
      },
    },
  },

  plugins: [],
};
