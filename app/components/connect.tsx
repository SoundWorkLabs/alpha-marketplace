"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletModal from "./modals/ConnectWalletModal";
import DisconnectWalletDropdown from "./DisconnectWalletDropdown";

export default function ConnectWallet() {
    const { publicKey } = useWallet();

    return (
        <>
            {publicKey == null ? (
                <ConnectWalletModal />
            ) : (
                <DisconnectWalletDropdown />
            )}
        </>
    );
}
