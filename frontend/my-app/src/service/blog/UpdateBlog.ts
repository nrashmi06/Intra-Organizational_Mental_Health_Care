import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper'; 
import axiosInstance from '@/utils/axios';

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

  const blogRequestDTO: { [key: string]: any } = {};
  if (blogData.title) blogRequestDTO.title = blogData.title;
  if (blogData.content) blogRequestDTO.content = blogData.content;
  if (blogData.summary) blogRequestDTO.summary = blogData.summary;
  if (blogData.userId) blogRequestDTO.userId = blogData.userId;

  const blogBlob = new Blob([JSON.stringify(blogRequestDTO)], {
    type: 'application/json',
  });
  formData.append('blog', blogBlob, 'blog.json');

  try {
    const response = await axiosInstance.put(BLOG_API_ENDPOINTS.UPDATE_BLOG(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update the blog:', error);
  }
};
