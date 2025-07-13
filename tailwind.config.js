// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        strathmore: {
          blue: '#003366', // Deep blue
          gold: '#FFD700', // Gold/Yellow
          lightBlue: '#E0F2F7', // Very light blue
        },
      },
      // MODIFIED: Corrected path for 'hero-pattern' to point to src/assets/images
      backgroundImage: {
        'hero-pattern': "url('/src/assets/images/hero-bg.jpg')", // Path now points to src/assets/images/
      }
    },
  },
  plugins: [],
};
