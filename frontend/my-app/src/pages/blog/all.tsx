import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar1 from "@/components/navbar/NavBar";
import BlogCard from "@/components/blog/BlogCard";
import Footer from "@/components/footer/Footer";
import InlineLoader from "@/components/ui/inlineLoader";
import fetchRecentBlogs from "@/service/blog/fetchBlogs";
import { RootState } from "@/store";
import "@/styles/global.css";
import getPageNumbers from "@/components/blog/PageNumbers";
import { BlogPost } from "@/lib/types";
import { PaginationInfo } from "@/lib/types";

const PAGE_SIZE_OPTIONS = [6, 9, 12, 15];
const DEFAULT_FILTERS = {
  pageSize: 6,
  sortField: "publishDate",
  sortDirection: "desc",
  searchQuery: "",
};

export default function AllBlogsPage() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("blogSearchQuery") || DEFAULT_FILTERS.searchQuery;
    }
    return DEFAULT_FILTERS.searchQuery;
  });
  
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    pageNumber: 0,
    pageSize: typeof window !== "undefined" 
      ? Number(localStorage.getItem("blogPageSize")) || DEFAULT_FILTERS.pageSize 
      : DEFAULT_FILTERS.pageSize,
    totalPages: 0,
    totalElements: 0,
    last: false,
    first: true,
  });

  const [sortConfig, setSortConfig] = useState(() => {
    if (typeof window !== "undefined") {
      return {
        field: localStorage.getItem("blogSortField") || DEFAULT_FILTERS.sortField,
        direction: localStorage.getItem("blogSortDirection") || DEFAULT_FILTERS.sortDirection,
      };
    }
    return {
      field: DEFAULT_FILTERS.sortField,
      direction: DEFAULT_FILTERS.sortDirection,
    };
  });

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchBlogs();
  }, [paginationInfo.pageNumber, paginationInfo.pageSize, sortConfig, token, searchQuery]);

  useEffect(() => {
    localStorage.setItem("blogPageSize", paginationInfo.pageSize.toString());
    localStorage.setItem("blogSortField", sortConfig.field);
    localStorage.setItem("blogSortDirection", sortConfig.direction);
    localStorage.setItem("blogSearchQuery", searchQuery);
  }, [paginationInfo.pageSize, sortConfig, searchQuery]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetchRecentBlogs({
        page: paginationInfo.pageNumber,
        size: paginationInfo.pageSize,
        sort: sortConfig.field,
        direction: sortConfig.direction,
        token,
      });

      if (response?.data) {
        setBlogs(response.data.content);
        setPaginationInfo((prev) => ({
          ...prev,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          last: response.data.last,
          first: response.data.first,
        }));
      }
    } catch (err) {
      setError("Failed to load blogs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSizeChange = (newSize: string) => {
    setPaginationInfo((prev) => ({
      ...prev,
      pageSize: Number(newSize),
      pageNumber: 0,
    }));
  };

  const handleSortChange = (value: string) => {
    const sortingConfigs = {
      recent: { field: "publishDate", direction: "desc" },
      oldest: { field: "publishDate", direction: "asc" },
      most_liked: { field: "likeCount", direction: "desc" },
      most_viewed: { field: "viewCount", direction: "desc" },
    };
    setSortConfig(sortingConfigs[value as keyof typeof sortingConfigs]);
    setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
  };

  const handlePageClick = (pageNum: number | string) => {
    if (typeof pageNum === "number") {
      setPaginationInfo((prev) => ({
        ...prev,
        pageNumber: pageNum - 1,
      }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getCurrentSortValue = () => {
    const { field, direction } = sortConfig;
    if (field === "publishDate" && direction === "desc") return "recent";
    if (field === "publishDate" && direction === "asc") return "oldest";
    if (field === "likeCount") return "most_liked";
    if (field === "viewCount") return "most_viewed";
    return "recent";
  };

  const clearFilters = () => {
    setSearchQuery(DEFAULT_FILTERS.searchQuery);
    setPaginationInfo(prev => ({
      ...prev,
      pageSize: DEFAULT_FILTERS.pageSize,
      pageNumber: 0,
    }));
    setSortConfig({
      field: DEFAULT_FILTERS.sortField,
      direction: DEFAULT_FILTERS.sortDirection,
    });
    localStorage.removeItem("blogSearchQuery");
    localStorage.removeItem("blogPageSize");
    localStorage.removeItem("blogSortField");
    localStorage.removeItem("blogSortDirection");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Blog | Explore All Articles</title>
        <meta
          name="description"
          content="Explore all blog posts on mental health and more!"
        />
      </Head>

      <Navbar1 />

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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
                }}
                placeholder="Search blogs..."
                className="p-3 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              <Select onValueChange={handleSortChange} value={getCurrentSortValue()}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="most_liked">Most Liked</SelectItem>
                  <SelectItem value="most_viewed">Most Viewed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={handlePageSizeChange}
                value={paginationInfo.pageSize.toString()}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>

            <Button
              className="w-full sm:w-auto flex items-center justify-center gap-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              onClick={() => router.push("/blog/create_blog")}
            >
              <Plus className="w-5 h-5" />
              Write
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-8 max-w-7xl py-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <InlineLoader />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((post) => (
                <BlogCard
                  key={post.id}
                  post={{
                    ...post,
                    summary:
                      post.summary.length > 200
                        ? `${post.summary.substring(0, 200)}...`
                        : post.summary,
                  }}
                />
              ))}
            </div>

            {/* Results Summary */}
            <div className="text-center text-xs text-gray-600 mt-6">
              Showing {blogs.length} of {paginationInfo.totalElements} blogs
            </div>
          </>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-center items-center gap-2 py-6">
          {getPageNumbers(paginationInfo.pageNumber + 1, paginationInfo.totalPages).map((pageNum, index) => (
            <button
              key={index}
              onClick={() => typeof pageNum === 'number' ? handlePageClick(pageNum) : undefined}
              className={`px-4 py-2 rounded-lg transition-colors ${
                pageNum === '...' 
                  ? 'cursor-default'
                  : pageNum === paginationInfo.pageNumber + 1
                    ? 'bg-green-500 text-white'
                    : 'hover:bg-gray-100'
              } ${
                typeof pageNum === 'number'
                  ? 'min-w-[40px] font-medium'
                  : 'pointer-events-none'
              }`}
              disabled={pageNum === '...'}
            >
              {pageNum}
            </button>
          ))}
        </div>
        
        {/* Results Summary */}
        <div className="text-center text-gray-600 pb-6">
          Showing {blogs.length} of {paginationInfo.totalElements} blogs
        </div>
      </div>

      <Footer />
    </div>
  );
}