import axios from "axios";

const apiUrl =
    "https://ageless-period-400708.uc.r.appspot.com/api/v1/nfts/soundwork";

export const tracks: {
    title: string | undefined;
    audioUrl: string | undefined;
    coverArtUrl: string | undefined;
}[] = [];

export interface NftSchemma {
    nft_address: string;
    collection_address: string | null;
    title: string;
    token_standard: string | null;
    current_owner: string;
    description: string;
    seller_fee_basis_points: number | null;
    image_url: string;
    metadata_uri: string;
    is_confirmed: boolean;
    available_for_lease: boolean;
}
export interface MetaSchemma {
    animation_url: string;
    attributes: string[];
    description: string;
    image: string;
    properties: { category: "audio"; files: string[] };
    symbol: string;
    title: string;
}

export async function fetchNftData() {
    const response = await axios.get(apiUrl);
    return response;
}

export async function nftData(target: string) {
    try {
        // Make the initial request to fetch the data
        const response = await axios.get(apiUrl);

        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }

        const data = response.data;

        const item = data.find(
            (item: NftSchemma) => item.nft_address === target
        );

        if (item) {
            const mData = item.metadata_uri;
            const metaResponse = await axios.get(mData);
            const metaDetails: MetaSchemma = metaResponse.data;

            const currentOwner: string = item.current_owner;

            console.log("meta", metaDetails);
            return { metaDetails, currentOwner };
        } else {
            console.log("Item not found");
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// export async function trackss(trackUrl: string) {
//     try {
//         const res = (await axios.get(trackUrl)).data;

//         if ((res && "title") || "animation_url" || "image in res") {
//             const title: string | undefined = res.title;
//             const audioUrl: string | undefined = res.animation_url;
//             const coverArtUrl: string | undefined = res.image;
//             // console.log("title", title, "aUrl", audioUrl, "img", coverArtUrl);
//             const trackData = {
//                 title,
//                 audioUrl,
//                 coverArtUrl
//             };

//             tracks.push(trackData);
//             return trackData;
//         } else {
//             throw "no associate mint found";
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }
