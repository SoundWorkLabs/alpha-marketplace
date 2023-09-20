import { Badge } from "@mantine/core";
import { ReactNode } from "react";

export default function CustomPill({ color, label, children }: { color: string, label: string, children?: ReactNode }) {

    return (
        <div>
            {!children ? (<div>
                <Badge
                    className="hover:cursor-pointer hover:scale-105"
                    styles={{
                        root: {
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
                    className="hover:cursor-pointer hover:scale-105"
                    size="xl"
                    variant="gradient"
                    gradient={{ from: 'red', to: 'cyan', deg: 90 }}
                >
                    {children}
                </Badge>
            </div>)}
        </div>
    )
}