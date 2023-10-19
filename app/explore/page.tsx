"use client";
import { Box, TextInput, Text } from "@mantine/core";
import Cards from "../components/Card";
import NftCard from "../components/NftCard";

import AudioPlayer from "./components/AudioPlayer";
import { tracks } from "./data/tracks";
import { useState } from "react";

export default function Explore() {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const track = tracks;
    // console.log(track);
    return (
        <div className="p-5 scroll-smooth">
            {/* Header Section */}
            <Box className="p-5 ">
                <div className="p-5 flex justify-between items-center border rounded-xl bg-transparent h-76">
                    <Text size="xl">Explore</Text>
                    <div className="ml-auto">
                        {" "}
                        <TextInput
                            w={600}
                            radius={20}
                            className="search w-[100px] p-2 "
                            placeholder="Search by collection, music, or creators..."
                        />
                    </div>
                    <button className="ml-4 bg-aduio-bg rounded-full p-4">
                        Sort by
                    </button>{" "}
                </div>
            </Box>

            {/* Audio Player */}
            <Box className="my-5 p-2 bg-aduio-bg rounded-full w-full h-76">
                <AudioPlayer />
                {/* {audioUrl && (
                    <AudioPlayer
                        src={audioUrl}
                        autoPlay={true}
                        customControls={true}
                    />
                )} */}
            </Box>

            {/* Collections */}

            {/* this will be derived from the collection component once the data is being feed from the backend */}
            <Box className="mt-5 p-5">
                <div className="text-xl font-semibold mb-4">Collections</div>
                <Box className="flex flex-wrap">
                    <Cards />
                    <Cards />
                    <Cards />
                    <Cards />
                </Box>
            </Box>
            {/* Sounds */}
            <Box className="mt-0 p-5">
                <div className="text-xl font-semibold mb-4">Sounds</div>
                <Box className="flex flex-wrap">
                    <NftCard />
                </Box>
            </Box>
        </div>
    );
}
