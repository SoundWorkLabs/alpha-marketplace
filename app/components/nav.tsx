"use client";

import { useState } from "react";
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

import SoundWorkLogo from "./icon";

const data = [
    { link: "/", label: "Explore", icon: IconCategory },
    { link: "/profile", label: "Profile", icon: IconUserCircle },
    { link: "/sounds", label: "Sounds", icon: IconHeadphones }, // todo: use figma svg
    { link: "/music", label: "Music Maker", icon: IconAdjustmentsHorizontal },
    { link: "/help", label: "Help", icon: IconHelp }
];

export function SideNav() {
    const [active, setActive] = useState("Explore");
    const pathname = usePathname();

    const links = data.map((item) => (
        <Link
            className={`flex p-2 bg-${
                pathname === item.link ? "slate-600" : "pink"
            } hover:cursor-pointer hover:bg-[var(--soundwork-hover-one)]`}
            href={item.link}
            key={item.label}
        >
            <item.icon className="my-auto" stroke={1.5} />
            <span className="my-auto mx-3">{item.label}</span>
        </Link>
    ));

    return (
        <nav className="w-max border-r-2 h-[100%]">
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
