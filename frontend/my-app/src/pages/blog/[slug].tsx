import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "@/styles/blog.css";
import "@/styles/global.css";

interface Article {
  title: string;
  date: string;
  content: string;
  image: string;
}

interface BlogCard {
  title: string;
  slug: string;
  image: string;
  date: string;
}

const BlogPost: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [blogCards, setBlogCards] = useState<BlogCard[]>([]);
  const imageRef = useRef<HTMLDivElement>(null); // Ref for the image div

  useEffect(() => {
    if (slug) {
      // Fetch the article data based on the slug (mock data for now)
      setArticle({
        title: "Mental Health and Well-Being",
        date: "07 Feb 2024",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        image: "/images/blog/mh1.png"
      });

      // Fetch other blog posts for the "Read More" section (mock data)
      setBlogCards([
        { title: "Nutrition and Health", slug: "nutrition-health", image: "/images/blog/mh3.avif", date: "05 Feb 2024" },
        { title: "Exercise for Mental Health", slug: "exercise-mental-health", image: "/images/blog/mh4.avif", date: "01 Feb 2024" },
        { title: "Healthy Lifestyle Tips", slug: "healthy-lifestyle", image: "/images/blog/mh5.avif", date: "15 Jan 2024" }
      ]);
    }
  }, [slug]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const mouseX = event.clientX - left;
      const mouseY = event.clientY - top;
      const offsetX = (mouseX / width) * 10 - 5; // Horizontal offset
      const offsetY = (mouseY / height) * 10 - 5; // Vertical offset

      imageRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  };

  if (!article) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="container max-w-4xl w-full">
          <h1 className="text-4xl font-bold mb-8 text-center">{article.title}</h1>

          {/* Image with border and shadow effect */}
          <div
            ref={imageRef}
            className="mb-8 relative w-full"
            style={{ height: "25vh", overflow: "hidden" }}
            onMouseMove={handleMouseMove} // Track mouse movement
          >
            <Image
              src={article.image}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg w-full h-full transition-all duration-300"
            />
          </div>

          <div className="text-sm text-muted-foreground text-right mt-2">{article.date}</div>

          <div className="prose max-w-none mt-6">
            <p>{article.content}</p>
          </div>

          {/* Read More Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Read More</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogCards.map((blog) => (
                <div key={blog.slug} className="blog-card w-full h-96 p-4 border rounded-lg shadow-lg flex flex-col">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={400}
                    height={250}
                    className="rounded-lg w-full h-48 object-cover mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <div className="text-sm text-muted-foreground mb-2">{blog.date}</div>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-blue-500 hover:underline mt-auto"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
