"use client";

import { Avatar, Box, Flex, TextInput } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { fetchUserNfts } from "../../services/NFT";
import NftCard from "../components/NftCard";
import { NftSchema } from "../components/types";

const dummyItemValObj = {
    Items: 34,
    Followers: 655,
    "Avg. Sale": 0.6,
    Traded: 0.56
};

export default function Profile() {
    const { publicKey } = useWallet();
    const [pubkey, setPubkey] = useState("");
    const [isConnected, setConnection] = useState(false);
    const [selectedOption, setSelectedOption] = useState(0);
    const [userNfts, setUserNfts] = useState<NftSchema[]>([]);

    useEffect(() => {
        if (!publicKey) {
            const connectBtn = document.querySelector(
                ".connectBtn"
            ) as HTMLButtonElement;

            return connectBtn?.click();
        }
        const userPubKey =
            `${publicKey?.toBase58().substring(0, 4) ?? ""}...${
                publicKey?.toBase58().substring(28, 32) ?? ""
            }` ?? "";
        setPubkey(userPubKey);
        const userData = async () => {
            setConnection(true);
            return setUserNfts(await fetchUserNfts(publicKey?.toBase58()));
        };
        userData();
    }, [publicKey]);

    const options = [
        "In Wallet",
        "Favorites",
        "My Activity",
        "Offers",
        "Hidden"
    ];

    return (
        <>
            {isConnected ? (
                <Box className="mx-5 p-5">
                    <Flex gap="lg" className="" wrap="wrap">
                        <Flex direction="column" gap={20}>
                            <Box>
                                <Avatar
                                    size="xl"
                                    src={null}
                                    alt="Jimii Mutuku"
                                    color="red"
                                >
                                    JM
                                </Avatar>
                            </Box>
                            <Box className="mt-4">{pubkey}</Box>
                        </Flex>

                        <Flex direction="column" gap={20} className="ml-16">
                            <Box>
                                <Box
                                    // style={{
                                    //     border: "2px solid var(--mantine-color-bright)",
                                    //     borderRadius: "0",
                                    //     color: "var(--mantine-color-bright)"
                                    // }}
                                    className="border border-[#D7D6D633] bg-[#D9D9D90A] rounded-[12px]"
                                >
                                    <Flex className="py-5 px-5" gap={100}>
                                        {Object.entries(dummyItemValObj).map(
                                            ([label, value]) => (
                                                <Stat
                                                    key={label}
                                                    label={label}
                                                    value={value}
                                                />
                                            )
                                        )}
                                    </Flex>
                                </Box>
                            </Box>
                            <Box>
                                {/* <CustomPill color=""  label="edit profile" /> */}
                                <button
                                    // variant="primary"
                                    className="bg-btn-bg rounded-full p-2 w-[207px]"
                                >
                                    Edit Profile
                                </button>
                            </Box>
                        </Flex>
                    </Flex>
                    <Box className="items-center">
                        <Flex className="space-x-20 mt-16 justify-center ">
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    className={
                                        selectedOption === index
                                            ? "border-b-[3px] pb-4 profile-selected-opt w-[137px]"
                                            : ""
                                    }
                                    onClick={() => {
                                        setSelectedOption(index);
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </Flex>
                    </Box>

                    <Box className="border border-[#D7D6D633] rounded-[12px] h-76 flex flex-wrap items-center justify-between bg-[#D9D9D90A]">
                        <div className="flex flex-wrap items-center mx-2">
                            {" "}
                            <TextInput
                                w={382}
                                radius={20}
                                className="search-profile p-2 h-[48px]"
                                placeholder="Search by music..."
                            />
                            <div className="font-[300] text-[16px] text-[#B3B3B3]">
                                0 results
                            </div>
                        </div>
                        <div className="mx-4">
                            <button className="text-[16px] mr-4 text-[#B3B3B3]  bg-[#0204164F] rounded-full w-[137px] h-[45px]">
                                Sort by
                            </button>{" "}
                            <button className="text-[16px] text-[#B3B3B3]  bg-[#0204164F] rounded-full w-[137px] h-[45px]">
                                filter
                            </button>
                        </div>
                    </Box>

                    {selectedOption == 0 && (
                        <Box className="flex flex-wrap">
                            {" "}
                            {userNfts && userNfts.length > 0 ? (
                                userNfts
                                    .slice()
                                    .reverse()
                                    .map((nft) => (
                                        <NftCard
                                            key={nft.nft_address}
                                            nft={nft}
                                        />
                                    ))
                            ) : (
                                <div>Loading...</div>
                            )}
                        </Box>
                    )}
                    {/* TO DO: implement other btns */}
                </Box>
            ) : null}
        </>
    );
}

function Stat({ value, label }: { value: number; label: string }) {
    return (
        <Box>
            <Box>{value}</Box>
            <Box>{label}</Box>
        </Box>
    );
}
