import { useRouter } from "next/router";
import Layout from "../../app/layout";
import { nftData } from "../../app/explore/data/tracks";
import { useEffect, useState } from "react";
import { Box } from "@mantine/core";

export default function SoundDetails() {
    const router = useRouter();
    const { id, metadata_uri, current_owner } = router.query;
    const metadataUriString = metadata_uri as string;

    const defaultTrackData: MetaDataSchema = {
        title: "",
        audioUrl: "",
        coverArtUrl: "",
        attributes: [],
        description: "",
        properties: { category: "", files: [] }
    };

    const [trackData, setTrackData] = useState<MetaDataSchema | undefined>(
        defaultTrackData
    );

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
                        <div className="p-5">
                            <Box className="flex flex-wrap my-8">
                                <img
                                    src={trackData.coverArtUrl}
                                    className="rounded-lg "
                                />
                                <Box>
                                    <h2>
                                        Owned By: {current_owner?.slice(0, 10)}
                                    </h2>
                                    <p>Title: {trackData.title}</p>

                                    {/* Render the files array in properties */}
                                    <h2>Files:</h2>
                                    {trackData.properties.files.map(
                                        (file, index) => (
                                            <div key={index}>
                                                {Object.keys(file).map(
                                                    (key) => (
                                                        <p key={key}>
                                                            {key}: {file[key]}
                                                        </p>
                                                    )
                                                )}
                                            </div>
                                        )
                                    )}
                                    {/* Access the properties object */}
                                    <h2>Properties:</h2>
                                    <p>
                                        Category:{" "}
                                        {trackData.properties.category}
                                    </p>
                                </Box>
                            </Box>
                            <h2>Description:{trackData.description}</h2>
                            <p>Audio URL: {trackData.audioUrl}</p>

                            {/* Iterate through the attributes array */}
                            <h2>Attributes:</h2>
                            {trackData.attributes.map((attr, index) => (
                                <div key={index}>
                                    {Object.keys(attr).map((key) => (
                                        <p key={key}>
                                            {key}: {attr[key]}
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Layout>
        </div>
    );
}

interface MetaDataSchema {
    title: string;
    audioUrl: string;
    coverArtUrl: string;
    attributes: object[];
    description: string;
    properties: {
        category: string;
        files: object[];
    };
}
