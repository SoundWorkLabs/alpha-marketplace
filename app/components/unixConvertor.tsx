export default function getUnixTimestampForExpiry(days: string) {
    const currentDate = new Date();
    const expiryDate = new Date(
        currentDate.getTime() + Number(days) * 24 * 60 * 60 * 1000
    );

    const unixTimestamp = Math.floor(expiryDate.getTime() / 1000);

    return unixTimestamp;
}
