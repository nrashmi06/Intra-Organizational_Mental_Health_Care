import Link from 'next/link';
import Image from 'next/image';

// BlogCard Component
const BlogCard: React.FC<{
  post: { 
    id: number;
    title: string; 
    imageUrl: string; 
    summary: string; 
    likeCount: number;
    likedByCurrentUser: boolean;
  };
}> = ({ post }) => {
  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full" style={{ height: '200px' }}>
        {/* Use the correct image URL */}
        <Image
          src={post.imageUrl} // Make sure to use the imageUrl from the response
          alt={post.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{post.summary}</p>
        <Link href={`/blog/${post.id}`} className="text-blue-500 mt-4">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
