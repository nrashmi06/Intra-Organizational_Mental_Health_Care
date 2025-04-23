import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
import { setUser, clearUser } from "@/store/authSlice";
import { AppDispatch } from "@/store"; // Adjust according to your app's store setup

interface RefreshTokenResponse {
    userId: string;
    email: string;
    anonymousName: string;
    role: string;
}

const refreshToken = async (dispatch: AppDispatch): Promise<void> => {
    try {
        const response = await axiosInstance.post(
            API_ENDPOINTS.RENEW_TOKEN,
            {},
            { withCredentials: true }
        );

        const accessToken = response.headers["authorization"]?.startsWith(
            "Bearer "
          )
            ? response.headers["authorization"].slice(7)
            : null;
        const data = response.data as RefreshTokenResponse;
        console.log("Refresh token response:", data, accessToken);

        dispatch(
            setUser({
                userId: data.userId,
                email: data.email,
                anonymousName: data.anonymousName,
                role: data.role,
                accessToken: accessToken,
            })
        );
               
    } catch (error: any) {
        console.error("Error refreshing token:", error.response || error.message);

        dispatch(clearUser());
        window.location.href = "/signin";
    }
};

export default refreshToken;