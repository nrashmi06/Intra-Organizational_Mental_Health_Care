import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InlineLoader from '@/components/ui/inlineLoader';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  likeCount: number;
  likedByCurrentUser: boolean;
  imageUrl: string;
}

interface AuthorBlogsProps {
  userId: string;
  currentBlogId: string | string[];
  token: string;
  getBlogsByUserId: (userId: string, token: string) => Promise<BlogPost[]>;
}

const BlogsByAuthor = ({ userId, currentBlogId, token, getBlogsByUserId }: AuthorBlogsProps) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    if(!currentBlogId) return;
    const fetchAuthorBlogs = async () => {
      try {
        setLoading(true);
        const authorBlogs = await getBlogsByUserId(userId, token);
        const filteredBlogs = authorBlogs.filter(blog => Number(blog.id) !== Number(currentBlogId));
        const initialLoadingStates = filteredBlogs.reduce((acc, blog) => ({
          ...acc,
          [blog.id]: true
        }), {});
        
        setImageLoadingStates(initialLoadingStates);
        setBlogs(filteredBlogs);
      } catch (err) {
        setError('Failed to fetch author\'s blogs'+err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchAuthorBlogs();
    }
  }, [userId, token, currentBlogId]);

  const handleImageLoad = (blogId: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [blogId]: false
    }));
  };

  if (loading) {
    return <InlineLoader height="h-64" />;
  }

  if (error) {
    return null;
  }

  if (blogs.length === 0) {
    return null;
  }

  const displayedBlogs = showAll ? blogs : blogs.slice(0, 3);

  return (
    <div className="w-full container max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="border-l-4 border-green-500 pl-4">
        <h2 className="text-2xl font-bold text-gray-900">More from this author</h2>
        <p className="text-gray-600 mt-1">Discover other blogs from this writer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedBlogs.map((blog) => (
          <Card 
            key={blog.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            onClick={() => window.location.href = `/blog/${blog.id}`}
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              {imageLoadingStates[blog.id] && (
                <InlineLoader height="h-full" />
              )}
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  imageLoadingStates[blog.id] ? 'hidden' : ''
                }`}
                onLoad={() => handleImageLoad(blog.id)}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center text-white">
                  <Heart 
                    className={`w-4 h-4 ${blog.likedByCurrentUser ? 'fill-red-500 text-red-500' : ''}`}
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

      {blogs.length > 3 && (
        <div className="flex justify-end mt-8">
          <Button
            onClick={() => {
              setShowAll(!showAll);
            }}
            variant="outline"
            className="group hover:bg-green-50"
          >
            <span className="text-green-700 group-hover:text-green-800">
              {showAll ? 'Show Less' : 'View More Stories'}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogsByAuthor;