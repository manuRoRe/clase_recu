import axiosClient from "../api/axiosClient";



export const checkHealth = async () => {
    try {
        const response = await axiosClient.get("/health");
        return response.data;
    } catch (error) {
        console.error("Error checking health:", error);
        throw error;
    }
}

export async function getCitizenProfile() {
    const response = await axiosClient.get("/me/profile");
    return response.data;
}
export async function getVehicles() {
    const response = await axiosClient.get("/me/vehicles");
    return response.data;
}