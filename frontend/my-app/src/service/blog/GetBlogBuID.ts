import axiosInstance from "@/utils/axios";
import { BLOG_API_ENDPOINTS } from "@/mapper/blogMapper"; // Import the endpoint mapper

// Fetch a blog by ID
export const fetchBlogById = async (id: number, token: string) => {
  try {
    const response = await axiosInstance.get(BLOG_API_ENDPOINTS.GET_BLOG_BY_ID(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Returns the blog data
  } catch (error: any) {
    console.error("Error fetching blog by ID:", error);

    // Handle Axios errors
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to fetch blog."
      );
    } else if (error.request) {
      throw new Error("No response received from the server. Please try again.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};

// Toggle like/unlike on a blog
export const toggleLikeOnBlog = async (id: number, token: string, toggle: boolean) => {
  try {
    const response = await axiosInstance.post(
      `${BLOG_API_ENDPOINTS.LIKE_UNLIKE_BLOG(id)}?action=${toggle ? "unlike" : "like"}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Returns updated blog details
  } catch (error: any) {
    console.error("Error toggling like on blog:", error);

    // Handle Axios errors
    if (error.response) {
      throw new Error(
        error.response.data?.message || "Failed to update like status."
      );
    } else if (error.request) {
      throw new Error("No response received from the server. Please try again.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};
