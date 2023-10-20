"use client";
import { Text } from "@mantine/core";
import { IconHeartFilled, IconHeart } from "@tabler/icons-react";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NftCardProps } from "./types";

const NftCard: React.FC<NftCardProps> = ({ nft }) => {
    const handleLike = () => {
        if (!like == true) {
            setLike(true);
            return <IconHeartFilled floodColor="red" />;
        } else {
            setLike(false);
            return <IconHeart />;
        }
    };

    const [like, setLike] = useState(true);

    return (
        <div className="nft-cards p-5 w-nft-card-w h-nft-card-h">
            <div className="custom-border p-4 w-full h-full">
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
                        className="rounded-lg mb-5"
                        width={234.27}
                        height={208.85}
                        style={{
                            objectFit: "fill"
                        }}
                    />
                </Link>
                <Text fw={500}>{nft.title}</Text>
                <Text size="sm">{nft.current_owner.slice(0, 10)}</Text>
                <button onClick={handleLike} className="flex text-right">
                    {!like ? (
                        <IconHeartFilled className="text-red-500" />
                    ) : (
                        <IconHeart />
                    )}
                </button>
            </div>
        </div>
    );
};

export default NftCard;
