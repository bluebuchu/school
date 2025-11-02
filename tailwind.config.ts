/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        beige: "#E6DDD4",
        softOrange: "#E6B891",
        calmBrown: "#6B8E6B",
        skyBlue: "#87CEEB",
        cloudWhite: "#F8F9FA",
        sageGreen: "#6B8E6B",
        softGray: "#D3D9E0",
        warmBeige: "#E6DDD4",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
        noto: ["Noto Sans KR", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'fade-in-delay': 'fadeIn 1.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};