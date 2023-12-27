import { useEffect, useState } from "react";
import { fetchListedNfts } from "../../services/NFT";
import { NftSchema } from "./types";
import NftCard from "./NftCard";
import { Box } from "@mantine/core";

function Features() {
    const [listedNfts, setListedNfts] = useState<NftSchema[]>([]);
    useEffect(() => {
        fetchListedNfts().then((res: NftSchema[]) => {
            setListedNfts(res);
        });
    }, []);
    console.log("listed nfts after set", listedNfts);

    return (
        <section
            id={"features"}
            className="flex items-center justify-center flex-col px-[6.97rem] py-[8.13rem] space-y-[2.62rem]"
        >
            <div className="text-[4rem] font-[700] leading-[5.7rem]my-[3.31rem]">
                Key Features
            </div>
            <div className="inline-flex gap-[1.94rem] text-[1.125rem] leading-[1.8rem] font-[font-[300]">
                <div className="custom-border1 rounded-2xl w-[20.875rem] h-[20.125rem] p-5">
                    <div className="text-[3.125rem] font-[600] leading-[5rem]">
                        MINT
                    </div>
                    <div>
                        If it's a sound, it belongs on Soundwork. Big or small,
                        mint your favourite sound creations on the platform to
                        be used and enjoyed by others.
                    </div>
                </div>
                <div className="custom-border1 rounded-2xl w-[20.875rem] h-[20.125rem] p-5">
                    <div className="text-[3.125rem] font-[600] leading-[5rem]">
                        EXPLORE
                    </div>
                    <div>
                        Discover a vast sound library minted by artists just
                        like yourself. Once you find the perfect sound, you can
                        either purchase it or lease it, allowing for a custom
                        experience suited to your needs.
                    </div>
                </div>
                <div className="custom-border1 rounded-2xl w-[20.875rem] h-[20.125rem] p-5">
                    <div className="text-[3.125rem] font-[600] leading-[5rem]">
                        CREATE
                    </div>
                    <div>
                        Start incorporating the sounds into your own creations,
                        make them stand out from the rest, and use our built-in
                        DAW to instantly ignite your workflow.
                    </div>
                </div>
            </div>
            <div>
                <div className="text-[4rem] font-[700] leading-[4.62rem] flex justify-center my-[3.31rem]">
                    Featured Music NFT
                </div>
                <Box className="flex flex-wrap w-full h-full">
                    {listedNfts?.length > 0 &&
                        listedNfts
                            .slice(0, 9)
                            .reverse()
                            .map((nft) => (
                                <NftCard key={nft.nft_address} nft={nft} />
                            ))}
                </Box>
            </div>
            <button
                onClick={() => {
                    window.open("/explore", "_blank");
                }}
                className="bg-btn-bg w-[23.125rem] rounded-[3.125rem] mt-5 text-[1.125rem] font-normal leading-[1.8rem] py-3 px-8"
            >
                Explore All
            </button>
        </section>
    );
}

export default Features;
