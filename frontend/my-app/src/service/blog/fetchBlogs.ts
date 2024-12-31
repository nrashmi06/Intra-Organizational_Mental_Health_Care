import { BLOG_API_ENDPOINTS } from "@/mapper/blogMapper";
import axiosInstance from "@/utils/axios";

export default async function fetchBlogs({
  userId,
  page = 0,
  size = 3,
  filterType,
  token,
  title,
}: {
  userId?: string;
  page?: number;
  size?: number;
  filterType?: string;
  token: string;
  title: string;
}) {
  if (!token) {
    throw new Error("Token is required");
  }

  let url;
  if (filterType) {
    url =
      filterType === "TRENDING"
        ? BLOG_API_ENDPOINTS.GET_TRENDING_BLOGS
        : BLOG_API_ENDPOINTS.GET_BLOGS;
  } else {
    url = BLOG_API_ENDPOINTS.GET_BLOGS;
  }
  const params: Record<string, string | number> = {
    page,
    size,
  };

  if (userId) params.userId = userId;
  if (filterType && !(filterType === "TRENDING")) {
    params.filterType = filterType.toString();
  }
  if (title) params.title = title;
  try {
    const response = await axiosInstance.get(url, {
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
