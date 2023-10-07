import {
  Card,
  CardSection,
  Group,
  Image,
  Button,
  TabsPanel,
  TabsTab,
  Text,
} from "@mantine/core";

export default function Cards() {
  return (
    <Card padding="1xl">
      <CardSection>
        <TabsTab value="pack">
          <Image
            //   temp
            src="https://i.imgur.com/5fPwIQr.jpeg"
            alt=""
            h={208.85}
            w={234.27}
          />
          <Text fw={500}>Name of Collection</Text>

          <Group
            className=" text-black"
            justify="space-between"
            mt="md"
            mb="xs"
          >
            <TabsPanel value={"collection1"}>
              <Text fw={500}>Name of Collection</Text>
              <Text size="sm" c="dimmed">
                Artist name
              </Text>
            </TabsPanel>
          </Group>
          <Button>preview</Button>
        </TabsTab>
      </CardSection>
    </Card>
  );
}
