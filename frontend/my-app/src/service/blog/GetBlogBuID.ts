import axios from "axios";

// Define the API URL
const API_URL = "http://localhost:8080/mental-health/api/v1/blogs";

export const fetchBlogById = async (id: number, token: string) => {
  try {
    console.log("path to fetch blog by id:", `${API_URL}/${id}`);
    console.log("Fetching blog post with id:", id);
    console.log("Token:", token);
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Return the response data for further use
  } catch (error) {
    console.error("Error retriving ", error);
    throw error; // Rethrow error to be handled by the caller
  }
};
