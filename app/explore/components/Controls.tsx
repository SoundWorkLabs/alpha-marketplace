import React, { useEffect, useRef, useCallback } from "react";
import { AudioContextData } from "../../components/types";

import {
    IconPlayerPlayFilled,
    IconPlayerSkipBackFilled,
    IconPlayerPause,
    IconPlayerSkipForwardFilled
} from "@tabler/icons-react";
import { PlayListIcon } from "../../components/icon";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { formatTime } from "./ProgressBar";
import Image from "next/image";
import PlaylistManager from "../../components/PlaylistManager";
import { PlaylistProvider } from "../../context/playlistProviderContext";

interface ControlsProps {
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    progressBarRef: React.MutableRefObject<HTMLInputElement | null>;
    duration: number;
    setTimeProgress: (time: number) => void;
    isPlaying: boolean;
    togglePlayPause: () => void;
    currentTrack: AudioContextData["currentTrack"];
}

const Controls: React.FC<ControlsProps> = ({
    audioRef,
    progressBarRef,
    duration,
    setTimeProgress,
    isPlaying,
    togglePlayPause,
    currentTrack
}) => {
    const playAnimationRef = useRef<number>();
    const [opened, { open, close }] = useDisclosure(false);
    const coverArt = currentTrack?.coverArt;
    const repeat = useCallback(() => {
        const currentTime = audioRef.current?.currentTime || 0;
        setTimeProgress(currentTime);
        progressBarRef.current!.value = currentTime.toString();

        progressBarRef.current!.style.setProperty(
            "--range-progress",
            `${(
                (Number(progressBarRef.current!.value) / duration) *
                100
            ).toString()}%`
        );

        playAnimationRef.current = requestAnimationFrame(repeat);
    }, [audioRef, duration, progressBarRef, setTimeProgress]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play();
            playAnimationRef.current = requestAnimationFrame(repeat);
        } else {
            audioRef.current?.pause();
            cancelAnimationFrame(playAnimationRef.current!);
        }
    }, [isPlaying, audioRef, repeat]);

    return (
        <div className="controls-wrapper">
            <div className="flex items-center">
                <button
                    className="p-2 mr-4 rounded-full bg-gray-500"
                    onClick={() => {
                        console.log("should skip prev");
                    }}
                >
                    <IconPlayerSkipBackFilled />
                </button>

                <button
                    className="p-2 mx-4 rounded-full bg-gray-500"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? <IconPlayerPause /> : <IconPlayerPlayFilled />}
                </button>
                <button
                    className="p-2 mx-4 rounded-full bg-gray-500"
                    onClick={() => {
                        console.log("should skip next");
                    }}
                >
                    <IconPlayerSkipForwardFilled />
                </button>
                <button
                    className="p-2 mx-4 rounded-full bg-gray-500 h-[40px] w-[40px]"
                    onClick={open}
                >
                    <PlayListIcon />
                </button>
                <Modal
                    opened={opened}
                    onClose={close}
                    withCloseButton={false}
                    radius="18px"
                    className="play-list"
                >
                    <PlaylistManager
                        duration={duration}
                        currentTrack={currentTrack}
                        isPlaying={isPlaying}
                        togglePlayPause={togglePlayPause}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default Controls;
