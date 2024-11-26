// verifyEmail.ts
export const verifyEmail = async (email: string) => {
    const url = 'http://localhost:8080/mental-health/api/v1/users/verify-email'; // API URL
  
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
        throw new Error('Email verification failed');
      }
  
      const data = await response.json(); // Optionally process the response data
      console.log('Email verified successfully:', data);
      return data;
    } catch (error) {
      console.error('Error during email verification:', error);
      throw error; // Rethrow error to be handled by calling function
    }
  };
  