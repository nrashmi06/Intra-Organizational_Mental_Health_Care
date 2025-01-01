// src/service/user/RefreshToken.ts
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
import { setUser } from "@/store/authSlice";

const refreshToken = async (dispatch: any) => { // Accept dispatch as a parameter
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.RENEW_TOKEN, {}, { withCredentials: true });
        dispatch(setUser(response.data)); // Dispatch the action with the new user data
        return response.data;
    } catch (error) {
        console.error("Error refreshing token:", error);
        window.location.href = "/signin"; // Redirect to signin if refresh fails
    }
};

export default refreshToken;
