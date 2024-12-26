import React, { useEffect, useState } from "react";
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
import { fetchBlogs } from "@/service/blog/FetchByStatus";
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
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Blog | Explore All Articles</title>
        <meta
          name="description"
          content="Explore all blog posts on mental health and more!"
        />
      </Head>

      {role === "ADMIN" ? <Navbar2 /> : <Navbar1 />}

      <div className="w-full bg-white py-8 md:py-10 border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
            All Blogs
          </h1>
          <p className="text-base text-center text-gray-600 max-w-2xl mx-auto">
            Explore all blog posts on mental health and more.
          </p>
        </div>
      </div>

      {/* Search and Controls Section */}
      <div className="w-full bg-white border-b py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search blogs..."
                className="p-3 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={handleSortToggle}
                className="w-full sm:w-auto p-3 border bg-black rounded-lg flex items-center justify-center gap-2"
              >
                <ArrowUpDown className="w-5 h-5" />
                <span className="sm:hidden">Sort by Date</span>
              </Button>
            </div>
            <Button
              className="w-full sm:w-auto flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              onClick={() => router.push("/blog/create_blog")}
            >
              <Plus className="w-5 h-5" />
              Write
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 max-w-7xl py-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <InlineLoader />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <BlogCard 
                post={{
                  ...post,
                  summary: post.summary.length > 150 
                    ? `${post.summary.substring(0, 150)}...` 
                    : post.summary
                }} 
                key={post.id} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-center items-center gap-4 py-6">
          <button
            onClick={
              currentPage === 1 ? undefined : () => paginate(currentPage - 1)
            }
            className={`p-2 text-black rounded-lg hover:bg-gray-100 transition-colors ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={currentPage === 1}
          >
            <ChevronLeftCircle className="w-6 h-6" />
          </button>
          <span className="self-center text-lg font-medium">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={
              currentPage === totalPages
                ? undefined
                : () => paginate(currentPage + 1)
            }
            className={`p-2 text-black rounded-lg hover:bg-gray-100 transition-colors ${
              currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={currentPage === totalPages}
          >
            <ChevronRightCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}