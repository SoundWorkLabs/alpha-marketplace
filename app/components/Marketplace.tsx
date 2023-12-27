function Marketplace() {
    return (
        <section
            id="market-place"
            className="px-[6.97rem] pt-[8.13rem] space-y-[2.62rem]"
        >
            <div className="text-[4rem] font-[700] leading-[4.62rem]">
                Marketplace
            </div>
            <div className="space-y-5 text-[1.125rem] leading-[1.8rem] font-[300]">
                <div>
                    By minting and listing a Music NFT on Soundwork, musicians
                    are able to track when and where their sounds are being used
                    on the platform’s Dashboard, and get rewarded for their
                    contributions in real time.
                </div>
                <div>
                    Music NFTs on Soundwork can be bought, sold, and leased,
                    which is a novel way to make use of the samples without
                    purchasing them directly.
                </div>
            </div>
            <button
                className="bg-btn-bg w-[23.125rem] rounded-[3.125rem] mt-5 text-[1.125rem] font-normal leading-[1.8rem] py-3 px-8"
                onClick={() => {
                    window.open("/explore", "_blank");
                }}
            >
                Explore Marketplace
            </button>
        </section>
    );
}

export default Marketplace;
