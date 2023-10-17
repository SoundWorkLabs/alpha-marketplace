"use client";

import { useParams } from "next/navigation";
import { nftData } from "../../explore/data/tracks";
import React, { useEffect, useState } from "react";
import { Box, CopyButton, ActionIcon, Tooltip, rem } from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import LibAudioPlayer from "../../explore/components/AudioPlayer";

export default function page() {
    const currentURL = window.location.href;
    const target = useParams();
    console.log("t", target.id);

    const [metaDetails, setMetaDetails] = useState(null);
    const [currentOwner, setCurrentOwner] = useState(null);

    useEffect(() => {
        nftData(target.id).then((res) => {
            if (res) {
                setMetaDetails(res.metaDetails);
                setCurrentOwner(res.currentOwner);
            }
        });
    }, [target.id]);
    if (!metaDetails) {
        return <div>loadind...</div>;
    }
    const { animation_url, description, image, title } = metaDetails;

    return (
        <div className="p-5 my-5 mx-5">
            <Box className="flex flex-wrap">
                <img src={image} className="rounded-md dynamic-image" />
                <Box className="mx-6 flex-1 ">
                    <div className="flex flex-wrap  my-5">
                        <span>Owner By: </span>
                        <CopyButton value={currentOwner} timeout={250}>
                            {({ copied, copy }) => (
                                <div
                                    onClick={copy}
                                    // color={copied ? "blue" : "gray"}
                                    className="flex flex-wrap mx-3  "
                                >
                                    {currentOwner.slice(0, 10)}
                                    <ActionIcon
                                        color="transparent"
                                        className="mx-3 hover:bg-transparent"
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
                        <div className="title flex flex-wrap">
                            <img src="/minilogo.png" width={33} height={33} />

                            <p className="text-3xl mx-5">{title}</p>
                        </div>
                        <div className="mx-5 my-5">
                            <button className="border rounded-full hover:bg-btn-bg1 mx-5 my-2 p-3 w-234.27">
                                Download
                            </button>
                            <button className="border rounded-full hover:bg-btn-bg mx-5 my-2 p-3 w-234.27">
                                Sell
                            </button>
                        </div>
                        <table className="w-full">
                            <tr className=" mx-5 ">
                                <td className="columns">Files</td>
                                <td className="columns">Type</td>
                                <td className="columns">Format</td>
                            </tr>

                            <tr className="mx-3">
                                <td className="rows my-5 mx-5">
                                    Row 2, Column 1
                                </td>
                                <td className="rows my-5 mx-5">
                                    Row 2, Column 2
                                </td>
                                <td className="rows my-5 mx-5">
                                    Row 2, Column 3
                                </td>
                            </tr>
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
            <div className="fixed left-9.75rem right-0 bg-aduio-bg  rounded-full p-4 transform -translate-x-1/2 left-1/2">
                <LibAudioPlayer />
            </div>
        </div>
    );
}

// {metaDetails: {…}, currentOwner: '4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF'}
// currentOwner
// :
// "4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF"
// metaDetails
// :
// animation_url
// :
// "https://storage.googleapis.com/sw-test-2023/sounds/2023-10-11T13:21:39.188Z_file_example_WAV_5MG.wav"
// attributes
// :
// (2) [{…}, {…}]
// description
// :
// "real ones know this"
// image
// :
// "https://storage.googleapis.com/sw-test-2023/images/2023-10-11T13:21:38.799Z_BocchiRunner2049.jpeg"
// properties
// :
// {category: 'audio', files: Array(2)}
// symbol
// :
// ""
// title
// :
// "bocchi"
