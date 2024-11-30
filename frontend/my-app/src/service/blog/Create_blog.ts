import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/mental-health/api/v1';

export const createBlog = async (
  blogData: {
    title: string;
    content: string;
    summary: string;
    userId: number;
    image: File; // Ensure this is a File object
  },
  accessToken: string
) => {
  try {
    // Create FormData
    const formData = new FormData();

    // Add image first
    formData.append('image', blogData.image);

    // Prepare blog data as JSON
    const blogRequestDTO = {
      title: blogData.title,
      content: blogData.content,
      summary: blogData.summary,
      userId: blogData.userId,
    };

    // Convert blog data to Blob
    const blogBlob = new Blob([JSON.stringify(blogRequestDTO)], {
      type: 'application/json'
    });
    formData.append('blog', blogBlob, 'blog.json');

    // Debug: Log FormData contents
    for (const [key, value] of formData.entries()) {
      console.log('FormData -${key}:', value);
    }

    // Make the POST request
    const response = await axios.post(`${API_BASE_URL}/blogs/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    // Enhanced error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }

    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Failed to create blog'
    );
  }
};