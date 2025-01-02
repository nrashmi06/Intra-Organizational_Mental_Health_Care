import axios from "axios";
import refreshToken from "@/service/user/RefreshToken"; 
import { useAppDispatch } from "@/hooks/useAppDispatch";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Replace with your API base URL
  timeout: 10000, // Optional: set a timeout for requests
});

// Global Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response if successful
  async (error) => {
    const originalRequest = error.config;
    console.log("Request inside axios instance failed with status code:", error.response?.status);

    // Handle 429 (Too Many Requests) globally
    if (error.response?.status === undefined || error.response?.status === 429) {
      console.info("You are being rate-limited. Please try again later.");
      alert("You are being rate-limited. Please try again later.");
      if (typeof window !== "undefined") {
        alert("Too many requests! Please slow down.");
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        const dispatch = useAppDispatch();
        const data = await dispatch(refreshToken); // Assuming refreshToken is designed for this purpose
        if (data && data.accessToken) {

          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest); // Retry the request
        } else {
          // Handle failure to refresh token (e.g., log out user)
          alert("Session expired. Please log in again.");
          window.location.href = "/signin"; // Redirect to sign-in page (or log the user out)
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        // Handle the case where the token refresh fails
        alert("Error refreshing token. Please log in again.");
        window.location.href = "/signin"; // Redirect to sign-in page
      }
    }

    return Promise.reject(error); // Reject the error for local handling
  }
);

export default axiosInstance;
