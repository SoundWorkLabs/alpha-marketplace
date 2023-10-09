import { useState, useEffect, useRef, useCallback } from "react";

import {
    IconPlayerPlayFilled,
    IconPlayerSkipBackFilled,
    IconPlayerPause,
    IconPlayerSkipForwardFilled,
    IconPlaylist
} from "@tabler/icons-react";

function Controls({ audioRef, progressBarRef, duration, setTimeProgress }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    //   animation
    const playAnimationRef = useRef();

    const repeat = useCallback(() => {
        const currentTime = audioRef.current.currentTime;
        setTimeProgress(currentTime);
        progressBarRef.current.value = currentTime;
        progressBarRef.current.style.setProperty(
            "--range-progress",
            `${(progressBarRef.current.value / duration) * 100}%`
        );

        playAnimationRef.current = requestAnimationFrame(repeat);
    }, [audioRef, duration, progressBarRef, setTimeProgress]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
            playAnimationRef.current = requestAnimationFrame(repeat);
        } else {
            audioRef.current.pause();
            cancelAnimationFrame(playAnimationRef.current);
        }
    }, [isPlaying, audioRef, repeat]);

    return (
        <div className="controls-wrapper">
            <div className="controls">
                <button className="p-5">
                    <IconPlayerSkipBackFilled />
                </button>

                <button className="p-5" onClick={togglePlayPause}>
                    {isPlaying ? <IconPlayerPause /> : <IconPlayerPlayFilled />}
                </button>
                <button className="p-5">
                    <IconPlayerSkipForwardFilled />
                </button>
                <button className="p-5">
                    <IconPlaylist />
                </button>
            </div>
        </div>
    );
}

export default Controls;
