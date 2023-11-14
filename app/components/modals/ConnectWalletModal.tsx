// ? for testing

"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Stack, Title, Box, Text } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { ConnectArrow } from "../icon";

export default function ConnectWalletModal() {
    const [opened, { open, close }] = useDisclosure(false);
    const { wallets, select } = useWallet();

    return (
        <>
            <Modal
                className="connect-wallet text-center"
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
                <Title
                    order={3}
                    mb="30"
                    className="title border-b-2 border-[#454545]"
                >
                    Connect Your Wallet
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
                                    // <Button
                                    //     key={wallet.adapter.name}
                                    //     onClick={() => {
                                    //         select(wallet.adapter.name);
                                    //     }}
                                    //     size="lg"
                                    //     // styles={{
                                    //     //     root: {
                                    //     //         borderRadius: "0",
                                    //     //         background: "none",
                                    //     //         color: "var(--mantine-color-bright)",
                                    //     //         border: "2px solid var(--mantine-color-bright)"
                                    //     //     }
                                    //     // }}
                                    //     leftSection={
                                    //         <Image
                                    //             src={wallet.adapter.icon}
                                    //             alt={wallet.adapter.name}
                                    //             height="40"
                                    //             width="40"
                                    //         />
                                    //     }
                                    // >
                                    //     <Button
                                    //         // styles={{
                                    //         //     root: {
                                    //         //         background: "none",
                                    //         //         borderRadius: "0",
                                    //         //         color: "var(--mantine-color-white)"
                                    //         //     }
                                    //         // }}
                                    //         onClick={() =>
                                    //             select(wallet.adapter.name)
                                    //         }
                                    //     >
                                    //         <div className="text-blue-600">
                                    //             {wallet.adapter.name}
                                    //         </div>
                                    //     </Button>
                                    // </Button>

                                    <button
                                        key={wallet.adapter.name}
                                        onClick={() => {
                                            select(wallet.adapter.name);
                                        }}
                                        className="
                                        flex flex-wrap items-center justify-between
                                        px-5
                                        py-2
                                        hover:bg-[#252d6a55]
                                        hover: rounded-[18px]
                                        "
                                    >
                                        <div className="flex flex-wrap items-center">
                                            <Image
                                                src={wallet.adapter.icon}
                                                alt={wallet.adapter.name}
                                                height="40"
                                                width="40"
                                            />
                                            <div className="ml-[1.5rem]">
                                                {wallet.adapter.name}
                                            </div>
                                        </div>

                                        <div>
                                            <ConnectArrow />
                                        </div>
                                    </button>
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
