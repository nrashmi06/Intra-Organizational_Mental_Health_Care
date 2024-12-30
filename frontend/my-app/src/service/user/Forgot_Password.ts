import axios from 'axios';
import { API_ENDPOINTS } from '@/mapper/userMapper'; // Import the userMapper

interface ForgotPasswordResponse {
  message: string;
}

const forgotPassword = async (email: string, token: string): Promise<string> => {
  try {
    const response = await axios.post<ForgotPasswordResponse>(API_ENDPOINTS.FORGOT_PASSWORD, { email }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // Assuming the response structure matches the example provided
    return response.data.message;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to process forgot-password request');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export default forgotPassword;