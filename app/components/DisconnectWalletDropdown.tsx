import { Box, Button, Menu, rem } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import {
    IconArrowsExchange,
    IconCopy,
    IconUserCircle
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function DisconnectWalletDropdown() {
    const { publicKey, disconnect } = useWallet();
    const clipboard = useClipboard({ timeout: 500 });

    const router = useRouter();

    return (
        <Box>
            <Box>
                <Menu
                    trigger="hover"
                    openDelay={100}
                    closeDelay={400}
                    shadow="md"
                    width="150"
                >
                    <Menu.Target>
                        <Button style={{ background: "none" }}>
                            {`${publicKey
                                ?.toBase58()
                                .substring(0, 4)}...${publicKey
                                ?.toBase58()
                                .substring(28, 32)}` ?? ""}
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            onClick={() => router.push("/profile")}
                            leftSection={
                                <IconUserCircle
                                    style={{ width: rem(14), height: rem(14) }}
                                />
                            }
                        >
                            Profile
                        </Menu.Item>
                        <Menu.Item
                            onClick={() =>
                                clipboard.copy(publicKey?.toBase58())
                            }
                            leftSection={
                                <IconCopy
                                    style={{ width: rem(14), height: rem(14) }}
                                />
                            }
                        >
                            {clipboard.copied ? "copied" : "Copy address"}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={
                                <IconArrowsExchange
                                    style={{ width: rem(14), height: rem(14) }}
                                />
                            }
                            onClick={() => disconnect()}
                        >
                            Change wallet
                        </Menu.Item>
                        <Menu.Divider />

                        <Menu.Item color="red" onClick={() => disconnect()}>
                            Disconnect
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Box>
        </Box>
    );
}
