import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BlogPost {
  id: number;
  title: string;
  imageUrl: string;
  summary: string;
  likeCount: number;
  likedByCurrentUser: boolean;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
    >
      <Link href={`/blog/${post.id}`}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.imageUrl || "/placeholder.png"}
            alt={post.title || "Blog image"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center text-white">
              <Heart
                className={`w-4 h-4 ${
                  post.likedByCurrentUser ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="ml-2 text-sm">{post.likeCount}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-4">
            {post.summary}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default BlogCard;