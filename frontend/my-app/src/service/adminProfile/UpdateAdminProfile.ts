import { AdminProfile, AdminProfileResponse } from "./CreateAdminProfile";
import { ADMIN_PROFILE_API_ENDPOINTS } from "@/mapper/adminProfileMapper";
import axiosInstance from "@/utils/axios";

export const updateAdminProfile = async (
  profile: AdminProfile,
  token: string
)=> {
  try {
    const formData = new FormData();

    const adminProfileDTO = {
      fullName: profile.fullName,
      adminNotes: profile.adminNotes,
      qualifications: profile.qualifications,
      contactNumber: profile.contactNumber,
      email: profile.email,
    };

    const adminProfileBlob = new Blob([JSON.stringify(adminProfileDTO)], {
      type: 'application/json',
    });

    formData.append('adminProfile', adminProfileBlob, 'adminProfile.json');

    if (profile.profilePicture) {
      formData.append('profilePicture', profile.profilePicture);
    }
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

    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error('Error updating profile:', error);
  }
};
