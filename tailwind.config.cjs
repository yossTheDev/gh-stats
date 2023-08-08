/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,svelte}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        light: {
          primary: "#fcfbb3",

          secondary: "#abfcc1",

          accent: "#1D4ED8",

          neutral: "#252d31",

          "base-100": "#f3f4f6",
          "base-200": "#dddddd",

          info: "#38a5dc",

          success: "#229187",

          warning: "#cf7507",

          error: "#fc4a27",
        },

        dark: {
          primary: "#fcfbb3",

          secondary: "#abfcc1",

          accent: "#1D4ED8",

          neutral: "#252d31",

          "base-100": "#141414",
          "base-200": "#1D1D1D",

          info: "#38a5dc",

          success: "#229187",

          warning: "#cf7507",

          error: "#fc4a27",
        },
      },
    ],
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
};
