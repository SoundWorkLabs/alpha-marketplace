// import { useRef, useState, useEffect } from "react";
// import Music from "./Music";
// import Controls from "./Controls";
// import ProgressBar from "./ProgressBar";

// import { IconVolume, IconArrowsShuffle2 } from "@tabler/icons-react";

// // @jim4067 should i add this interface to the types file?
// interface LibAudioPlayerProps {
//     isPlaying: boolean;
//     togglePlayPause: () => void;
// }

// function LibAudioPlayer({ isPlaying, togglePlayPause }):LibAudioPlayerProps {
//     const [currentTrack, setCurrentTrack] = useState("");
//     // useEffect(() => {
//     //     setCurrentTrack(track);
//     //     console.log(currentTrack);
//     // }, [track]);

//     const progressBarRef = useRef();
//     const audioRef = useRef();

//     const [timeProgress, setTimeProgress] = useState(0);
//     const [duration, setDuration] = useState(0);
//     return (
//         <div className="w-full flex justify-between items-center">
//             <Controls
//                 {...{
//                     audioRef,
//                     progressBarRef,
//                     duration,
//                     setTimeProgress,
//                     isPlaying,
//                     togglePlayPause
//                 }}
//             />
//             <Music
//                 {...{ currentTrack, audioRef, setDuration, progressBarRef }}
//             />
//             <ProgressBar
//                 {...{ progressBarRef, audioRef, timeProgress, duration }}
//             />
//             <div className="">
//                 <button className="p-2">
//                     <IconVolume />
//                 </button>
//                 <button className="p-2">
//                     <IconArrowsShuffle2 />
//                 </button>
//             </div>
//         </div>
//     );
// }
// export default LibAudioPlayer;

import React, { useRef, useState, useEffect } from "react";
import Music from "./Music";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import { IconVolume, IconArrowsShuffle2 } from "@tabler/icons-react";

interface LibAudioPlayerProps {
    isPlaying: boolean;
    togglePlayPause: () => void;
    currentTrack: string;
}

function LibAudioPlayer({
    isPlaying,
    togglePlayPause,
    currentTrack
}: LibAudioPlayerProps) {
    // const [currentTrack, setCurrentTrack] = useState<string>("");
    // useEffect(() => {
    //     setCurrentTrack(track);
    //     console.log(currentTrack);
    // }, [track]);

    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [timeProgress, setTimeProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    return (
        <div className="w-full flex justify-between items-center">
            <Controls
                audioRef={audioRef}
                progressBarRef={progressBarRef}
                duration={duration}
                setTimeProgress={setTimeProgress}
                isPlaying={isPlaying}
                togglePlayPause={togglePlayPause}
            />
            <Music
                currentTrack={currentTrack}
                audioRef={audioRef}
                setDuration={setDuration}
                progressBarRef={progressBarRef}
            />
            <ProgressBar
                progressBarRef={progressBarRef}
                audioRef={audioRef}
                timeProgress={timeProgress}
                duration={duration}
            />
            <div className="">
                <button className="p-2">
                    <IconVolume />
                </button>
                <button className="p-2">
                    <IconArrowsShuffle2 />
                </button>
            </div>
        </div>
    );
}

export default LibAudioPlayer;
