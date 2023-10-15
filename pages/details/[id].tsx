import { useRouter } from "next/router";
import Layout from "../../app/layout";
import { nftData } from "../../app/explore/data/tracks";
import { useEffect, useState } from "react";

export default function SoundDetails() {
    const router = useRouter();
    const { id, metadata_uri } = router.query;
    const metadataUriString = metadata_uri as string;

    const [trackData, setTrackData] = useState(null);

    useEffect(() => {
        // Use the metadataUriString or any other identifier to fetch data
        if (metadataUriString) {
            nftData(metadataUriString)
                .then((data) => {
                    setTrackData(data);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [metadataUriString]);

    return (
        <div>
            <Layout>
                <div>
                    {trackData && (
                        <div>
                            <img src={trackData.coverArtUrl} />
                            <p>Title: {trackData.title}</p>
                            <p>Audio URL: {trackData.audioUrl}</p>
                            {/* <p>att 1 {trackData.attributes[0]}</p>
                            <p>att 1 {trackData.attributes[1]}</p> */}
                            {/* <p>des: {trackData.description}</p>
                            <p>pro: {trackData.properties.category}</p>
                            <p>pro: {trackData.properties.files[0]}</p>
                            <p>pro: {trackData.properties.files[1]}</p> */}
                        </div>
                    )}
                </div>
            </Layout>
        </div>
    );
}
