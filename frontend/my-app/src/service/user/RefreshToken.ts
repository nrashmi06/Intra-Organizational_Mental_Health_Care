// src/service/user/RefreshToken.ts
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
import { setUser } from "@/store/authSlice";

const refreshToken = async (dispatch: any) => { // Accept dispatch as a parameter
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.RENEW_TOKEN, {}, { withCredentials: true });
        const accessToken = response.headers["authorization"]?.startsWith(
            "Bearer "
          )
            ? response.headers["authorization"].slice(7)
            : null;
    
        dispatch(
            setUser({
              userId: response.data.userId,
              email: response.data.email,
              anonymousName: response.data.anonymousName,
              role: response.data.role,
              accessToken: accessToken,
            })
          ); // Dispatch the action with the new user data
        return response.data;
    } catch (error) {
        console.error("Error refreshing token:", error);
        window.location.href = "/signin"; 
    }
};

export default refreshToken;
