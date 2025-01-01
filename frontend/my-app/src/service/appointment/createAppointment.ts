import { APPOINTMENT_API_ENDPOINTS } from '@/mapper/appointmentMapper'; 
import { FormData } from '@/lib/types'; 
import axiosInstance from '@/utils/axios';

const createAppointment = async (token: string, formData: FormData): Promise<number | null> => {
  try {
    const response = await axiosInstance.post(
      APPOINTMENT_API_ENDPOINTS.BOOK_APPOINTMENT,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );
    return response.status;
  } catch (error: any) {
    console.error('Unexpected error:', error.message || error);
    return null;
  }
};

export default createAppointment;
