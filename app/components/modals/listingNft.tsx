import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction
} from "@solana/web3.js";
import { createListing } from "../../../services/listing";
import { SoundworkSDK } from "@jimii/soundwork-sdk";
import { AnchorProvider, Provider } from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import {
    AnchorWallet,
    useConnection,
    useWallet
} from "@solana/wallet-adapter-react";
useConnection;
export default function ListingNft(props: {
    price: number;
    nftAddress: string;
    connection: Connection;
    provider: Provider;
}) {
    const { connection, price, nftAddress, provider } = props;
    console.log("connecting to sdk 😊");
    const [sdk, setSdk] = useState<SoundworkSDK>();
    const [mint, setMint] = useState<PublicKey>();
    const [sol, setSol] = useState<number>();
    const [ix, setIX] = useState<TransactionInstruction>();

    useEffect(() => {
        const initializeSDK = async () => {
            const sdk = await new SoundworkSDK(provider, connection);
            setSdk(sdk);
            // You can now use 'sdk' for further operations
        };
        console.log("creating soundwork mint pubkey");
        const mint = new PublicKey(nftAddress);
        console.log("mint pubkey created", mint);
        setMint(mint);

        const toSol = price * LAMPORTS_PER_SOL;
        console.log("price in sol", toSol);
        setSol(toSol);

        initializeSDK();
    }, [provider, connection, sdk, mint, sol]);

    if (!sdk) {
        console.log("could not connect to sound work rpc server");
        return <>could not connect to sound work rpc server</>;
    }
    if (!mint) {
        console.log("this should not happen 😐");
        return <>invalid mint</>;
    }
    if (!sol) {
        console.log("this should not happen 😐");
        return <>solana is dead 😭</>;
    }

    useEffect(() => {
        console.log("generating ix 🗒️");
        sdk.createListing(mint, sol)
            .then((txhash) => {
                console.log("txhash #️⃣", txhash);
                setIX(txhash);
            })
            .catch((err) => {
                console.log("caught error:", err);
            });
    }, [sdk, sol, mint, connection]);

    if (!ix) {
        console.log("ix error");
        return <>ix failed to generate</>;
    }

    const tx = new Transaction().add(ix);
    const wallet = useWallet();
    if (!wallet) {
        return <>tx failed </>;
    }

    // shoudld send tx

    return <>an error occured while listing</>;

    // return <>you are about to list your sound work</>;
}
