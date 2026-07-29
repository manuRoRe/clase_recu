// src/services/adminCitizenService.js
import axiosClient from "../api/axiosClient";


export async function listAdminCitizens(search = "") {
    const response = await axiosClient.get("/admin/citizens", {
        params: search ? { search } : {},
    });

    return response.data;
}

export async function getAdminCitizenDetails(citizenId) {
    const response = await axiosClient.get(`/admin/citizens/${citizenId}`);
    return response.data;
}

export async function createAdminCitizen(citizenData) {
    const response = await axiosClient.post("/admin/citizens", citizenData);
    return response.data;
}

export async function updateAdminCitizen(citizenId, citizenData) {
    const response = await axiosClient.patch(
        `/admin/citizens/${citizenId}/point-adjustments`,
        citizenData
    );

    return response.data;
}

export async function deactivateAdminCitizen(citizenId, reason) {
    const response = await axiosClient.patch(
        `/admin/citizens/${citizenId}/status`,
        {
            status: "inactive",
            reason,
        }
    );

    return response.data;
}
