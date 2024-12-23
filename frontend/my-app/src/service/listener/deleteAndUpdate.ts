import axios from "axios";
import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper"; // Import the mapper

export const deleteApplication = async (
  applicationId: string | null,
  accessToken: string
) => {
  try {
    // Use the mapped endpoint for deleting the application
    if (!applicationId) {
      throw new Error("Application ID cannot be null");
    }
    const url = `${LISTENER_APPLICATION_API_ENDPOINTS.DELETE_APPLICATION(applicationId.toString())}`;
    

    const result = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return result;
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

export const updateApplication = async (
  applicationId: string,
  accessToken: string,
  updatedData: {
    fullName: string;
    branch: string;
    usn: string;
    semester: number;
    phoneNumber: string;
    reasonForApplying: string;
    image: File | null; // Ensure this is a File object or null
  }
) => {
  try {
    // Create FormData instance
    const formData = new FormData();

    // Add the image file to FormData if it exists
    if (updatedData.image) {
      formData.append("certificate", updatedData.image);
    }

    // Prepare application data as a JSON object
    const applicationRequestDTO = {
      fullName: updatedData.fullName,
      branch: updatedData.branch,
      semester: updatedData.semester,
      usn: updatedData.usn,
      reasonForApplying: updatedData.reasonForApplying,
      phoneNumber: updatedData.phoneNumber,
    };

    // Convert application data to a Blob
    const applicationBlob = new Blob([JSON.stringify(applicationRequestDTO)], {
      type: "application/json",
    });
    formData.append("application", applicationBlob, "application.json");

    // Debug: Log FormData contents (optional, for debugging purposes)
    for (const [key, value] of formData.entries()) {
      console.log(`FormData - ${key}:`, value);
    }

    // Use the mapped endpoint for updating the application
    const response = await axios.put(
      `${LISTENER_APPLICATION_API_ENDPOINTS.UPDATE_APPLICATION(applicationId.toString())}`,
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
    // Enhanced error logging
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update application"
    );
  }
};
