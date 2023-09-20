"use client"

import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Stack, Title, Box, Text } from '@mantine/core';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';

export default function ConnectWallet() {
    const [opened, { open, close }] = useDisclosure(false);
    const { publicKey, wallets, select, connect } = useWallet();

    return (
        <>
            {
                publicKey == null ? <WalletMultiButton style={{ background: "transparent" }} /> : <WalletDisconnectButton style={{ background: "transparent" }} />
            }
        </>
    );
}