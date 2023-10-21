import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function getSolFromLamports(
    price: number | string,
    decimals = 0,
    round = 0
): number {
    let value = Number(price) / LAMPORTS_PER_SOL;
    if (value === 0) {
        return 0;
    }

    if (decimals > 0) {
        value = value / 10 ** decimals;
    }

    return getRoundedValue(value, round);
}

export function getRoundedValue(value: number, round: number): number {
    if (round > 0) {
        let multiplied = Math.round(value * 10 ** round);
        while (multiplied === 0) {
            round += 1;
            multiplied = Math.round(value * 10 ** round);
        }
        return multiplied / 10 ** round;
    }

    return value;
}
