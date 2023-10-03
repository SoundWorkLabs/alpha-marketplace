"use client";

import { Box, Flex, Text, Image, Group, rem } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import {
	IconUpload,
	IconPhoto,
	IconX,
	IconFileUpload,
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
				background: "var(--mantine-color-placeholder)",
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
												color: "var(--mantine-color-blue-6)",
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
											color: "var(--mantine-color-red-6)",
										}}
										stroke={1.5}
									/>
								</Dropzone.Reject>
								<Dropzone.Idle>
									<IconPhoto
										style={{
											width: rem(52),
											height: rem(52),
											color: "var(--mantine-color-dimmed)",
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
						padding: "0px 10px 2px 10px",
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
				background: "var(--mantine-color-placeholder)",
			}}
		>
			<Dropzone
				accept={{
					"audio/*": [], // All type audio file types
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
													color: "var(--mantine-color-blue-6)",
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
												color: "var(--mantine-color-red-6)",
											}}
											stroke={1.5}
										/>
									</Dropzone.Reject>
									<Dropzone.Idle>
										<IconFileUpload
											style={{
												width: rem(52),
												height: rem(52),
												color: "var(--mantine-color-dimmed)",
											}}
											stroke={1.5}
										/>
									</Dropzone.Idle>
								</Flex>
							</div>
							<div
								style={{
									padding: "0px 10px 2px 10px",
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
