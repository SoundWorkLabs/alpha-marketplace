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
import { WalletContextProvider } from "./context/WalletContextProvider";

import { AudioProvider } from "./context/audioPlayerContext";
import { PlaylistProvider } from "./context/playlistProviderContext";

import { headers } from "next/headers";
import HomePage from "./page";

export const metadata = {
    title: "Soundwork",
    description: "soundwork web app!"
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const pathname = headers().get("x-invoke-path") || "";
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
            <body className="bg-[#020415] bg-sw-bg text-white">
                <MantineProvider>
                    <Wallet>
                        <WalletContextProvider>
                            {pathname === "/" ? (
                                <AudioProvider>
                                    <PlaylistProvider>
                                        <HomePage />
                                    </PlaylistProvider>
                                </AudioProvider>
                            ) : (
                                <>
                                    <div className="flex p-0 m-0">
                                        <nav>
                                            <SideNav />
                                        </nav>
                                        <main className="w-screen">
                                            <div className="flex justify-end p-5 ">
                                                <Group>
                                                    <Link
                                                        href="/create"
                                                        passHref
                                                    >
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
                                            <AudioProvider>
                                                <PlaylistProvider>
                                                    {children}
                                                </PlaylistProvider>
                                            </AudioProvider>

                                            <Toaster position="bottom-center" />
                                        </main>
                                    </div>

                                    <footer className="text-white">
                                        <Footer />
                                    </footer>
                                </>
                            )}
                        </WalletContextProvider>
                    </Wallet>
                </MantineProvider>
            </body>
        </html>
    );
}
