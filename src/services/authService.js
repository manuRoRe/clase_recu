import axiosClient from "../api/axiosClient";

export const login = async (email, password) => {
    try {
        const response = await axiosClient.post("/auth/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}