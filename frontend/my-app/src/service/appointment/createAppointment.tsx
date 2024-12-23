import axios from 'axios';
import {APPOINTMENT_API_ENDPOINTS} from '@/mapper/appointmentMapper';  // Import the appointment API endpoint mappings
interface FormData {
  adminId: string;
  timeSlotId: string;
  fullName: string;
  severityLevel: string;
  phoneNumber: string;
  appointmentReason: string;
}

// Create an Axios instance with default configurations
const createAppointment = async (token: string, formData: FormData) => {
  try {
    const response = await axios.post(
      APPOINTMENT_API_ENDPOINTS.BOOK_APPOINTMENT, // Use the mapped URL
      formData, // Pass the form data
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '', // Add token dynamically if available
        },
      }
    );
    
    return response; // Return response on success
  } catch (error: any) {
    console.error('Error creating appointment:', error.response?.data || error.message || error);
    throw error; // Throw error to be handled by the component
  }
};

export default createAppointment;
