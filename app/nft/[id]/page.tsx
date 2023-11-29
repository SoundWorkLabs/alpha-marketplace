"use client";
import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo
} from "react";
import { useParams } from "next/navigation";
import {
    Box,
    CopyButton,
    ActionIcon,
    rem,
    Modal,
    TextInput,
    Avatar,
    Image,
    Container,
    Select
} from "@mantine/core";
import { IconCopy, IconCheck, IconPlayerPlayFilled } from "@tabler/icons-react";
import { SoundworkListSDK } from "@jimii/soundwork-sdk";
import { SoundworkBidSDK } from "@jimii/soundwork-sdk";
import {
    useAnchorWallet,
    useConnection,
    useWallet
} from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, BN } from "@coral-xyz/anchor";

import {
    fetchSingleListedNfts,
    fetchSolUsd,
    nftData
} from "../../../services/NFT";
import LibAudioPlayer from "../../explore/components/AudioPlayer";
import { MetaSchema, NftSchema, UserInfo } from "../../components/types";
import SoundWorkLogo, { SolIcon } from "../../components/icon";
import { useAudio } from "../../context/audioPlayerContext";
import { fetchUserByAddress } from "../../../services/user";
import { createListing, deleteListing } from "../../../services/listing";
import getUnixTimestampForExpiry from "../../components/unixConvertor";

const ExpiryDateOptions = [
    { value: "1", label: "1 Day" },
    { value: "3", label: "3 Days" },
    { value: "7", label: "7 Days" },
    { value: "30", label: "1 Month" }
    // { value: "custom", label: "Custom" }
];

