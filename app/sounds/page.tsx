"use client";
import { Box, Flex, TextInput } from "@mantine/core";
import Image from "next/image";
import {
    useAnchorWallet,
    useConnection,
    useWallet
} from "@solana/wallet-adapter-react";
import { fetchUserNfts } from "../../services/NFT";
import { BidSchema, NftSchema } from "../components/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import NftCard from "../components/NftCard";
import NftFallback from "../components/NftFallback";
import { FilterIcon, SearchIcon, SolIcon, SortIcon } from "../components/icon";
import { IconGhost2 } from "@tabler/icons-react";
import {
    deleteBid,
    fetchOffersReceived,
    fetchOffersSent
} from "../../services/bidding";
import { AnchorProvider } from "@coral-xyz/anchor";
import { SoundworkBidSDK } from "@jimii/soundwork-sdk";
import { PublicKey, Transaction } from "@solana/web3.js";
import toast from "react-hot-toast";

export default function Sounds() {
    const anchorWallet = useAnchorWallet();
    const { publicKey, connected } = useWallet();
    const wallet = useWallet();
    const { connection } = useConnection();
    const [nfts, setNfts] = useState<NftSchema[]>([]);
    const [offersReceived, setOffersReceived] = useState<BidSchema[]>([]);
    const [offersSent, setOffersSent] = useState<BidSchema[]>([]);
    const pubkey = publicKey?.toBase58();
    const [selectedOption, setSelectedOption] = useState(0);
    const [refreshReceived, setRefreshReceived] = useState(false);
    const [refreshSent, setRefreshSent] = useState(false);

    useEffect(() => {
        if (!connected || !pubkey) {
            const connectBtn = document.querySelector(
                ".connectBtn"
            ) as HTMLButtonElement;

            return connectBtn?.click();
        }
        fetchUserNfts(pubkey as string)
            .then(async (res) => {
                if (res && res.length > 0) {
                    setNfts(res);
                } else {
                    // If there are no matching NFTs
                    setIsEmpty(true);
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
            });
    }, [connected, publicKey, pubkey]);
    const [isEmpty, setIsEmpty] = useState(false);

    // fetches sent offers
    useEffect(() => {
        if (pubkey) {
            fetchOffersSent(pubkey).then((res) => {
                console.log("offers received", res);
                if (res) {
                    setOffersSent(res);
                    // setRefreshSent(false)
                }
            });
        }
    }, [refreshSent, connected, publicKey, pubkey]);

    // fetches received offers
    useEffect(() => {
        if (pubkey) {
            fetchOffersReceived(pubkey).then((res) => {
                console.log("offers received", res);
                if (res) {
                    setOffersReceived(res);
                }
            });
        }
    }, [refreshReceived, connected, publicKey, pubkey]);
    const options = ["My Sounds", "Offers Received", "Offers made by me"];

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
        [bidSDK, connection, pubkey]
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
        [bidSDK, connection, pubkey]
    );
    const handleDeleteOffer = useCallback(
        async (bidId: string, mint: string) => {
            const ix = await bidSDK?.deleteBid(new PublicKey(mint));
            if (ix) {
                const tx = new Transaction().add(ix);

                try {
                    await wallet
                        .sendTransaction(tx, connection)
                        .then(async () => {
                            await deleteBid(bidId).then(() => {
                                console.log("success");
                                toast.success(
                                    "You Successfully deleted your offer!",
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
                                setRefreshSent(true);
                            });
                        });
                } catch (err) {
                    console.log("error", err);
                    toast.error("Failed to delete offer!", {
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
        [bidSDK, connection, pubkey]
    );
    return (
        <div className="p-5 my-2 mx-5 scroll-smooth">
            <Box className="items-center">
                <Flex className="space-x-20 mt-16 justify-center text-[1.25rem] font-[400] leading-[104%]">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={
                                selectedOption === index
                                    ? "border-b-[0.1875rem] pb-4 profile-selected-opt w-fit"
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

            {/* {!connected ? (
                <>connect your wallet</>
            ) :  */}
            {/* {isEmpty ? (
                <>You dont have any minted sound works</>
            ) : (
                <Box className="flex flex-wrap">
                    {nfts.length > 0 ? (
                        nfts
                            .slice()
                            .reverse()
                            .map((nft) => (
                                <NftCard key={nft.nft_address} nft={nft} />
                            ))
                    ) : (
                        <div>Loading...</div>
                    )}
                </Box>
            )} */}

            {/* my sounds */}
            {!isEmpty ? (
                selectedOption == 0 && (
                    <Box className="flex flex-wrap">
                        {" "}
                        {nfts && nfts.length > 0
                            ? nfts
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
                )
            ) : (
                <div className="mt-10">
                    <div className="flex justify-center">
                        <IconGhost2 className="w-[15rem] h-[15rem]" />
                    </div>

                    <div className="flex justify-center text-[1.5rem] font-[600] leading-[1.3rem]">
                        Oh no! You dont have any minted soundwork NFTs
                    </div>
                </div>
            )}

            {/* offers received*/}
            {!isEmpty &&
                selectedOption == 1 &&
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
                                                        bidReceived.bidMeta
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
                                                    <div>Offer Amount:</div>
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

            {/* offers made by me */}
            {!isEmpty &&
                selectedOption == 2 &&
                offersSent &&
                offersSent.length > 0 && (
                    <Box className="flex flex-col">
                        {offersSent
                            .slice()
                            .reverse()
                            .map((bidSent, index) => (
                                <Box
                                    key={index}
                                    className="my-2 space-y-5 flex flex-wrap border border-[#0091D766] p-5 rounded-[0.5525rem] justify-between items-center"
                                >
                                    {bidSent.bidMeta?.image ? (
                                        <Box className="flex flex-wrap space-x-5">
                                            <div className="w-[10rem] h-[10rem]">
                                                <Image
                                                    className="w-[10rem] h-[10rem] rounded-[0.5525rem]"
                                                    src={bidSent.bidMeta?.image}
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
                                                    {`Title: ${bidSent.bidMeta?.title}`}
                                                </div>
                                                <div>
                                                    {`Seller: ${bidSent.sellerUsername}`}
                                                </div>
                                                <div className="flex flex-wrap space-x-5 items-center">
                                                    <div>Offer Amount:</div>
                                                    <div className="flex flex-wrap items-center space-x-2">
                                                        <SolIcon />
                                                        <div>
                                                            {bidSent.bid_amount}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>{" "}
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

                                    <button
                                        className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg my-2 p-3 w-nft-w text-[1rem] font-[300] leading-5"
                                        onClick={() => {
                                            handleDeleteOffer(
                                                bidSent.bid_id,
                                                bidSent.nft_address
                                            );
                                        }}
                                    >
                                        Delete Offer
                                    </button>
                                </Box>
                            ))}
                    </Box>
                )}
        </div>
    );
}
