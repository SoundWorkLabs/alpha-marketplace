// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import { nftData } from "../../../services/NFT";
// import {
//     Box,
//     CopyButton,
//     ActionIcon,
//     rem,
//     Pill,
//     Modal,
//     TextInput
// } from "@mantine/core";
// import Image from "next/image";
// import {
//     IconCopy,
//     IconCheck,
//     IconPlayerPlayFilled,
//     IconPlayerPause
// } from "@tabler/icons-react";
// import LibAudioPlayer from "../../explore/components/AudioPlayer";
// import { MetaSchemma } from "../../explore/data/tracks";
// import SoundWorkLogo from "../../components/icon";
// import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
// import { AnchorProvider } from "@coral-xyz/anchor";
// import { useAudio } from "../../context/audioPlayerContext";
// import ListingNft from "../../components/modals/ListingNft";

// export default function Page() {
//     const { id: nftAddress } = useParams();
//     const { connection } = useConnection();
//     const wallet = useAnchorWallet();
//     const [provider, setProvider] = useState<AnchorProvider | undefined>();
//     const { isPlaying, togglePlayPause, setCurrentTrack, currentTrack } =
//         useAudio();
//     const [metaDetails, setMetaDetails] = useState<MetaSchemma | undefined>();
//     const [currentOwner, setCurrentOwner] = useState<string>("");
//     const [isLoading, setIsLoading] = useState(true);
//     const [isNotOwner, setOwner] = useState(true);
//     const [isSellModalOpen, setIsSellModalOpen] = useState(false);
//     const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
//     const [value, setValue] = useState("");
//     const playPauseRef = useRef();

//     useEffect(() => {
//         nftData(nftAddress)
//             .then((res) => {
//                 if (res) {
//                     console.log("nft data:", res);

//                     setMetaDetails(res.metaDetails);
//                     setCurrentOwner(res.nftDetails.current_owner);
//                     if (
//                         res.nftDetails.current_owner === publicKey?.toBase58()
//                     ) {
//                         setOwner(false);
//                         console.log("is owner?😥", isNotOwner);
//                     }

//                     // for dev testing
//                     setOwner(false);
//                 }
//             })
//             .catch((error) => {
//                 console.error(error);
//             })
//             .finally(() => {
//                 setIsLoading(false);
//             });
//     }, [nftAddress]);

//     useEffect(() => {
//         if (!wallet) {
//             throw new Error("No wallet available");
//         }
//         console.log("wallet available", wallet);
//         const createProvider = async () => {
//             const provider = await new AnchorProvider(connection, wallet, {
//                 skipPreflight: false,
//                 commitment: "confirmed"
//             });
//             setProvider(provider);
//             return;
//         };
//         createProvider();
//     }, [wallet, connection]);

//     if (!provider) {
//         return <>No provider found</>;
//     }

//     const publicKey = wallet?.publicKey;

//     console.log(`publicKey: ${publicKey} is connected 🔗`);
//     console.log("selling this nft 🍽️", nftAddress);

//     const handleListClick = (e: React.MouseEvent<HTMLButtonElement>) => {
//         e.preventDefault();

//         const inputValue = parseFloat(value);

