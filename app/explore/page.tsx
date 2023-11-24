"use client";
import { Box, TextInput } from "@mantine/core";
import LibAudioPlayer from "./components/AudioPlayer";
import { useState, useEffect, Suspense, lazy } from "react";
// import { useAudio } from "../context/audioPlayerContext";
import { fetchListedNfts } from "../../services/NFT";
import { NftSchema } from "../components/types";
import { SearchIcon, SortIcon } from "../components/icon";
import { IconLoader2 } from "@tabler/icons-react";
import NftFallback from "../components/NftFallback";
import NftCard from "../components/NftCard";

export default function Explore() {
    const [nfts, setNfts] = useState<NftSchema[]>([]);

    // const {
    //     isPlaying,
    //     setIsPlaying,
    //     currentTrack,
    //     setCurrentTrack,
    //     togglePlayPause
    // } = useAudio();

    useEffect(() => {
        fetchListedNfts()
            .then((res) => {
                if (res) {
                    setNfts(res);
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
            });
    }, []);

    return (
        <div className="p-5 scroll-smooth">
            {/* Header Section */}
            <Box className="p-5 ">
                <div className="p-5 flex justify-between items-center border border-[#D7D6D633] rounded-[0.75rem] bg-[#D9D9D90A] h-[4.75rem]">
                    <p className="text-[1.75rem] font-[600]">Explore</p>
                    <div className="ml-auto">
                        <TextInput
                            w={"25.6875rem"}
                            radius={"3rem"}
                            className="search items-center p-[.75] "
                            placeholder="Search by collection, music or creators..."
                            leftSection={<SearchIcon />}
                        />
                    </div>
                    <button className="w-[7.625rem] h-[3rem] ml-4 bg-[#0204164F] rounded-[3rem] space-x-2 flex flex-wrap items-center justify-center">
                        <p className="text-[#B3B3B3]">Sort by</p>
                        <SortIcon />
                    </button>
                </div>
            </Box>

            {/* Audio Player */}
            <Box className="my-5 px-7 bg-aduio-bg rounded-[4.28644rem]">
                <LibAudioPlayer
                // isPlaying={isPlaying}
                // togglePlayPause={togglePlayPause}
                // currentTrack={currentTrack}
                />
            </Box>

            {/* Collections */}

            {/* this will be derived from the collection component once the data is being feed from the backend */}
            {/* <Box className="mt-5 p-5">
                <div className="text-xl font-semibold mb-4">Collections</div>
                <Box className="flex flex-wrap">
                    <Cards />
                    <Cards />
                    <Cards />
                    <Cards />
                </Box>
            </Box> */}
            {/* Sounds */}
            <Box className="mt-0 p-5">
                <div className="text-[1.75rem] font-[400] mb-4">Sounds</div>
                <Box className="flex flex-wrap">
                    {nfts.length === 0
                        ? Array.from({ length: 10 }, (_, index) => (
                              <NftFallback key={index} />
                          ))
                        : nfts
                              .slice()
                              .reverse()
                              .map((nft) => (
                                  <NftCard key={nft.nft_address} nft={nft} />
                              ))}
                </Box>
            </Box>
        </div>
    );
}
