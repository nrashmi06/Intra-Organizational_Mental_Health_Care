// src/service/blog/UpdateBlogStatus.ts
import axios from 'axios';

export const changeBlogApprovalStatus = async (id: string, status: 'approved' | 'rejected', token: string) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/mental-health/api/v1/blogs/${id}/approval-status?isApproved=${status === 'approved'}`, 
      { status }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data; // Expected to return a { success: true/false, message: string }
  } catch (error) {
    console.error("Error updating blog approval status:", error);
    throw error;
  }
};