//         if (!inputValue) {
//             console.log("Invalid value");
//         } else if (!isNaN(inputValue) && inputValue <= 10000) {
//             console.log("Input Value:", inputValue);
//         } else {
//             console.log("Invalid value");
//         }
//     };

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (!metaDetails || !currentOwner) {
//         return <div>Data not available. Try again later.</div>;
//     }

//     const animation_url = metaDetails?.animation_url;
//     const description = metaDetails?.description;
//     const image = metaDetails?.image;
//     const title = metaDetails?.title;
//     const atrr = metaDetails?.attributes;

//     return (
//         <div className="p-5 my-2 mx-5 scroll-smooth">
//             <Box className="flex flex-wrap">
//                 <div className="image-container">
//                     <Image
//                         priority
//                         src={image}
//                         alt="nft imaga"
//                         className="rounded-md dynamic-image"
//                         height={600}
//                         width={600}
//                     />
//                     <div
//                         className="play-pause-container"
//                         onClick={() => {
//                             setCurrentTrack(animation_url);
//                             togglePlayPause();
//                             console.log("should play", animation_url);
//                         }}
//                     >
//                         {isPlaying ? (
//                             <IconPlayerPause
//                                 className="pause-button"
//                                 size={142}
//                             />
//                         ) : (
//                             <IconPlayerPlayFilled
//                                 className="player-button"
//                                 size={142}
//                             />
//                         )}
//                     </div>
//                 </div>

//                 <Box className="mx-6 flex-1 ">
//                     <div className="flex flex-wrap my-5">
//                         <span className="text-[#E6E6E6]">Owner By: </span>
//                         <CopyButton
//                             value={currentOwner ? (currentOwner as string) : ""}
//                             timeout={250}
//                         >
//                             {({ copied, copy }) => (
//                                 <div
//                                     onClick={copy}
//                                     // color={copied ? "blue" : "gray"}
//                                     className="flex flex-wrap mx-3 cursor-pointer "
//                                 >
//                                     {currentOwner?.slice(0, 10)}
//                                     <ActionIcon
//                                         color="transparent"
//                                         className="mx-2 hover:bg-transparent"
//                                     >
//                                         {copied ? (
//                                             <IconCheck
//                                                 style={{ width: rem(16) }}
//                                             />
//                                         ) : (
//                                             <IconCopy
//                                                 style={{ width: rem(16) }}
//                                             />
//                                         )}
//                                     </ActionIcon>
//                                 </div>
//                             )}
//                         </CopyButton>
//                     </div>
//                     <Box className="border custom-border p-4 whitespace-pre-wrap justify-stretch bg-detail-bg title-box">
//                         <div className="mini-logo flex flex-wrap">
//                             <SoundWorkLogo />
//                             <p className="text-3xl mx-5">{title}</p>
//                         </div>

//                         <div className=" mx-5 my-5">
//                             <button className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg mx-8 my-2 p-3 w-nft-w">
//                                 <a
//                                     href={
//                                         !isNotOwner
//                                             ? `${animation_url}`
//                                             : "buy-now-link"
//                                     }
//                                     download={
//                                         !isNotOwner ? `${animation_url}` : ""
//                                     }
//                                 >
//                                     {!isNotOwner ? "Download" : "Buy Now"}
//                                 </a>
//                             </button>

//                             <button
//                                 className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg mx-8 my-2 p-3 w-nft-w"
//                                 onClick={() => {
//                                     // setOwner(true); for testing during dev
//                                     if (!isNotOwner) {
//                                         setIsSellModalOpen(true);
//                                     } else {
//                                         setIsOfferModalOpen(true);
//                                     }
//                                 }}
//                             >
//                                 {!isNotOwner ? "Sell" : "Make Offer"}
//                                 {/* <SellModal {{isOpen={isOpen}}} /> */}
//                             </button>
//                             {/* will be moved to components/Modal  */}
//                             {/* Sell Modal */}

//                             <Modal
//                                 opened={isSellModalOpen}
//                                 onClose={() => setIsSellModalOpen(false)}
//                                 radius={17.681}
//                                 top={200}
//                                 withCloseButton={false}
//                                 closeOnClickOutside={true}
//                                 closeOnEscape={true}
//                                 size={652}
//                             >
//                                 <div className="mx-5">
//                                     <div className="text-xl font-bold">
//                                         Set Price
//                                     </div>
//                                     <div className="flex flex-wrap justify-between">
//                                         <div className="flex items-center space-x-2">
//                                             <TextInput
//                                                 // label="Amount"
//                                                 className="modal-input border-[2.21px] border-[rgba(0, 145, 215, 0.40)] rounded-md font-mono font-bold"
//                                                 withAsterisk
//                                                 type="number"
//                                                 value={value}
//                                                 onChange={(e) => {
//                                                     setValue(
//                                                         e.currentTarget.value
//                                                     );
//                                                 }}
//                                             />
//                                             <div className="sol-label px-[29px]  border border-[#0091D766] rounded-full ">
//                                                 SOL
//                                             </div>
//                                         </div>
//                                         <button
//                                             className="rounded-full bg-btn-bg w-nft-w"
//                                             onClick={handleListClick}
//                                             // disabled={isClickDisabled}
//                                         >
//                                             List for Sale
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <ListingNft
//                                         price={parseFloat(value)}
//                                         nftAddress={nftAddress}
//                                         connection={connection}
//                                         provider={provider}
//                                         wallet={wallet}
//                                     />
//                                 </div>
//                             </Modal>

//                             {/* Offer Modal */}
//                             {/* <Modal
//                                 opened={isOfferModalOpen}
//                                 onClose={() => setIsOfferModalOpen(false)}
//                                 title="Make an offer"
//                                 className="z-20"
//                             >
//                                 <TextInput
//                                     label="First input"
//                                     placeholder="First input"
//                                 />
//                                 <TextInput
//                                     data-autofocus
//                                     label="Input with initial focus"
//                                     placeholder="It has data-autofocus attribute"
//                                     mt="md"
//                                 />
//                             </Modal> */}
//                         </div>
//                         <table className="w-full table-auto overflow-y-auto">
//                             <thead>
//                                 <tr className=" mx-0 ">
//                                     <th className="columns">Files</th>
//                                     <th className="columns">Type</th>
//                                     <th className="columns">Format</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="">
//                                 <tr>
//                                     {/* <td>
//                                         {files
//                                             ? files.map((file) => {
//                                                   console.log(file);
//                                                   return `we need name for files`;
//                                               })
//                                             : ""}
//                                     </td>
//                                     <td>{category ? category : ""}</td>

//                                     {files
//                                         ? files.map((file) => {
//                                               console.log(file.type);
//                                               const fileName = file.type;
//                                               return <td>{fileName}</td>;
//                                           })
//                                         : ""} */}
//                                     <td>Row 2, Column 1</td>
//                                     <td>Row 2, Column 2</td>
//                                     <td>Row 2, Column 3</td>
//                                 </tr>
//                                 <tr>
//                                     <td>Row 2, Column 1</td>
//                                     <td>Row 2, Column 2</td>
//                                     <td>Row 2, Column 3</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </Box>
//                 </Box>
//             </Box>
//             <div className="my-3">
//                 <p className="text-3xl my-3">Description </p>
//                 <p>{description}</p>
//             </div>
//             <div className="my-5">
//                 <p className="text-3xl my-3">Properties</p>
//                 {
//                     atrr
//                         ? atrr.map((attributes, index) => {
//                               console.log(attributes);
//                               return (
//                                   <div key={index}>
//                                       {Object.entries(attributes).map(
//                                           ([key, value]) => (
//                                               // <div key={key}>
//                                               //   <strong>{key}:</strong> {value}
//                                               // </div>
//                                               <Pill key={key}>
//                                                   <span className="bg-audio-bg">
//                                                       {key}:
//                                                   </span>
//                                                   <span className="bg-transparent">
//                                                       {value}
//                                                   </span>
//                                               </Pill>
//                                           )
//                                       )}
//                                   </div>
//                               );
//                           })
//                         : null // Use null if you don't want to render anything when atrr is falsy
//                 }
//             </div>
//             <div className="my-5">
//                 <p className="text-3xl my-3">Price History</p>
//             </div>
//             <div className="fixed bg-aduio-bg  bottom-4 rounded-full w-3/4 px-5">
//                 <LibAudioPlayer
//                     isPlaying={isPlaying}
//                     togglePlayPause={togglePlayPause}
//                     currentTrack={currentTrack}
//                 />
//             </div>
//         </div>
//     );
// }
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation"; // Corrected the import
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
import { MetaSchemma } from "../../explore/data/tracks";
import SoundWorkLogo from "../../components/icon";
import { useConnection, useWallet } from "@solana/wallet-adapter-react"; // Corrected the import
import { AnchorProvider, getProvider } from "@coral-xyz/anchor";
import { useAudio } from "../../context/audioPlayerContext";
import ListingNft from "../../components/modals/ListingNft";

export default function Page() {
    const { id: nftAddress } = useParams();
    const { connection } = useConnection();
    const provider = getProvider();
    const pubkey = getProvider().publicKey?.toBase58();

    console.log("pubkey", pubkey);
    // Corrected the function name
    // const [provider, setProvider] = useState<AnchorProvider | undefined>();
    const { isPlaying, togglePlayPause, setCurrentTrack, currentTrack } =
        useAudio();
    const [metaDetails, setMetaDetails] = useState<MetaSchemma | undefined>();
    const [currentOwner, setCurrentOwner] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isNotOwner, setOwner] = useState(true);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [value, setValue] = useState("");
    const playPauseRef = useRef(null); // Added a missing ref value

    useEffect(() => {
        nftData(nftAddress)
            .then((res) => {
                if (res) {
                    console.log("nft data:", res);

                    setMetaDetails(res.metaDetails);
                    setCurrentOwner(res.nftDetails.current_owner);
                    if (res.nftDetails.current_owner === pubkey) {
                        setOwner(false);
                        console.log("is owner?😥", isNotOwner);
                    }

                    // for dev testing
                    setOwner(false);
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [nftAddress]);

    console.log(`publicKey: ${pubkey} is connected 🔗`);
    console.log("selling this nft 🍽️", nftAddress);

    const handleListClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const inputValue = parseFloat(value);

        if (!inputValue) {
            console.log("Invalid value");
        } else if (!isNaN(inputValue) && inputValue <= 10000) {
            console.log("Input Value:", inputValue);
        } else {
            console.log("Invalid value");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!metaDetails || !currentOwner) {
        return <div>Data not available. Try again later.</div>;
    }

    const animation_url = metaDetails?.animation_url;
    const description = metaDetails?.description;
    const image = metaDetails?.image;
    const title = metaDetails?.title;
    const atrr = metaDetails?.attributes;

    return (
        <div className="p-5 my-2 mx-5 scroll-smooth">
            <Box className="flex flex-wrap">
                <div className="image-container">
                    <Image
                        priority
                        src={image}
                        alt="nft image"
                        className="rounded-md dynamic-image"
                        height={600}
                        width={600}
                    />
                    <div
                        className="play-pause-container"
                        onClick={() => {
                            setCurrentTrack(animation_url);
                            togglePlayPause();
                            console.log("should play", animation_url);
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

                <Box className="mx-6 flex-1">
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
                    <Box className="border custom-border p-4 whitespace-pre-wrap justify-stretch bg-detail-bg title-box">
                        <div className="mini-logo flex flex-wrap">
                            <SoundWorkLogo />
                            <p className="text-3xl mx-5">{title}</p>
                        </div>

                        <div className="mx-5 my-5">
                            <button className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg mx-8 my-2 p-3 w-nft-w">
                                <a
                                    href={
                                        !isNotOwner
                                            ? `${animation_url}`
                                            : "buy-now-link"
                                    }
                                    download={
                                        !isNotOwner ? `${animation_url}` : ""
                                    }
                                >
                                    {!isNotOwner ? "Download" : "Buy Now"}
                                </a>
                            </button>

                            <button
                                className="border-2 border-[#0091D766] rounded-full hover:bg-btn-bg mx-8 my-2 p-3 w-nft-w"
                                onClick={() => {
                                    // setOwner(true); for testing during dev
                                    if (!isNotOwner) {
                                        setIsSellModalOpen(true);
                                    } else {
                                        setIsOfferModalOpen(true);
                                    }
                                }}
                            >
                                {!isNotOwner ? "Sell" : "Make Offer"}
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
                                        onClick={handleListClick}
                                    >
                                        List for Sale
                                    </button>
                                </div>
                            </div>
                            <div>
                                <ListingNft
                                    price={parseFloat(value)}
                                    nftAddress={nftAddress}
                                    connection={connection}
                                    provider={provider}
                                />
                            </div>
                        </Modal>
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
                          console.log(attributes);
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
            <div className="fixed bg-audio-bg bottom-4 rounded-full w-3/4 px-5">
                <LibAudioPlayer
                    isPlaying={isPlaying}
                    togglePlayPause={togglePlayPause}
                    currentTrack={currentTrack}
                />
            </div>
        </div>
    );
}
