"use client";

// import React, { createContext, useContext, useState } from "react";

// const AudioContext = createContext();

// export function useAudioContext() {
//     return useContext(AudioContext);
// }

// export function AudioProvider({ children }) {
//     const [currentTrack, setCurrentTrack] = useState("");
//     const [isPlaying, setIsPlaying] = useState(false);

//     // Other audio-related state and functions can be added here

//     return (
//         <AudioContext.Provider
//             value={{
//                 currentTrack,
//                 setCurrentTrack,
//                 isPlaying,
//                 setIsPlaying
//                 // Add other audio-related data and functions here
//             }}
//         >
//             {children}
//         </AudioContext.Provider>
//     );
// }

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define a TypeScript interface for the context data
interface AudioContextData {
    isPlaying: boolean;
    togglePlayPause: () => void;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    currentTrack: string; // Add this line
    setCurrentTrack: React.Dispatch<React.SetStateAction<string>>;
    // Add more properties as needed
}

// Create the context
const AudioContext = createContext<AudioContextData | undefined>(undefined);

// Create a custom hook for using the audio context
export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
};

interface AudioProviderProps {
    children: ReactNode;
}

// Define your AudioProvider component
export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<string>("");
    // Define the togglePlayPause function
    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    return (
        <AudioContext.Provider
            value={{
                isPlaying,
                togglePlayPause,
                setIsPlaying,
                currentTrack,
                setCurrentTrack
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};
