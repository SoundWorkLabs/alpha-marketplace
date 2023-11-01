"use client";

import {
    Box,
    Button,
    Collapse,
    Flex,
    Group,
    Select,
    Switch,
    Text,
    Textarea,
    TextInput,
    Title
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { IconPlus, IconX } from "@tabler/icons-react";
import React, { useCallback, useState } from "react";
import { AudioDropzone, ImageDropzone } from "../components/FileDropzone";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { toWeb3JsTransaction } from "@metaplex-foundation/umi-web3js-adapters";
import { mintSingle, saveMinted } from "../../services/NFT";

import toast from "react-hot-toast";
import { notifyErr, notifyLoading, notifySuccess } from "../components/toasts";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import { MintSingleResp } from "../../types";

export default function Create() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();

    // ? UI STATE
    const [collapseAttributes, setCollapseAttributes] =
        useState<boolean>(false);
    const [collapseType, setCollapseType] = useState<boolean>(false);

    const [soundType, setSoundType] = useState<string>("");

    // ? FORM DATA STATE
    const [coverImage, setCoverImage] = useState<FileWithPath>();
    const [audioFile, setAudioFile] = useState<FileWithPath>();
    const [name, setName] = useState<string>("");
    const [symbol, setSymbol] = useState<string>("");
    const [externalUrl, setExternalUrl] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [numtoMint, setNumToMint] = useState<number>();
    const [allowDownload, setAllowDownload] = useState(false);
    // attributes
    const [attributeKey, setAttributeKey] = useState<string>("");
    const [attributeValue, setAttributeValue] = useState<string>("");
    const [attributes, setAttributes] = useState<
        { [traitKey: string]: string }[]
    >([]);

    console.log("attributes", attributes);

    const deserializeUmiTx = useCallback(
        async (serializedTx: string): Promise<VersionedTransaction> => {
            if (!publicKey) throw new WalletNotConnectedError();

            // deserialize the tx
            const umi = createUmi(connection.rpcEndpoint);
            const deserializedTx = umi.transactions.deserialize(
                Buffer.from(serializedTx, "base64")
            );
            const web3jsTx = toWeb3JsTransaction(deserializedTx);

            return web3jsTx;
        },
        [connection, publicKey]
    );

    // todo: user anchor provider
    const handleSignTx = useCallback(
        async (deserializedTx: VersionedTransaction): Promise<Transaction> => {
            // determine the provider and sign
            // the tx ourselves
            const { backpack }: any = window; // backpack
            const {
                phantom: { solana: phantomProvider }
            }: any = window; // phantom
            const { glow }: any = window; // glow
            const { braveSolana }: any = window; // brave

            let tx;
            if (backpack?.isConnected) {
                console.log("backpack 👌");
                tx = await backpack.sendAndConfirm(deserializedTx);
            } else if (phantomProvider?.isConnected) {
                console.log("phantom 👌");
                tx =
                    await phantomProvider.signAndSendTransaction(
                        deserializedTx
                    );
            } else if (glow?.isConnected) {
                console.log("glow 👌");
                tx = glow.signAndSendTransaction(deserializedTx);
            } else if (braveSolana?.isConnected) {
                console.log("brave 👌");
                tx = braveSolana.signAndSendTransaction(deserializedTx);
            } else {
                // todo: proper error handling
                console.error("selected wallet not supported");
            }

            return tx;
        },
        []
    );

    const createFormData = useCallback((): FormData => {
        if (!publicKey) throw new WalletNotConnectedError();

        const formData = new FormData();
        formData.append("authorityPubkey", publicKey?.toBase58());
        formData.append("title", name);
        formData.append("symbol", symbol);
        formData.append("description", description);
        formData.append("externalUrl", externalUrl);
        formData.append("attributes", JSON.stringify(attributes));
        formData.append("allowDownload", allowDownload.toString());
        formData.append("audioFile", audioFile ?? "");
        formData.append("coverImage", coverImage ?? "");

        return formData;
    }, [
        name,
        symbol,
        description,
        externalUrl,
        allowDownload,
        audioFile,
        coverImage,
        attributes,
        publicKey
    ]);

    function handleAddAttribute() {
        if (!attributeKey && !attributeValue) return;

        const newAttribute = { [attributeKey]: attributeValue };

        setAttributes([...attributes, newAttribute]);

        // onclick, clear attributes input
        console.log("clear input");
        setAttributeKey("");
        setAttributeValue("");
    }

    const handleSuccess = useCallback(
        async (serializedTx: MintSingleResp) => {
            notifySuccess(
                "Success. Please sign the transaction to finish NFT mint"
            );

            try {
                const deserializedTx = await deserializeUmiTx(serializedTx.tx);
                const tx = await handleSignTx(deserializedTx);
                console.log("the tx", tx);
                if (tx) {
                    await saveMinted(serializedTx.mint);
                    notifySuccess(
                        `https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`
                    );
                } else {
                    notifyErr(
                        "Error signing your transaction, please try again."
                    );
                }
            } catch (err) {
                console.error("Error processing transaction:", err);
            }
        },
        [deserializeUmiTx, handleSignTx]
    );

    const handleError = (error: Error) => {
        console.error("An error occurred:", error.message);
        console.log("serialized", error);
        notifyErr(error.message);
    };

    const handleSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            if (!publicKey) throw new WalletNotConnectedError();

            try {
                let toastId = notifyLoading("uploading NFT metadata");
                const formData = createFormData();
                const serializedTx = await mintSingle(formData);

                toast.dismiss(toastId);

                console.log("serialized", serializedTx);

                if (serializedTx.error) {
                    console.log("there was an error ");
                    // @ts-ignore
                    handleError(serializedTx.error);
                } else {
                    handleSuccess(serializedTx);
                }
            } catch (err) {
                console.error("Error during NFT mint:", err);
            }
        },
        [publicKey, createFormData, handleSuccess]
    );

    if (!publicKey) return <>Please connect your wallet to mint an NFT</>;

    return (
        <Box className="create">
            <Box mx={100} mb={20}>
                <Box>
                    <Title order={3}>Create New Sound NFT</Title>
                </Box>
                <Box>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <Flex direction="column" gap="30">
                            <Group>
                                <Flex direction="column" gap="3" w={"40vw"}>
                                    <Box>
                                        <Text fw="bold" size="lg" lh={3}>
                                            Cover Image / Video
                                        </Text>
                                    </Box>
                                    <Box>
                                        <ImageDropzone
                                            setFileState={(
                                                file: FileWithPath
                                            ) => setCoverImage(file)}
                                        />
                                    </Box>
                                </Flex>
                            </Group>

                            <Group mb={-20}>
                                <CollapsibleField
                                    label="Type"
                                    opened={collapseType}
                                    description="Sound / Collection"
                                    toggle={() =>
                                        setCollapseType(!collapseType)
                                    }
                                >
                                    <Box className="drop-down">
                                        <Select
                                            required // ! WHY NOT WORK?
                                            placeholder="Pick sound type you want to mint"
                                            data={[
                                                "sound",
                                                "collection"
                                                // "preset",
                                                // "plugin"
                                            ]}
                                            value={soundType}
                                            // @ts-ignore
                                            onChange={setSoundType}
                                        />
                                    </Box>
                                    <Box>
                                        {soundType === "sound" && (
                                            <Box mt={20}>
                                                <AudioDropzone
                                                    setFileState={(
                                                        file: FileWithPath
                                                    ) => setAudioFile(file)}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </CollapsibleField>
                            </Group>

                            <Group className="test">
                                <TextInputField
                                    label="Name"
                                    required={true}
                                    placeholder="Kobeni Higashiyama"
                                    onChange={({ target: { value } }) =>
                                        setName(value)
                                    }
                                />
                            </Group>
                            {/* 
                            <Group>
                                <TextInputField
                                    label="Symbol"
                                    placeholder="KBN"
                                    onChange={({ target: { value } }) =>
                                        setSymbol(value)
                                    }
                                />
                            </Group> 
                            */}

                            <Group>
                                <TextInputField
                                    label="External Link"
                                    placeholder="https://soundwork.io/assets/csm"
                                    onChange={({ target: { value } }) =>
                                        setExternalUrl(value)
                                    }
                                />
                            </Group>

                            <Group>
                                <Flex direction="column" gap="3" w={"40vw"}>
                                    <Box>
                                        <Text fw="bold" size="lg" lh={3}>
                                            Description
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Textarea
                                            placeholder="start typing..."
                                            variant="filled" /* width='200vw' */
                                            onChange={({ target: { value } }) =>
                                                setDescription(value)
                                            }
                                        />
                                    </Box>
                                </Flex>
                            </Group>

                            <Group gap={30}>
                                <CollapsibleField
                                    label="Attributes"
                                    opened={collapseAttributes}
                                    description="Textual traits. Press Enter to submit a tag"
                                    toggle={() =>
                                        setCollapseAttributes(
                                            !collapseAttributes
                                        )
                                    }
                                >
                                    <Flex
                                        justify="space-between"
                                        wrap="wrap"
                                        gap={10}
                                    >
                                        <TextInput
                                            placeholder="trait type"
                                            value={attributeKey}
                                            onChange={({ target: { value } }) =>
                                                setAttributeKey(value)
                                            }
                                        />
                                        <TextInput
                                            placeholder="trait value"
                                            value={attributeValue}
                                            onChange={({ target: { value } }) =>
                                                setAttributeValue(value)
                                            }
                                        />
                                    </Flex>
                                    <Button
                                        variant="primary"
                                        mt={4}
                                        display="flex"
                                        justify="center"
                                        onClick={handleAddAttribute}
                                    >
                                        add trait
                                    </Button>
                                    <Box
                                        bg={"var(--_input-bg)"}
                                        style={{
                                            border: "1px solid var(--mantine-color-bright)",
                                            padding: "10px 2px",
                                            background: "var(--_input-bg)",
                                            margin: "10px 0"
                                        }}
                                    >
                                        {attributes.length > 0 &&
                                            attributes.map(
                                                (attribute, index) => (
                                                    <Box key={index}>
                                                        &nbsp; &#123;{" "}
                                                        {
                                                            Object.keys(
                                                                attribute
                                                            )[0]
                                                        }{" "}
                                                        {": "}
                                                        &nbsp;
                                                        {
                                                            Object.values(
                                                                attribute
                                                            )[0]
                                                        }{" "}
                                                        &#125;
                                                    </Box>
                                                )
                                            )}
                                    </Box>
                                </CollapsibleField>
                            </Group>

                            <Group>
                                <Flex w={"40vw"} justify="space-between">
                                    <Flex direction="column">
                                        <Text fw="bold" size="lg">
                                            Available for lease
                                        </Text>
                                        <Text size="xs">
                                            Allow users to download the file for
                                            usage without transferring ownership
                                        </Text>
                                    </Flex>
                                    <Box>
                                        <Switch
                                            styles={{
                                                trackLabel: {
                                                    background: `${
                                                        allowDownload
                                                            ? "linear-gradient(90deg, rgba(119, 16, 186, 1), rgba(230, 18, 157, 1))"
                                                            : "transparent"
                                                    }`
                                                },
                                                thumb: {
                                                    background: `${
                                                        allowDownload
                                                            ? "white"
                                                            : "rgba(230, 2, 147, 1)"
                                                    }`,
                                                    outline: "none",
                                                    // border: `${allowDownload ? "" : "none"}`,
                                                    border: "none"
                                                },
                                                track: {
                                                    border: `${
                                                        allowDownload
                                                            ? "none"
                                                            : ""
                                                    }`,
                                                    background: `${
                                                        allowDownload
                                                            ? "rgba(230, 2, 147, 1)"
                                                            : "transparent"
                                                    }`
                                                }
                                            }}
                                            checked={allowDownload}
                                            onChange={({
                                                target: { checked }
                                            }) => setAllowDownload(checked)}
                                        />
                                    </Box>
                                </Flex>
                            </Group>

                            <Group>
                                <TextInputField
                                    label="Supply"
                                    type="number"
                                    placeholder="1"
                                    description="Number of copies to be minted"
                                    onChange={({ target: { value } }) =>
                                        setNumToMint(value)
                                    }
                                />
                            </Group>

                            <Box>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    // onClick={() => console.log('wat up')}
                                >
                                    Mint
                                </Button>
                            </Box>
                        </Flex>
                    </form>
                </Box>
            </Box>
        </Box>
    );
}

interface TextInputFieldProps {
    label: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    description?: string;
    onChange: (event: any) => void; //todo: fix type
}

function TextInputField({
    label,
    placeholder,
    onChange,
    type,
    required,
    description
}: TextInputFieldProps) {
    return (
        <Flex direction="column" gap="3" w={"40vw"}>
            <Box>
                <Text fw="bold" size="lg" lh={3}>
                    {label}
                </Text>
                <Text size="xs" mt={-3}>
                    {description}
                </Text>
            </Box>
            <Box>
                <TextInput
                    type={type}
                    required={required}
                    onChange={(event) => onChange(event)}
                    placeholder={placeholder}
                    variant="filled"
                    width="200vw"
                />
            </Box>
        </Flex>
    );
}

const CollapsibleField = ({
    label,
    opened,
    description,
    toggle,
    children
}: {
    label: string;
    opened: boolean;
    description: string;
    toggle: () => void;
    children?: React.ReactNode;
}) => {
    return (
        <Flex direction="column" gap="3" w={"40vw"}>
            <Flex direction="row" justify="space-between">
                <Box>
                    <Text fw="bold" size="lg">
                        {label}
                    </Text>
                    <Text size="sm" lh={3}>
                        {description}
                    </Text>
                </Box>
                <Box
                    className="hover:cursor-pointer"
                    my="auto"
                    style={{
                        border: "1px solid transparent",
                        borderImage:
                            "linear-gradient(90deg, rgba(119, 16, 186, 1), rgba(230, 18, 157, 1))",
                        borderImageSlice: 1
                    }}
                >
                    {opened ? (
                        <IconX onClick={toggle} />
                    ) : (
                        <IconPlus onClick={toggle} />
                    )}
                </Box>
            </Flex>
            <Collapse in={opened}>
                <Box my={10}>{children}</Box>
            </Collapse>
        </Flex>
    );
};
