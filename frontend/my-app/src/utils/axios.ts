import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Replace with your API base URL
  timeout: 10000, // Optional: set a timeout for requests
});

// Global Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response if successful
  async (error) => {
    if (error.response?.status === 429) {
      // Handle 429 Too Many Requests globally
      console.info('You are being rate-limited. Please try again later.');
      alert('You are being rate-limited. Please try again later.');

      // Optional: Show a user-friendly message or notification
      if (typeof window !== 'undefined') {
        alert('Too many requests! Please slow down.');
      }

      // You could also implement retry logic here if necessary
    }

    return Promise.reject(error); // Continue rejecting the error for local handling
  }
);

export default axiosInstance;
