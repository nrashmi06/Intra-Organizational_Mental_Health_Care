import React, { useEffect, useState } from "react"; // Import React and necessary hooks
import Head from "next/head";
import Navbar1 from "@/components/navbar/NavBar";
import Navbar2 from "@/components/navbar/navbar4";
import BlogCard from "@/components/blog/BlogCard";
import Footer from "@/components/footer/Footer";
import {
  ChevronRightCircle,
  ChevronLeftCircle,
  Plus,
  ArrowUpDown,
} from "lucide-react";
import "@/styles/global.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { fetchBlogs } from "@/service/blog/FetchByStatus"; // Import the fetchBlogs function
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import InlineLoader from "@/components/ui/inlineLoader";

export default function AllBlogsPage() {
  const router = useRouter();

  interface BlogPost {
    imageUrl: string;
    summary: string;
    id: number;
    title: string;
    date: string;
    likeCount: number;
    likedByCurrentUser: boolean;
  }

  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByDate, setSortByDate] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortToggle = () => {
    setSortByDate(!sortByDate);
  };

  const token = useSelector((state: RootState) => state.auth.accessToken);
  const role = useSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    // Fetch blog posts with status "approved" on component mount
    if (token) {
      fetchBlogs("approved", token)
        .then((data) => {
          if (Array.isArray(data)) {
            setAllPosts(data);
          } else {
            setError("Failed to load blogs");
          }
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load blogs" + err);
          setLoading(false);
        });
    } else {
      router.push("/signin");
      setLoading(false);
    }
  }, []);

  const filteredPosts = allPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = sortByDate
    ? [...filteredPosts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : filteredPosts;

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Blog | Explore All Articles</title>
        <meta
          name="description"
          content="Explore all blog posts on mental health and more!"
        />
      </Head>

      {role === "ADMIN" ? <Navbar2 /> : <Navbar1 />}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          All Blogs
        </h1>
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
            className="p-2 border bg-black rounded-lg flex items-center gap-2"
          >
            <ArrowUpDown className="w-5 h-5" />
          </Button>
        </div>
        <Button
          className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded-lg"
          onClick={() => router.push("/blog/create_blog")}
        >
          <Plus className="w-5 h-5" />
          Write
        </Button>
      </div>

      {loading ? (
        <InlineLoader/>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <BlogCard post={post} key={post.id} />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center items-center gap-4 py-4">
        <button
          onClick={
            currentPage === 1 ? undefined : () => paginate(currentPage - 1)
          }
          className={`p-2 text-black rounded-lg ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={currentPage === 1}
        >
          <ChevronLeftCircle className="w-6 h-6" />
        </button>
        <span className="self-center text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={
            currentPage === totalPages
              ? undefined
              : () => paginate(currentPage + 1)
          }
          className={`p-2 text-black rounded-lg ${
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={currentPage === totalPages}
        >
          <ChevronRightCircle className="w-6 h-6" />
        </button>
      </div>

      <Footer />
    </div>
  );
}
