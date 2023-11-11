import React, { useEffect, useRef, useState } from "react";
import Music from "./Music";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import { useAudio } from "../../context/audioPlayerContext";

function LibAudioPlayer() {
    const progressBarRef = useRef<HTMLInputElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const {
        isPlaying,
        setIsPlaying,
        togglePlayPause,
        currentTrack,
        setCurrentTrack
    } = useAudio();

    const [timeProgress, setTimeProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    useEffect(() => {
        if (currentTrack !== undefined) {
            setIsPlaying(true);
        }
    }, [currentTrack]);
    return (
        <div className="flex justify-between items-center">
            <div className="">
                <div className="space-x-5 flex flex-wrap items-center">
                    <Controls
                        audioRef={audioRef}
                        progressBarRef={progressBarRef}
                        duration={duration}
                        setTimeProgress={setTimeProgress}
                        isPlaying={isPlaying}
                        togglePlayPause={togglePlayPause}
                        currentTrack={currentTrack}
                    />
                    <Music
                        currentTrack={currentTrack}
                        audioRef={audioRef}
                        setDuration={setDuration}
                        progressBarRef={progressBarRef}
                        togglePlayPause={togglePlayPause}
                        setCurrentTrack={setCurrentTrack}
                    />
                </div>
            </div>
            <div>
                <div className="w-[437.22px]">
                    <ProgressBar
                        progressBarRef={progressBarRef}
                        audioRef={audioRef}
                        timeProgress={timeProgress}
                        duration={duration}
                        isPlaying={isPlaying}
                    />
                </div>
            </div>
        </div>
    );
}

export default LibAudioPlayer;
