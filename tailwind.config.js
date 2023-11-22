/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            borderColor: {
                boda: {
                    a: "linear-gradient(to right, #FF5733, #6C5B7B)"
                }
            },
            backgroundImage: {
                "btn-bg":
                    "linear-gradient(90deg, rgba(0, 145, 215, 0.4), rgba(0, 145, 215, 1), rgba(254, 15, 212, 1))"
            },
            backgroundColor: {
                "aduio-bg": "#21232C",
                "detail-bg": "#03061B"
            },
            width: {
                "nft-w": "14.64194rem",
                "nft-card-w": "16.16138rem"
            },
            height: {
                "nft-h": "13.05344rem",
                "nft-card-h": "22.23913rem",
                76: "76px"
            }
        }
    },

    plugins: [require("tailwindcss-gradients")]
};
