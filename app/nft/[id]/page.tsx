"use client";
import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    Suspense
} from "react";
import { useParams } from "next/navigation";
import {
    fetchSingleListedNfts,
    fetchSolUsd,
    nftData
} from "../../../services/NFT";
import {
    Box,
    CopyButton,
    ActionIcon,
    rem,
    Pill,
    Modal,
    TextInput,
    Avatar,
    Image
} from "@mantine/core";
// import Image from "next/image";
import { IconCopy, IconCheck, IconPlayerPlayFilled } from "@tabler/icons-react";
import LibAudioPlayer from "../../explore/components/AudioPlayer";
import { MetaSchema, NftSchema, UserInfo } from "../../components/types";
import SoundWorkLogo, { SolIcon } from "../../components/icon";
import { useAudio } from "../../context/audioPlayerContext";

import ListingNft from "../../components/modals/listingNft";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import BuyNow from "../../components/BuyNow";
import { SoundworkSDK } from "@jimii/soundwork-sdk";
import { PublicKey, Transaction } from "@solana/web3.js";

import { AnchorProvider } from "@coral-xyz/anchor";
import { fetchUserByAddress } from "../../../services/user";
import { deleteListing } from "../../../services/listing";

export default function Page() {
    const { id: nftAddress } = useParams();
    const wallet = useAnchorWallet();

    const { setCurrentTrack } = useAudio();
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
    const [author, setAuthor] = useState<UserInfo>();
    const [listingInfo, setListingInfo] = useState<NftSchema["listings"]>();
    const [solUsd, setSolUsd] = useState<string>();

    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();

    // TODO: this data should be passed in from the page we are navigating from
    useEffect(() => {
        nftData(nftAddress)
            .then((res) => {
                if (res) {
                    setMetaDetails(res.metaDetails);
                    setCurrentOwner(res.nftDetails.current_owner);
                    fetchUserByAddress(res.nftDetails.current_owner).then(
                        (res) => {
                            setAuthor(res);
                        }
                    );

                    fetchSingleListedNfts(nftAddress).then((res) => {
                        if (res) {
                            res.listings.length > 0;
                            return setListingInfo(res.listings);
                        }
                    });

                    fetchSolUsd().then((res) => {
                        setSolUsd(res);
                    });
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
            if (typeof window !== "undefined") {
                const connectBtn = document.querySelector(
                    ".connectBtn"
                ) as HTMLButtonElement;

                connectBtn?.click();
            }
        } else if (currentOwner === pubkey) {
            const a = document.createElement("a");
            a.href = animation_url ?? ""; // todo: handle err
            a.download = title ?? ""; // todo: handle error
            a.click();
        } else {
            handleBuy();
        }
    };

    const handleBuy = useCallback(async () => {
        if (!anchorWallet) throw new Error("wallet not connected");
        if (!pubkey) throw new Error("wallet not connected");

        const provider = await new AnchorProvider(connection, anchorWallet, {});

        const soundworkSDK = new SoundworkSDK(provider, connection);

        let nftMint = new PublicKey(nftAddress);
        let ix = await soundworkSDK.buyListing(nftMint);
        let tx = new Transaction();
        let blockhash = (await connection.getLatestBlockhash("finalized"))
            .blockhash;
        tx.recentBlockhash = blockhash;
        tx.feePayer = new PublicKey(pubkey);
        tx.add(ix);

        try {
            const {
                phantom: { solana: phantomProvider }
            }: any = window; // phantom
            let txHash = await phantomProvider.signAndSendTransaction(tx);

            // let txhash = await provider.sendAndConfirm(tx);
            console.log("tx hash", txHash);
        } catch (err) {
            console.log("buying failed", err);
        }
    }, [anchorWallet, connection, pubkey]);

    const handleDeleteListing = useCallback(async () => {
        if (!anchorWallet) throw new Error("wallet not connected");
        if (!pubkey) throw new Error("wallet not connected");

        const provider = await new AnchorProvider(connection, anchorWallet, {});

        const soundworkSDK = new SoundworkSDK(provider, connection);

        let nftMint = new PublicKey(nftAddress);

        const ix = await soundworkSDK.deleteListing(nftMint);
        const tx = new Transaction();
        let blockhash = (await connection.getLatestBlockhash("finalized"))
            .blockhash;
        tx.recentBlockhash = blockhash;
        tx.feePayer = new PublicKey(pubkey);
        tx.add(ix);

        try {
            const {
                phantom: { solana: phantomProvider }
            }: any = window; // phantom
            let txHash = await phantomProvider.signAndSendTransaction(tx);

            // let txhash = await provider.sendAndConfirm(tx);
            console.log("tx hash", txHash);

            if (listingInfo && txHash) {
                deleteListing(listingInfo[0].id);
            }
        } catch (err) {
            console.log("deleting nft failed", err);
        }
    }, [anchorWallet, connection, pubkey]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!metaDetails || !currentOwner) {
        return <div>Data not available. Try again later.</div>;
    }

    return (
        <div className="p-5 my-2 mx-5 scroll-smooth">
            <Box className="flex flex-wrap gap-x-10">
                <div className="relative w-[26.375rem] h-[26.375rem]">
                    <Image
                        // priority
                        src={image ?? ""}
                        alt="nft image"
                        className="dynamic-image"
                        // height="26.375rem"
                        // width="26.375rem"
                        radius="0.5525rem"
                    />
                    <div
                        className="play-pause-container"
                        onClick={() => {
                            setCurrentTrack({
                                track: animation_url,
                                title: title,
                                author: currentOwner.slice(0, 10),
                                coverArt: image
                            });
                            // togglePlayPause();
                        }}
                    >
                        {/* {isPlaying ? ( */}
                        {/* <IconPlayerPause className="pause-button" size={142} />
                        ) : ( */}
                        <IconPlayerPlayFilled
                            className="player-button"
                            size={142}
                        />
                        {/* )} */}
                    </div>
                </div>

                <Box className="flex-1 max-w-[39vw] my-auto xl:max-w-full">
                    <div className="flex flex-wrap items-center">
                        <Avatar
                            src={author?.avatar_url as string}
                            size="2.41175rem"
                        />
                        <p className="text-[1.25rem] text-[#47DEF2] font-[500] ml-1">
                            {/* {nft.current_owner.slice(0, 10)} */}
                            {author?.username}
                        </p>
                    </div>
                    <div className="flex flex-wrap mt-2 mb-2">
                        <span className="text-[#E6E6E6] text-[1rem] font-[300]">
                            Owner By:{" "}
                        </span>
                        <CopyButton
                            value={currentOwner ? (currentOwner as string) : ""}
                            timeout={250}
                        >
                            {({ copied, copy }) => (
                                <div
                                    onClick={copy}
                                    className="flex flex-wrap mx-3 cursor-pointer "
                                >
                                    {currentOwner === pubkey
                                        ? "You"
                                        : currentOwner?.slice(0, 10)}
                                    <ActionIcon
                                        color="transparent"
                                        className="hover:bg-transparent"
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
                    <Box className="custom-border1 p-4 justify-stretch title-box w-full h-[18.5rem]">
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="mini-logo flex flex-wrap items-center space-x-5">
                                <SoundWorkLogo />
                                <p className="text-[2.25rem] font-[500]">
                                    {title}
                                </p>
                            </div>

                            {listingInfo && (
                                <div className="flex flex-wrap items-center space-x-4">
                                    <span className="sol-icon-price">
                                        <SolIcon />
                                    </span>
                                    <p className="text-[2.25rem] font-[500] leading-[2.59875rem]">
                                        {listingInfo! &&
                                            `${listingInfo[0].list_price} ( $${(
                                                parseFloat(
                                                    listingInfo! &&
                                                        listingInfo[0]
                                                            .list_price
                                                ) *
                                                parseFloat(solUsd! && solUsd)
                                            ).toFixed(2)} )`}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="my-[1.12rem] flex justify-between">
                            <button
                                className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg my-2 p-3 w-nft-w text-[1rem] font-[300]"
                                onClick={() => handleClick()}
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
                                className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg my-2 p-3 w-nft-w text-[1rem] font-[300]"
                                onClick={() => {
                                    if (!pubkey) {
                                        const connectBtn =
                                            document?.querySelector(
                                                ".connectBtn"
                                            ) as HTMLButtonElement;
                                        connectBtn?.click();
                                    } else if (
                                        currentOwner === pubkey &&
                                        !listingInfo!
                                    ) {
                                        setIsSellModalOpen(true);
                                    } else if (
                                        currentOwner === pubkey &&
                                        listingInfo!
                                    ) {
                                        console.log("should open delete modal");
                                        handleDeleteListing();
                                    } else {
                                        setIsOfferModalOpen(true);
                                    }
                                }}
                            >
                                {currentOwner === pubkey
                                    ? listingInfo! && listingInfo[0].list_price
                                        ? "Delete Listing"
                                        : "Sell"
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
                            overlayProps={{
                                backgroundOpacity: 0.55,
                                blur: 3
                            }}
                            className="listing-nft-modal"
                        >
                            <div className="mx-5">
                                <div className="text-[2rem] font-[500] my-2">
                                    Set Price
                                </div>
                                <div className="flex flex-wrap justify-between my-2">
                                    {/* <div className="flex items-center space-x-2"> */}
                                    <TextInput
                                        className="modal-input border-[rgba(0, 145, 215, 0.40)] rounded-md font-mono font-bold"
                                        withAsterisk
                                        type="number"
                                        value={value}
                                        onChange={(e) => {
                                            setValue(e.currentTarget.value);
                                        }}
                                        leftSection={<SolIcon />}
                                    />
                                    {/* <div className="sol-label px-[29px] border border-[#0091D766] rounded-full ">
                                            SOL
                                        </div> */}
                                    {/* </div> */}
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
            <div className="my-[2.81rem]">
                <p className="text-[2.25rem] font-[500] my-3">Description</p>
                <p className="text-[1.25rem] font-[300] leading-[1.44375rem]">
                    {description}
                </p>
            </div>
            <div className="mb-[2.81rem]">
                <p className="text-[2.25rem] font-[500] my-3">Properties</p>
                {atrr
                    ? atrr.map((attributes, index) => {
                          return (
                              <div
                                  key={index}
                                  className="text-[1.25rem] font-[300] leading-[1.44375rem]"
                              >
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
            <div className="mb-[2.81rem]">
                <p className="text-[2.25rem] font-[500] my-3">Price History</p>
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
