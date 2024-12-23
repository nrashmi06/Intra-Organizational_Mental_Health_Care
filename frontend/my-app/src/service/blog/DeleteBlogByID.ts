import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper'; // Import the endpoint from the mapper
import router from 'next/router';

async function DeleteBlogByID(postId: number, token: string): Promise<void> {
  if (!postId || !token) return;

  try {
    const response = await fetch(BLOG_API_ENDPOINTS.DELETE_BLOG(postId), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // If the response is not OK, throw an error
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete the article');
    }

    router.push('/blog/all'); // Redirect to blog list after deletion
  } catch (error: any) {
    console.error('Failed to delete the article:', error);
    // Show an error message to the user, or handle it in a more user-friendly way
    alert(error.message || 'An error occurred while deleting the blog.');
  }
}

export default DeleteBlogByID;
