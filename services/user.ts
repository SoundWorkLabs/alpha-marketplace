import { API_BASE_URL } from "../utils/config";

export async function fetchUserById(id: number) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/id/${id}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error fetching user:", response.statusText);
        }
    } catch (err) {
        console.error("Error fetching user:", err);
    }
}

export async function fetchUserByAddress(address: string) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/users/address/${address}`
        );
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error fetching user:", response.statusText);
        }
    } catch (err) {
        console.error("Error fetching user:", err);
    }
}

export async function fetchUserByUsername(username: string) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/users/address/${username}`
        );
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error fetching user:", response.statusText);
        }
    } catch (err) {
        console.error("Error fetching user:", err);
    }
}

export async function deleteUser(id: number) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/delete/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            console.log("User deleted successfully");
        } else {
            console.error("Error deleting user:", response.statusText);
        }
    } catch (err) {
        console.error("Error deleting user:", err);
    }
}
