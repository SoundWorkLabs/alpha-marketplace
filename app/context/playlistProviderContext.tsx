"use client";
import React, { ReactNode, createContext, useContext, useState } from "react";
import { AudioContextData, useAudio } from "./audioPlayerContext";
import LibAudioPlayer from "../explore/components/AudioPlayer";
import { usePathname } from "next/navigation";

interface PlaylistContextType {
    PlayList: Array<AudioContextData["currentTrack"]>;
    addToPlaylist?: (
        track: AudioContextData["currentTrack"]
    ) => void | undefined;
    removeFromPlaylist: () => void;
    removeAllFromPlaylist: () => void;
    skipBackward: () => void;
    skipForward: () => void;
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
    const [prevTracks, setPrevTracks] = useState<
        Array<AudioContextData["currentTrack"]>
    >([]);
    const [trackIndex, setTrackIndex] = useState(0);
    const {
        currentTrack,
        setCurrentTrack,
        togglePlayPause,
        isPlaying,
        setIsPlaying
    } = useAudio();

    const playTrack = (track: AudioContextData["currentTrack"]) => {
        setPrevTracks((prevTracks) =>
            [...prevTracks, currentTrack].filter(Boolean)
        );
        setCurrentTrack(track);
        // togglePlayPause();
    };
    const addToPlaylist = (track: AudioContextData["currentTrack"]) => {
        if (currentTrack === undefined) {
            // setCurrentTrack(track);
            playTrack(track);

            setIsPlaying(!isPlaying);
            // togglePlayPause();
        } else {
            setPlayList([track, ...PlayList]);
        }
    };
    const removeFromPlaylist = () => {
        if (PlayList.length > 0) {
            const [nextTrack, ...restOfPlaylist] = PlayList;
            setPlayList(restOfPlaylist);
            // setCurrentTrack(nextTrack);\
            playTrack(nextTrack);
        } else {
            setCurrentTrack(undefined);
        }
    };
    const removeAllFromPlaylist = () => {
        if (PlayList.length > 0) {
            setPlayList([]);
            setPrevTracks([]);
        }
    };

    const skipBackward = () => {
        if (prevTracks.length > 0) {
            const [prevTrack, ...restOfPrevTracks] = prevTracks;
            setPrevTracks(restOfPrevTracks);

            if (
                prevTrack &&
                !PlayList.some(
                    (track) => track && track.title === prevTrack.title
                )
            ) {
                setPlayList([...PlayList]);
            }

            playTrack(prevTrack);
        } else {
            if (
                currentTrack &&
                !PlayList.some(
                    (track) => track && track.title === currentTrack.title
                )
            ) {
                setPlayList([currentTrack, ...PlayList]);
            }

            playTrack(currentTrack);
        }
    };

    const skipForward = () => {
        if (PlayList.length > 0) {
            const [nextTrack, ...restOfPlaylist] = PlayList;
            setPlayList([nextTrack, ...PlayList]);
            playTrack(nextTrack);
        } else {
            setCurrentTrack(undefined);
        }
    };
    const contextValue: PlaylistContextType = {
        PlayList,
        addToPlaylist,
        removeFromPlaylist,
        removeAllFromPlaylist,
        skipBackward,
        skipForward
    };

    return (
        <PlaylistContext.Provider value={contextValue}>
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylist = () => {
    const pathname = usePathname();
    const context = useContext(PlaylistContext);
    if (!context && pathname !== "/") {
        throw new Error("usePlaylist must be used within a PlaylistProvider");
    }
    return context;
};
