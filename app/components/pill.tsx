import { Badge } from "@mantine/core";
import { ReactNode } from "react";

export default function CustomPill({
    color,
    label,
    children
}: {
    color: string;
    label?: string;
    children?: ReactNode;
}) {
    return (
        <div>
            {!children ? (
                <div className="border-2 border-[#0091D766] rounded-full">
                    <Badge
                        className="hover:bg-btn-bg  bg-transparent "
                        // styles={{
                        //     // root: {
                        //     //     borderRadius: "0",
                        //     //     color: "var(--mantine-color-text)",
                        //     //     border: "2px solid var
                        //     // }

                        size="xl"
                        color="default"
                        styles={{
                            label: {
                                alignItems: "center",
                                fontFamily:
                                    "'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                                fontSize: 14,
                                fontWeight: "600",
                                height: "48px",
                                padding: " 10px 24px",
                                textTransform: "capitalize"
                            }
                        }}
                    >
                        {label}
                    </Badge>
                </div>
            ) : (
                <div>
                    <Badge
                        // className="hover:cursor-pointer !rounded-none  hover:bg-slate-600"
                        // size="xl"
                        // variant="gradient"
                        // gradient={{
                        //     from: "rgba(0, 145, 215, 1)",
                        //     to: "rgba(254, 15, 212, 1)",
                        //     deg: 90
                        // }}
                        className="rounded-full mx-8 hover:bg-btn-bg text-md"
                        size="xl"
                        variant="gradient"
                        gradient={{
                            from: "rgba(0, 145, 215, 1)",
                            to: "rgba(254, 15, 212, 1)",
                            deg: 90
                        }}
                    >
                        {children}
                    </Badge>
                </div>
            )}
        </div>
    );
}
