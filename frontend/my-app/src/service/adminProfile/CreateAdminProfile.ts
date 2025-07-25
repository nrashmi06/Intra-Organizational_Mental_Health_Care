import axiosInstance from '@/utils/axios';
import { ADMIN_PROFILE_API_ENDPOINTS } from '@/mapper/adminProfileMapper';


export interface AdminProfile {
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePicture: File | null;
  profilePictureUrl?: string;
  totalAppointments?: number;
  lastAppointmentDate?: string;
  totalBlogsPublished?: number;
  totalLikesReceived?: number;
  totalViewsReceived?: number;
}


export const createAdminProfile = async (
    adminProfile: AdminProfile,
    accessToken: string
  )=> {
    try {
      const formData = new FormData();
      
      const adminProfileDTO = {
        fullName: adminProfile.fullName,
        adminNotes: adminProfile.adminNotes,
        qualifications: adminProfile.qualifications,
        contactNumber: adminProfile.contactNumber,
        email: adminProfile.email,
      };

        const adminProfileBlob = new Blob([JSON.stringify(adminProfileDTO)], {
            type: 'application/json'
            });
            formData.append('adminProfile', adminProfileBlob, 'adminProfile.json');


      if (adminProfile.profilePicture) {
        formData.append('profilePicture', adminProfile.profilePicture);
      }
  
      const response = await axiosInstance.post(`${ADMIN_PROFILE_API_ENDPOINTS.CREATE_ADMIN_PROFILE}`, 
        formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        }
      });  
  
      return response.data || null;
    } catch (error: any) {
      const errorMessage = error.response
        ? error.response.data
        : error.message || 'An unknown error occurred';
      console.error('Error creating admin profile:', errorMessage);
    }
  };