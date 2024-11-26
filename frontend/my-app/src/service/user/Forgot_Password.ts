import axios from 'axios';

interface ForgotPasswordResponse {
  message: string;
}

const forgotPassword = async (email: string): Promise<string> => {
  const endpoint = 'http://localhost:8080/mental-health/api/v1/users/forgot-password';

  try {
    const response = await axios.post<ForgotPasswordResponse>(endpoint, { email });
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
