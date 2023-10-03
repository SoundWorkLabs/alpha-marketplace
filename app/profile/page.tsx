"use client";

import { Avatar, Box, Button, Flex, Group, Input, Tabs } from "@mantine/core";
import { useWallet } from "@solana/wallet-adapter-react";
import CustomPill from "../components/pill";

const dummyItemValObj = {
    Items: 34,
    Followers: 655,
    "Avg. Sale": 0.6,
    Traded: 0.56
};

export default function Profile() {
    const { publicKey } = useWallet();

    return (
        <Box className="mx-10">
            <Flex gap="lg" className="p-5" wrap="wrap">
                <Flex direction="column" gap={20}>
                    <Box>
                        <Avatar
                            size="xl"
                            src={null}
                            alt="Jimii Mutuku"
                            color="red"
                        >
                            JM
                        </Avatar>
                    </Box>
                    <Box>
                        {`${publicKey?.toBase58().substring(0, 6) ?? ""} ${
                            publicKey?.toBase58().substring(26, 32) ?? ""
                        }` ?? "Connect Wallet"}{" "}
                        {/* // todo: create hook for this */}
                    </Box>
                </Flex>

                <Flex direction="column" gap={20}>
                    <Box>
                        <Box
                            style={{
                                border: "2px solid var(--mantine-color-bright)",
                                borderRadius: "0",
                                color: "var(--mantine-color-bright)"
                            }}
                        >
                            <Flex className="py-2 px-3" gap={100}>
                                {Object.entries(dummyItemValObj).map(
                                    ([label, value]) => (
                                        <Stat
                                            key={label}
                                            label={label}
                                            value={value}
                                        />
                                    )
                                )}
                            </Flex>
                        </Box>
                    </Box>
                    <Box>
                        {/* <CustomPill color=""  label="edit profile" /> */}
                        <Button variant="primary">edit profile</Button>
                    </Box>
                </Flex>
            </Flex>

            <Box>
                <Tabs
                    variant="unstyled"
                    defaultValue="first"
                    style={{}}
                    // className="[&:nth-child(3)]:underline"
                >
                    <Tabs.List>
                        <Tabs.Tab value="first">Teal tab</Tabs.Tab>
                        <Tabs.Tab value="second" color="blue">
                            Blue tab
                        </Tabs.Tab>
                    </Tabs.List>

                    <Box>
                        {" "}
                        {/* //? search bar container */}
                        <Flex
                            justify="space-between"
                            style={{
                                marginTop: "2px",
                                border: "2px solid var(--mantine-color-bright)",
                                borderRadius: "0",
                                color: "var(--mantine-color-bright)"
                            }}
                        >
                            <Group>
                                <Box>
                                    {" "}
                                    {/* //todo: input container  */}
                                    <Input variant="filled" size="md" />
                                </Box>
                                <Box>0 result</Box>
                            </Group>
                            <Group>
                                <Box>sort by</Box>
                                <Box>filter</Box>
                            </Group>
                        </Flex>
                    </Box>

                    <Tabs.Panel value="first" pt="xs">
                        First tab color is teal, it gets this value from context
                    </Tabs.Panel>

                    <Tabs.Panel value="second" pt="xs">
                        Second tab color is blue, it gets this value from props,
                        props have the priority and will override context value
                    </Tabs.Panel>
                </Tabs>
            </Box>
        </Box>
    );
}

function Stat({ value, label }: { value: number; label: string }) {
    return (
        <Box>
            <Box>{value}</Box>
            <Box>{label}</Box>
        </Box>
    );
}
