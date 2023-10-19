import React from "react";
import { MantineProvider, ColorSchemeScript, Group } from "@mantine/core";

import ConnectWallet from "./components/connect";
import { Wallet } from "./components/Wallet";
import CustomPill from "./components/pill";

// import { resolver, theme } from "../theme";
import { SideNav } from "./components/nav";

import "./globals.css";
import "@mantine/core/styles.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import Link from "next/link";
import Footer from "./components/footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
    title: "Soundwork",
    description: "soundwork web app!"
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                {/* <ColorSchemeScript /> */}
                <link rel="shortcut icon" href="/favicon.svg" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </head>
            <body className="bg-sw-bg">
                <MantineProvider>
                    <Wallet>
                        <div className="flex text-white">
                            <nav>
                                <SideNav />
                            </nav>
                            <main className="w-screen">
                                <div className="flex justify-end p-5 ">
                                    <Group>
                                        <Link href="/create" passHref>
                                            <CustomPill
                                                label="Create"
                                                color="transparent"
                                            />
                                        </Link>
                                        <CustomPill
                                            label="sol"
                                            color="transparent"
                                        />
                                        <CustomPill color="transparent">
                                            {" "}
                                            {/* // todo: enable user to change network settings here */}
                                            <ConnectWallet />
                                        </CustomPill>
                                    </Group>
                                </div>
                                {children}
                                <Toaster position="bottom-center" />
                            </main>
                        </div>
                        <footer>
                            <Footer />
                        </footer>
                    </Wallet>
                </MantineProvider>
            </body>
        </html>
    );
}
