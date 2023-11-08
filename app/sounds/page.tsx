"use client";
import { Box } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchUserNfts } from "../../services/NFT";
import { NftSchema } from "../components/types";
import { useEffect, useState } from "react";
import NftCard from "../components/NftCard";

export default function Sounds() {
    const { publicKey, connected } = useWallet();
    const [nfts, setNfts] = useState<NftSchema[]>([]);
    const pubkey = publicKey?.toBase58();

    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        if (!connected) {
            const connectBtn = document.querySelector(
                ".connectBtn"
            ) as HTMLButtonElement;

            return connectBtn?.click();
        }
        fetchUserNfts(pubkey as string)
            .then((res) => {
                if (res) {
                    // test pubkey
                    // const target =
                    //     "C8HXcXRqA6UjWAf1NTQXY7i4DMvMY9x3zbUhj9dyw2Yi";

                    // const ownedNfts = res.filter(
                    //     (nft: NftSchema) => nft.current_owner === pubkey
                    // );

                    if (res.length > 0) {
                        setNfts(res);
                    } else {
                        // If there are no matching NFTs
                        setIsEmpty(true);
                    }
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
            });
    }, [connected]);

    return (
        <div className="p-5 my-2 mx-5 scroll-smooth">
            <Box className="flex items-center justify-center space-x-7 my-4">
                <button>My Sound</button>
                <button>Offer Received</button>
                <button>Offers Made By Me</button>
            </Box>
            <Box className="flex items-center justify-between bg-[#D9D9D90A] backdrop-blur-md rounded-md m-4 h-[76px] p-5 border border-[#A4A4A9] text-base">
                <div className="flex flex-wrap items-center space-x-3">
                    <input
                        placeholder="Search by music..."
                        className="rounded-full bg-[#0204164F] border border-[#A4A4A9] p-2 m-2 w-[382px]"
                    />
                    <div className="font-light">result</div>
                </div>

                <div className="flex">
                    <button className="rounded-full bg-[#0204164F] p-2 m-2 hover:bg-[#020416a4]">
                        Sort by
                    </button>
                    <button className="rounded-full bg-[#0204164F] p-2 m-2 hover:bg-[#020416a4]">
                        Filter
                    </button>
                </div>
            </Box>
            {/* {!connected ? (
                <>connect your wallet</>
            ) :  */}
            {isEmpty ? (
                <>You dont have any minted sound works</>
            ) : (
                <Box className="flex flex-wrap">
                    {nfts.length > 0 ? (
                        nfts
                            .slice()
                            .reverse()
                            .map((nft) => (
                                <NftCard key={nft.nft_address} nft={nft} />
                            ))
                    ) : (
                        <div>Loading...</div>
                    )}
                </Box>
            )}
        </div>
    );
}
