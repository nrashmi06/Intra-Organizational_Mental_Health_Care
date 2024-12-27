import axios from "axios";
import { BLOG_API_ENDPOINTS } from "@/mapper/blogMapper";

export default async function fetchBlogs({
  userId,
  page = 0,
  size = 9,
  sort,
  direction,
  token,
}: {
  userId?: number;
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
  token: string;
}) {
  if (!token) {
    throw new Error("Token is required");
  }

  const url = BLOG_API_ENDPOINTS.GET_RECENT_BLOGS;
  const params: Record<string, string | number> = {
    page,
    size,
  };

  if (userId) params.userId = userId;
  if (sort) params.sort = sort;
  if (direction) params.direction = direction;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response;
  } catch (error) {
    console.log("Error fetching recent blogs:", error);
  }
}
