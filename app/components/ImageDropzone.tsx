"use client"

import { Box, Flex, Text, Image, Group, rem, lighten } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { useState } from "react";

interface dropProps {
    setCoverImage: (file: FileWithPath[]) => void
}

export default function ImageDropzone({ setCoverImage }: dropProps) {
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const imgSrc = files.length > 0 ? URL.createObjectURL(files[0]) : "";

    return (
        <Box style={{
            background: "var(--mantine-color-placeholder)",
        }}
        >
            <Dropzone accept={IMAGE_MIME_TYPE}
                onDrop={(files) => {
                    console.log('files', files)
                    setFiles(files);
                }
                }>
                <Group gap="xl" mih={100} justify='center' style={{ pointerEvents: 'none' }}>
                    {
                        files.length === 0 ? (
                            <div>
                                <Flex justify='center'>
                                    <Dropzone.Accept>
                                        <div className="flex justify-center">
                                            <IconUpload
                                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                                stroke={1.5}
                                            />
                                        </div>
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconPhoto
                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Idle>
                                </Flex>
                            </div>
                        ) :
                            (
                                <Flex justify='center' mt={3}>
                                    {
                                        files.length > 0 ? (
                                            <Flex justify='center'>
                                                <Image
                                                    h={200}
                                                    // w={"350vw"}
                                                    src={imgSrc}
                                                    onLoad={() => URL.revokeObjectURL(imgSrc)}
                                                    alt='selected image for preview' />
                                            </Flex>
                                        ) : null
                                    }
                                </Flex>
                            )
                    }
                </Group>
                <div
                    style={{
                        padding: "0px 10px 2px 10px",
                    }}
                >
                    <Text size="xl" inline>
                        Drag cover image here or click to select file
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        Supported file types include MP3, WAV, AIFF, Max Size 10MB
                    </Text>
                </div>
            </Dropzone>

        </Box>
    )
}