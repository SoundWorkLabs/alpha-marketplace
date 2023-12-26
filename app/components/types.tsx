import React from "react";
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
    className?: string;
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
export interface UserInfo {
    active_address: string;
    avatar_url: string;
    is_admin: boolean;
    user_id: number;
    username: string;
}

export interface BidSchema {
    bid_id: string;
    nft_address: string;
    bidder_id: number;
    bid_amount: string;
    bid_date?: null;
    account: {
        active_address: string;
    };
    nft: {
        current_owner: string;
    };
    bidMeta: MetaSchema;
    bidderUsername: string;
    sellerUsername: string;
}
