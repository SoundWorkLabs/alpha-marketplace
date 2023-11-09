"use client";
import { Box, Flex, TextInput } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchUserNfts } from "../../services/NFT";
import { NftSchema } from "../components/types";
import { useEffect, useState } from "react";
import NftCard from "../components/NftCard";

export default function Sounds() {
    const { publicKey, connected } = useWallet();
    const [nfts, setNfts] = useState<NftSchema[]>([]);
    const pubkey = publicKey?.toBase58();
    const [selectedOption, setSelectedOption] = useState(0);

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
    const options = ["My Sounds", "Offers Received", "Offers made by me"];
    return (
        <div className="p-5 my-2 mx-5 scroll-smooth">
            <Box className="items-center">
                <Flex className="space-x-20 mt-16 justify-center ">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={
                                selectedOption === index
                                    ? "border-b-[3px] pb-4 profile-selected-opt w-[137px]"
                                    : ""
                            }
                            onClick={() => {
                                console.log("index", index);
                                setSelectedOption(index);
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </Flex>
            </Box>
            <Box className="border border-[#D7D6D633] rounded-[12px] h-76 flex flex-wrap items-center justify-between bg-[#D9D9D90A]">
                <div className="flex flex-wrap items-center mx-2">
                    {" "}
                    <TextInput
                        w={382}
                        radius={20}
                        className="search-profile p-2 h-[48px]"
                        placeholder="Search by music..."
                    />
                    <div className="font-[300] text-[16px] text-[#B3B3B3]">
                        0 results
                    </div>
                </div>
                <div className="mx-4">
                    <button className="text-[16px] mr-4 text-[#B3B3B3]  bg-[#0204164F] rounded-full w-[137px] h-[45px]">
                        Sort by
                    </button>{" "}
                    <button className="text-[16px] text-[#B3B3B3]  bg-[#0204164F] rounded-full w-[137px] h-[45px]">
                        filter
                    </button>
                </div>
            </Box>

            {/* {!connected ? (
                <>connect your wallet</>
            ) :  */}
            {/* {isEmpty ? (
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
            )} */}
            {!isEmpty ? (
                selectedOption == 0 && (
                    <Box className="flex flex-wrap">
                        {" "}
                        {nfts && nfts.length > 0 ? (
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
                )
            ) : (
                <>You dont have any minted sound works</>
            )}
        </div>
    );
}
