"use client";
import { Box, Flex, TextInput } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchUserNfts } from "../../services/NFT";
import { NftSchema } from "../components/types";
import { useEffect, useState } from "react";
import NftCard from "../components/NftCard";
import NftFallback from "../components/NftFallback";
import { FilterIcon, SearchIcon, SortIcon } from "../components/icon";
import { IconGhost2 } from "@tabler/icons-react";

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
    }, [connected, publicKey]);
    const options = ["My Sounds", "Offers Received", "Offers made by me"];
    return (
        <div className="p-5 my-2 mx-5 scroll-smooth">
            <Box className="items-center">
                <Flex className="space-x-20 mt-16 justify-center text-[1.25rem] font-[400] leading-[104%]">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={
                                selectedOption === index
                                    ? "border-b-[0.1875rem] pb-4 profile-selected-opt w-fit"
                                    : ""
                            }
                            onClick={() => {
                                setSelectedOption(index);
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </Flex>
            </Box>
            <Box className="border border-[#D7D6D633] rounded-[0.75rem] h-[4.75rem] flex flex-wrap items-center justify-between bg-[#D9D9D90A]">
                <div className="flex flex-wrap items-center mx-2 space-x-[1.56rem]">
                    {" "}
                    <TextInput
                        w={"25.6875rem"}
                        radius={"3rem"}
                        className="search items-center p-[.75] pl-[1.25rem] leading-[1.04rem]"
                        placeholder="Search by music..."
                        leftSection={<SearchIcon />}
                    />
                    <div className="font-[300] text-[1rem] text-[#B3B3B3]">
                        0 results
                    </div>
                </div>
                <div className="mx-4 flex flex-wrap">
                    <button className="w-[7.625rem] h-[3rem] ml-4 bg-[#0204164F] rounded-[3rem] space-x-2 flex flex-wrap items-center justify-center">
                        <p className="text-[#B3B3B3] font-[400] leading-[1.5rem]">
                            Sort by
                        </p>
                        <SortIcon />
                    </button>
                    <button className="w-[7.625rem] h-[3rem] ml-4 bg-[#0204164F] rounded-[3rem] space-x-2 flex flex-wrap items-center justify-center">
                        <p className="text-[#B3B3B3] font-[400] leading-[1.5rem]">
                            Filters
                        </p>
                        <FilterIcon />
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
                        {nfts && nfts.length > 0
                            ? nfts
                                  .slice()
                                  .reverse()
                                  .map((nft) => (
                                      <NftCard
                                          key={nft.nft_address}
                                          nft={nft}
                                      />
                                  ))
                            : Array.from({ length: 10 }, (_, index) => (
                                  <NftFallback key={index} />
                              ))}
                    </Box>
                )
            ) : (
                <div className="mt-10">
                    <div className="flex justify-center">
                        <IconGhost2 className="w-[15rem] h-[15rem]" />
                    </div>

                    <div className="flex justify-center text-[1.5rem] font-[600] leading-[1.3rem]">
                        Oh no! You dont have any minted soundwork NFTs
                    </div>
                </div>
            )}
        </div>
    );
}
