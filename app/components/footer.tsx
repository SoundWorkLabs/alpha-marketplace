import { Box } from "@mantine/core";
import Link from "next/link";

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
        <Box className="border-t-2 py-3">
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
