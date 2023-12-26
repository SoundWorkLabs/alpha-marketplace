import { Box } from "@mantine/core";
import Link from "next/link";
import SoundWorkLogo from "./icon";
import {
    IconBrandDiscord,
    IconBrandGmail,
    IconBrandLinkedin,
    IconBrandTelegram,
    IconBrandTwitter
} from "@tabler/icons-react";

export default function Footer() {
    let footerLinks = [
        {
            link: "#",
            label: "Terms & Conditions"
        },
        {
            link: "#",
            label: "Privacy"
        },
        {
            link: "#",
            label: "Collection Statement"
        },
        {
            link: "#",
            label: `Soundwork © ${new Date().getFullYear()}`
        }
    ];
    return (
        <Box className="border-t-2 py-3 bg-[#121426]">
            <Box className="flex justify-center wrap">
                {footerLinks.map((data, index) => (
                    <Link
                        href={data.link}
                        className="my-auto hover:cursor-pointer"
                        key={index}
                    >
                        {data.label}
                        {index < footerLinks.length - 1 && (
                            <span className="my-auto mx-[1vw]">|</span>
                        )}
                    </Link>
                ))}
            </Box>
        </Box>
    );
}

export function HomeFooter() {
    return (
        <div className="bg-gradient-to-r from-[#340E42] to-[#FE0FD4] w-full h-full flex flex-wrap justify-around px-[6.97rem] pt-[3.69rem] space-y-[2.62rem] space-x-[5.07rem]">
            <SoundWorkLogo className="w-[9.5rem] h-[11.4375rem] flex-shrink-0" />
            <div>
                <div className="text-[1rem] font-[500] leading-normal py-5">
                    Important links
                </div>
                <div className="text-[.85rem] font-[400] leading-normal flex flex-col space-y-1">
                    <a href="#home" className="nav-link">
                        Home
                    </a>
                    <a href="#market-place" className="nav-link">
                        Marketplace
                    </a>
                    <div
                        onClick={() => {
                            window.open("/explore", "_blank");
                        }}
                    >
                        App
                    </div>
                    <a href="#" className="nav-link">
                        Who we are?
                    </a>
                </div>
            </div>
            <div>
                <div className="text-[1rem] font-[500] leading-normal py-5">
                    Contact Us
                </div>
                <div className="text-[.85rem] font-[600] leading-normal space-y-1">
                    <div className="flex flex-wrap space-x-3">
                        <div className="font-bold">Phone:</div>
                        {/* update with actual number  */}
                        <div>+12 123 563 4567</div>
                    </div>
                    <div className="flex flex-wrap space-x-3">
                        <div className="font-bold">Email:</div>
                        <div>official@soundwork.com</div>
                    </div>
                </div>
            </div>
            <div>
                <div className="text-[1rem] font-[500] leading-normal py-5">
                    Follow Us
                </div>
                <div className="flex flex-wrap space-x-5">
                    <IconBrandDiscord size={"1.93669rem"} stroke={".089rem"} />
                    <IconBrandTelegram size={"1.93669rem"} stroke={".089rem"} />
                    <IconBrandTwitter size={"1.93669rem"} stroke={".089rem"} />
                    <IconBrandGmail size={"1.93669rem"} stroke={".089rem"} />
                    <IconBrandLinkedin size={"1.93669rem"} stroke={".089rem"} />
                </div>
            </div>
            <div className="flex items-baseline text-[1rem] font-[500] leading-normal">
                Copyright © 2023, All rights reserved.
            </div>
        </div>
    );
}
