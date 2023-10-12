import { Text } from "@mantine/core";
import { IconHeartFilled, IconHeart } from "@tabler/icons-react";
import { useState } from "react";

export default function NftCard() {
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
        <div className="nft-cards p-5 w-full">
            <div className=" custom-border p-4 ">
                <img
                    src="https://i.imgur.com/5fPwIQr.jpeg"
                    alt=""
                    className="rounded-lg mb-5"
                />
                <Text size="sm">Artist name</Text>
                <Text>track title</Text>
                <Text>price</Text>
                <Text>number available</Text>
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
}
