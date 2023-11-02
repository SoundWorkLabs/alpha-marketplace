// ? for testing

"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Stack, Title, Box, Text } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";

export default function ConnectWalletModal() {
    const [opened, { open, close }] = useDisclosure(false);
    const { wallets, select } = useWallet();

    return (
        <>
            <Modal
                className="text-center"
                opened={opened}
                onClose={close}
                size="md"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3
                }}
                centered
                withCloseButton={false}
            >
                <Title order={3} mb="20">
                    Select Wallet
                </Title>
                <Box>
                    <Stack>
                        {wallets.filter(
                            (wallet) => wallet.readyState === "Installed"
                        ).length > 0 ? (
                            wallets
                                .filter(
                                    (wallet) =>
                                        wallet.readyState === "Installed"
                                )
                                .map((wallet) => (
                                    <Button
                                        key={wallet.adapter.name}
                                        onClick={() => {
                                            select(wallet.adapter.name);
                                        }}
                                        size="lg"
                                        styles={{
                                            root: {
                                                borderRadius: "0",
                                                background: "none",
                                                color: "var(--mantine-color-bright)",
                                                border: "2px solid var(--mantine-color-bright)"
                                            }
                                        }}
                                        leftSection={
                                            <Image
                                                src={wallet.adapter.icon}
                                                alt={wallet.adapter.name}
                                                height="20"
                                                width="20"
                                            />
                                        }
                                    >
                                        <Button
                                            styles={{
                                                root: {
                                                    background: "none",
                                                    borderRadius: "0",
                                                    color: "var(--mantine-color-bright)"
                                                }
                                            }}
                                            onClick={() =>
                                                select(wallet.adapter.name)
                                            }
                                        >
                                            {wallet.adapter.name}
                                        </Button>
                                    </Button>
                                ))
                        ) : (
                            <Text>
                                No wallet found. Please download a supported
                                Solana wallet
                            </Text>
                        )}
                    </Stack>
                </Box>
            </Modal>

            <Button
                className="connectBtn"
                style={{ background: "none" }}
                onClick={open}
            >
                Connect
            </Button>
        </>
    );
}
