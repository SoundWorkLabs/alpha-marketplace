"use client";
import { Text } from "@mantine/core";
import {
    IconHeartFilled,
    IconHeart,
    IconPlayerPause,
    IconPlayerPlayFilled
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MetaSchema, NftCardProps } from "./types";
import { useAudio } from "../context/audioPlayerContext";
import { nftData } from "../../services/NFT";
import { SolIcon } from "./icon";

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
    const [metaDetails, setMetaDetails] = useState<MetaSchema | undefined>();
    const { togglePlayPause, setCurrentTrack, currentTrack } = useAudio();
    const [isPlaying, setIsPlaying] = useState(false);
    const [like, setLike] = useState(true);

    useEffect(() => {
        nftData(nft.nft_address).then((res) => {
            if (res) {
                setMetaDetails(res.metaDetails);
            }
        });
    }, []);

    const handleLike = () => {
        if (!like == true) {
            setLike(true);
            return <IconHeartFilled floodColor="red" />;
        } else {
            setLike(false);
            return <IconHeart />;
        }
    };

    const animation_url = metaDetails?.animation_url;
    const title = metaDetails?.title;
    const author = nft?.current_owner.slice(0, 10);
    // console.log("list", nft?.listings[0]);
    const handlePlayPauseClick = () => {
        if (animation_url) {
            setIsPlaying(!isPlaying);
            togglePlayPause();
            setCurrentTrack({
                track: animation_url,
                author: author,
                title: title
            });
        }
    };
    return (
        <div className="nft-cards w-nft-card-w h-nft-card-h my-5 mr-5">
            <div className="custom-border p-[12px] w-full h-full">
                {/* <div className="border-[2px] border-[linear-gradient(90deg, rgba(0, 145, 215, 0.4) 0%, #0091D7 43.75%, #FE0FD4 100%)] rounded-[17.681px] p-[12px] w-full h-full"> */}

                <div>
                    <Link
                        href={`/nft/[id]?owner=${nft.current_owner}&metadata=${nft.metadata_uri}`}
                        as={`/nft/${nft.nft_address}`}
                        passHref
                        key={nft.nft_address}
                    >
                        <Image
                            priority={true}
                            src={nft.image_url}
                            alt="nft image"
                            className="rounded-[8.84px] mb-5"
                            width={234.27}
                            height={208.85}
                            style={{
                                objectFit: "fill"
                            }}
                        />
                    </Link>
                    <div
                        className="play-pause-nft w-fit h-fit"
                        onClick={handlePlayPauseClick}
                    >
                        {isPlaying ? (
                            <IconPlayerPause
                                className="pause-button-nft hover:text-gray-300"
                                size={64}
                            />
                        ) : (
                            <IconPlayerPlayFilled
                                className="player-button-nft hover:text-gray-300"
                                size={64}
                            />
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-[22px] font-[400] leading-relaxed">
                        {nft.title}
                    </p>
                    <p className="text-[14.44px] text-[#47DEF2]">
                        {nft.current_owner.slice(0, 10)}
                    </p>
                </div>

                {nft?.listings ? (
                    // nft?.listings[0] && (
                    <div className="flex justify-between items-center">
                        <div className="flex flex-wrap items-center">
                            <SolIcon />
                            <p className="text-[20.471px] text-[#47DEF2] ml-2 font-[500]">
                                {nft.listings[0].list_price}
                                {/* &copy; */}
                            </p>
                        </div>
                    </div>
                ) : (
                    ""
                )}

                {/* <p className="text-[#FFFFFF61] text-[15.471px]">
                        we need availabilty prop
                        10 available{" "}
                    </p> */}

                <div className="flex flex-wrap justify-end mt-[1.5px]">
                    <button onClick={handleLike} className="flex text-right">
                        {!like ? (
                            <IconHeartFilled className="text-red-500" />
                        ) : (
                            <IconHeart />
                        )}
                    </button>
                    {/* <button
                        className="bg-slate-800 rounded-full px-3"
                        onClick={() => {
                            if (animation_url) {
                                setCurrentTrack({
                                    author: author,
                                    title: title,
                                    track: animation_url
                                });
                                togglePlayPause();
                            }
                        }}
                    >
                        preview
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default NftCard;
