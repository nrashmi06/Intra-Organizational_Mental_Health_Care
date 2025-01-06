import axiosInstance from '@/utils/axios'; 
import { API_ENDPOINTS } from "@/mapper/userMapper";

export const verifyEmail = async (email: string) => {
  const url = API_ENDPOINTS.VERIFY_EMAIL; 

  try {
    const response = await axiosInstance.post(
      url,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; 
  } catch (error : any) {
    console.error('Error during email verification:', error);

    if (error.response) {
      const errorData = error.response.data;
      console.error('Error data:', errorData);
    }

  }
};
