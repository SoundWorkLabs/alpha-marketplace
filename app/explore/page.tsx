"use client";
import { Box, TextInput, Flex, Tabs, Text } from "@mantine/core";
import Cards from "../components/Card";

// import AudioPlayer from "./components/AudioPlayer";
import AudioPlayer from "./components/LocalAudioPlayer";

export default function Explore() {
    const audioUrl = "/sunella.mp3"; // To be adjust to call the URL based on the Netlify function route

    return (
        <div className="p-5">
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
            <Box className="my-8">
                <AudioPlayer audioUrl={audioUrl} />
            </Box>

            {/* Sound Packs */}
            <Box>
                <div className="text-xl font-semibold mb-4">Sound Packs</div>
                <Box>
                    <Flex>
                        <Tabs defaultValue="pack" color="blue">
                            {Cards()}
                        </Tabs>
                    </Flex>
                </Box>
            </Box>
        </div>
    );
}
