"use client";

import type { WalletContextState } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet as useWalletAdapter } from "@solana/wallet-adapter-react";

import React, { createContext, useContext, useEffect, useState } from "react";

type WalletContextValue = {
    balance: number | null;
    address?: string;
} & WalletContextState;

const WalletContext = createContext<WalletContextValue>(
    {} as WalletContextValue
);

export function WalletContextProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const { connection } = useConnection();
    const { publicKey, ...restParams } = useWalletAdapter();
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        if (!publicKey) return;
        connection.getBalance(publicKey).then((lamp) => setBalance(lamp));
    }, [publicKey, balance, connection]);

    const returnValue = {
        ...restParams,
        publicKey,
        balance,
        address: publicKey?.toBase58()
    };

    return (
        <WalletContext.Provider value={returnValue}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWalletContext() {
    return useContext(WalletContext);
}
