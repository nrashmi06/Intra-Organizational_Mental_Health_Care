import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper';  // Import the endpoint mapper

export async function fetchBlogs(status?: string, token?: string) {
  if (!token) {
    throw new Error('No token found');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const url = status
    ? `${BLOG_API_ENDPOINTS.GET_BLOGS_BY_APPROVAL_STATUS}?status=${status}`  // Use the mapped URL for status
    : `${BLOG_API_ENDPOINTS.GET_BLOGS_BY_APPROVAL_STATUS}?status=pending`; // Default to pending status if no status is provided

  try {
    const response = await fetch(url, { method: 'GET', headers });

    // Ensure the response is in the expected format (JSON or plain text)
    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();

      // Ensure that the response data is an array before returning
      if (Array.isArray(data)) {
        return data;
      } else {
        console.error('Expected an array but got:', data);
        return [];  // Return an empty array if the response is not an array
      }
    } else if (contentType && contentType.includes('text/plain')) {
      // Handle text/plain response (for errors or other messages)
      const textData = await response.text();
      console.error('Received plain text:', textData);

      // Wrap the plain text into a JSON object to maintain consistency
      return { message: textData };
    } else {
      // Handle unexpected content type
      throw new Error(`Expected JSON or plain text, but got ${contentType}`);
    }
  } catch (error) {
    // Catch and log any unexpected errors during the fetch process
    console.error('Error fetching blogs:', error);
    throw new Error('Failed to fetch blogs');
  }
}
