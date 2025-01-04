import axiosInstance from "@/utils/axios";
import { EMAIL_API_ENDPOINTS } from "@/mapper/emailMapper"; 

export const sendMassEmail = async (
  emailData: {
    subject: string;
    body: string;
    files: File[];
  },
  recipientType: string,
  accessToken: string
) => {
  try {
    const formData = new FormData();
    formData.append("subject", emailData.subject);
    formData.append("body", emailData.body);
    emailData.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await axiosInstance.post(
      EMAIL_API_ENDPOINTS.SEND_MASS_EMAIL(recipientType), 
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response data:", error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  }
};
