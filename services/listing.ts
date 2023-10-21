import { API_BASE_URL } from "../utils/config";

import { PublicKey } from "@solana/web3.js";

// fetch all listing
export async function getListings() {
    try {
        const response = await fetch(`${API_BASE_URL}/nfts/listing`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error fetching listings:", response.statusText);
        }
    } catch (err) {
        console.error("Error fetching listings:", err);
    }
}

export async function createListing(
    id: string,
    sellerAddress: string,
    mint: PublicKey,
    price: number
) {
    let listingData = {
        id,
        sellerAddress,
        mint,
        price,
        data: new Date(),
        isActive: true // get this from the tx, if it fails false, else true
    };

    try {
        const response = await fetch(`${API_BASE_URL}/nfts/create/listing`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(listingData)
        });

        if (response.ok) {
            console.log("Listing created successfully");
        } else {
            console.error("Error creating listing:", response.statusText);
        }
    } catch (err) {
        console.error("Error creating listing:", err);
    }
}

// id is is the tx Hash
// ! not implemented
async function deleteListing(id: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/nfts/listing${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log("Listing deleted successfully");
        } else {
            console.error("Error deleting listing:", response.statusText);
        }
    } catch (err) {
        console.error("Error deleting listing:", err);
    }
}
