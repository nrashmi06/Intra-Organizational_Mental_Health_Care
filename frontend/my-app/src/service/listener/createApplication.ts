import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper"; // Import the mapper
import axiosInstance from "@/utils/axios";

export const createApplication = async (
  applicationData: {
    fullName: string;
    branch: string;
    usn: string;
    semester: number;
    phoneNumber: string;
    reasonForApplying: string;
    image: File;
  },
  accessToken: string
) => {
  try {
    const formData = new FormData();
    formData.append("certificate", applicationData.image);
    const applicationRequestDTO = {
      fullName: applicationData.fullName,
      branch: applicationData.branch,
      semester: applicationData.semester,
      usn: applicationData.usn,
      reasonForApplying: applicationData.reasonForApplying,
      phoneNumber: applicationData.phoneNumber,
    };
    const applicationBlob = new Blob([JSON.stringify(applicationRequestDTO)], {
      type: "application/json",
    });
    formData.append("application", applicationBlob, "application.json");

    for (const [key, value] of formData.entries()) {
      console.log(`FormData - ${key}:`, value);
    }
    const response = await axiosInstance.post(
      `${LISTENER_APPLICATION_API_ENDPOINTS.SUBMIT_APPLICATION}`, // Use the mapped endpoint
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
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
