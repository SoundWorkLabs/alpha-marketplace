"use client";
import {
    IconHeartFilled,
    IconHeart,
    IconPlayerPause,
    IconPlayerPlayFilled
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AudioContextData, MetaSchema, NftCardProps, UserInfo } from "./types";
import { useAudio } from "../context/audioPlayerContext";
import { nftData } from "../../services/NFT";
import { SolIcon } from "./icon";
import { usePlaylist } from "../context/playlistProviderContext";
import { fetchUserByAddress } from "../../services/user";
import { Avatar } from "@mantine/core";

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
    const [metaDetails, setMetaDetails] = useState<MetaSchema | undefined>();
    // const { togglePlayPause, setCurrentTrack, currentTrack, PlayList } =
    //     useAudio();
    const [isPlaying, setIsPlaying] = useState(false);
    const [like, setLike] = useState(true);
    const { addToPlaylist } = usePlaylist();
    const [author, setAuthor] = useState<UserInfo>();
    // const [trackList, setTrackList] = useState<
    //     Array<AudioContextData["currentTrack"]>
    // >([]);

    useEffect(() => {
        nftData(nft.nft_address).then((res) => {
            if (res) {
                setMetaDetails(res.metaDetails);
                fetchUserByAddress(nft.current_owner).then((res) => {
                    setAuthor(res);
                });
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
    // const author = nft?.current_owner.slice(0, 10);
    const coverArt = nft?.image_url;
    const handlePlayPauseClick = () => {
        if (animation_url) {
            setIsPlaying(!isPlaying);
            addToPlaylist({
                track: animation_url,
                author: author?.username,
                title: title,
                coverArt: coverArt
            });
            // setCurrentTrack({
            //     track: animation_url,
            //     author: author,
            //     title: title,
            //     coverArt: coverArt
            // });
            // togglePlayPause();
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
                            className="rounded-[8.84px] mb-5 h-nft-h w-nft-w"
                            // className="rounded-[8.84px] mb-5"
                            width={234.27}
                            height={208.85}
                        />
                    </Link>
                    <div
                        className="play-pause-nft w-fit h-fit"
                        onClick={handlePlayPauseClick}
                    >
                        {/* TO DO: toggle play pause  for specify track*/}

                        {/* {isPlaying ? (
                            <IconPlayerPause
                                className="pause-button-nft hover:text-gray-300"
                                size={64}
                            />
                        ) : ( */}
                        <IconPlayerPlayFilled
                            className="player-button-nft hover:text-gray-300"
                            size={64}
                        />
                        {/* )} */}
                    </div>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <div className="flex flex-wrap items-center">
                        <Avatar
                            src={author?.avatar_url as string}
                            size="1.11025rem"
                        />
                        <p className="text-[14.44px] text-[#47DEF2] ml-1">
                            {/* {nft.current_owner.slice(0, 10)} */}
                            {author?.username}
                        </p>
                    </div>

                    <p className="text-[22px] font-[400] leading-relaxed">
                        {nft.title.length >= 25
                            ? `${nft.title.slice(0, 22)}...`
                            : nft.title}
                    </p>
                </div>

                {/* <p className="text-[#FFFFFF61] text-[15.471px]">
                        we need availabilty prop
                        10 available{" "}
                    </p> */}

                <div className="flex flex-wrap justify-between mt-4 items-center">
                    {nft?.listings ? (
                        // <div className="flex justify-between items-center">
                        <div className="flex flex-wrap items-center">
                            <SolIcon />
                            <p className="text-[20.471px] text-[#47DEF2] ml-2 font-[500]">
                                {nft.listings[0].list_price}
                            </p>
                        </div>
                    ) : (
                        // </div>
                        ""
                    )}
                    <button onClick={handleLike} className="ml-auto">
                        {!like ? (
                            <IconHeartFilled className="text-[#FE0F3A] w-[26.521px] h-[26.521px]" />
                        ) : (
                            <IconHeart className="w-[26.521px] h-[26.521px]" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NftCard;
