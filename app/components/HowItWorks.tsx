import Image from "next/image";

function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="px-[6.97rem] pt-[8.13rem] space-y-[2.62rem]"
        >
            <div className="text-[4rem] leading-[4.62rem] font-[700]">
                <div>How do we</div>
                <div>Soundwork?</div>
            </div>
            <div className="text-[1.125rem] leading-[1.8rem] font-[font-[300]">
                <ol>
                    <li>
                        <div className="flex flex-wrap space-x-2">
                            <div>1.</div>
                            <div className="font-bold">Mint & List:</div>
                            <div className="">
                                Create your unique music NFTs
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="flex flex-wrap space-x-2">
                            <div>2.</div>
                            <div className="font-bold">
                                Discover & Purchase:
                            </div>
                            <div>
                                Browse exclusive tracks, samples, collections,
                                and more from global artists.
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="flex flex-wrap space-x-2">
                            <div>3.</div>
                            <div className="font-bold">
                                Create and get Rewarded:
                            </div>
                            <div>
                                Soundwork ensures transparent and fair rewards
                                for creators, thanks to on-chain smart
                                contracts.
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
            {/* <Image
                src={
                    "/public/images/gwad-34-beatmaker-with-headset-sitting-on-a-computer-chair-in-fr-d-4-be-887-e-628842-d-69-e-4-d-91-f-6434-c-442-c-1.png"
                }
                width={300}
                height={300}
                alt="producer-mixing"
            /> */}
        </section>
    );
}

export default HowItWorks;
