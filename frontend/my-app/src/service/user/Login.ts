import axios from "axios";
import { setUser } from "@/store/authSlice";
import { AppDispatch } from "@/store/index"; 

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    // Make the actual API call to login
    const response = await axios.post('http://localhost:8080/mental-health/api/v1/users/login', {
      email,
      password,
    });
    
    if (response.status === 200 && response.data) {
      // Extract the access token from the headers
      const accessToken = response.headers['authorization']?.replace("Bearer ", "").trim() || "not retrived correctly ";
      console.log("Response Headers:", response.headers);
      console.log("API response:", response);
      console.log("Authorization Header:", response.headers['authorization']);
      console.log("accessToken :" , accessToken);


      // Dispatch the action to store user details and token in Redux
      dispatch(setUser({
        userId: response.data.userId,
        email: response.data.email,
        anonymousName: response.data.anonymousName,
        role: response.data.role,
        accessToken: accessToken,
      }));

      // Return the response data for further processing
      return response.data;
    } else {
      throw new Error("Invalid login credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Response error:", error.response.data);
    }
    throw error;
  }
};
