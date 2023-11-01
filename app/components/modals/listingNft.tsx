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
                const sdk = new SoundworkSDK(provider, connection);
                await setSdk(sdk);

                const ix = await sdk.createListing(mint, price).then((ix) => {
                    return ix;
                });
                const tx = new Transaction().add(ix);
                const txSigHash = await provider
                    .sendAndConfirm(tx, [])
                    .then((sig) => {
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
                return txSigHash;
            }
        };

        initialize();
    }, [wallet, connection, provider, sdk]);
    return <></>;
}
