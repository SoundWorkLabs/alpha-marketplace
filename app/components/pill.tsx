import { Badge } from "@mantine/core";
import { ReactNode } from "react";

export default function CustomPill({ color, label, children }: { color: string, label?: string, children?: ReactNode }) {

    return (
        <div>
            {!children ? (<div>
                <Badge
                    className="hover:cursor-pointer hover:bg-[var(--soundwork-hover-one)] "
                    styles={{
                        root: {
                            borderRadius: "0",
                            color: 'var(--mantine-color-bright)',
                            border: '2px solid var(--mantine-color-bright)'
                        }
                    }}
                    size="xl"
                    color={color}
                >
                    {label}
                </Badge>
            </div>) : (<div>
                <Badge
                    className="hover:cursor-pointer !rounded-none  hover:bg-slate-600"
                    size="xl"
                    variant="gradient"
                    gradient={{ from: 'rgba(0, 145, 215, 1)', to: 'rgba(254, 15, 212, 1)', deg: 90 }}
                >
                    {children}
                </Badge>
            </div>)}
        </div>
    )
}