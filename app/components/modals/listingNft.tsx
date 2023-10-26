import { PublicKey, Transaction } from "@solana/web3.js";
import { createListing, getListings } from "../../../services/listing";
import { SoundworkSDK } from "@jimii/soundwork-sdk";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import toast, { Toaster } from "react-hot-toast";

export default function ListingNft(props: {
    price: number;
    nftAddress: string;
    closeModal: () => void;
}) {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const { price, nftAddress, closeModal } = props;
    const [provider, setProvider] = useState<AnchorProvider>();
    const [sdk, setSdk] = useState<SoundworkSDK>();
    const [isSigned, setSign] = useState(false);
    const mint = new PublicKey(nftAddress);
    const [id, setId] = useState<string>();
    const sellerAddress = wallet?.publicKey;

    useEffect(() => {
        if (!wallet) throw new WalletNotConnectedError();
        const initialize = async () => {
            if (!provider && !sdk) {
                const provider = await new AnchorProvider(
                    connection,
                    wallet,
                    {}
                );
                setProvider(provider);
                console.log("provider🤞", provider);
                const sdk = new SoundworkSDK(provider, connection);
                await setSdk(sdk);
            }
        };

        initialize();
    }, [wallet, connection, provider, sdk]);

    const sign = async (sellerAddress: PublicKey) => {
        // const sol = price * LAMPORTS_PER_SOL;

        console.log("creating tx");
        if (!sdk) {
            throw new WalletNotConnectedError();
        }

        const ix = await sdk.createListing(mint, price).then((ix) => {
            console.log("ix 📝: ", ix);
            console.log("to sale at: ", price);
            return ix;
        });

        if (!ix) {
            throw new Error();
        }

        const tx = new Transaction().add(ix);

        if (!tx) {
            throw new Error();
        }

        if (!provider) {
            throw new Error();
        }

        console.log("provider: ", provider);

        const txSigHash = await provider
            .sendAndConfirm(tx, [])
            .then((sig) => {
                console.log(`https://explorer.solana.com/tx/${sig}`);
                closeModal();
                toast.success("NFT Listed 🎉🎉", {
                    duration: 3000,
                    position: "top-left",
                    style: {
                        animation: "ease-in-out",
                        background: "#0091D766",
                        borderRadius: "20px",
                        color: "white"
                    }
                });
                createListing(sig, sellerAddress.toBase58(), mint, price);
            })
            .catch((err) => {
                closeModal();
                console.log("transaction failed", err);
                return toast.error("Failed to List", {
                    duration: 3000,
                    position: "top-left",
                    style: {
                        animation: "ease-in-out",
                        background: "#0091D766",
                        borderRadius: "20px",
                        color: "white"
                    }
                });
            });
        console.log("txsh", txSigHash);

        return txSigHash;
    };

    if (price && nftAddress && sdk) {
        try {
            if (!sellerAddress) {
                throw new Error();
            }
            sign(sellerAddress);
        } catch (error) {
            console.error("Error creating listing:");
        }
    }
    return <></>;
}
