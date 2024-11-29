import Link from 'next/link';
import Image from 'next/image';

// In BlogCard Component
const BlogCard: React.FC<{ post: { title: string; slug: string; image: string; date: string; excerpt: string; } }> = ({ post }) => {
  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full" style={{ height: '200px' }}>
        <Image
          src={post.image}
          alt={post.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{post.date}</p>
        <p className="text-gray-700 flex-grow">{post.excerpt}</p>
        {/* Directly apply styles to the Link component */}
        <Link href={`/blog/${post.slug}`} className="text-blue-500 mt-4">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
