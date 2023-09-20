// ? for testing

"use client"

import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Stack, Title, Box, Text } from '@mantine/core';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';

function Test() {
    const [opened, { open, close }] = useDisclosure(false);
    const { publicKey, wallets, select, connect } = useWallet();


    return (
        <>
            <Modal
                className='text-center'
                opened={opened}
                onClose={close}
                size="md"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                centered
                withCloseButton={false}
            >

                <Title order={3} mb="20">
                    Connect Solana Wallet
                </Title>
                <Box>
                    <Stack>
                        {wallets.filter((wallet) => wallet.readyState === "Installed").length >
                            0 ? (
                            wallets
                                .filter((wallet) => wallet.readyState === "Installed")
                                .map((wallet) => (
                                    <Button
                                        key={wallet.adapter.name}
                                        onClick={() => { select(wallet.adapter.name) }}
                                        size="lg"
                                        leftSection={
                                            <Image
                                                src={wallet.adapter.icon}
                                                alt={wallet.adapter.name}
                                                height="20"
                                                width="20"
                                            />
                                        }
                                    >
                                        <Button onClick={() => select(wallet.adapter.name)}>
                                            {wallet.adapter.name}
                                        </Button>
                                    </Button>
                                ))
                        ) : (
                            <Text>No wallet found. Please download a supported Solana wallet</Text>
                        )}
                    </Stack>
                </Box>
            </Modal>


        </>
    );
}