// import React, { useRef, useState } from "react";
// import Music from "./Music";
// import Controls from "./Controls";
// import ProgressBar from "./ProgressBar";
// import { LibAudioPlayerProps } from "../../components/types";

// function LibAudioPlayer({
//     isPlaying,
//     togglePlayPause,
//     currentTrack
// }: LibAudioPlayerProps) {
//     const progressBarRef = useRef<HTMLInputElement | null>(null);
//     const audioRef = useRef<HTMLAudioElement | null>(null);

//     const [timeProgress, setTimeProgress] = useState<number>(0);
//     const [duration, setDuration] = useState<number>(0);

//     return (
//         <div className="flex justify-between items-center">
//             <div className="">
//                 <div className="space-x-5 flex flex-wrap items-center">
//                     <Controls
//                         audioRef={audioRef}
//                         progressBarRef={progressBarRef}
//                         duration={duration}
//                         setTimeProgress={setTimeProgress}
//                         isPlaying={isPlaying}
//                         togglePlayPause={togglePlayPause}
//                     />
//                     <Music
//                         currentTrack={currentTrack}
//                         audioRef={audioRef}
//                         setDuration={setDuration}
//                         progressBarRef={progressBarRef}
//                     />
//                 </div>
//             </div>
//             <div>
//                 <div className="w-[437.22px]">
//                     <ProgressBar
//                         progressBarRef={progressBarRef}
//                         audioRef={audioRef}
//                         timeProgress={timeProgress}
//                         duration={duration}
//                         // togglePlayPause={togglePlayPause}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }
// LibAudioPlayer.js
import React, { useRef, useState } from "react";
import Music from "./Music";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import { LibAudioPlayerProps } from "../../components/types";
import { AudioContextData, useAudio } from "../../context/audioPlayerContext";

function LibAudioPlayer() {
    const progressBarRef = useRef<HTMLInputElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { isPlaying, togglePlayPause, currentTrack } = useAudio();

    const [timeProgress, setTimeProgress] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

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
                    />
                    <Music
                        currentTrack={currentTrack}
                        audioRef={audioRef}
                        setDuration={setDuration}
                        progressBarRef={progressBarRef}
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
                    />
                </div>
            </div>
        </div>
    );
}

export default LibAudioPlayer;
