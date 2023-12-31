import React from "react";
import { IconVolume, IconArrowsShuffle2 } from "@tabler/icons-react";

interface ProgressBarProps {
    progressBarRef: React.RefObject<HTMLInputElement>;
    audioRef: React.RefObject<HTMLAudioElement>;
    timeProgress: number;
    duration: number;
    isPlaying: boolean;
    // togglePlayPause: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progressBarRef,
    audioRef,
    timeProgress,
    duration,
    isPlaying
    // togglePlayPause
}) => {
    const handleProgressChange = () => {
        // console.log(progressBarRef.current.value);
        audioRef.current!.currentTime = Number(
            progressBarRef.current!.valueAsNumber
        );
    };
    //     useEffect(())
    //  if (formatTime(timeProgress)==formatTime(duration)){
    //         toggle
    //     }
    //   converting time

    return (
        <div className="progress p-2">
            {/* time Procession */}
            {/* <span className="time current">{formatTime(timeProgress)}</span> */}
            <input
                type="range"
                ref={progressBarRef}
                defaultValue="0"
                onChange={handleProgressChange}
                className="appearance-none w-full 
                overflow-hidden bg-gray-600 h-1 rounded-lg focus:outline-none range-slider"
            />
            <div className="time text-[13.336px] text-[#909090] flex items-center w-full justify-between">
                <div>{isPlaying && formatTime(duration)}</div>
                <div className="">
                    <button className="p-2">
                        <IconVolume />
                    </button>
                    <button className="p-2">
                        <IconArrowsShuffle2 />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;

export function formatTime(time: number): string {
    if (time && !isNaN(time)) {
        const minutes = Math.floor(time / 60);
        const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(time % 60);
        const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${formatMinutes}:${formatSeconds}`;
    }
    return "--:--";
}
