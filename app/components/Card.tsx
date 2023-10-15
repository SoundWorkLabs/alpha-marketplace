import { Text } from "@mantine/core";

export default function Cards() {
    return (
        <div className="collections-cards p-5 ">
            <div className="custom-border p-4">
                <img
                    src="https://i.imgur.com/5fPwIQr.jpeg"
                    alt=""
                    className="rounded-lg mb-5 w-234.27 h-208.85"
                />
                <Text fw={500}>Name of Collections</Text>
                <Text size="sm">Artist name</Text>
            </div>
        </div>
    );
}
