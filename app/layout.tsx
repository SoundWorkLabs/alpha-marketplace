import React from "react";
import { MantineProvider, ColorSchemeScript, Group, Badge, Button } from "@mantine/core";

import ConnectWallet from "./components/connect";
import { Wallet } from "./components/Wallet";
import CustomPill from "./components/pill";

import { theme } from "../theme";
import { SideNav } from "./components/nav";

import './globals.css';
import "@mantine/core/styles.css";
import '@solana/wallet-adapter-react-ui/styles.css';
export const metadata = {
  title: "Soundwork",
  description: "soundwork web app!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Wallet>
            <div className="flex">
              <nav>
                <SideNav />
              </nav>
              <main className="w-screen">
                <div className="flex justify-end p-5 ">
                  <Group>
                    <CustomPill label="Create Music" color="transparent" />
                    <CustomPill label="SOL" color="transparent" />
                    <CustomPill label="SOL" color="transparent">
                      <ConnectWallet />
                    </CustomPill>
                  </Group>
                </div>
                {children}
              </main>
            </div>
          </Wallet>
        </MantineProvider>

      </body>
    </html >
  );
}
