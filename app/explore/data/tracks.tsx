import axios from "axios";
import { useState } from "react";

// this should be in the netlify function when backend data is provided
const apiUrl =
    "https://ageless-period-400708.uc.r.appspot.com/api/v1/nfts/soundwork";

// TODO use interface
export const tracks: {
    title: string | undefined;
    audioUrl: string | undefined;
    coverArtUrl: string | undefined;
}[] = [];

export async function fetchNftData() {
    try {
        const response = await axios.get(apiUrl);

        return response;
    } catch (e) {
        throw e;
    }
}

export async function trackss(trackUrl: string) {
    try {
        const res = (await axios.get(trackUrl)).data;

        if ((res && "title") || "animation_url" || "image in res") {
            const title: string | undefined = res.title;
            const audioUrl: string | undefined = res.animation_url;
            const coverArtUrl: string | undefined = res.image;
            // console.log("title", title, "aUrl", audioUrl, "img", coverArtUrl);
            const trackData = {
                title,
                audioUrl,
                coverArtUrl
            };

            tracks.push(trackData);
            return trackData;
        } else {
            throw "no associate mint found";
        }
    } catch (err) {
        console.log(err);
    }
}

export async function nftData(target: string) {
    try {
        // Make the initial request to fetch the data
        const response = await axios.get(apiUrl);

        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }

        const data = response.data;

        const item = data.find((item) => item.nft_address === target);

        if (item) {
            const mData = item.metadata_uri;
            const metaResponse = await axios.get(mData);
            const metaDetails = metaResponse.data;

            const currentOwner = item.current_owner;

            console.log("meta", metaDetails);
            // console.log("current_owner", currentOwner);
            return { metaDetails, currentOwner }; // Return the metadata details
        } else {
            console.log("Item not found");
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
