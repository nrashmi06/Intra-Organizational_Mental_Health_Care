import axios from 'axios';
import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper'; // Import the blog endpoints from the mapper

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
    // Create FormData for the request
    const formData = new FormData();

    // Append the image file
    formData.append('image', blogData.image);

    // Prepare the blog data as JSON
    const blogRequestDTO = {
      title: blogData.title,
      content: blogData.content,
      summary: blogData.summary,
      userId: blogData.userId,
    };

    // Convert blog data to a Blob (JSON)
    const blogBlob = new Blob([JSON.stringify(blogRequestDTO)], {
      type: 'application/json',
    });
    formData.append('blog', blogBlob, 'blog.json');

    // Debug: Log FormData contents
    for (const [value] of formData.entries()) {
      console.log('FormData -${key}:', value);
    }

    // Make the POST request using the API endpoint
    const response = await axios.post(BLOG_API_ENDPOINTS.CREATE_BLOG, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data; // Return the response data (created blog details)
  } catch (error: any) {
    // Enhanced error logging
    if (error.response) {
      // The request was made, and the server responded with a status code
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }

    // Throw the error with a more informative message
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Failed to create blog'
    );
  }
};
