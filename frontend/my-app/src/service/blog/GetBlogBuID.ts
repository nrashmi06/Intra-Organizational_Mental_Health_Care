// Fetch a blog by ID
export const fetchBlogById = async (id: number, token: string) => {
    console.log('id', id);
    console.log('token', token);
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/blogs/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error('Failed to fetch blog.');
    }
  
    return await response.json(); // Returns the blog data
  };
  
  // Toggle like/unlike on a blog
  export const toggleLikeOnBlog = async (id: number, token: string, toggle: boolean) => {
    console.log('toggle', toggle);
    console.log('id for toogle :', id);
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/blogs/${id}/like-unlike?action=${toggle ? 'unlike' : 'like'}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error('Failed to update like status.');
    }
  
    return await response.json(); // Returns updated article details
  };
  