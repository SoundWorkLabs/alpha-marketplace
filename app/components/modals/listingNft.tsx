import React, { useState, useEffect } from "react";
import { SoundworkSDK } from "@jimii/soundwork-sdk";
import {
    useConnection,
    useAnchorWallet,
    useWallet,
    AnchorWallet
} from "@solana/wallet-adapter-react";
import {
    AnchorProvider,
    Wallet,
    setProvider,
    Program
} from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { createListing } from "../../../services/listing";

export default function ListingNft(props: {
    price: number;
    nftAddress: string;
}) {
    // export default function ListingNft(price: number,wallet:AnchorWallet,connection:Connection) {
    console.log("in listing");
    const wallet = useAnchorWallet();
    const { connection } = useConnection();
    // const program = Program(sdk.)

    // console.log(nftAddress);
    const mint = new PublicKey(props.nftAddress);
    const price = props.price * LAMPORTS_PER_SOL;

    if (!wallet) {
        return <>wallet not found</>;
    }
    const provider = new AnchorProvider(connection, wallet, {});

    const sdk = new SoundworkSDK(provider, connection);

    try {
        sdk.createListing(mint, price)
            .then((txhash) => {
                console.log("listed 🫱🏾‍🫲🏾:", txhash);
            })
            .finally(() => {
                // listing(())
            });
    } catch (e) {
        console.log("something aint right", e);
    }

    return <div>Listing NFT</div>;
}
