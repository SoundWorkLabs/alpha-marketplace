import { Text } from "@mantine/core";
import { IconHeartFilled, IconHeart } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { fetchNftData } from "../explore/data/tracks";
import Link from "next/link";

interface NftSchema {
    nft_address: string;
    title: string;
    current_owner: string;
    image_url: string;
    audioUrl: string;
    metadata_uri: string;
}

export default function NftCard() {
    const [nfts, setNfts] = useState<NftSchema[]>([]);

    useEffect(() => {
        fetchNftData()
            .then((res) => {
                if (res && res.data) {
                    setNfts(res.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
            });
    }, []);
    return (
        <div className="flex flex-wrap">
            {nfts && nfts.length > 0 ? (
                nfts.map((nft) => (
                    <Link
                        href={`/nft/[id]?owner=${nft.current_owner}&metadata=${nft.metadata_uri}`}
                        as={`/nft/${nft.nft_address}`}
                        passHref
                        key={nft.nft_address}
                        shallow
                    >
                        <span className="nft-cards">
                            <Card nft={nft} />
                        </span>
                    </Link>
                ))
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

const Card: React.FC<{
    nft: NftSchema;
}> = ({ nft }) => {
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
        <div className="nft-cards p-5">
            <div className=" custom-border p-4">
                <img
                    src={nft.image_url}
                    alt="nft image"
                    className="rounded-lg mb-5 w-234.27 h-208.85"
                />
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
