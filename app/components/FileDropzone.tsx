// "use client";

// import { Box, Flex, Text, Image, Group, rem } from "@mantine/core";
// import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
// import {
//     IconUpload,
//     IconPhoto,
//     IconX,
//     IconFileUpload,
//     IconActivityHeartbeat
// } from "@tabler/icons-react";
// import { useState } from "react";

// interface FileProps {
//     setFileState: (file: FileWithPath) => void;
// }

// export function ImageDropzone({ setFileState }: FileProps) {
//     const [files, setFiles] = useState<FileWithPath[]>([]);
//     const imgSrc = files.length > 0 ? URL.createObjectURL(files[0]) : "";
//     const [imgIsUpload, setImgIsUploaded] = useState<boolean>(false);

//     return (
//         <Box
//         // style={{
//         //     background: "var(--mantine-color-placeholder)"
//         // }}
//         // className="rounded-[0.625rem] border border-[#7710BA] bg-[#C4C4C41A] h-[13.1875rem]"
//         >
//             <Dropzone
//                 accept={IMAGE_MIME_TYPE}
//                 onDrop={(files) => {
//                     setFileState(files[0]);
//                     setFiles(files);
//                 }}
//             >
//                 <Group
//                     gap="xl"
//                     mih={100}
//                     justify="center"
//                     style={{ pointerEvents: "none" }}
//                 >
//                     {files.length === 0 ? (
//                         <div>
//                             <Flex justify="center">
//                                 <Dropzone.Accept>
//                                     <IconUpload
//                                         style={{
//                                             width: rem(102),
//                                             height: rem(102),
//                                             color: "var(--mantine-color-blue-6)"
//                                         }}
//                                         stroke={1.5}
//                                     />
//                                 </Dropzone.Accept>
//                                 <Dropzone.Reject>
//                                     <IconX
//                                         style={{
//                                             width: rem(102),
//                                             height: rem(102),
//                                             color: "var(--mantine-color-red-6)"
//                                         }}
//                                         stroke={1.5}
//                                     />
//                                 </Dropzone.Reject>
//                                 <Dropzone.Idle>
//                                     <IconPhoto
//                                         style={{
//                                             width: rem(102),
//                                             height: rem(102)
//                                         }}
//                                         stroke={rem(1)}
//                                         color="#D9D9D954"
//                                     />
//                                 </Dropzone.Idle>
//                             </Flex>
//                         </div>
//                     ) : (
//                         <Flex justify="center" mt={3}>
//                             {files.length > 0 ? (
//                                 // <Flex justify="center">
//                                 //     <Image
//                                 //         h={200}
//                                 //         // w={"350vw"}
//                                 //         src={imgSrc}
//                                 //         onLoad={() =>
//                                 //             URL.revokeObjectURL(imgSrc)
//                                 //         }
//                                 //         alt="selected image for preview"
//                                 //     />
//                                 // </Flex>
//                                 <img
//                                     // priority={true}
//                                     src={imgSrc}
//                                     alt="nft image"
//                                     className="rounded-[0.5525rem] h-[100%] w-[100%]"
//                                     // className="rounded-[8.84px] mb-5"
//                                     // width={234.27}
//                                     // height={208.85}
//                                     onLoad={() => URL.revokeObjectURL(imgSrc)}
//                                     style={{ imageRendering: "pixelated" }}
//                                 />
//                             ) : null}
//                         </Flex>
//                     )}
//                 </Group>
//             </Dropzone>
//         </Box>
//     );
// }

// export function AudioDropzone({ setFileState }: FileProps) {
//     const [files, setFiles] = useState<FileWithPath[]>([]);
//     const imgSrc = files.length > 0 ? URL.createObjectURL(files[0]) : "";

//     return (
//         <Box
//         // style={{
//         //     background: "var(--mantine-color-placeholder)"
//         // }}
//         >
//             <Dropzone
//                 accept={{
//                     "audio/*": [] // All type audio file types
//                 }}
//                 onDrop={(files) => {
//                     setFileState(files[0]);
//                     setFiles(files);
//                 }}
//             >
//                 <Group
//                     gap="xl"
//                     mih={50}
//                     justify="center"
//                     style={{ pointerEvents: "none" }}
//                 >
//                     {files.length === 0 ? (
//                         <div>
//                             <div>
//                                 <Flex justify="center">
//                                     <Dropzone.Accept>
//                                         <div className="flex justify-center">
//                                             <IconUpload
//                                                 style={{
//                                                     width: rem(102),
//                                                     height: rem(102)
//                                                 }}
//                                                 stroke={rem(1)}
//                                                 color="#D9D9D954"
//                                             />
//                                         </div>
//                                     </Dropzone.Accept>
//                                     <Dropzone.Reject>
//                                         <IconX
//                                             style={{
//                                                 width: rem(102),
//                                                 height: rem(102)
//                                             }}
//                                             stroke={rem(1)}
//                                             color="#D9D9D954"
//                                         />
//                                     </Dropzone.Reject>
//                                     <Dropzone.Idle>
//                                         <IconFileUpload
//                                             style={{
//                                                 width: rem(102),
//                                                 height: rem(102)
//                                             }}
//                                             stroke={rem(1)}
//                                             color="#D9D9D954"
//                                         />
//                                     </Dropzone.Idle>
//                                 </Flex>
//                             </div>
//                             {/* <div
//                                 style={{
//                                     padding: "0px 10px 2px 10px"
//                                 }}
//                             >
//                                 <Text size="xl" inline>
//                                     Drag audio file here or click to select file
//                                 </Text>
//                                 <Text size="sm" c="dimmed" inline mt={7}>
//                                     Supported file types include MP3, WAV, AIFF,
//                                     Max Size 10MB
//                                 </Text>
//                             </div> */}
//                         </div>
//                     ) : (
//                         // <Flex justify="center" mt={3}>
//                         <div>
//                             {files.length > 0 ? (
//                                 <Flex
//                                     // justify="center"
//                                     direction="row"
//                                     // className="flex flex-wrap"
//                                     className="flex items-center"
//                                 >
//                                     {/* <Text fw="bold">upload</Text> */}
//                                     {/* <IconActivityHeartbeat
//                                         width={102}
//                                         height={102}
//                                         stroke={rem(1)}
//                                     /> */}
//                                     <div className="text-[1.125rem] font-[400] leading-[1.35rem] my-[1.56rem]">
//                                         {files[0].path}
//                                     </div>
//                                 </Flex>
//                             ) : null}
//                         </div>

