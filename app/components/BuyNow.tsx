import { PublicKey, Transaction } from "@solana/web3.js";
import { SoundworkSDK } from "@jimii/soundwork-sdk";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import toast from "react-hot-toast";

export default function BuyNow(props: {
    nftAddress: string;
    onBuyNow: () => void;
}) {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const { nftAddress, onBuyNow } = props;
    const [provider, setProvider] = useState<AnchorProvider>();
    const [sdk, setSdk] = useState<SoundworkSDK>();
    const mint = new PublicKey(nftAddress);

    useEffect(() => {
        if (!wallet) throw new WalletNotConnectedError();
        const initiaclizeBuy = async () => {
            if (!provider && !sdk) {
                const provider = await new AnchorProvider(
                    connection,
                    wallet,
                    {}
                );
                setProvider(provider);
                const sdk = new SoundworkSDK(provider, connection);
                await setSdk(sdk);

                const ix = await sdk.buyListing(mint);

                const tx = new Transaction().add(ix);
                await provider
                    .sendAndConfirm(tx, [])
                    .then((sig) => {
                        console.log(`https://explore,solana.com/tx/${sig}`);
                        toast.success("NFT bought 🎉🎉", {
                            duration: 3000,
                            position: "top-center",
                            style: {
                                animation: "ease-in-out",
                                background: "#0091D766",
                                borderRadius: "20px",
                                color: "white"
                            }
                        });
                        onBuyNow();
                    })

                    .catch((err) => {
                        onBuyNow();
                        return toast.error("Failed to buy", {
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
            }
        };
        initiaclizeBuy();
    }, []);

    return <></>;
}
