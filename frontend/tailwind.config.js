/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        floating: "floating 6s ease-in-out infinite",
        floatingSlow: "floating-slow 9s ease-in-out infinite",
        zoomIn: "zoomIn 1s ease-out forwards",
        slideInLeft: "slideInLeft 0.5s ease-out forwards",
      },
      keyframes: {
        floating: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
          "100%": { transform: "translateY(0)" },
        },
        floatingSlow: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0)" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.8)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
