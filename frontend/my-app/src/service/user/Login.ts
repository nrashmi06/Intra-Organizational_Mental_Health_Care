import { setUser } from "@/store/authSlice";
import { AppDispatch } from "@/store/index";
import axiosInstance from '@/utils/axios'; // Import your Axios instance
import { API_ENDPOINTS } from "@/mapper/userMapper";

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    // Send POST request using Axios
    const response = await axiosInstance.post(
      API_ENDPOINTS.LOGIN,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    // Extract access token from response headers
    const accessToken = response.headers["authorization"]?.startsWith("Bearer ")
      ? response.headers["authorization"].slice(7)
      : null;

    if (!accessToken) {
      return { 
        success: false, 
        error: "Authentication failed. Please try again." 
      };
    }

    // Dispatch the action to store user details and token in Redux
    dispatch(
      setUser({
        userId: response.data.userId,
        email: response.data.email,
        anonymousName: response.data.anonymousName,
        role: response.data.role,
        accessToken: accessToken,
      })
    );

    return { success: true, data: response.data, accessToken };
  } catch (error : any) {
    console.error("Login error:", error);

    // Axios-specific error handling
    if (error.response) {
      if (error.response.status === 401) {
        return { success: false, error: "Invalid username or password. Please try again." };
      }

      if (error.response.status === 400) {
        const errorData = error.response.data;
        return { 
          success: false, 
          error: errorData.message || "Invalid input. Please check your credentials." 
        };
      }

      return { 
        success: false, 
        error: error.response.data?.message || "Login failed due to an unknown error." 
      };
    }

    return { 
      success: false, 
      error: "Unable to connect to the server. Please try again later." 
    };
  }
};
