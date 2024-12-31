import axiosInstance from '@/utils/axios'; // Import the Axios instance
import { API_ENDPOINTS } from "@/mapper/userMapper";

export const verifyEmail = async (email: string) => {
  const url = API_ENDPOINTS.VERIFY_EMAIL; // Use the mapped URL from the envMapper

  try {
    const response = await axiosInstance.post(
      url,
      { email }, // Send email in the body as JSON
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Email verified successfully:', response.data);
    return response.data; // Return the data from the response
  } catch (error : any) {
    console.error('Error during email verification:', error);

    // Handle Axios-specific error
    if (error.response) {
      const errorData = error.response.data;
      throw new Error(`Email verification failed: ${errorData.message || error.response.statusText}`);
    }

    // Fallback for network or other errors
    throw new Error("Network or unexpected error occurred during email verification.");
  }
};
