import { Box } from "@mantine/core";
import Link from "next/link";
import SoundWorkLogo from "./icon";
import {
    IconBrandDiscord,
    IconBrandGmail,
    IconBrandLinkedin,
    IconBrandTelegram,
    IconBrandX
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
    const email = "info@soundwork.io";
    const phone = "";
    return (
        <div className="bg-gradient-to-r from-[#340E42] to-[#FE0FD4] w-full h-full flex flex-col">
            <div className="flex flex-wrap justify-around px-[6.97rem] py-[3.69rem] space-y-[2.62rem] space-x-[5.07rem]">
                <SoundWorkLogo className="w-[9.5rem] h-[11.4375rem] flex-shrink-0" />
                <div>
                    <div className="text-[1rem] font-[500] leading-normal py-3">
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
                    <div className="text-[1rem] font-[500] leading-normal py-3">
                        Contact Us
                    </div>
                    <div className="text-[.85rem] font-[600] leading-normal space-y-1">
                        <div className="flex flex-wrap space-x-3">
                            <div className="font-bold">Phone:</div>
                            {/* update with actual number  */}
                            <div>
                                {phone === "" ? "+12 123 563 4567" : phone}
                            </div>
                        </div>
                        <div className="flex flex-wrap space-x-3">
                            <div className="font-bold">Email:</div>
                            <div
                                onClick={() => {
                                    window.open(`mailto:${email}`);
                                }}
                            >
                                {email}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="text-[1rem] font-[500] leading-normal py-3">
                        Follow Us
                    </div>
                    <div className="flex flex-wrap space-x-5">
                        <Link
                            href={"https://discord.gg/BKcEnA3r5C"}
                            target="_blank"
                        >
                            <IconBrandDiscord
                                size={"1.93669rem"}
                                stroke={".089rem"}
                            />
                        </Link>

                        <IconBrandTelegram
                            size={"1.93669rem"}
                            stroke={".089rem"}
                        />
                        <Link
                            href={"https://twitter.com/Soundworkio"}
                            target="_blank"
                        >
                            <IconBrandX
                                size={"1.93669rem"}
                                stroke={".089rem"}
                            />
                        </Link>
                        <div
                            onClick={() => {
                                window.open(`mailto:${email}`, "_blank");
                            }}
                        >
                            <IconBrandGmail
                                size={"1.93669rem"}
                                stroke={".089rem"}
                            />
                        </div>
                        <Link
                            href={
                                "https://www.linkedin.com/company/soundworkio/"
                            }
                            target="_blank"
                        >
                            <IconBrandLinkedin
                                size={"1.93669rem"}
                                stroke={".089rem"}
                            />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex justify-center text-[1rem] font-[500] leading-normal border-t-[1px] py-3">
                © 2023 Soundwork , All rights reserved.
            </div>
        </div>
    );
}
