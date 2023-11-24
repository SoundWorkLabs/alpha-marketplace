"use client";

import { Avatar, Box, Flex, TextInput } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { fetchUserNfts } from "../../services/NFT";
import NftCard from "../components/NftCard";
import { NftSchema, UserInfo } from "../components/types";
import { fetchUserByAddress } from "../../services/user";
import NftFallback from "../components/NftFallback";
import { SearchIcon, SortIcon, FilterIcon } from "../components/icon";

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
    const [userInfo, setUserInfo] = useState<UserInfo>();

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
            setUserInfo(await fetchUserByAddress(publicKey?.toBase58()));
            setUserNfts(await fetchUserNfts(publicKey?.toBase58()));
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
                                    src={userInfo?.avatar_url}
                                    alt="user avatar img"
                                    // color="red"
                                />
                                {/* </Avatar> */}
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
                                    className="bg-btn-bg rounded-full py-[0.6875rem] px-[1.8125rem] w-[12.9375rem] text-[1rem] font-[300] leading-[1.04rem]"
                                >
                                    Edit Profile
                                </button>
                            </Box>
                        </Flex>
                    </Flex>
                    <Box className="items-center">
                        <Flex className="space-x-20 mt-16 justify-center text-[1.25rem] font-[400] leading-1.3rem">
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    className={
                                        selectedOption === index
                                            ? "border-b-[0.1875rem] pb-4 profile-selected-opt w-[8.5625rem]"
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

                    <Box className="border border-[#D7D6D633] rounded-[0.75rem] h-[4.75rem] flex flex-wrap items-center justify-between bg-[#D9D9D90A]">
                        <div className="flex flex-wrap items-center mx-2 space-x-[1.56rem]">
                            {" "}
                            <TextInput
                                w={"25.6875rem"}
                                radius={"3rem"}
                                className="search items-center p-[.75] pl-[1.25rem] leading-[1.04rem]"
                                placeholder="Search by music..."
                                leftSection={<SearchIcon />}
                            />
                            <div className="font-[300] text-[1rem] text-[#B3B3B3]">
                                0 results
                            </div>
                        </div>
                        <div className="mx-4 flex flex-wrap">
                            <button className="w-[7.625rem] h-[3rem] ml-4 bg-[#0204164F] rounded-[3rem] space-x-2 flex flex-wrap items-center justify-center">
                                <p className="text-[#B3B3B3] font-[400] leading-[1.5rem]">
                                    Sort by
                                </p>
                                <SortIcon />
                            </button>
                            <button className="w-[7.625rem] h-[3rem] ml-4 bg-[#0204164F] rounded-[3rem] space-x-2 flex flex-wrap items-center justify-center">
                                <p className="text-[#B3B3B3] font-[400] leading-[1.5rem]">
                                    Filters
                                </p>
                                <FilterIcon />
                            </button>
                        </div>
                    </Box>

                    {selectedOption == 0 && (
                        <Box className="flex flex-wrap">
                            {" "}
                            {userNfts && userNfts.length > 0
                                ? userNfts
                                      .slice()
                                      .reverse()
                                      .map((nft) => (
                                          <NftCard
                                              key={nft.nft_address}
                                              nft={nft}
                                          />
                                      ))
                                : Array.from({ length: 10 }, (_, index) => (
                                      <NftFallback key={index} />
                                  ))}
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
