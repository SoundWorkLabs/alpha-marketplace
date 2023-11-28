import { API_BASE_URL } from "../utils/config";

import { PublicKey } from "@solana/web3.js";

// fetch all nfts listed on our marketplace
// export async function getListings() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/listings`);
//         if (response.ok) {
//             return await response.json();
//         } else {
//             console.error("Error fetching listings:", response.statusText);
//         }
//     } catch (err) {
//         console.error("Error fetching listings:", err);
//     }
// }

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
        isActive: true // get this from the tx, if it fails false, else true
    };

    try {
        const response = await fetch(`${API_BASE_URL}/listings/create`, {
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
export async function deleteListing(id: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/listings/delete/${id}`, {
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

export async function editListing(id: string, mint: PublicKey, price: number) {
    let editListingData = {
        id,
        mint,
        price
    };
    try {
        const response = await fetch(`${API_BASE_URL}/nfts/listings/${id}`, {
            method: "UPDATE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(editListingData)
        });

        if (response.ok) {
            console.log("listing edit excuted successfully");
        } else {
            console.error("Error deleting listing:", response.statusText);
        }
    } catch (err) {
        console.error("Error deleting listing:", err);
    }
}
