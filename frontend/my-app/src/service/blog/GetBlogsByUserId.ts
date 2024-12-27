import axios from 'axios';
import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper';


export const getBlogsByUserId = async (userId: string, token: string) => {
  try {
    const response = await axios.get(BLOG_API_ENDPOINTS.GET_BLOGS_BY_USER(userId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs by user ID:', error);
    throw error;
  }
};