"use client";
import React, { ReactNode, createContext, useContext, useState } from "react";
import { AudioContextData, useAudio } from "./audioPlayerContext";

interface PlaylistContextType {
    PlayList: Array<AudioContextData["currentTrack"]>;
    addToPlaylist: (track: AudioContextData["currentTrack"]) => void;
    removeFromPlaylist: () => void;
    playCurrentTrack: () => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
    undefined
);

interface PlaylistProviderProps {
    children: ReactNode;
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({
    children
}) => {
    const [PlayList, setPlayList] = useState<
        Array<AudioContextData["currentTrack"]>
    >([]);
    const {
        currentTrack,
        setCurrentTrack,
        togglePlayPause,
        isPlaying,
        setIsPlaying
    } = useAudio();

    const addToPlaylist = (track: AudioContextData["currentTrack"]) => {
        if (currentTrack === undefined) {
            setCurrentTrack(track);
            setIsPlaying(!isPlaying);
            togglePlayPause();
        } else {
            setPlayList([track, ...PlayList]);
        }
    };

    const removeFromPlaylist = () => {
        if (PlayList.length > 0) {
            const [nextTrack, ...restOfPlaylist] = PlayList;
            setPlayList(restOfPlaylist);
            setCurrentTrack(nextTrack);
        } else {
            setCurrentTrack(undefined);
        }
    };

    const playCurrentTrack = () => {
        togglePlayPause();
    };

    const contextValue: PlaylistContextType = {
        PlayList,
        addToPlaylist,
        removeFromPlaylist,
        playCurrentTrack
    };

    return (
        <PlaylistContext.Provider value={contextValue}>
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylist = () => {
    const context = useContext(PlaylistContext);
    if (!context) {
        throw new Error("usePlaylist must be used within a PlaylistProvider");
    }
    return context;
};
