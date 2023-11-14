// PlaylistManager.js
import React, { useEffect } from "react";
import { usePlaylist } from "../context/playlistProviderContext";
import Image from "next/image";
import { formatTime } from "../explore/components/ProgressBar";
import { AudioContextData } from "./types";

interface PlayListProps {
    duration: number;
    isPlaying: boolean;
    togglePlayPause: () => void;
    currentTrack: AudioContextData["currentTrack"];
}

const PlaylistManager: React.FC<PlayListProps> = ({
    duration,
    isPlaying,
    togglePlayPause,
    currentTrack
}) => {
    const { PlayList } = usePlaylist();

    useEffect(() => {}, [PlayList]);
    return (
        <div className="p-2">
            <div className="font-[600] text-[20px]">Queue</div>
            <div className="mt-2 ">
                <div className="font-[500] text-gray-500">Now Playing</div>
                <div className="pl-5 my-1  flex flex-wrap justify-between text-gray-500 items-end">
                    <div className="flex flex-wrap ">
                        {currentTrack?.coverArt ? (
                            <Image
                                src={currentTrack.coverArt as string}
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
                                {currentTrack?.title ? currentTrack?.title : ""}
                            </div>
                            <div className="text-[13.336px]">
                                {currentTrack?.author
                                    ? currentTrack?.author
                                    : ""}
                            </div>
                        </div>
                    </div>

                    <div>{isPlaying && formatTime(duration)}</div>
                </div>
            </div>
            <div className="mt-3 ">
                <div className="font-[500] text-gray-500">Up Next:</div>
                {PlayList.map((track, index) => (
                    <div
                        className="pl-5 my-1  flex flex-wrap justify-between text-gray-500 items-end"
                        key={index}
                    >
                        <div className="flex flex-wrap ">
                            {track?.coverArt ? (
                                <Image
                                    src={track.coverArt as string}
                                    alt="track image"
                                    width={40}
                                    height={40}
                                    className="rounded-[8.84px] mr-3 w-[40px] h-[40px]"
                                />
                            ) : (
                                ""
                            )}

                            <div className="flex flex-col">
                                <div>{track?.title ? track?.title : ""}</div>
                                <div className="text-[13.336px]">
                                    {track?.author ? track?.author : ""}
                                </div>
                            </div>
                        </div>
                        {/* <div>{formatTime(duration)}</div> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistManager;
