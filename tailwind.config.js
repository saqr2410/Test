/** @type {import('tailwindcss').Config} */

export default {

    content: [

        "./index.html",

        "./src/**/*.{js,jsx,ts,tsx}",

    ],

    theme: {

        extend: {

            colors: {

                primary: "#5B2A86",

                secondary: "#6D28D9",

                light: "#F5F3FF",

                background: "#F8F8FC",

                border: "#E5E7EB",

                success: "#22C55E",

                danger: "#EF4444",

                dark: "#1F2937",

            },

            fontFamily: {

                alex: ["Alexandria", "sans-serif"],

            },

            boxShadow: {

                card: "0 10px 30px rgba(91,42,134,.10)",

                navbar: "0 10px 30px rgba(0,0,0,.08)",

            },

            borderRadius: {

                xl2: "18px",

            },

        },

    },

    plugins: [],

};