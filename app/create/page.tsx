"use client";

import {
    Box,
    Button,
    Collapse,
    Flex,
    Group,
    Switch,
    TagsInput,
    Text,
    Textarea,
    TextInput,
    Title,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import ImageDropzone from "../components/ImageDropzone";

export default function Create() {
    const [opened, { toggle }] = useDisclosure(false);
    const { wallet } = useWallet();
    // const [collapseStates, setCollapseStates] = useState([false, false, false]);
    const [collapseStates, setCollapseStates] = useState([
        {
            label: "Properties",
            description: "Textual traits. Press Enter to submit a tag",
            opened: false,
        },
        {
            label: "Type",
            description: "Sound / Sample Pack / Preset / Plugin",
            opened: false,
        },
        {
            label: "Stats",
            description: "Numerical traits that show up as a number",
            opened: false,
        },
    ]);

    const [coverImage, setCoverImage] = useState<FileWithPath>();
    const [name, setName] = useState<string>();
    const [externalLink, setExternalLink] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [allowDownload, setAllowDownload] = useState(false);

    const toggleCollapse = (index: number) => {
        const newCollapseStates = [...collapseStates];
        newCollapseStates[index].opened = !newCollapseStates[index].opened;
        setCollapseStates(newCollapseStates);
    };

    return (
        <Box>
            <Box mx={100} mb={20}>
                <Box>
                    <Title order={3}>Create New Sound NFT</Title>
                </Box>
                <Box>
                    <form>
                        <Flex direction="column" gap="30">
                            <Group>
                                <Flex direction="column" gap="3" w={"40vw"}>
                                    <Box>
                                        <Text fw="bold" size="lg" lh={3}>
                                            Cover Image / Video
                                        </Text>
                                        {/* <Text size='sm'>
                                            MP3, WAV, AIFF, Max Size 10MB
                                        </Text> */}
                                    </Box>
                                    <Box>
                                        <ImageDropzone
                                            setCoverImage={(
                                                file: FileWithPath
                                            ) => setCoverImage(file)}
                                        />
                                    </Box>
                                </Flex>
                            </Group>

                            <Group>
                                <TextInputField
                                    label="Name"
                                    placeholder="Savannah Nguyen"
                                    onChange={({ target: { value } }) =>
                                        setName(value)
                                    }
                                />
                            </Group>

                            <Group>
                                <TextInputField
                                    label="External Link"
                                    placeholder="https://soundwork.io/assets"
                                    onChange={({ target: { value } }) =>
                                        setName(value)
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
                                        />
                                    </Box>
                                </Flex>
                            </Group>

                            <Group>
                                {collapseStates.map((state, index) => (
                                    <InputTags
                                        label={state.label}
                                        description={state.description}
                                        key={index}
                                        opened={state.opened}
                                        toggle={() => toggleCollapse(index)}
                                    />
                                ))}
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
                                                    background: `${allowDownload
                                                        ? "linear-gradient(90deg, rgba(119, 16, 186, 1), rgba(230, 18, 157, 1))"
                                                        : "transparent"
                                                        }`,
                                                },
                                                thumb: {
                                                    background: `${allowDownload
                                                        ? "white"
                                                        : "rgba(230, 2, 147, 1)"
                                                        }`,
                                                    outline: "none",
                                                    // border: `${allowDownload ? "" : "none"}`,
                                                    border: "none",
                                                },
                                                track: {
                                                    border: `${allowDownload
                                                        ? "none"
                                                        : ""
                                                        }`,
                                                    background: `${allowDownload
                                                        ? "rgba(230, 2, 147, 1)"
                                                        : "transparent"
                                                        }`,
                                                },
                                            }}
                                            checked={allowDownload}
                                            onChange={({
                                                target: { checked },
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
                                        setName(value)
                                    }
                                />
                            </Group>

                            <Box>
                                <Button
                                    variant="gradient"
                                    gradient={{
                                        from: "rgba(0, 145, 215, 1)",
                                        to: "rgba(254, 15, 212, 1)",
                                        deg: 90,
                                    }}
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
    description?: string;
    onChange: (event: any) => void; //todo: fix type
}

function TextInputField({
    label,
    placeholder,
    onChange,
    type,
    description,
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
                    onChange={(event) => onChange(event)}
                    placeholder={placeholder}
                    variant="filled"
                    width="200vw"
                />
            </Box>
        </Flex>
    );
}

const InputTags = ({
    label,
    opened,
    description,
    toggle,
}: {
    label: string;
    opened: boolean;
    description: string;
    toggle: () => void;
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
                        borderImageSlice: 1,
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
                <TagsInput placeholder="Enter tag" />
            </Collapse>
        </Flex>
    );
};
