import { PublicKey } from "@solana/web3.js";
import { API_BASE_URL } from "../utils/config";

export async function createBid(
    id: string,
    bidderAddress: string,
    mint: PublicKey,
    bidAmount: number
) {
    console.log("id", id);
    console.log("bidderAddress", bidderAddress);
    console.log("mint", mint);
    console.log("bidAmount", bidAmount);
    let biddingData = {
        id,
        bidderAddress,
        mint,
        bidAmount
    };
    await fetch(`${API_BASE_URL}/bids/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(biddingData)
    });
}

export async function deleteBid(id: string) {
    await fetch(`${API_BASE_URL}/bids/delete/${id}`, {
        method: "DELETE"
    });
}
