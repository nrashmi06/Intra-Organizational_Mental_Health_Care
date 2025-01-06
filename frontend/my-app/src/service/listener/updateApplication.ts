import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper"; // Import URL mappings
import axiosInstance from "@/utils/axios";

export const updateApplication = async (
  applicationId: string,
  applicationData: {
    fullName: string;
    branch: string;
    usn: string;
    semester: number;
    phoneNumber: string;
    reasonForApplying: string;
    image?: File;
  },
  accessToken: string
) => {
  try {
    const formData = new FormData();

    if (applicationData.image) {
      formData.append("certificate", applicationData.image);
    }

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

    const response = await axiosInstance.put(
      LISTENER_APPLICATION_API_ENDPOINTS.UPDATE_APPLICATION(applicationId),
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
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  }
};
