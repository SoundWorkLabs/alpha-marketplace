import { PublicKey, Transaction } from "@solana/web3.js";
import { createListing } from "../../../services/listing";
import { SoundworkSDK } from "@jimii/soundwork-sdk";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import toast from "react-hot-toast";

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
    const mint = new PublicKey(nftAddress);

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

                const ix = await sdk.createListing(mint, price).then((ix) => {
                    console.log("ix 📝: ", ix);
                    console.log("to sale at: ", price);
                    return ix;
                });
                const tx = new Transaction().add(ix);
                const txSigHash = await provider
                    .sendAndConfirm(tx, [])
                    .then((sig) => {
                        console.log(`https://explorer.solana.com/tx/${sig}`);
                        closeModal();
                        toast.success("NFT Listed 🎉🎉", {
                            duration: 3000,
                            position: "top-center",
                            style: {
                                animation: "ease-in-out",
                                background: "#0091D766",
                                borderRadius: "20px",
                                color: "white"
                            }
                        });
                        createListing(
                            sig,
                            wallet.publicKey?.toBase58(),
                            mint,
                            price
                        );
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
            }
        };

        initialize();
    }, [wallet, connection, provider, sdk]);
    return <></>;
}