export default function Page() {
    const { id: nftAddress } = useParams();

    const wallet = useWallet();
    const anchorWallet = useAnchorWallet();
    const { connection } = useConnection();
    const pubkey = anchorWallet?.publicKey.toBase58();
    const mint = new PublicKey(nftAddress);

    const { setCurrentTrack } = useAudio();
    const [metaDetails, setMetaDetails] = useState<MetaSchema | undefined>();
    const [currentOwner, setCurrentOwner] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [value, setValue] = useState("");
    const playPauseRef = useRef(null);

    const [author, setAuthor] = useState<UserInfo>();
    const [listingInfo, setListingInfo] = useState<NftSchema["listings"]>();
    const [solUsd, setSolUsd] = useState<string>();
    const [expiryDate, setExpiryDate] = useState("");

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

    // initializing anchor provider
    const anchorProvider = useMemo((): AnchorProvider => {
        if (!anchorWallet) {
            throw new Error("wallet not connected");
        }
        return new AnchorProvider(
            connection,
            anchorWallet,
            AnchorProvider.defaultOptions()
        );
    }, [anchorWallet, connection]);

    // initializing sound work SDKs
    const listSDK = useMemo((): SoundworkListSDK => {
        return new SoundworkListSDK(anchorProvider, connection);
    }, [anchorProvider, connection]);

    const bidSDK = useMemo((): SoundworkBidSDK => {
        return new SoundworkBidSDK(anchorProvider, connection);
    }, [anchorProvider, connection]);

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
            a.href = animation_url ?? "";
            a.download = title ?? "";
            try {
                a.click();
            } catch (err) {
                console.log("download failed");
            }
        } else {
            if (listingInfo) {
                handleBuy(listingInfo[0].id);
            }
        }
    };

    const handleBuy = useCallback(
        async (id: string) => {
            let ix = await listSDK.buyListing(mint);
            let tx = new Transaction().add(ix);

            try {
                await wallet
                    .sendTransaction(tx, connection)
                    .then(async (txHash) => {
                        console.log("tx hash", txHash);
                        await deleteListing(id).then((res) => {
                            console.log(res);
                        });
                    });
            } catch (err) {
                console.log("buying failed", err);
            }
        },
        [listSDK, connection, pubkey, mint]
    );

    const handleListing = useCallback(
        async (price: number) => {
            if (!pubkey) throw new Error("wallet not connected");

            const ix = await listSDK.createListing(mint, price);
            let tx = new Transaction().add(ix);

            try {
                await wallet
                    .sendTransaction(tx, connection)
                    .then(async (txHash) => {
                        console.log("tx hash", txHash);
                        await createListing(txHash, pubkey, mint, price).then(
                            (res) => {
                                console.log(res);
                            }
                        );
                    });
            } catch (err) {
                console.log("listing failed", err);
            }
        },
        [listSDK, connection, pubkey, mint]
    );

    const handleDeleteListing = useCallback(
        async (nftID: string) => {
            const ix = await listSDK.deleteListing(mint);
            const tx = new Transaction().add(ix);

            try {
                await wallet
                    .sendTransaction(tx, connection)
                    .then(async (txHash) => {
                        console.log("tx hash", txHash);
                        await deleteListing(nftID).then((res) => {
                            console.log(res);
                        });
                    });
            } catch (err) {
                console.log("deleting nft failed", err);
            }
        },
        [listSDK, connection, pubkey, mint]
    );

    const handleEditListing = useCallback(
        async (newPrice: number, nftID: string) => {
            if (!pubkey) throw new Error("wallet not connected");

            const ix = await listSDK.editListing(mint, newPrice);
            const tx = new Transaction().add(ix);

            try {
                await wallet
                    .sendTransaction(tx, connection)
                    .then(async (txHash) => {
                        console.log("tx hash", txHash);
                        await deleteListing(nftID).then((res) => {
                            console.log(res);
                        });
                        await createListing(
                            txHash,
                            pubkey,
                            mint,
                            newPrice
                        ).then((res) => {
                            console.log(res);
                        });
                    });
            } catch (err) {
                console.log("edit failed", err);
            }
        },
        [listSDK, connection, pubkey, mint]
    );

    const handleBid = useCallback(
        async (offerPrice: number, expiryDate: string) => {
            const expire_ts = getUnixTimestampForExpiry(expiryDate);

            const ix = await bidSDK.placeBid(
                mint,
                new BN(offerPrice * LAMPORTS_PER_SOL),
                new BN(expire_ts)
            );

            const tx = new Transaction().add(ix);

            try {
                const txHash = await wallet.sendTransaction(tx, connection);
                // .then(async (txHash) => {
                //     console.log("tx hash", txHash);
                //     // kasuba97 todo: post txHash to the bid route
                // });
                console.log(txHash);
            } catch (err) {
                console.log("bid failed", err);
            }
        },
        [bidSDK, mint, wallet, connection]
    );

    const handleExpiryDateChange = (value: string) => {
        console.log("expiry date", value);
        setExpiryDate(value);
    };

    if (isLoading) {
        return (
            <>
                <div className="p-5 my-2 mx-5 scroll-smooth animate-pulse">
                    <Box className="flex flex-wrap gap-x-10">
                        <div className="relative w-[26.375rem] h-[26.375rem] bg-[#1d1f2592] rounded-[0.5525rem]"></div>
                        <Box className="max-w-[39vw] my-auto xl:max-w-full">
                            <div className="bg-[#1d1f2592] w-[8rem] h-[2.41175rem]"></div>
                            <div className="mt-2 mb-2 bg-[#1d1f2592] w-[10rem] h-[2.41175rem]"></div>
                            <Box className="p-4 flex justify-stretch title-box h-[18.5rem] bg-[#1d1f2592] rounded-[1.1rem] min-w-full"></Box>
                        </Box>
                    </Box>
                    <div className="my-[2.81rem] bg-[#1d1f2592] w-[15rem] h-[5.41175rem]"></div>
                    <div className="my-[2.81rem] bg-[#1d1f2592] w-[15rem] h-[5.41175rem]"></div>
                    <div className="my-[2.81rem] bg-[#1d1f2592] w-[15rem] h-[5.41175rem]"></div>
                </div>
            </>
        );
    }

    if (!metaDetails || !currentOwner) {
        return <div>Data not available. Try again later.</div>;
    }
    // createListing(
    //     "4M3AFY6JcBtWnEKxkv5g1SN69DaCq822tZNnfaDzX52nhDXVmSAw5S5AsvjyGMUe7NLM4m3pw9HvGAStJLZW7P9c",
    //     "5tvtJ9YCxLh2W2QzthXmhrVy91rK3XWptCFRSES5NE3K",
    //     new PublicKey("A2QsAMagYto3gHTKZww5jGzqnjaCtNrp1uTXHdwRDFYC"),
    //     4
    // );
    // deleteListing(
    //     "4EcggLmGkNJJQmTapPDgmGjUFByu8Tv3o1E5GCSFLtMxKWmjJAKSF12sLkTvk9T3dTvDMgFjv6ykzzoF8UpeqZAN"
    // );
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
                            {/* <>
                                {isBuyNowOpen && (
                                    <BuyNow
                                        nftAddress={nftAddress}
                                        onBuyNow={() => {
                                            setIsBuyNowOpen(!isBuyNowOpen);
                                        }}
                                    />
                                )}
                            </> */}
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
                                        setIsEditModalOpen(true);
                                    } else {
                                        setIsOfferModalOpen(true);
                                    }
                                }}
                            >
                                {currentOwner === pubkey
                                    ? listingInfo! && listingInfo[0].list_price
                                        ? "Edit Listing"
                                        : "Sell"
                                    : "Make Offer"}
                            </button>
                        </div>
                        {/* list an NFT modal */}
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
                                            const price = parseInt(value);
                                            handleListing(price);
                                        }}
                                    >
                                        List for Sale
                                    </button>
                                </div>
                            </div>
                        </Modal>
                        {/* edit listing modal */}
                        <Modal
                            opened={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
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
                                <div className="flex flex-wrap justify-between my-2 items-center">
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
                                        className="border border-[#0091D766] rounded-full hover:bg-btn-bg w-[10rem] h-[2.2rem] text-[1rem]"
                                        onClick={() => {
                                            if (listingInfo) {
                                                const newPrice =
                                                    parseInt(value);
                                                handleEditListing(
                                                    newPrice,
                                                    listingInfo?.[0].id
                                                );
                                            }
                                        }}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        className="border border-[#0091D766] rounded-full hover:bg-btn-bg w-[10rem] h-[2.2rem] text-[1rem]"
                                        onClick={() => {
                                            if (listingInfo) {
                                                handleDeleteListing(
                                                    listingInfo?.[0].id
                                                );
                                            }
                                        }}
                                    >
                                        Delete Listing
                                    </button>
                                </div>
                            </div>
                        </Modal>
                        {/* bid modal */}
                        <Modal
                            opened={isOfferModalOpen}
                            onClose={() => setIsOfferModalOpen(false)}
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
                                    Set Offer
                                </div>
                                <div className="flex flex-wrap justify-evenly my-2 items-center">
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
                                    <div>
                                        <Container className="w-[10rem]">
                                            <Select
                                                data={ExpiryDateOptions}
                                                placeholder="Select Expiry Date"
                                                value={expiryDate}
                                                onChange={
                                                    handleExpiryDateChange
                                                }
                                                id="expiryDate"
                                            />
                                        </Container>
                                    </div>
                                    <button
                                        className="border border-[#0091D766] rounded-full hover:bg-btn-bg w-[10rem] h-[2.2rem] text-[1rem]"
                                        onClick={() => {
                                            const price = Number(value);
                                            console.log("price", price);
                                            handleBid(price, expiryDate);
                                        }}
                                    >
                                        Confirm
                                    </button>
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
                                  className="text-[1.25rem] font-[300] leading-[1.44375rem] bg-[#D9D9D90A] border border-[#D7D6D633] rounded-[0.75rem] w-[10.5rem] h-[3.9375rem] overflow-hidden"
                              >
                                  {Object.entries(attributes).map(
                                      ([key, value]) => (
                                          <div
                                              key={key}
                                              className="mx-[1.12rem] mt-[.44rem] text-[0.8125rem] font-[300]"
                                          >
                                              <div className="">{key}</div>
                                              <div className="text-[1.375rem] font-[400]">
                                                  {value}
                                              </div>
                                          </div>
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
