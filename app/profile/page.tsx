"use client";

import { Avatar, Box, Flex, TextInput } from "@mantine/core";
import {
    useAnchorWallet,
    useConnection,
    useWallet
} from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchUserNfts } from "../../services/NFT";
import NftCard from "../components/NftCard";
import { BidSchema, NftSchema, UserInfo } from "../components/types";
import { fetchUserByAddress } from "../../services/user";
import NftFallback from "../components/NftFallback";
import { SearchIcon, SortIcon, FilterIcon, SolIcon } from "../components/icon";
import { deleteBid, fetchOffersReceived } from "../../services/bidding";
import { SoundworkBidSDK } from "@jimii/soundwork-sdk";
import { AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import toast from "react-hot-toast";
import Image from "next/image";

const dummyItemValObj = {
    Items: 34,
    Followers: 655,
    "Avg. Sale": 0.6,
    Traded: 0.56
};

export default function Profile() {
    const { publicKey } = useWallet();
    const wallet = useWallet();
    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();
    const [pubkey, setPubkey] = useState("");
    const [isConnected, setConnection] = useState(false);
    const [selectedOption, setSelectedOption] = useState(0);
    const [userNfts, setUserNfts] = useState<NftSchema[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [refreshReceived, setRefreshReceived] = useState(false);
    const [offersReceived, setOffersReceived] = useState<BidSchema[]>([]);

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

    // fetching offers
    useEffect(() => {
        if (publicKey) {
            fetchOffersReceived(publicKey.toBase58()).then((res) => {
                console.log("offers received", res);
                if (res) {
                    setOffersReceived(res);
                }
            });
        }
    }, [refreshReceived, publicKey]);

    // initializing anchor provider
    const anchorProvider = useMemo((): AnchorProvider | undefined => {
        try {
            if (!anchorWallet) {
                throw new Error("wallet not connected");
            }
            return new AnchorProvider(
                connection,
                anchorWallet,
                AnchorProvider.defaultOptions()
            );
        } catch (err) {
            console.log("wallet not connected");
            return undefined;
        }
    }, [anchorWallet, connection]);

    // initializing sound work SDKs
    const bidSDK = useMemo((): SoundworkBidSDK | undefined => {
        if (anchorProvider) {
            return new SoundworkBidSDK(anchorProvider, connection);
        }
        return undefined;
    }, [anchorProvider, connection]);

    const options = [
        "In Wallet",
        "Favorites",
        "My Activity",
        "Offers",
        "Hidden"
    ];

    const handleAcceptOffer = useCallback(
        async (bidId: string, mint: string) => {
            const ix = await bidSDK?.acceptBid(new PublicKey(mint));
            if (ix) {
                const tx = new Transaction().add(ix);

                try {
                    await wallet
                        .sendTransaction(tx, connection)
                        .then(async () => {
                            await deleteBid(bidId).then(() => {
                                console.log("success");
                                toast.success(
                                    "You Successfully accepted the offer!",
                                    {
                                        duration: 3000,
                                        position: "top-center",
                                        style: {
                                            animation: "ease-in-out",
                                            background: "#0091D766",
                                            borderRadius: "20px",
                                            color: "white"
                                        }
                                    }
                                );
                                setRefreshReceived(true);
                            });
                        });
                } catch (err) {
                    console.log("error", err);
                    toast.error("Failed to accepted the offer!", {
                        duration: 3000,
                        position: "top-center",
                        style: {
                            animation: "ease-in-out",
                            background: "#0091D766",
                            borderRadius: "20px",
                            color: "white"
                        }
                    });
                }
            }
        },
        [bidSDK, connection, publicKey?.toBase58()]
    );
    const handleRejectOffer = useCallback(
        async (bidId: string, mint: string) => {
            const ix = await bidSDK?.rejectBid(new PublicKey(mint));
            if (ix) {
                const tx = new Transaction().add(ix);

                try {
                    await wallet
                        .sendTransaction(tx, connection)
                        .then(async () => {
                            await deleteBid(bidId).then(() => {
                                console.log("success");
                                toast.success(
                                    "You Successfully rejected the offer!",
                                    {
                                        duration: 3000,
                                        position: "top-center",
                                        style: {
                                            animation: "ease-in-out",
                                            background: "#0091D766",
                                            borderRadius: "20px",
                                            color: "white"
                                        }
                                    }
                                );
                                setRefreshReceived(true);
                            });
                        });
                } catch (err) {
                    console.log("error", err);
                    toast.error("Failed to reject the offer!", {
                        duration: 3000,
                        position: "top-center",
                        style: {
                            animation: "ease-in-out",
                            background: "#0091D766",
                            borderRadius: "20px",
                            color: "white"
                        }
                    });
                }
            }
        },
        [bidSDK, connection, publicKey?.toBase58()]
    );

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

                    {/* offers */}
                    {selectedOption == 3 &&
                        offersReceived &&
                        offersReceived.length > 0 && (
                            <Box className="flex flex-col">
                                {offersReceived
                                    .slice()
                                    .reverse()
                                    .map((bidReceived, index) => (
                                        <Box
                                            key={index}
                                            className="my-2 flex flex-wrap border border-[#0091D766] p-5 rounded-[0.5525rem] justify-between items-center"
                                        >
                                            {bidReceived.bidMeta?.image ? (
                                                <Box className="flex flex-wrap space-x-5">
                                                    <div className="w-[10rem] h-[10rem]">
                                                        <Image
                                                            className="w-[10rem] h-[10rem] rounded-[0.5525rem]"
                                                            src={
                                                                bidReceived
                                                                    .bidMeta
                                                                    ?.image
                                                            }
                                                            alt="bid-img"
                                                            // radius="0.5525rem"
                                                            width={300}
                                                            height={300}
                                                            quality={100}
                                                            priority
                                                        />
                                                    </div>

                                                    <div className="space-y-5 py-5 text-[1.3rem] font-[300] leading-5">
                                                        <div>
                                                            {`Title: ${bidReceived.bidMeta?.title}`}
                                                        </div>
                                                        <div>
                                                            {`Bidder: ${bidReceived.bidderUsername}`}
                                                        </div>
                                                        <div className="flex flex-wrap space-x-5 items-center">
                                                            <div>
                                                                Offer Amount:
                                                            </div>
                                                            <div className="flex flex-wrap items-center space-x-2">
                                                                <SolIcon />
                                                                <div>
                                                                    {
                                                                        bidReceived.bid_amount
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Box>
                                            ) : (
                                                <div className="flex flex-wrap space-x-5 animate-pulse">
                                                    <div className="w-[10rem] h-[10rem] bg-[#1d1f2592] rounded-[0.5525rem]"></div>
                                                    <div className="space-y-5 py-5">
                                                        <div className="w-[7.5rem] h-[1.5rem] bg-[#1d1f2592] rounded-[0.5525rem]"></div>
                                                        <div className="w-[7.5rem] h-[1.5rem] bg-[#1d1f2592] rounded-[0.5525rem]"></div>
                                                        <div className="w-[7.5rem] h-[1.5rem] bg-[#1d1f2592] rounded-[0.5525rem]"></div>
                                                    </div>
                                                </div>
                                            )}

                                            <Box className="flex flex-col">
                                                <button
                                                    className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg p-3 w-nft-w text-[1rem] font-[300] leading-5"
                                                    onClick={() => {
                                                        handleAcceptOffer(
                                                            bidReceived.bid_id,
                                                            bidReceived.nft_address
                                                        );
                                                    }}
                                                >
                                                    Accept Offer
                                                </button>
                                                <button
                                                    className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg my-2 p-3 w-nft-w text-[1rem] font-[300] leading-5"
                                                    onClick={() => {
                                                        handleRejectOffer(
                                                            bidReceived.bid_id,
                                                            bidReceived.nft_address
                                                        );
                                                    }}
                                                >
                                                    Reject Offer
                                                </button>
                                            </Box>
                                        </Box>
                                    ))}
                            </Box>
                        )}
                    {/* {selectedOption == 3 && <>in offers</>} */}
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
