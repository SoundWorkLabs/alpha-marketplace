"use client";
import { Box, TextInput, Text } from "@mantine/core";
import Cards from "../components/Card";
import NftCard from "../components/NftCard";

import AudioPlayer from "./components/AudioPlayer";
// import AudioPlayer from "./components/LocalAudioPlayer";

export default function Explore() {
    const audioUrl = "/sunella.mp3"; // To be adjust to call the URL based on the Netlify function route

    return (
        <div className="my-8 p-5">
            {/* Header Section */}
            <Box className="p-5">
                <div className="flex justify-between items-center">
                    <Text className="text-lg font-semibold">Explore</Text>
                    <div className="flex-1 ml-8">
                        <TextInput
                            className="w-full p-2 rounded-md border border-gray-300"
                            placeholder="Search by collection, music, or creators..."
                        />
                    </div>
                    <Box className="ml-4">Sort by</Box>
                </div>
            </Box>

            {/* Audio Player */}
            <Box className="my-8 p-5">
                {/* <AudioPlayer audioUrl={audioUrl} /> */}
                <AudioPlayer />
            </Box>

            {/* Collections */}

            {/* this will be derived from the collection component once the data is being feed from the backend */}
            <Box className="my-8 p-5">
                <div className="text-xl font-semibold mb-4">Collections</div>
                <Box className="flex w-full">
                    <Cards />
                    <Cards />
                    <Cards />
                    <Cards />
                </Box>
            </Box>
            {/* Sounds */}
            {/* this will be derived from the nft component once the data is being feed from the backend */}
            <Box className="my-8 p-5">
                <div className="text-xl font-semibold mb-4">Sounds</div>
                <Box className="flex">
                    <NftCard />
                    <NftCard />
                    <NftCard />
                    <NftCard />
                </Box>
            </Box>
        </div>
    );
}
