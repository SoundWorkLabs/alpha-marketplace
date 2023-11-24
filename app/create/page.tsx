"use client";

import {
    Box,
    Button,
    Collapse,
    Flex,
    Group,
    rem,
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
import {
    IconFileUpload,
    IconPhoto,
    IconPlus,
    IconX
} from "@tabler/icons-react";
import React, { useCallback, useEffect, useState } from "react";
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

    // if (!publicKey) return <>Please connect your wallet to mint an NFT</>;

    if (!publicKey) {
        if (typeof window !== "undefined") {
            const connectBtn = document.querySelector(
                ".connectBtn"
            ) as HTMLButtonElement;

            return connectBtn?.click();
        }
    }

    return (
        <Flex justify="center">
            <Box mx={0} mb={20}>
                <Box className="my-[3.5rem]">
                    <div className="text-[1.75rem] font-[600] leading-[2.1rem]">
                        Create New Sound NFT
                    </div>
                </Box>
                <Box>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <Flex direction="column" gap="30">
                            <Group>
                                <Flex direction="column" gap="3" w={"40vw"}>
                                    <div className="text-[1.625rem] font-[400] leading-[1.95rem]">
                                        Cover Image / Video
                                    </div>
                                    <div className="text-[1.125rem] font-[400] leading-[1.35rem] my-[1.56rem]">
                                        JPG, GIF, MP4, Max Size 10 MB
                                    </div>
                                    <Box className="border-4 border-[#D9D9D954] p-5 rounded-[0.625rem]">
                                        <ImageDropzone
                                            setFileState={(
                                                file: FileWithPath
                                            ) => setCoverImage(file)}
                                        />
                                        {coverImage === undefined && (
                                            <div className="text-[#D9D9D954] font-[250] flex justify-center space-x-2">
                                                <p>Drag cover image here</p>
                                                <IconPhoto />
                                                <p>or click</p>
                                                <IconPhoto />
                                                <p>to select file</p>
                                            </div>
                                        )}
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
                                    <Box className="flex flex-col text-[1.125rem] font-[200] leading-[1.35rem]">
                                        {soundType === "sound" && (
                                            <Box
                                                mt={20}
                                                className={
                                                    audioFile === undefined
                                                        ? "border-4 border-[#D9D9D954] mt-5 p-5 rounded-[0.625rem]"
                                                        : "mt-5 p-5"
                                                }
                                            >
                                                <AudioDropzone
                                                    setFileState={(
                                                        file: FileWithPath
                                                    ) => setAudioFile(file)}
                                                />
                                                {audioFile === undefined && (
                                                    <div className="text-[#D9D9D954]">
                                                        <div className="space-x-2 flex flex-wrap items-center font-400 justify-center">
                                                            <p>
                                                                Drag audio file
                                                                here
                                                            </p>
                                                            <IconFileUpload />
                                                            <p>or click </p>
                                                            <IconFileUpload />
                                                            <p>
                                                                to select file
                                                            </p>
                                                        </div>

                                                        <div className="flex justify-center text-[.75rem]">
                                                            Supported file types
                                                            include MP3, WAV,
                                                            AIFF, Max Size 10MB
                                                        </div>
                                                    </div>
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                </CollapsibleField>
                            </Group>

                            <Group className="test flex flex-col">
                                <div className="text-[1.625rem] font-[400] leading-[1.95rem]">
                                    Name
                                </div>
                                {/* <input className="text-[1.125rem] font-[400] leading-[1.35rem] my-[1.56rem]" placeholder="Kobeni Higashiyama"
                                onChange={({ target: { value } }) =>
                                setName(value)
                            }/> */}
                                <TextInput
                                    // label="Name"
                                    required={true}
                                    placeholder="Kobeni Higashiyama"
                                    onChange={({ target: { value } }) =>
                                        setName(value)
                                    }
                                    className="text-[1.125rem] font-[400] leading-[1.35rem] my-[1.56rem] w-full"
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
                                <div className="text-[1.625rem] font-[400] leading-[1.95rem]">
                                    External Link
                                </div>
                                <TextInput
                                    // label="External Link"
                                    placeholder="https://soundwork.io/assets/csm"
                                    onChange={({ target: { value } }) =>
                                        setExternalUrl(value)
                                    }
                                    className="text-[1.125rem] font-[400] leading-[1.35rem] my-[1.56rem] w-full"
                                />
                            </Group>

                            <Group>
                                <Flex direction="column" gap="3" w={"40vw"}>
                                    <Box>
                                        <div className="text-[1.625rem] font-[400] leading-[1.95rem]">
                                            Description
                                        </div>
                                    </Box>
                                    <Box>
                                        <Textarea
                                            placeholder="start typing..."
                                            variant="filled" /* width='200vw' */
                                            onChange={({ target: { value } }) =>
                                                setDescription(value)
                                            }
                                            className="text-[1.125rem] font-[400] leading-[1.35rem] my-[1.56rem] w-full"
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
                                        align="center"
                                    >
                                        <TextInput
                                            placeholder="trait type"
                                            value={attributeKey}
                                            onChange={({ target: { value } }) =>
                                                setAttributeKey(value)
                                            }
                                            className="text-[1.125rem] font-[400] leading-[1.35rem] my-[1.56rem]bg-[#FE0FD4]"
                                        />
                                        <TextInput
                                            placeholder="trait value"
                                            value={attributeValue}
                                            onChange={({ target: { value } }) =>
                                                setAttributeValue(value)
                                            }
                                            className="text-[1.125rem] font-[500] leading-[1.35rem] my-[.5rem] "
                                        />
                                    </Flex>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={handleAddAttribute}
                                            className="w-[10.0625rem] h-[1.5625rem] rounded-[2.9375rem] bg-btn-bg text-[1rem] font-[200] leading-[1.3rem]"
                                        >
                                            add trait
                                        </button>
                                        <button
                                            // variant="primary"
                                            // mt={4}
                                            // display="flex"
                                            // justify="center"
                                            onClick={() => {
                                                setAttributes([]);
                                            }}
                                            className="w-[10.0625rem] h-[1.5625rem] rounded-[2.9375rem] bg-btn-bg text-[1rem] font-[200] leading-[1.3rem]"
                                        >
                                            clear
                                        </button>
                                    </div>

                                    <Box
                                        // bg={"var(--_input-bg)"}
                                        // style={{
                                        //     border: "1px solid var(--mantine-color-bright)",
                                        //     padding: "10px 2px",
                                        //     background: "var(--_input-bg)",
                                        //     margin: "10px 0"
                                        // }}
                                        className="border-4 border-[#D9D9D954] mt-5 p-5 rounded-[0.625rem]"
                                    >
                                        {attributes.length > 0 &&
                                            attributes.map(
                                                (attribute, index) => (
                                                    <Box
                                                        key={index}
                                                        className="p-2 flex flex-wrap justify-center space-x-5 text-[1.4rem] font-[300]"
                                                    >
                                                        {/* &nbsp; &#123;{" "}
                                                        { */}
                                                        <div className="text-[#0091D7]">
                                                            {
                                                                Object.keys(
                                                                    attribute
                                                                )[0]
                                                            }
                                                            :
                                                        </div>
                                                        {/*                                                             
                                                        }{" "}
                                                        {": "}
                                                        &nbsp;
                                                        { */}
                                                        <div className="text-[#FE0FD4]">
                                                            {
                                                                Object.values(
                                                                    attribute
                                                                )[0]
                                                            }
                                                        </div>

                                                        {/* }{" "}
                                                        &#125; */}
                                                    </Box>
                                                )
                                            )}
                                    </Box>
                                </CollapsibleField>
                            </Group>

                            <Group>
                                <Flex w={"40vw"} justify="space-between">
                                    <Flex direction="column">
                                        <div className="text-[1.625rem] font-[400] leading-[1.95rem]">
                                            Available for lease
                                        </div>
                                        <div className="text-[0.925rem] font-[200] leading-[1.95rem] my-[.5rem]">
                                            Allow users to download the file for
                                            usage without transferring ownership
                                        </div>
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

                            {/* // todo: Jimii(don;t show it type is single sound)  */}
                            <Group>
                                <Flex direction="column">
                                    <div className="text-[1.625rem] font-[400] leading-[1.95rem]">
                                        Supply
                                    </div>
                                    <div className="text-[0.925rem] font-[200] leading-[1.95rem] my-[.5rem]">
                                        Number of copies to be minted
                                    </div>
                                    <TextInput
                                        // label="Supply"
                                        type="number"
                                        placeholder="1"
                                        // description="Number of copies to be minted"
                                        onChange={({ target: { value } }) => {
                                            const supply = parseInt(value);
                                            supply > 0 && setNumToMint(supply);
                                        }}
                                    />
                                </Flex>
                            </Group>

                            <Box className="flex justify-center my-5">
                                <button
                                    // variant="primary"
                                    type="submit"
                                    // onClick={() => console.log('wat up')}
                                    className="w-[19.0625rem] h-[3.5625rem] rounded-[2.9375rem] text-[1.25rem] font-[300] leading-[1.3rem] bg-btn-bg"
                                >
                                    Mint
                                </button>
                            </Box>
                        </Flex>
                    </form>
                </Box>
            </Box>
        </Flex>
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
            {" "}
            <div className="text-[1.625rem] font-[400] leading-[1.95rem]">
                {label}
            </div>
            <Flex direction="row" justify="space-between" align="center">
                <Box>
                    <div className="text-[1.125rem] font-[400] leading-[1.35rem] my-[1.56rem]">
                        {description}
                    </div>
                </Box>
                <Box
                    className="hover:cursor-pointer border-2 border-[#0091D766] rounded-full flex justify-items-end"
                    my="auto"
                    // style={{
                    //     border: "1px solid transparent",
                    //     borderImage:
                    //         "linear-gradient(90deg, rgba(119, 16, 186, 1), rgba(230, 18, 157, 1))",
                    //     borderImageSlice: 1,
                    //     borderRadius: "100%"
                    // }}
                >
                    {opened ? (
                        <IconX
                            onClick={toggle}
                            className="m-1"
                            size={15}
                            color="rgba(230, 2, 147, 1)"
                            stroke="2.9"
                        />
                    ) : (
                        <IconPlus
                            onClick={toggle}
                            className="m-1"
                            size={15}
                            color="rgba(230, 2, 147, 1)"
                            stroke="2.9"
                        />
                    )}
                </Box>
            </Flex>
            <Collapse in={opened}>
                <Box my={10}>{children}</Box>
            </Collapse>
        </Flex>
    );
};
