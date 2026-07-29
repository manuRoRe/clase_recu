import axiosClient from "../api/axiosClient";

export const login = async (credentials) => {
    try {
        const response = await axiosClient.post("/auth/login", credentials);
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}