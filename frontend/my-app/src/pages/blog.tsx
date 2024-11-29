import Head from "next/head"; // Import Head for managing page metadata
import Navbar from "@/components/navbar/NavBar"; // Adjust the path based on your folder structure
import BlogCard from "@/components/blog/BlogCard"; // Import the new BlogCard component
import Footer from "@/components/footer/Footer"; // Import the Footer component
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/global.css";
import Arrow from '@/components/blog/Arrow'

// Function to generate a slug from a string (title)
const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
};

export default function Component() {
  const trendingPosts = [
    {
      id: 1,
      title: "Mental Health:",
      date: "07 Feb 2024",
      image: "/images/blog/mh5.avif",
      excerpt: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable",
      slug: generateSlug("Mental Health:")  // Add slug here
    },
    {
      id: 2,
      title: "Mental Health Matters",
      date: "07 Feb 2024",
      image: "/images/blog/mh3.avif",
      excerpt: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable",
      slug: generateSlug("Mental Health Matters")  // Add slug here
    },
    {
      id: 3,
      title: "Know Your Mental Health:",
      date: "07 Feb 2024",
      image: "/images/blog/mh4.avif",
      excerpt: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable",
      slug: generateSlug("Know Your Mental Health:")  // Add slug here
    },
  ];

  const popularPosts = [
    {
      id: 1,
      title: "Understanding Mental Health:",
      date: "07 Feb 2024",
      image: "/images/blog/mh5.avif",
      excerpt: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable",
      slug: generateSlug("Understanding Mental Health:")  // Add slug here
    },
    {
      id: 2,
      title: "Mental Health Matters",
      date: "07 Feb 2024",
      image: "/images/blog/mh4.avif",
      excerpt: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable",
      slug: generateSlug("Mental Health Matters")  // Add slug here
    },
    {
      id: 3,
      title: "Understanding Mental Health:",
      date: "07 Feb 2024",
      image: "/images/blog/mh3.avif",
      excerpt: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable",
      slug: generateSlug("Understanding Mental Health:")  // Add slug here
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Add the title for the page */}
      <Head>
        <title>Blog | Explore Trending and Popular Articles</title>
        <meta name="description" content="Explore trending and popular blog posts on mental health and more!" />
      </Head>

      {/* Navbar */}
      <Navbar /> {/* Ensure the navbar is above the SVG */}

      {/* Page Heading */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Welcome to Our Blog
        </h1>
        <p className="text-lg text-center text-gray-600 mt-4">
          Explore trending and popular articles on mental health and more.
        </p>
      </div>

      {/* Trending Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Trending</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full border hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full border hover:bg-gray-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {trendingPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Popular Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Popular</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full border hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full border hover:bg-gray-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {popularPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Arrow />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
