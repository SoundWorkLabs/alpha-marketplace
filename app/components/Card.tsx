import { Text } from "@mantine/core";
import Image from "next/image";
export default function Cards() {
    return (
        <div className="collections-cards p-5 h-nft-card-h w-nft-card-w">
            <div className="custom-border p-4">
                <Image
                    src="https://i.imgur.com/5fPwIQr.jpeg"
                    alt=""
                    className="rounded-lg mb-5"
                    width={234.27}
                    height={208.85}
                />
                <Text fw={500}>Name of Collections</Text>
                <Text size="sm">Artist name</Text>
            </div>
        </div>
    );
}
