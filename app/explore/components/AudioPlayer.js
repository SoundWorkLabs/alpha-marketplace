import { useRef, useState, useEffect } from "react";
import Music from "./Music";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";

import { IconVolume, IconArrowsShuffle2 } from "@tabler/icons-react";

function LibAudioPlayer() {
    const [currentTrack, setCurrentTrack] = useState("");
    // useEffect(() => {
    //     setCurrentTrack(track);
    //     console.log(currentTrack);
    // }, [track]);

    const progressBarRef = useRef();
    const audioRef = useRef();

    const [timeProgress, setTimeProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    return (
        <div className="w-full flex justify-between items-center">
            <Controls
                {...{ audioRef, progressBarRef, duration, setTimeProgress }}
            />
            <Music
                {...{ currentTrack, audioRef, setDuration, progressBarRef }}
            />
            <ProgressBar
                {...{ progressBarRef, audioRef, timeProgress, duration }}
            />
            <div className="">
                <button className="p-2">
                    <IconVolume />
                </button>
                <button classNanme="p-2">
                    <IconArrowsShuffle2 />
                </button>
            </div>
        </div>
    );
}
export default LibAudioPlayer;
