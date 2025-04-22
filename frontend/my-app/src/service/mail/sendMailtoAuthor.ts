import axiosInstance from "@/utils/axios";
import { EMAIL_API_ENDPOINTS } from "@/mapper/emailMapper";

export const sendMailToAuthor = async (
  emailData: {
    subject: string;
    body: string;
  },
  userId: number,
  accessToken: string
) => {
  try {
    console.log("Email data:", emailData);
    console.log("User ID:", userId);
    console.log("Access token:", accessToken);

    const response = await axiosInstance.post(
      EMAIL_API_ENDPOINTS.SEND_EMAIL(userId),
      {
        subject: emailData.subject,
        body: emailData.body,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
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
    throw error;
  }
};
