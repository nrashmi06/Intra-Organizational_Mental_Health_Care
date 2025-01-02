import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
import { setUser, clearUser } from "@/store/authSlice";
import { AppDispatch } from "@/store"; // Adjust according to your app's store setup

const refreshToken = async (dispatch: AppDispatch): Promise<void> => {
    try {
        const response = await axiosInstance.post(
            API_ENDPOINTS.RENEW_TOKEN,
            {},
            { withCredentials: true }
        );

        const accessToken = response.headers["authorization"]?.startsWith("Bearer ")
            ? response.headers["authorization"].slice(7)
            : null;

        if (!accessToken) {
            throw new Error("Failed to retrieve access token.");
        }

        dispatch(
            setUser({
                userId: response.data.userId,
                email: response.data.email,
                anonymousName: response.data.anonymousName,
                role: response.data.role,
                accessToken,
            })
        );
    } catch (error: any) {
        console.error("Error refreshing token:", error.response || error.message);

        dispatch(clearUser());
        window.location.href = "/signin";
    }
};

export default refreshToken;
