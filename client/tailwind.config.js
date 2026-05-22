/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      Poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#FD3D57",
        secondary: "#232830",
        neu: {
          50: "#f0f2f5",
          100: "#e4e7ec",
          200: "#d1d5db",
          300: "#b0b7c3",
          400: "#8a94a6",
          500: "#6b7588",
          600: "#555e6e",
          700: "#484f5c",
          800: "#3e434d",
          900: "#373b43",
        },
      },
      boxShadow: {
        "neu": "9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5)",
        "neu-sm": "5px 5px 10px rgba(163, 177, 198, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.5)",
        "neu-xs": "3px 3px 6px rgba(163, 177, 198, 0.5), -3px -3px 6px rgba(255, 255, 255, 0.4)",
        "neu-inset": "inset 5px 5px 10px rgba(163, 177, 198, 0.6), inset -5px -5px 10px rgba(255, 255, 255, 0.5)",
        "neu-inset-sm": "inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.4)",
        "neu-colored": "7px 7px 14px rgba(253, 61, 87, 0.3), -7px -7px 14px rgba(255, 255, 255, 0.5)",
        "neu-colored-sm": "4px 4px 8px rgba(253, 61, 87, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.4)",
        "neu-dark": "5px 5px 10px rgba(0, 0, 0, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.05)",
        "neu-dark-sm": "3px 3px 6px rgba(0, 0, 0, 0.25), -3px -3px 6px rgba(255, 255, 255, 0.04)",
      },
    },
  },
  plugins: [],
};
