import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/mental-health/api/v1';

export const createBlog = async (
  blogData: {
    title: string;
    content: string;
    summary: string;
    userId: number;
    image: File;
  },
  accessToken: string // Pass the token as a parameter
) => {
  try {
    const formData = new FormData();

    // Add the blog data as a JSON string
    const blogJson = JSON.stringify({
      title: blogData.title,
      content: blogData.content,
      summary: blogData.summary,
      userId: blogData.userId,
    });
    formData.append('blog', blogJson);

    // Add the image
    formData.append('image', blogData.image);
    
    //console form data
    console.log(formData);
    
    // Debugging FormData contents
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log('Access token:', accessToken);
    // Make the POST request
    const response = await axios.post(`${API_BASE_URL}/blogs/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error in createBlog:', error);
    throw new Error(error.response?.data?.message || 'Failed to create blog');
  }
};
