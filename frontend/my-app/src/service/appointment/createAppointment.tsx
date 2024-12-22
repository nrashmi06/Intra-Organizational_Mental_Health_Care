import axios from 'axios';

// Define the FormData interface correctly with string types for each field
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
      'http://localhost:8080/mental-health/api/v1/appointments', 
      {
        ...formData,
        timeSlotId: formData.timeSlotId, // Ensure selected time slot ID is included
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '', // Add token dynamically if available
        },
      }
    );
    return response; // Return response to handle success in the component
  } catch (error) {
    const err = error as any;
    console.error('Error creating appointment:', err.response?.data || err.message);
    throw err; // Throw error to be handled in the component
  }
};

export default createAppointment;
