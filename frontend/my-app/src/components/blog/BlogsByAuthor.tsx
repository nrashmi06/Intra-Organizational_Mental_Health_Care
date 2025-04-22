import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import InlineLoader from "@/components/ui/inlineLoader";
import router from "next/router";
import { BlogPost } from "@/lib/types";
import fetchBlogs from "@/service/blog/fetchBlogs";
import BlogCard from "@/components/blog/BlogCard";

interface AuthorBlogsProps {
  userId: string;
  currentBlogId: string | string[];
  token: string;
}

interface BlogResponse {
  data: {
    content: BlogPost[];
  };
}

const BlogsByAuthor = ({ userId, currentBlogId, token }: AuthorBlogsProps) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentBlogId) return;

    const fetchAuthorBlogs = async () => {
      try {
        setLoading(true);
        const authorBlogs = await fetchBlogs({ userId, token, title: "" }) as BlogResponse;

        if (!authorBlogs) return;

        const filteredBlogs = authorBlogs.data.content.filter(
          (blog) => Number(blog.id) !== Number(currentBlogId)
        );

        setBlogs(filteredBlogs);
      } catch (err) {
        setError("Failed to fetch author's blogs: " + String(err));
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchAuthorBlogs();
    }
  }, [userId, token, currentBlogId]);

  if (loading) {
    return <InlineLoader height="h-64" />;
  }

  if (error || blogs.length === 0) {
    return null;
  }

  return (
    <div className="w-full container max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="border-l-4 border-green-500 pl-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">
              More from this author
            </h2>
            <p className="text-gray-600">
              Discover other blogs from this writer
            </p>
          </div>
          <Button
            onClick={() => {
              router.push(`/blog/${currentBlogId}/more?userId=${userId}`);
            }}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <span className="text-green-700 group-hover:text-green-800">
              View More
            </span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} post={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogsByAuthor;