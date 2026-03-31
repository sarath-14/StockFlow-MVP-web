import axios from "axios";
import { LOCAL_STORAGE_KEYS, localstorage } from "./localstorage";
import { toast } from "sonner";

export interface ResponseJson<T> {
    data: T;
    success: boolean;
    message: string;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const token = localstorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if(token && token.length) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    (response) => {
        if(response.data.success == true) {
            return response;
        }
        toast.error(response.data.message);
        return Promise.reject(response.data.message);
    },
    (error) => {
        const message = error?.response?.data?.message || error.message || "Something went wrong";
        toast.error(message);
        return Promise.reject(error);
    }
)

export default api;