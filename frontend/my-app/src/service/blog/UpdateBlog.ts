import axios from 'axios';
import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper'; // Adjust the path if needed

export const updateBlog = async (
  id: number,
  blogData: {
    title?: string;
    content?: string;
    summary?: string;
    userId: number;
    image?: File;
  },
  token: string
) => {
  const formData = new FormData();

  if (blogData.image) {
    formData.append('image', blogData.image);
  }

  // Only include properties that are defined
  const blogRequestDTO: { [key: string]: any } = {};
  if (blogData.title) blogRequestDTO.title = blogData.title;
  if (blogData.content) blogRequestDTO.content = blogData.content;
  if (blogData.summary) blogRequestDTO.summary = blogData.summary;
  if (blogData.userId) blogRequestDTO.userId = blogData.userId;

  // Append the blog data as JSON in a blob
  const blogBlob = new Blob([JSON.stringify(blogRequestDTO)], {
    type: 'application/json',
  });
  formData.append('blog', blogBlob, 'blog.json');

  try {
    const response = await axios.put(BLOG_API_ENDPOINTS.UPDATE_BLOG(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating blog:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update blog');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred while updating the blog');
    }
  }
};
