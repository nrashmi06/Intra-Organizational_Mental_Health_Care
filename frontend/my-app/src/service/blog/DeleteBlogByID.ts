import axiosInstance from "@/utils/axios";
import { BLOG_API_ENDPOINTS } from "@/mapper/blogMapper";
import router from "next/router";

async function DeleteBlogByID(postId: number, token: string): Promise<void> {
  if (!postId || !token) return;

  try {
    await axiosInstance.delete(BLOG_API_ENDPOINTS.DELETE_BLOG(postId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    router.push("/blog/all");
  } catch (error: any) {
    console.error("Failed to delete the article:", error);

    if (error.response) {
      alert(
        error.response.data.message || "Failed to delete the article. Please try again."
      );
    } else {
      alert("An unexpected error occurred while deleting the blog.");
    }
  }
}

export default DeleteBlogByID;
