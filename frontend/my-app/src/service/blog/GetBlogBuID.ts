import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper'; // Import the endpoint mapper

// Fetch a blog by ID
export const fetchBlogById = async (id: number, token: string) => {
  try {
    const response = await fetch(`${BLOG_API_ENDPOINTS.GET_BLOG_BY_ID(id)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch blog.');
    }

    return await response.json(); // Returns the blog data
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

// Toggle like/unlike on a blog
export const toggleLikeOnBlog = async (id: number, token: string, toggle: boolean) => {
  try {
    const response = await fetch(
      `${BLOG_API_ENDPOINTS.LIKE_UNLIKE_BLOG(id)}?action=${toggle ? 'unlike' : 'like'}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update like status.');
    }

    return await response.json(); // Returns updated blog details
  } catch (error) {
    console.error('Error toggling like on blog:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};
