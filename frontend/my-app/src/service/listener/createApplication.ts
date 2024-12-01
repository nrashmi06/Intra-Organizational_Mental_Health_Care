import axios from "axios";

const API_BASE_URL =
  "http://localhost:8080/mental-health/api/v1/listener-applications/submit";

export const createApplication = async (
  applicationData: {
    fullName: string;
    branch: string;
    usn: string;
    semester: number;
    phoneNumber: string;
    reasonForApplying: string;
    image: File; // Ensure this is a File object
  },
  accessToken: string
) => {
  try {
    // Create FormData instance
    const formData = new FormData();

    // Add the image file to FormData
    formData.append("certificate", applicationData.image);

    // Prepare application data as a JSON object
    const applicationRequestDTO = {
      fullName: applicationData.fullName,
      branch: applicationData.branch,
      semester: applicationData.semester,
      usn: applicationData.usn,
      reasonForApplying: applicationData.reasonForApplying,
      phoneNumber: applicationData.phoneNumber,
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

    // Make the POST request
    const response = await axios.post(`${API_BASE_URL}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

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
        "Failed to submit application"
    );
  }
};
