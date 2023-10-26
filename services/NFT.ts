import { API_BASE_URL } from "../utils/config";
import { NftSchemma, MetaSchemma } from "../app/components/types";
import axios from "axios";

/** generate uris and mint tx to be signed on the frontend */
/*  returns a serialized transaction we need to sign */
export async function mintSingle(postData: FormData) {
    const opts = {
        method: "POST",
        body: postData
    };

    try {
        const response = await fetch(`${API_BASE_URL}/nfts/create/mint`, opts);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const resp = await response.json();
        return resp;
    } catch (err: unknown) {
        return err;
    }
}

/** if successful register NFT as minted */
/*  returns a serialized transaction we need to sign */
export async function saveMinted(nftMint: string) {
    const opts = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nftMint })
    };

    try {
        const response = await fetch(`${API_BASE_URL}/nfts/create/save`, opts);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const resp = await response.json();
        return resp;
    } catch (err: unknown) {
        return err;
    }
}

export async function fetchSoundworkNfts() {
    //nfts/soundwork
    try {
        const response = await fetch(`${API_BASE_URL}/nfts/soundwork`);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function nftData(target: string) {
    try {
        // Make the initial request to fetch the data
        const response = await axios.get(`${API_BASE_URL}/nfts/soundwork`);

        if (response.status !== 200) {
            throw new Error("Please check your connection 🔗");
        }

        const data = response.data;

        const item = data.find(
            (item: NftSchemma) => item.nft_address === target
        );

        if (item) {
            const mData = item.metadata_uri;
            const metaResponse = await axios.get(mData);
            const metaDetails: MetaSchemma = metaResponse.data;

            const nftDetails: NftSchemma = item;
            return { metaDetails, nftDetails };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export async function fetchNftData() {
    const response = await axios.get(`${API_BASE_URL}/nfts/soundwork`);
    return response;
}
