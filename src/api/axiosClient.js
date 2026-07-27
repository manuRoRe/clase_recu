import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://teamflow-api-rnvl.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosClient;