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
                <button className="p-2 mr-4 rounded-full bg-gray-500">
                    <IconPlayerSkipBackFilled />
                </button>

                <button
                    className="p-2 mx-4 rounded-full bg-gray-500"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? <IconPlayerPause /> : <IconPlayerPlayFilled />}
                </button>
                <button className="p-2 mx-4 rounded-full bg-gray-500">
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
                    <div className="p-2">
                        <div className="font-[600] text-[20px]">Queue</div>
                        <div className="mt-2 ">
                            <div className="font-[500] text-gray-500">
                                Now Playing
                            </div>
                            <div className="pl-5 my-1  flex flex-wrap justify-between text-gray-500 items-end">
                                <div className="flex flex-wrap ">
                                    {coverArt ? (
                                        <Image
                                            src={coverArt as string}
                                            alt="track image"
                                            width={40}
                                            height={40}
                                            className="rounded-[8.84px] mr-3 w-[40px] h-[40px]"
                                        />
                                    ) : (
                                        ""
                                    )}

                                    <div className="flex flex-col">
                                        <div>
                                            {currentTrack?.title
                                                ? currentTrack?.title
                                                : ""}
                                        </div>
                                        <div className="text-[13.336px]">
                                            {currentTrack?.author
                                                ? currentTrack?.author
                                                : ""}
                                        </div>
                                    </div>
                                </div>

                                <div>{formatTime(duration)}</div>
                            </div>
                        </div>
                        <div className="mt-3 ">
                            <div className="font-[500] text-gray-500">
                                Up Next:
                            </div>
                            <div className="pl-5 my-1 flex flex-wrap justify-between text-gray-500">
                                <div className="flex flex-wrap">
                                    <div>track img</div>
                                    <div>track title</div>
                                </div>

                                <div>1:00</div>
                            </div>{" "}
                            <div className="pl-5 my-1 flex flex-wrap justify-between text-gray-500">
                                <div className="flex flex-wrap">
                                    <div>track img</div>
                                    <div>track title</div>
                                </div>

                                <div>1:00</div>
                            </div>{" "}
                            <div className="pl-5 my-1 flex flex-wrap justify-between text-gray-500">
                                <div className="flex flex-wrap">
                                    <div>track img</div>
                                    <div>track title</div>
                                </div>

                                <div>1:00</div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Controls;
