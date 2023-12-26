"use client";
import { Box } from "@mantine/core";
import SoundWorkLogo from "./components/icon";
import Explore from "./explore/page";
import Image from "next/image";
import Link from "next/link";
import HowItWorks from "./components/HowItWorks";
import { useEffect } from "react";
import Marketplace from "./components/Marketplace";
import Features from "./components/Features";
import { HomeFooter } from "./components/footer";
import Home from "./components/Home";
import { HomeNav } from "./components/nav";
// import { Button } from '@mantine/core';
// import { useWallet } from '@solana/wallet-adapter-react';

export default function HomePage() {
    useEffect(() => {
        document.querySelectorAll(".nav-link").forEach((anchor: Element) => {
            anchor.addEventListener(
                "click",
                function (this: HTMLAnchorElement, e) {
                    e.preventDefault();

                    const targetId = this?.getAttribute("href")?.substring(1);

                    if (targetId) {
                        document.getElementById(targetId)?.scrollIntoView({
                            behavior: "smooth"
                        });
                    }
                }
            );
        });
    }, []);
    return (
        <Box className="home bg-[#020415]">
            <HomeNav />
            <Box className="overflow-hidden">
                <Home />
                <HowItWorks />
                <Marketplace />
                <Features />
                <HomeFooter />
            </Box>
        </Box>
    );
}
