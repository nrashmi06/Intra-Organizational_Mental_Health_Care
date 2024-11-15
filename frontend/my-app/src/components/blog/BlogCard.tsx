import Image from "next/image";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  date: string;
  image: string;
  excerpt: string;
}

interface BlogCardProps {
  post: Post;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="space-y-4">
      {/* Fixed size for the image box */}
      <div className="relative w-full h-72">
        <Image
          src={post.image}
          alt={post.title}
          layout="fill" // Makes image cover the fixed box size
          objectFit="cover" // Ensures the image scales properly to fit the box
          className="rounded-lg w-full h-full"
        />
      </div>
      <div className="space-y-2">
        <span className="text-sm text-gray-500">{post.date}</span>
        <h3 className="text-xl font-semibold">{post.title}</h3>
        <p className="text-gray-600">{post.excerpt}</p>
        <Link href={`/blog/${post.id}`} className="text-blue-500 hover:underline block">
          Read full article
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
