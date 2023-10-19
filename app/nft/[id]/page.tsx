"use client";

import { useParams } from "next/navigation";
import { nftData } from "../../../services/NFT";
import React, { useEffect, useState } from "react";
import { Box, CopyButton, ActionIcon, rem } from "@mantine/core";
import Image from "next/image";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import LibAudioPlayer from "../../explore/components/AudioPlayer";
import { MetaSchemma } from "../../explore/data/tracks";
import SoundWorkLogo from "../../components/icon";
import { useWallet } from "@solana/wallet-adapter-react";
import { encode, decode } from "bs58";

export default function Page() {
    // const currentURL = window.location.href;
    const nftAddress = useParams();
    const { publicKey } = useWallet();

    const pubkey = publicKey ? publicKey?.toBase58() : "";
    console.log(pubkey);

    const [metaDetails, setMetaDetails] = useState<MetaSchemma>();
    const [currentOwner, setCurrentOwner] = useState<string>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        nftData(nftAddress.id)
            .then((res) => {
                if (res) {
                    setMetaDetails(res.metaDetails);
                    setCurrentOwner(res.nftDetails.current_owner);
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [nftAddress.id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!metaDetails || !currentOwner) {
        return <div>Data not available. Try again later.</div>;
    }

    const animation_url = metaDetails?.animation_url;
    const description = metaDetails?.description;
    const image = metaDetails?.image;
    const title = metaDetails?.title;

    return (
        <div className="p-5 my-2 mx-5 scroll-smooth">
            <Box className="flex flex-wrap">
                <Image
                    priority
                    src={image}
                    alt="nft imaga"
                    className="rounded-md dynamic-image"
                    height={600}
                    width={600}
                />
                <Box className="mx-6 flex-1 ">
                    <div className="flex flex-wrap  my-5">
                        <span className="text-[#E6E6E6]">Owner By: </span>
                        <CopyButton
                            value={currentOwner ? (currentOwner as string) : ""}
                            timeout={250}
                        >
                            {({ copied, copy }) => (
                                <div
                                    onClick={copy}
                                    // color={copied ? "blue" : "gray"}
                                    className="flex flex-wrap mx-3 cursor-pointer "
                                >
                                    {currentOwner?.slice(0, 10)}
                                    <ActionIcon
                                        color="transparent"
                                        className="mx-2 hover:bg-transparent"
                                    >
                                        {copied ? (
                                            <IconCheck
                                                style={{ width: rem(16) }}
                                            />
                                        ) : (
                                            <IconCopy
                                                style={{ width: rem(16) }}
                                            />
                                        )}
                                    </ActionIcon>
                                </div>
                            )}
                        </CopyButton>
                    </div>
                    <Box className="border custom-border p-4 whitespace-pre-wrap justify-stretch bg-detail-bg title-box">
                        <div className="mini-logo flex flex-wrap">
                            <SoundWorkLogo />
                            <p className="text-3xl mx-5">{title}</p>
                        </div>

                        <div className=" mx-5 my-5">
                            <button className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg mx-8 my-2 p-3 w-nft-w">
                                {currentOwner === pubkey
                                    ? "Download"
                                    : "Buy Now"}
                            </button>
                            <button className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg mx-8 my-2 p-3 w-nft-w">
                                {currentOwner === pubkey
                                    ? "Sell"
                                    : "Make Offer"}
                            </button>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className=" mx-5 ">
                                    <th className="columns">Files</th>
                                    <th className="columns">Type</th>
                                    <th className="columns">Format</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Row 2, Column 1</td>
                                    <td>Row 2, Column 2</td>
                                    <td>Row 2, Column 3</td>
                                </tr>
                                <tr>
                                    <td>Row 2, Column 1</td>
                                    <td>Row 2, Column 2</td>
                                    <td>Row 2, Column 3</td>
                                </tr>
                            </tbody>
                        </table>
                    </Box>
                </Box>
            </Box>
            <div className="my-3">
                <p className="text-3xl my-3">Description </p>
                <p>{description}</p>
            </div>
            <div className="my-5">
                <p className="text-3xl my-3">Properties</p>
            </div>
            <div className="my-5">
                <p className="text-3xl my-3">Price History</p>
            </div>
            <div>animation_url: {animation_url}</div>
            <div className="fixed bg-aduio-bg  bottom-4 rounded-full w-3/4 px-5">
                <LibAudioPlayer />
            </div>
        </div>
    );
}
