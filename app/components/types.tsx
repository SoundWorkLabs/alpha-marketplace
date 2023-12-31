import React, { ReactNode, createContext, useContext, useState } from "react";
import { useAudio } from "../context/audioPlayerContext";
export interface NftSchema {
    nft_address: string;
    collection_address: string | null;
    listings: [
        {
            id: string;
            list_price: string;
            nft_address: string;
        }
    ];
    title: string;
    token_standard: string | null;
    current_owner: string;
    description: string;
    seller_fee_basis_points: number | null;
    image_url: string;
    metadata_uri: string;
    is_confirmed: boolean;
    available_for_lease: boolean;
}
export interface MetaSchema {
    animation_url: string;
    attributes: string[];
    description: string;
    image: string;
    properties: { category: "audio"; files: string[] };
    symbol: string;
    title: string;
}

export interface NftCardProps {
    nft: NftSchema;
}

export interface ControlsProps {
    audioRef: React.RefObject<HTMLAudioElement>;
    progressBarRef: React.RefObject<HTMLInputElement>;
    duration: number;
    setTimeProgress: (time: number) => void;
    isPlaying: boolean;
    togglePlayPause: () => void;
}
export interface AudioContextData {
    isPlaying: boolean;
    togglePlayPause: () => void;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    // currentTrack: string;
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
}
export interface LibAudioPlayerProps {
    isPlaying: boolean;
    togglePlayPause: () => void;
    currentTrack: AudioContextData["currentTrack"];
}
