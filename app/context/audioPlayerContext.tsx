"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AudioContextData {
    isPlaying: boolean;
    togglePlayPause: () => void;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    currentTrack:
        | {
              track: string | undefined;
              author: string | undefined;
              title: string | undefined;
              coverArt: string | undefined;
          }
        | undefined;
    setCurrentTrack: React.Dispatch<
        React.SetStateAction<AudioContextData["currentTrack"] | undefined>
    >;
    PlayList: Array<AudioContextData["currentTrack"]>;
}

const AudioContext = createContext<AudioContextData | undefined>(undefined);

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

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<
        AudioContextData["currentTrack"] | undefined
    >();
    const [PlayList, setPlayList] = useState<
        Array<AudioContextData["currentTrack"]>
    >([]);

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
                setCurrentTrack,
                PlayList
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};
