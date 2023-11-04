"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { nftData } from "../../../services/NFT";
import {
    Box,
    CopyButton,
    ActionIcon,
    rem,
    Pill,
    Modal,
    TextInput
} from "@mantine/core";
import Image from "next/image";
import {
    IconCopy,
    IconCheck,
    IconPlayerPlayFilled,
    IconPlayerPause
} from "@tabler/icons-react";
import LibAudioPlayer from "../../explore/components/AudioPlayer";
import { MetaSchema } from "../../components/types";
import SoundWorkLogo from "../../components/icon";
import { useAudio } from "../../context/audioPlayerContext";

import ListingNft from "../../components/modals/listingNft";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import BuyNow from "../../components/BuyNow";
import { SoundworkSDK } from "@jimii/soundwork-sdk";
import { PublicKey, Transaction } from "@solana/web3.js";

import { AnchorProvider } from "@coral-xyz/anchor";

export default function Page() {
    const { id: nftAddress } = useParams();
    const wallet = useAnchorWallet();

    const { isPlaying, togglePlayPause, setCurrentTrack, currentTrack } =
        useAudio();
    const [metaDetails, setMetaDetails] = useState<MetaSchema | undefined>();
    const [currentOwner, setCurrentOwner] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [value, setValue] = useState("");
    const [isPrice, setIsPrice] = useState<number>(0);
    const playPauseRef = useRef(null);
    const [isListing, setIsListing] = useState(false);
    const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
    const pubkey = wallet?.publicKey.toBase58();

    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();

    // TODO: this data should be passed in from the page we are navigating from
    useEffect(() => {
        nftData(nftAddress)
            .then((res) => {
                if (res) {
                    setMetaDetails(res.metaDetails);
                    setCurrentOwner(res.nftDetails.current_owner);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [nftAddress]);

    const animation_url = metaDetails?.animation_url;
    const description = metaDetails?.description;
    const image = metaDetails?.image;
    const title = metaDetails?.title;
    const atrr = metaDetails?.attributes;

    const handleClick = () => {
        if (!pubkey) {
            const connectBtn = document.querySelector(
                ".connectBtn"
            ) as HTMLButtonElement;

            connectBtn?.click();
        } else if (currentOwner === pubkey) {
            const a = document.createElement("a");
            a.href = animation_url ?? ""; // todo: handle err
            a.download = title ?? ""; // todo: handle error
            a.click();
        } else {
            setIsBuyNowOpen(!isBuyNowOpen);
        }
    };

    const handleBuy = useCallback(async () => {
        if (!anchorWallet) throw new Error("wallet not connected");
        if (!pubkey) throw new Error("wallet not connected");

        const provider = await new AnchorProvider(connection, anchorWallet, {});

        const soundworkSDK = new SoundworkSDK(provider, connection);

        let nftMint = new PublicKey(
            "5BxzpdNRuGnbSXpLfrZyxDTX3jGZEELwdj1mLWhgWTv"
        ); // ! remove me
        let ix = await soundworkSDK.buyListing(nftMint);
        let tx = new Transaction();
        let blockhash = (await connection.getLatestBlockhash("finalized"))
            .blockhash;
        tx.recentBlockhash = blockhash;
        tx.feePayer = new PublicKey(pubkey);
        tx.add(ix);

        const {
            phantom: { solana: phantomProvider }
        }: any = window; // phantom
        let txHash = await phantomProvider.signAndSendTransaction(tx);

        // let txhash = await provider.sendAndConfirm(tx);
        console.log("tx hash", txHash);
    }, [anchorWallet, connection]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!metaDetails || !currentOwner) {
        return <div>Data not available. Try again later.</div>;
    }

    return (
        <div className="p-5 my-2 mx-5 scroll-smooth">
            <Box className="flex flex-wrap gap-x-10">
                <div className="image-container">
                    <Image
                        priority
                        src={image ?? ""}
                        alt="nft image"
                        className="rounded-md dynamic-image"
                        height={600}
                        width={600}
                    />
                    <div
                        className="play-pause-container"
                        onClick={() => {
                            setCurrentTrack({
                                track: animation_url,
                                title: title,
                                author: currentOwner.slice(0, 10)
                            });
                            togglePlayPause();
                        }}
                    >
                        {isPlaying ? (
                            <IconPlayerPause
                                className="pause-button"
                                size={142}
                            />
                        ) : (
                            <IconPlayerPlayFilled
                                className="player-button"
                                size={142}
                            />
                        )}
                    </div>
                </div>

                <Box className="flex-1 max-w-[39vw] my-auto xl:max-w-full">
                    <div className="flex flex-wrap my-5">
                        <span className="text-[#E6E6E6]">Owner By: </span>
                        <CopyButton
                            value={currentOwner ? (currentOwner as string) : ""}
                            timeout={250}
                        >
                            {({ copied, copy }) => (
                                <div
                                    onClick={copy}
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
                    <Box className="custom-border1 p-4 justify-stretch title-box">
                        <div className="mini-logo flex flex-wrap">
                            <SoundWorkLogo />
                            <p className="text-3xl mx-5">{title}</p>
                        </div>

                        <div className="my-5 flex justify-between">
                            <button
                                className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg my-2 p-3 w-nft-w"
                                onClick={() => handleBuy()}
                            >
                                {currentOwner === pubkey
                                    ? "Download"
                                    : "Buy Now"}
                            </button>
                            <>
                                {isBuyNowOpen && (
                                    <BuyNow
                                        nftAddress={nftAddress}
                                        onBuyNow={() => {
                                            setIsBuyNowOpen(!isBuyNowOpen);
                                        }}
                                    />
                                )}
                            </>
                            <button
                                className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg mx-8 my-2 p-3 w-nft-w"
                                onClick={() => {
                                    if (!pubkey) {
                                        const connectBtn =
                                            document.querySelector(
                                                ".connectBtn"
                                            ) as HTMLButtonElement;
                                        connectBtn?.click();
                                    } else if (currentOwner === pubkey) {
                                        setIsSellModalOpen(true);
                                    } else {
                                        setIsOfferModalOpen(true);
                                    }
                                }}
                            >
                                {currentOwner === pubkey
                                    ? "Sell"
                                    : "Make Offer"}
                            </button>
                        </div>
                        <Modal
                            opened={isSellModalOpen}
                            onClose={() => setIsSellModalOpen(false)}
                            radius={17.681}
                            top={200}
                            withCloseButton={false}
                            closeOnClickOutside={true}
                            closeOnEscape={true}
                            size={652}
                        >
                            <div className="mx-5">
                                <div className="text-xl font-bold">
                                    Set Price
                                </div>
                                <div className="flex flex-wrap justify-between">
                                    <div className="flex items-center space-x-2">
                                        <TextInput
                                            className="modal-input border-[2.21px] border-[rgba(0, 145, 215, 0.40)] rounded-md font-mono font-bold"
                                            withAsterisk
                                            type="number"
                                            value={value}
                                            onChange={(e) => {
                                                setValue(e.currentTarget.value);
                                            }}
                                        />
                                        <div className="sol-label px-[29px]  border border-[#0091D766] rounded-full ">
                                            SOL
                                        </div>
                                    </div>
                                    <button
                                        className="rounded-full bg-btn-bg w-nft-w"
                                        onClick={() => {
                                            const price = parseFloat(value);
                                            setIsPrice(price);
                                            setIsListing(true);
                                        }}
                                    >
                                        List for Sale
                                    </button>
                                    <div>
                                        {isListing && (
                                            <ListingNft
                                                price={isPrice}
                                                nftAddress={nftAddress}
                                                closeModal={() => {
                                                    setValue("");
                                                    setIsSellModalOpen(false);
                                                    setIsListing(false);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        <table className="w-full table-auto overflow-y-auto">
                            <thead>
                                <tr className=" mx-0 ">
                                    <th className="columns">Files</th>
                                    <th className="columns">Type</th>
                                    <th className="columns">Format</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                <tr>
                                    {/* <td>
                                        {files
                                            ? files.map((file) => {
                                                  console.log(file);
                                                  return `we need name for files`;
                                              })
                                            : ""}
                                    </td>
                                    <td>{category ? category : ""}</td>

                                    {files
                                        ? files.map((file) => {
                                              console.log(file.type);
                                              const fileName = file.type;
                                              return <td>{fileName}</td>;
                                          })
                                        : ""} */}
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
                <p className="text-3xl my-3">Description</p>
                <p>{description}</p>
            </div>
            <div className="my-5">
                <p className="text-3xl my-3">Properties</p>
                {atrr
                    ? atrr.map((attributes, index) => {
                          return (
                              <div key={index}>
                                  {Object.entries(attributes).map(
                                      ([key, value]) => (
                                          <Pill key={key}>
                                              <span className="bg-audio-bg">
                                                  {key}:
                                              </span>
                                              <span className="bg-transparent">
                                                  {value}
                                              </span>
                                          </Pill>
                                      )
                                  )}
                              </div>
                          );
                      })
                    : null}
            </div>
            <div className="my-5">
                <p className="text-3xl my-3">Price History</p>
            </div>
            <div className="fixed bg-aduio-bg bottom-4 rounded-full w-3/4 h-76 px-7">
                <LibAudioPlayer
                // isPlaying={isPlaying}
                // togglePlayPause={togglePlayPause}
                // currentTrack={currentTrack}
                />
            </div>
        </div>
    );
}
