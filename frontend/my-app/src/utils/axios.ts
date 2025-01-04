import axios from "axios";
import { store } from "@/store";
import refreshToken from "@/service/user/RefreshToken";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === undefined || error.response?.status === 429) {
            if (typeof window !== "undefined") {
                window.location.href = "/RateLimitPage";
            }
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshToken(store.dispatch);
                originalRequest.headers["Authorization"] = `Bearer ${store.getState().auth.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                if (typeof window !== "undefined") {
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;