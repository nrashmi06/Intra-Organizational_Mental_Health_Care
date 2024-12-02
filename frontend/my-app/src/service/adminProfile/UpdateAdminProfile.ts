import axios from "axios";

const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/admins";

export interface AdminProfile {
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePicture: File | null; // File type for the profile picture
  profilePictureUrl?: string; // Optional: URL for the profile picture
}

export interface AdminProfileResponse {
  adminId: number;
  userId: number;
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePictureUrl: string; // URL for the uploaded or forwarded profile picture
  createdAt: string;
  updatedAt: string;
}

export const updateAdminProfile = async (
  adminProfile: AdminProfile,
  accessToken: string,
  id: string
): Promise<AdminProfileResponse> => {
  try {
    // Construct FormData for file upload and text fields
    const formData = new FormData();

    // If profile picture is a file, append it
    if (adminProfile.profilePicture) {
      formData.append("profilePicture", adminProfile.profilePicture);
    } else if (adminProfile.profilePictureUrl) {
      // If a profile picture URL is provided, include it as a string
      formData.append("profilePictureUrl", adminProfile.profilePictureUrl);
    }

    // Prepare the admin profile DTO as a Blob
    const adminProfileDTO = {
      fullName: adminProfile.fullName,
      adminNotes: adminProfile.adminNotes,
      qualifications: adminProfile.qualifications,
      contactNumber: adminProfile.contactNumber,
      email: adminProfile.email,
    };

    const adminProfileBlob = new Blob([JSON.stringify(adminProfileDTO)], {
      type: "application/json",
    });
    formData.append("adminProfile", adminProfileBlob, "adminProfile.json");

    // Make the PUT request to update the profile
    const response = await axios.put<AdminProfileResponse>(
      `${API_BASE_URL}/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Profile updated successfully:", response.data);

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response
      ? error.response.data
      : error.message || "An unknown error occurred while updating the profile";
    console.error("Error updating admin profile:", errorMessage);
    throw new Error(errorMessage);
  }
};
