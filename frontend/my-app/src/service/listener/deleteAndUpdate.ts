import axios from "axios";
import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper"; 
import axiosInstance from "@/utils/axios";

export const deleteApplication = async (
  applicationId: string | null,
  accessToken: string
) => {
  try {
    if (!applicationId) {
      throw new Error("Application ID cannot be null");
    }
    const url = `${LISTENER_APPLICATION_API_ENDPOINTS.DELETE_APPLICATION(applicationId.toString())}`;
    

    const result = await axiosInstance.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return result;
  } catch (error) {
    console.error("Error deleting application:", error);
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
    image: File | null; 
  }
) => {
  try {
    const formData = new FormData();
    if (updatedData.image) {
      formData.append("certificate", updatedData.image);
    }

    const applicationRequestDTO = {
      fullName: updatedData.fullName,
      branch: updatedData.branch,
      semester: updatedData.semester,
      usn: updatedData.usn,
      reasonForApplying: updatedData.reasonForApplying,
      phoneNumber: updatedData.phoneNumber,
    };

    const applicationBlob = new Blob([JSON.stringify(applicationRequestDTO)], {
      type: "application/json",
    });
    formData.append("application", applicationBlob, "application.json");

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
    if (error.response) {
      console.error("Error response data:", error.response.data);
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
