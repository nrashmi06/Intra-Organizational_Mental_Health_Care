import { API_ENDPOINTS } from "@/mapper/userMapper";

export const verifyEmail = async (email: string) => {
  const url = API_ENDPOINTS.VERIFY_EMAIL; // Use the mapped URL from the envMapper

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }), // Send email in the body as JSON
    });

    if (!response.ok) {
      // Handle non-2xx HTTP responses (error responses)
      const errorData = await response.json();
      throw new Error(`Email verification failed: ${errorData.message || response.statusText}`);
    }

    const data = await response.json(); // Optionally process the response data
    console.log('Email verified successfully:', data);
    return data;
  } catch (error) {
    console.error('Error during email verification:', error);
    throw error; // Rethrow error to be handled by calling function
  }
};
