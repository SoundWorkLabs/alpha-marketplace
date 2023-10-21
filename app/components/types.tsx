export interface NftSchemma {
    nft_address: string;
    collection_address: string | null;
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
export interface MetaSchemma {
    animation_url: string;
    attributes: string[];
    description: string;
    image: string;
    properties: { category: "audio"; files: string[] };
    symbol: string;
    title: string;
}

export interface NftCardProps {
    nft: NftSchemma;
}

export interface ControlsProps {
    audioRef: React.RefObject<HTMLAudioElement>;
    progressBarRef: React.RefObject<HTMLInputElement>;
    duration: number;
    setTimeProgress: (time: number) => void;
    isPlaying: boolean;
    togglePlayPause: () => void;
}
