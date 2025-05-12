export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["bg-primary", "text-primary"],
  theme: {
    extend: {
      colors: {
        primary: { 100: "#2B85FF" },
      },
    },
  },
  plugins: [],
};
