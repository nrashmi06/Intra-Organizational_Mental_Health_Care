import axiosInstance from "@/utils/axios";
import { BLOG_API_ENDPOINTS } from "@/mapper/blogMapper";

export const fetchBlogById = async (id: number, token: string) => {
  try {
    const response = await axiosInstance.get(
      BLOG_API_ENDPOINTS.GET_BLOG_BY_ID(id),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Blog fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching blog by ID:", error);
  }
};

export const toggleLikeOnBlog = async (
  id: number,
  token: string,
  toggle: boolean
) => {
  try {
    const response = await axiosInstance.post(
      `${BLOG_API_ENDPOINTS.LIKE_UNLIKE_BLOG(id)}?action=${
        toggle ? "unlike" : "like"
      }`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error toggling like on blog:", error);
  }
};
