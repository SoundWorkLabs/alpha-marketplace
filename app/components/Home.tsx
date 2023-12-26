import Image from "next/image";
import { MarkerIcon } from "./icon";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const gradientStyle = {
        background: "linear-gradient(91deg, #0091D7 -4.78%, #FE0FD4 75.27%)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        display: "inline-block"
    };
    return (
        <section
            id="home"
            className="home pt-[12rem] px-[6.97rem] flex flex-wrap"
        >
            <div className="relative text-[5.125rem] font-[800] leading-[5.40688rem] overflow-y-hidden">
                <div>Unlock the</div>
                <div>future of Music3</div>
            </div>
            <div>
                <div
                    style={gradientStyle}
                    className="text-[3rem] font-[600] leading-600 w-fit drop-shadow-[0px_4px_5px_#000]"
                >
                    <div>Digital Ownership for Music</div>
                    <div>Creators.</div>
                </div>
                <MarkerIcon />
                <div className="text-[1.25rem] font-[300] leading-[1.79375rem] m-2">
                    <div>Welcome to the heart of digital music ownership.</div>
                    <div>
                        <div>
                            Soundwork offers a decentralized space where
                            musicians and
                        </div>
                        <div>
                            fans converge. With every transaction, we prioritize
                        </div>
                        <div>
                            authenticity, originality, and rightful ownership.
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        window.open("/explore", "_blank");
                    }}
                    className="bg-btn-bg w-[23.125rem] rounded-[3.125rem] mt-5 text-[1.125rem] font-normal leading-[1.8rem] py-3 px-8"
                >
                    Explore Marketplace
                </button>
            </div>
            {/* TODO: kasuba97 implement with better img */}
            {/* <Image
                src={"/public/rectangle.jpg"}
                width={300}
                height={300}
                quality={100}
                priority
                alt={"dj-img"}
            /> */}
        </section>
    );
}
