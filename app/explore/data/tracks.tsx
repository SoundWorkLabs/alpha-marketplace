import axios from "axios";

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

export async function nftData(id: string): Promise<{
    title: string | undefined;
    audioUrl: string | undefined;
    coverArtUrl: string | undefined;
    attributes: string | undefined;
    description: string | undefined;
    properties: string | undefined;
}> {
    const data = await axios.get(id);

    const res = data.data;
    // console.log("in api", res.json().strinf);
    const title: string = res.title;
    const audioUrl: string = res.animation_url;
    const coverArtUrl: string = res.image;
    const attributes: string = res.attributes;
    const description: string = res.description;
    const properties: string = res.properties;

    console.log(res);
    // console.log("title", title, "aUrl", audioUrl, "img", coverArtUrl);
    const trackData = {
        title,
        audioUrl,
        coverArtUrl,
        attributes,
        description,
        properties
    };
    console.log(trackData);

    return trackData;
}
