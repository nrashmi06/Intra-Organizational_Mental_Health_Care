import axiosInstance from "@/utils/axios";
import { BLOG_API_ENDPOINTS } from "@/mapper/blogMapper"; // Import endpoint mapper

export async function fetchByStatus(
  status: string,
  token: string,
  page?: number,
  size?: number
) {
  if (!token) {
    throw new Error("No token found");
  }

  try {
    // Build the query parameters
    const params: Record<string, string | number> = { status: status || "pending" };
    if (page !== undefined) {
      params.page = page;
    }
    if (size !== undefined) {
      params.size = size;
    }

    // Make the GET request using Axios
    const response = await axiosInstance.get(BLOG_API_ENDPOINTS.GET_BLOGS_BY_APPROVAL_STATUS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params, // Pass query parameters
    });

    // Ensure the response data is valid
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Expected an array but got:", response.data);
      return []; // Return an empty array if the response is not an array
    }
  } catch (error: any) {
    console.error("Error fetching blogs:", error);

    // Handle errors based on the Axios error structure
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch blogs"
      );
    } else if (error.request) {
      throw new Error("No response received from the server. Please try again.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};