//                         // </Flex>
//                     )}
//                 </Group>
//             </Dropzone>
//         </Box>
//     );
// }

"use client";

import { Box, Flex, Text, Image, Group, rem } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import {
    IconUpload,
    IconPhoto,
    IconX,
    IconFileUpload
} from "@tabler/icons-react";
import { useState } from "react";

interface FileProps {
    setFileState: (file: FileWithPath) => void;
}

export function ImageDropzone({ setFileState }: FileProps) {
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const imgSrc = files.length > 0 ? URL.createObjectURL(files[0]) : "";

    return (
        <Box
            style={{
                background: "var(--mantine-color-placeholder)"
            }}
        >
            <Dropzone
                accept={IMAGE_MIME_TYPE}
                onDrop={(files) => {
                    setFileState(files[0]);
                    setFiles(files);
                }}
            >
                <Group
                    gap="xl"
                    mih={100}
                    justify="center"
                    style={{ pointerEvents: "none" }}
                >
                    {files.length === 0 ? (
                        <div>
                            <Flex justify="center">
                                <Dropzone.Accept>
                                    <div className="flex justify-center">
                                        <IconUpload
                                            style={{
                                                width: rem(52),
                                                height: rem(52),
                                                color: "var(--mantine-color-blue-6)"
                                            }}
                                            stroke={1.5}
                                        />
                                    </div>
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconX
                                        style={{
                                            width: rem(52),
                                            height: rem(52),
                                            color: "var(--mantine-color-red-6)"
                                        }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconPhoto
                                        style={{
                                            width: rem(52),
                                            height: rem(52),
                                            color: "var(--mantine-color-dimmed)"
                                        }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Idle>
                            </Flex>
                        </div>
                    ) : (
                        <Flex justify="center" mt={3}>
                            {files.length > 0 ? (
                                <Flex justify="center">
                                    <Image
                                        h={200}
                                        // w={"350vw"}
                                        src={imgSrc}
                                        onLoad={() =>
                                            URL.revokeObjectURL(imgSrc)
                                        }
                                        alt="selected image for preview"
                                    />
                                </Flex>
                            ) : null}
                        </Flex>
                    )}
                </Group>
                <div
                    style={{
                        padding: "0px 10px 2px 10px"
                    }}
                >
                    <Text size="xl" inline>
                        Drag cover image here or click to select file
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        Supported file types include PNG, JPEG, WEBP, Max Size
                        10MB
                    </Text>
                </div>
            </Dropzone>
        </Box>
    );
}

export function AudioDropzone({ setFileState }: FileProps) {
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const imgSrc = files.length > 0 ? URL.createObjectURL(files[0]) : "";

    return (
        <Box
            style={{
                background: "var(--mantine-color-placeholder)"
            }}
        >
            <Dropzone
                accept={{
                    "audio/*": [] // All type audio file types
                }}
                onDrop={(files) => {
                    setFileState(files[0]);
                    setFiles(files);
                }}
            >
                <Group
                    gap="xl"
                    mih={50}
                    justify="center"
                    style={{ pointerEvents: "none" }}
                >
                    {files.length === 0 ? (
                        <div>
                            <div>
                                <Flex justify="center">
                                    <Dropzone.Accept>
                                        <div className="flex justify-center">
                                            <IconUpload
                                                style={{
                                                    width: rem(52),
                                                    height: rem(52),
                                                    color: "var(--mantine-color-blue-6)"
                                                }}
                                                stroke={1.5}
                                            />
                                        </div>
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            style={{
                                                width: rem(52),
                                                height: rem(52),
                                                color: "var(--mantine-color-red-6)"
                                            }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconFileUpload
                                            style={{
                                                width: rem(52),
                                                height: rem(52),
                                                color: "var(--mantine-color-dimmed)"
                                            }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Idle>
                                </Flex>
                            </div>
                            <div
                                style={{
                                    padding: "0px 10px 2px 10px"
                                }}
                            >
                                <Text size="xl" inline>
                                    Drag audio file here or click to select file
                                </Text>
                                <Text size="sm" c="dimmed" inline mt={7}>
                                    Supported file types include MP3, WAV, AIFF,
                                    Max Size 10MB
                                </Text>
                            </div>
                        </div>
                    ) : (
                        <Flex justify="center" mt={3}>
                            {files.length > 0 ? (
                                <Flex
                                    justify="center"
                                    direction="column"
                                    className="text-center"
                                >
                                    <Text fw="bold">upload</Text>
                                    <Text fw="bold">{files[0].path}</Text>
                                </Flex>
                            ) : null}
                        </Flex>
                    )}
                </Group>
            </Dropzone>
        </Box>
    );
}
