import { API_BASE_URL } from "../utils/config";

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
