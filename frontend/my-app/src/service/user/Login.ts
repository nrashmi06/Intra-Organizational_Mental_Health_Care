import axios from "axios";

// Define the type for the login response
interface LoginResponse {
  token: string;  // Assuming the response contains a JWT token on successful login
  message?: string; // Optional message, if the backend sends one
}

// Create a function to handle user login
export const loginUser = async (email: string, password: string): Promise<LoginResponse | null> => {
  try {
    const response = await axios.post('http://localhost:8080/mental-health/api/v1/users/login', {
      email,
      password,
    });

    if (response.status === 200) {
      // Return the response data which includes the token and message
      return response.data;
    } else {
      throw new Error("Login failed. Please check your credentials.");
    }
  } catch (error) {
    // Handle errors, log them for debugging purposes
    console.error("Error during login:", error);
    
    // Check if the error has a response object (from the server)
    if (axios.isAxiosError(error) && error.response) {
      // You can extract more information from error.response if needed
      console.error("Response error:", error.response.data);
      return null; // Or you can throw an error here to propagate further if you want
    } else {
      // Handle generic errors (e.g., network errors)
      console.error("Network error or invalid login:", (error as Error).message);
      return null; // Or throw a general error if you want to stop execution
    }
  }
};
