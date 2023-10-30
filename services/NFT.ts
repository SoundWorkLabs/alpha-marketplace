import { API_BASE_URL } from "../utils/config";
import { NftSchema, MetaSchema } from "../app/components/types";
import { PublicKey } from "@solana/web3.js";

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

export async function fetchAllNfts() {
    try {
        const response = await (await fetch(`${API_BASE_URL}/nfts/all`)).json();
        return response;
    } catch (err) {
        console.log("error fetching all nfts", err);
    }
}

export async function fetchListedNfts() {
    try {
        const response = await fetch(`${API_BASE_URL}/nfts/marketplace`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error fetching listings:", response.statusText);
        }
    } catch (err) {
        console.error("Error fetching listings:", err);
    }
}

export async function fetchUserNfts() {
    try {
        const response = await (await fetch(`${API_BASE_URL}/nfts/all`)).json();

        return response;
    } catch (err) {
        console.log("error fetching all nfts", err);
    }
}

// todo (JIMI) correct types for array
export async function populateNftMetadata(nfts: Array<any> | any) {
    if (Array.isArray(nfts)) {
        // Handle the array of NFTs
        nfts.map((nft) => console.log(nft));
    } else {
        // Handle a single NFT
    }
}

// fetch a single nft
export async function fetchNftByMint(mint: PublicKey) {
    try {
        const response = await await fetch(
            `${API_BASE_URL}/nfts/${mint.toBase58()}`
        );
        console.log("response", response);
    } catch (err) {
        console.error("error fetching requested NFT", err);
    }
}

export async function nftData(target: string) {
    try {
        // Make the initial request to fetch the data
        const response = await fetch(`${API_BASE_URL}/nfts/all`);
        if (response.status !== 200) {
            throw new Error("Please check your connection 🔗");
        }

        const data = await response.json();

        const item = data?.find(
            (item: NftSchema) => item.nft_address === target
        );

        if (item) {
            const metaResponse = await fetch(item.metadata_uri);
            const metaDetails: MetaSchema = await metaResponse.json();

            const nftDetails: NftSchema = item;
            return { metaDetails, nftDetails };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// export async function fetchNftData() {
//     const response = await axios.get(`${API_BASE_URL}/nfts/all`);
//     return response;
// }
