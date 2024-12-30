import axios from 'axios';
import { APPOINTMENT_API_ENDPOINTS } from '@/mapper/appointmentMapper'; 
import { FormData } from '@/lib/types'; 

const createAppointment = async (token: string, formData: FormData): Promise<number | null> => {
  try {
    const response = await axios.post(
      APPOINTMENT_API_ENDPOINTS.BOOK_APPOINTMENT,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );
    return response.status; // Return response status
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating appointment:', error.response?.data || error.message);
      return error.response?.status || null; // Return specific status code for further handling
    }
    console.error('Unexpected error:', error.message || error);
    return null; // Handle non-Axios errors
  }
};

export default createAppointment;
