export default function NftFallback() {
    return (
        <div className="nft-cards w-nft-card-w h-nft-card-h my-5 mr-5  overflow-hidden">
            <div className="custom-border p-[.81rem] w-full h-full animate-pulse">
                <div className="rounded-[0.5525rem] mb-5 h-nft-h w-nft-w bg-[#1d1f2592]"></div>
                <div className="flex flex-col overflow-hidden space-y-[.39rem]">
                    <div className="bg-[#1d1f2592] h-[1.11025rem] w-[5.5rem] "></div>
                    <div className="bg-[#1d1f2592] h-[1.6875rem] w-[14.25]"></div>
                </div>
                <div className="flex flex-wrap justify-between mt-4">
                    <div className="bg-[#1d1f2592] h-[1.6875rem] w-[2.5rem]"></div>
                    <div className="bg-[#1d1f2592] h-[1.6875rem] w-[2.5rem]"></div>
                </div>
            </div>
        </div>
    );
}
