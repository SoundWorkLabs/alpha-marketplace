"use client";

import { useEffect, useState } from "react";
import { Group } from "@mantine/core";
import {
    IconCategory,
    IconUserCircle,
    IconHeadphones,
    IconAdjustmentsHorizontal,
    IconHelp
} from "@tabler/icons-react";

import Link from "next/link";
// import { ThemeToggle } from "./themeToggle";
import { usePathname } from "next/navigation";

import SoundWorkLogo, { SoundWorkHeadPhone } from "./icon";

const data = [
    { link: "/explore", label: "Explore", icon: IconCategory },
    { link: "/profile", label: "Profile", icon: IconUserCircle },
    { link: "/sounds", label: "Sounds", icon: SoundWorkHeadPhone }, // todo: use figma svg
    { link: "/music", label: "Music Maker", icon: IconAdjustmentsHorizontal },
    { link: "/help", label: "Help", icon: IconHelp }
];

export function SideNav() {
    const [active, setActive] = useState("Explore");
    const pathname = usePathname();

    const links = data.map((item) => (
        <Link
            className={`nav-btn flex p-2 bg-${
                pathname === item.link ? "slate-600" : "pink"
            } hover:cursor-pointer`}
            href={item.link}
            key={item.label}
        >
            <item.icon className="my-auto" stroke={1.5} />
            <span className="my-auto mx-3">{item.label}</span>
        </Link>
    ));

    return (
        <nav className="w-max border-r-2 h-[100%] bg-[#121426]">
            <div className="flex flex-col justify-between p-5 h-screen">
                <div className="flex flex-col gap-5">
                    <Group className="mt-10 mb-10" justify="center">
                        <Link href="/">
                            <div>
                                <SoundWorkLogo />
                            </div>
                        </Link>
                    </Group>
                    {links}
                </div>

                {/* <div>
                    <a
                        href="#"
                        className="flex gap-5"
                        onClick={(event) => event.preventDefault()}
                    >
                        <span>
                            <ThemeToggle />{" "}
                        </span>
                        <span className="my-auto"></span>
                    </a> */}

                {/* <a href="#" className='flex gap-2'  onClick={(event) => event.preventDefault()}>
                        <span><IconLogout size="0px" stroke={1.5} /></span>
                        <span>Logout</span>
                    </a> */}
                {/* </div> */}
            </div>
        </nav>
    );
}

export function HomeNav() {
    const [scrollPosition, setscrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setscrollPosition(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <nav
            className={
                scrollPosition > 0
                    ? "fixed px-[6.97rem] py-[0.99rem] flex flex-row justify-between items-center w-full h-[5rem] top-0 bg-black z-50 transition ease-in-out delay-150 duration-1000"
                    : "fixed px-[6.97rem] py-[0.99rem] flex flex-row justify-between items-center w-full h-[5rem] top-0 transition ease-in-out delay-150 duration-1000"
            }
        >
            <div
            // className={
            //     scrollPosition > 0
            //         ? "logo-after-scroll"
            //         : "logo-before-scroll"
            // }
            >
                <a href={"#home"} className="nav-link">
                    <SoundWorkLogo
                        className={
                            scrollPosition > 0
                                ? "w-[2.4rem] m-5"
                                : "w-[3.4rem] m-5"
                        }
                    />
                </a>
            </div>
            <div className="flex flex-wrap space-x-[2.31rem] text-[1.25rem] font-[500] leading-normal right-0">
                <div>
                    <a href={"#home"} className="nav-link">
                        Home
                    </a>
                </div>
                <div>
                    <a href={"#how-it-works"} className="nav-link">
                        How it works
                    </a>
                </div>
                <div>
                    <a href={"#market-place"} className="nav-link">
                        Marketplace
                    </a>
                </div>
                <div>
                    <a href={"#features"} className="nav-link">
                        Features
                    </a>
                </div>
                <div
                    onClick={() => {
                        window.open("/explore", "_blank");
                    }}
                >
                    App
                </div>
            </div>
        </nav>
    );
}
