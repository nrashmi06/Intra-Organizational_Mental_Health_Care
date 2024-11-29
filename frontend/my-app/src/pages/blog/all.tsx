import React from "react"; // Import React
import Head from "next/head"; // Import Head for managing page metadata
import Navbar from "@/components/navbar/NavBar"; // Adjust the path based on your folder structure
import BlogCard from "@/components/blog/BlogCard"; // Import the BlogCard component
import Footer from "@/components/footer/Footer"; // Import the Footer component
import { ChevronRightCircle, ChevronLeftCircle, Plus, ArrowUpDown } from "lucide-react"; // Import icons
import "@/styles/global.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router"; // Import useRouter for navigation

// Function to generate a slug from a string (title)
const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
};

export default function AllBlogsPage() {
  const router = useRouter(); // Initialize router for page navigation

  const allPosts = [
    { id: 1, title: "Mental Health Awareness", date: "01 Jan 2024", image: "/images/blog/mh5.avif", excerpt: "Mental health is an essential part of our overall health, and understanding it can make a big difference." },
    { id: 2, title: "The Importance of Sleep", date: "02 Jan 2024", image: "/images/blog/mh3.avif", excerpt: "Sleep plays a crucial role in our mental and physical health. Let's explore its importance." },
    { id: 3, title: "How to Manage Stress Effectively", date: "03 Jan 2024", image: "/images/blog/mh4.avif", excerpt: "Stress management is vital for maintaining well-being. In this post, we explore effective techniques." },
    { id: 4, title: "Understanding Anxiety", date: "04 Jan 2024", image: "/images/blog/mh3.avif", excerpt: "Anxiety can affect anyone. Learn about its causes and coping strategies in this blog post." },
    // Add more posts as needed
    { id: 5, title: "Mental Health Awareness", date: "01 Jan 2024", image: "/images/blog/mh5.avif", excerpt: "Mental health is an essential part of our overall health, and understanding it can make a big difference." },
    { id: 6, title: "The Importance of Sleep", date: "02 Jan 2024", image: "/images/blog/mh3.avif", excerpt: "Sleep plays a crucial role in our mental and physical health. Let's explore its importance." },
    { id: 7, title: "How to Manage Stress Effectively", date: "03 Jan 2024", image: "/images/blog/mh4.avif", excerpt: "Stress management is vital for maintaining well-being. In this post, we explore effective techniques." },
    { id: 8, title: "Understanding Anxiety", date: "04 Jan 2024", image: "/images/blog/mh3.avif", excerpt: "Anxiety can affect anyone. Learn about its causes and coping strategies in this blog post." },
    { id: 9, title: "Mental Health Awareness", date: "01 Jan 2024", image: "/images/blog/mh5.avif", excerpt: "Mental health is an essential part of our overall health, and understanding it can make a big difference." },
    { id: 10, title: "The Importance of Sleep", date: "02 Jan 2024", image: "/images/blog/mh3.avif", excerpt: "Sleep plays a crucial role in our mental and physical health. Let's explore its importance." },
    { id: 11, title: "How to Manage Stress Effectively", date: "03 Jan 2024", image: "/images/blog/mh4.avif", excerpt: "Stress management is vital for maintaining well-being. In this post, we explore effective techniques." },
    { id: 12, title: "Understanding Anxiety", date: "04 Jan 2024", image: "/images/blog/mh3.avif", excerpt: "Anxiety can affect anyone. Learn about its causes and coping strategies in this blog post." },
    
  ];

  // Search and sort state management
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortByDate, setSortByDate] = React.useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortToggle = () => {
    setSortByDate(!sortByDate);
  };

  // Filter and sort posts
  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = sortByDate
    ? [...filteredPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : filteredPosts;

  // Pagination state management
  const [currentPage, setCurrentPage] = React.useState(1);
  const postsPerPage = 9;
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  // Logic to slice the posts for the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Blog | Explore All Articles</title>
        <meta name="description" content="Explore all blog posts on mental health and more!" />
      </Head>

      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">All Blogs</h1>
        <p className="text-lg text-center text-gray-600 mt-4">
          Explore all blog posts on mental health and more.
        </p>
      </div>

      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search blogs..."
            className="p-2 border rounded-lg w-64"
          />
          <Button
            onClick={handleSortToggle}
            className="p-2 border bg-black rounded-lg flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
          </Button>
        </div>
        <Button
          className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded-lg"
          onClick={() => router.push('/blog/create_blog')} // Navigate to the create blog page
        >
          <Plus className="w-5 h-5" />
          Write
        </Button>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {currentPosts.map((post) => (
            <BlogCard key={post.id} post={{ ...post, slug: generateSlug(post.title) }} />
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 py-4">
        <button
          onClick={currentPage === 1 ? undefined : () => paginate(currentPage - 1)}
          className={`p-2 text-black rounded-lg ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={currentPage === 1}
        >
          <ChevronLeftCircle className="w-6 h-6" />
        </button>
        <span className="self-center text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={currentPage === totalPages ? undefined : () => paginate(currentPage + 1)}
          className={`p-2 text-black rounded-lg ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={currentPage === totalPages}
        >
          <ChevronRightCircle className="w-6 h-6" />
        </button>
      </div>

      <Footer />
    </div>
  );
}
