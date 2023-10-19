"use client";

// variables
export const resolver: CSSVariablesResolver = (theme) => ({
    variables: {},
    light: {
        "--soundwork-hover-one": "rgb(241 245 249 / 1)",
        "--soundwork-hover-gradient": "",
        "--mantine-color-text": "#FFFFFF"
        // "--mantine-font-family": "#Lexend"
    },
    dark: {
        "--soundwork-hover-one": "#34354a",
        "--soundwork-hover-gradient": "",
        "--mantine-color-text": "#FFFFFF"
        // "--mantine-font-family": "#Lexend"
        // "--mantine-color-body":
        //     "linear-gradient(90deg, rgba(0, 145, 215, 1), rgba(254, 15, 212, 1))"
    }
});

import { Button, rem, createTheme, CSSVariablesResolver } from "@mantine/core";

export const theme = createTheme({
    components: {
        Button: Button.extend({
            vars: (theme, props) => {
                if (props.variant === "primary") {
                    return {
                        root: {
                            "--button-radius": "0px",
                            "--button-bd": "none",
                            "--button-bg":
                                "linear-gradient(90deg, rgba(0, 145, 215, 1), rgba(254, 15, 212, 1))"
                            // "--button-fz": "16px",
                            // fontFamily: "Inter"
                            // "--button-hover": "2px solid white"
                        }
                    };
                }

                // if (props.size === 'primaryBorder') {
                //   return {
                //     root: {
                //       '--button-radius': '0px',
                //     },
                //   };
                // }
                return { root: {} };
            }
        })
    }
});
