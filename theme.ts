"use client";

// variables
export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    // '--mantine-hero-height': theme.other.heroHeight,
  },
  light: {
    '--soundwork-hover-one': "rgb(241 245 249 / 1)",
    '--soundwork-hover-gradient': "",
  },
  dark: {
    '--soundwork-hover-one': "#34354a",
    '--soundwork-hover-gradient': "",
  },
});



import { Button, rem, createTheme, CSSVariablesResolver } from '@mantine/core';

export const theme = createTheme({
  components: {
    Button: Button.extend({
      vars: (theme, props) => {
        if (props.variant === 'primary') {
          return {
            root: {
              '--button-bg': "black"
              // '--button-height': rem(60),
              // '--button-padding-x': rem(30),
              // '--button-fz': rem(24),
            },
          };
        }

        // if (props.size === 'xxs') {
        //   return {
        //     root: {
        //       '--button-height': rem(24),
        //       '--button-padding-x': rem(10),
        //       '--button-fz': rem(10),
        //     },
        //   };
        // }

        return { root: {} };
      },
    }),
  },
});