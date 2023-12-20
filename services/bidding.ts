import { PublicKey } from "@solana/web3.js";
import { API_BASE_URL } from "../utils/config";
import { BidSchema } from "../app/components/types";
import { nftData } from "./NFT";
import { fetchUserByAddress } from "./user";

export async function fetchAllBid() {
    const res = await (await fetch(`${API_BASE_URL}/bids/all`)).json();
    return res;
}

export async function fetchOffersReceived(pubkey: string) {
    const res = await (await fetch(`${API_BASE_URL}/bids/all`)).json();
    const offers = await res.filter((bid: BidSchema, index: number) => {
        nftData(bid.nft_address).then(async (res) => {
            if (
                bid.nft_address == res?.nftDetails.nft_address &&
                res?.metaDetails !== undefined
            ) {
                if (index >= 0 && index < offers.length && res) {
                    offers[index]["bidMeta"] = res?.metaDetails;
                }
            }
        });
        fetchUserByAddress(bid.account.active_address).then((res) => {
            if (index >= 0 && index < offers.length && res) {
                offers[index]["bidderUsername"] = res?.username;
            }
        });
        return bid.nft.current_owner === pubkey;
    });
    return offers;
}

export async function fetchOffersSent(pubkey: string) {
    const res = await (await fetch(`${API_BASE_URL}/bids/all`)).json();
    const offers = await res.filter((bid: BidSchema, index: number) => {
        nftData(bid.nft_address).then(async (res) => {
            if (
                bid.nft_address == res?.nftDetails.nft_address &&
                res?.metaDetails !== undefined
            ) {
                if (index >= 0 && index < offers.length && res) {
                    offers[index]["bidMeta"] = res?.metaDetails;
                }
            }
        });
        fetchUserByAddress(bid.nft.current_owner).then((res) => {
            console.log(res);
            if (index >= 0 && index < offers.length && res) {
                offers[index]["sellerUsername"] = res.username;
            }
        });
        return bid.account.active_address === pubkey;
    });
    return offers;
}

export async function createBid(
    id: string,
    bidderAddress: string,
    mint: PublicKey,
    bidAmount: number
) {
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
