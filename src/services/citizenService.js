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