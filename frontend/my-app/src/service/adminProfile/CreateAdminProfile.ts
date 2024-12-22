import axios from 'axios';
import { ADMIN_PROFILE_API_ENDPOINTS } from '@/mapper/adminProfileMapper';


export interface AdminProfile {
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePicture: File | null; // File type for the profile picture
}

export interface AdminProfileResponse {
  adminId: number;
  userId: number;
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePictureUrl: string; // URL for the uploaded profile picture
  createdAt: string;
  updatedAt: string;
}

export const createAdminProfile = async (
    adminProfile: AdminProfile,
    accessToken: string
  ): Promise<AdminProfileResponse> => {
    try {
      // Construct FormData for file upload and text fields
      const formData = new FormData();
      
      const adminProfileDTO = {
        fullName: adminProfile.fullName,
        adminNotes: adminProfile.adminNotes,
        qualifications: adminProfile.qualifications,
        contactNumber: adminProfile.contactNumber,
        email: adminProfile.email,
      };

        // Convert blog data to Blob
        const adminProfileBlob = new Blob([JSON.stringify(adminProfileDTO)], {
            type: 'application/json'
            });
            formData.append('adminProfile', adminProfileBlob, 'adminProfile.json');


      // Add profile picture if provided
      if (adminProfile.profilePicture) {
        formData.append('profilePicture', adminProfile.profilePicture);
      }
  
      // Make the POST request
      const response = await axios.post<AdminProfileResponse>(`${ADMIN_PROFILE_API_ENDPOINTS.CREATE_ADMIN_PROFILE}`, 
        formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log(response.data);   
  
      // Return the parsed response data
      return response.data;
    } catch (error: any) {
      // Enhanced error logging
      const errorMessage = error.response
        ? error.response.data
        : error.message || 'An unknown error occurred';
      console.error('Error creating admin profile:', errorMessage);
      throw new Error(errorMessage);
    }
  };