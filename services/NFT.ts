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
