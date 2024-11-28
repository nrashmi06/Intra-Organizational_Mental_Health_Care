import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/mental-health/api/v1';

export const createBlog = async (blogData: {
  title: string;
  content: string;
  summary: string;
  userId: number;
  image: File;
}) => {
  try {
    const formData = new FormData();

    // Add the blog data as a JSON string
    formData.append(
      'blog',
      JSON.stringify({
        title: blogData.title,
        content: blogData.content,
        summary: blogData.summary,
        userId: blogData.userId,
      })
    );

    // Add the image as a separate key
    formData.append('image', blogData.image);

    // Make the POST request
    const response = await axios.post(`${API_BASE_URL}/blogs/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create blog');
  }
};
