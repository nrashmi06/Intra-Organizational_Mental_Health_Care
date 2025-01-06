import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper';
import axiosInstance from '@/utils/axios';

export const changeBlogApprovalStatus = async (id: string, status: 'approved' | 'rejected', token: string) => {
  try {
    const response = await axiosInstance.put(
      `${BLOG_API_ENDPOINTS.UPDATE_BLOG_APPROVAL_STATUS(id)}?isApproved=${status === 'approved'}`, 
      { status }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data; 
  } catch (error) {
    console.error("Error updating blog approval status:", error);
  }
};
