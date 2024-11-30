import router from 'next/router';


async function DeleteBlogByID(postId: number, token: string): Promise<void> {
  if (!postId || !token) return;

  try {
    await fetch(`http://localhost:8080/mental-health/api/v1/blogs/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.push('/blog/all'); // Redirect to blog list after deletion
  } catch (error) {
    console.error('Failed to delete the article:', error);
    // Handle the error appropriately here
  }
}

export default DeleteBlogByID