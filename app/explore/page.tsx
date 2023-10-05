"use client";
import { Box, TextInput, Flex, Tabs } from "@mantine/core";
import SortBy from "../components/Sort";
import Cards from "./components/Card";
import { useState } from "react";

// import AudioPlayer from "./components/AudioPlayer";
import AudioPlayer from "./components/LocalAudioPlayer";

export default function Explore() {
  const audioUrl = "/sunella.mp3"; // Adjust the URL based on your Netlify function route
  // const audioUrl = ".netlify/functions/audio"; // Adjust the URL based on your Netlify function route

  return (
    <div>
      <Box>
        <Flex>
          explore page
          <TextInput placeholder="Search by collection, music or creators..." />
          <Box>Sort by</Box>
        </Flex>
      </Box>

      <Box>
        <AudioPlayer audioUrl={audioUrl} />
      </Box>
      <Box>
        <div>Sound Packs</div>
        <Box>
          <Flex>
            <Tabs defaultValue={"pack"} c={"blue"}>
              {Cards()}
            </Tabs>
          </Flex>
        </Box>
      </Box>
    </div>
  );
}
