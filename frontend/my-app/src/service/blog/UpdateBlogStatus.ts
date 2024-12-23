// src/service/blog/UpdateBlogStatus.ts
import axios from 'axios';
import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper';

export const changeBlogApprovalStatus = async (id: string, status: 'approved' | 'rejected', token: string) => {
  try {
    const response = await axios.put(
      `${BLOG_API_ENDPOINTS.UPDATE_BLOG_APPROVAL_STATUS(id)}?isApproved=${status === 'approved'}`, 
      { status }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data; // Expected to return a { success: true/false, message: string }
  } catch (error) {
    console.error("Error updating blog approval status:", error);
    throw error;
  }
};
