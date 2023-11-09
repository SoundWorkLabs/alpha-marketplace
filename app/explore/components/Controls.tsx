// import { useEffect, useRef, useCallback } from "react";

// import {
//     IconPlayerPlayFilled,
//     IconPlayerSkipBackFilled,
//     IconPlayerPause,
//     IconPlayerSkipForwardFilled
// } from "@tabler/icons-react";
// import { PlayListIcon } from "../../components/icon";

// function Controls({
//     audioRef,
//     progressBarRef,
//     duration,
//     setTimeProgress,
//     isPlaying,
//     togglePlayPause
// }) {
//     // const [isPlaying, setIsPlaying] = useState(false);
//     // const togglePlayPause = () => {
//     //     setIsPlaying((prev) => !prev);
//     // };

//     //   animation
//     const playAnimationRef = useRef();
//     const [isPlayListOpen, setIsPlayListOpen] = useState(false);

//     const repeat = useCallback(() => {
//         const currentTime = audioRef.current.currentTime;
//         setTimeProgress(currentTime);
//         progressBarRef.current.value = currentTime;
//         progressBarRef.current.style.setProperty(
//             "--range-progress",
//             `${(progressBarRef.current.value / duration) * 100}%`
//         );

//         playAnimationRef.current = requestAnimationFrame(repeat);
//     }, [audioRef, duration, progressBarRef, setTimeProgress]);

//     useEffect(() => {
//         if (isPlaying) {
//             audioRef.current.play();
//             playAnimationRef.current = requestAnimationFrame(repeat);
//         } else {
//             audioRef.current.pause();
//             cancelAnimationFrame(playAnimationRef.current);
//         }
//     }, [isPlaying, audioRef, repeat]);

//     return (
//         <div className="controls-wrapper">
//             <div className="flex items-center">
//                 <button className="p-2 mr-4 rounded-full bg-gray-500">
//                     <IconPlayerSkipBackFilled />
//                 </button>

//                 <button
//                     className="p-2 mx-4 rounded-full bg-gray-500"
//                     onClick={togglePlayPause}
//                 >
//                     {isPlaying ? <IconPlayerPause /> : <IconPlayerPlayFilled />}
//                 </button>
//                 <button className="p-2 mx-4 rounded-full bg-gray-500">
//                     <IconPlayerSkipForwardFilled />
//                 </button>
//                 <button
//                     className="p-2 mx-4 rounded-full bg-gray-500 h-[40px] w-[40px]"
//                     onClick={() => {
//                         console.log("should open play list");
//                         setIsPlayListOpen(!isPlayListOpen);
//                     }}
//                 >
//                     <PlayListIcon className="" />
//                 </button>
//                 {isPlayListOpen && (
//                     <Modal>{console.log("play list", isPlayListOpen)}</Modal>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Controls;
import React, { useEffect, useRef, useCallback, useState } from "react";

import {
    IconPlayerPlayFilled,
    IconPlayerSkipBackFilled,
    IconPlayerPause,
    IconPlayerSkipForwardFilled
} from "@tabler/icons-react";
import { PlayListIcon } from "../../components/icon";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface ControlsProps {
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    progressBarRef: React.MutableRefObject<HTMLInputElement | null>;
    duration: number;
    setTimeProgress: (time: number) => void;
    isPlaying: boolean;
    togglePlayPause: () => void;
}

const Controls: React.FC<ControlsProps> = ({
    audioRef,
    progressBarRef,
    duration,
    setTimeProgress,
    isPlaying,
    togglePlayPause
}) => {
    const playAnimationRef = useRef<number>();
    const [opened, { open, close }] = useDisclosure(false);
    // const [isPlayListOpen, setIsPlayListOpen] = useState(false);

    const modalStyles = {
        top: "20%",
        left: "80%",
        width: "20%"
    };

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
                    // onClick={() => {
                    //     setIsPlayListOpen(!isPlayListOpen);
                    // }}
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
                    <>play list</>
                </Modal>
            </div>
        </div>
    );
};

export default Controls;
