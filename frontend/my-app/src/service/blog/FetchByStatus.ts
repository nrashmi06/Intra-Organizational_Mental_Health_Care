export async function fetchBlogs(status?: string, token?: string) {
  if (!token) {
    throw new Error('No token found');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const url = status
    ? `http://localhost:8080/mental-health/api/v1/blogs?status=${status}`
    : 'http://localhost:8080/mental-health/api/v1/blogs?status=pending'; // Fetch all blogs without status filter

  const response = await fetch(url, { method: 'GET', headers });

  // Check if the response is JSON
  const contentType = response.headers.get('Content-Type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();

    // Ensure that the response data is an array before returning
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error('Expected an array but got:', data);
      return [];  // Return an empty array in case the response is not an array
    }
  } else if (contentType && contentType.includes('text/plain')) {
    // Handle text/plain response (for errors or other messages)
    const textData = await response.text();
    console.error('Received plain text:', textData);

    // Convert plain text to JSON
    const jsonData = {
      message: textData,  // Wrap the text in a JSON object
    };

    return jsonData;
  } else {
    // Handle unexpected content type
    throw new Error(`Expected JSON or plain text, but got ${contentType}`);
  }
}
