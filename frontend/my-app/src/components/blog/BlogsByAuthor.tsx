import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InlineLoader from "@/components/ui/inlineLoader";
import router from "next/router";
import { BlogPost } from "@/lib/types";
import Image from "next/image";
import fetchBlogs from "@/service/blog/fetchBlogs";
interface AuthorBlogsProps {
  userId: string;
  currentBlogId: string | string[];
  token: string;
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
        const authorBlogs = await fetchBlogs({ userId, token, title: "" });
        if (!authorBlogs) return;
        const filteredBlogs = authorBlogs.data.content.filter(
          (blog: { id: any }) => Number(blog.id) !== Number(currentBlogId)
        );

        setBlogs(filteredBlogs);
      } catch (err) {
        setError("Failed to fetch author's blogs" + err);
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

  if (error) {
    return null;
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <div className="w-full container max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="border-l-4 border-green-500 pl-4">
        <h2 className="text-2xl font-bold text-gray-900">
          More from this author
        </h2>
        <p className="text-gray-600 mt-1">
          Discover other blogs from this writer
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card
            key={blog.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            onClick={() => (window.location.href = `/blog/${blog.id}`)}
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              {!blog.imageUrl && <InlineLoader height="h-full" />}
              {blog.imageUrl && (
                <Image
                  src={blog.imageUrl || "/placeholder.png"}
                  alt={blog.title || "Blog image"}
                  className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105
                }`}
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center text-white">
                  <Heart
                    className={`w-4 h-4 ${
                      blog.likedByCurrentUser ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  <span className="ml-2 text-sm">{blog.likeCount}</span>
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {blog.summary}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={() => {
            router.push(`/blog/${currentBlogId}/more?userId=${userId}`);
          }}
          variant="outline"
        >
          <span className="text-green-700 group-hover:text-green-800">
            View More
          </span>
        </Button>
      </div>
    </div>
  );
};

export default BlogsByAuthor;
