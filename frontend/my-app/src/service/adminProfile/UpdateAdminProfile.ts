import { AdminProfile, AdminProfileResponse } from "./CreateAdminProfile";
import { ADMIN_PROFILE_API_ENDPOINTS } from "@/mapper/adminProfileMapper";
import axiosInstance from "@/utils/axios";

export const updateAdminProfile = async (
  profile: AdminProfile,  // Change to AdminProfile type
  token: string
): Promise<AdminProfileResponse> => {
  try {
    // Construct FormData for file upload and text fields
    const formData = new FormData();

    // Create an adminProfileDTO with the text fields
    const adminProfileDTO = {
      fullName: profile.fullName,
      adminNotes: profile.adminNotes,
      qualifications: profile.qualifications,
      contactNumber: profile.contactNumber,
      email: profile.email,
    };

    // Convert the adminProfileDTO to a Blob
    const adminProfileBlob = new Blob([JSON.stringify(adminProfileDTO)], {
      type: 'application/json',
    });

    // Append adminProfile data as a JSON file
    formData.append('adminProfile', adminProfileBlob, 'adminProfile.json');

    // Add profile picture if provided
    if (profile.profilePicture) {
      formData.append('profilePicture', profile.profilePicture);
    }

    // Make the PUT request to update the profile
    const response = await axiosInstance.put<AdminProfileResponse>(
      ADMIN_PROFILE_API_ENDPOINTS.UPDATE_ADMIN_PROFILE,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Handle the response data
    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
