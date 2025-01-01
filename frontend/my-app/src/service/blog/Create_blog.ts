import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper'; // Import the blog endpoints from the mapper
import axiosInstance from '@/utils/axios';

export const createBlog = async (
  blogData: {
    title: string;
    content: string;
    summary: string;
    userId: number;
    image: File; 
  },
  accessToken: string
) => {
  try {
    const formData = new FormData();
    formData.append('image', blogData.image);
    const blogRequestDTO = {
      title: blogData.title,
      content: blogData.content,
      summary: blogData.summary,
      userId: blogData.userId,
    };

    const blogBlob = new Blob([JSON.stringify(blogRequestDTO)], {
      type: 'application/json',
    });
    formData.append('blog', blogBlob, 'blog.json');

    for (const [value] of formData.entries()) {
      console.log('FormData -${key}:', value);
    }
    const response = await axiosInstance.post(BLOG_API_ENDPOINTS.CREATE_BLOG, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data; 
  } catch (error: any) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Failed to create blog'
    );
  }
};
