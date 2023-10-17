/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            backgroundColor: {
                "aduio-bg": "#21232C",
                "btn-bg": "#0091D7",
                "btn-bg1": "#FE0FD4",
                "detail-bg": "#03061B"
            },
            width: {
                234.27: "234.27px"
            },
            height: {
                208.85: "208.85px"
            }
        }
    },
    plugins: []
};
