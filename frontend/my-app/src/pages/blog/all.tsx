import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar1 from "@/components/navbar/Navbar2";
import BlogCard from "@/components/blog/BlogCard";
import Footer from "@/components/footer/Footer";
import InlineLoader from "@/components/ui/inlineLoader";
import fetchRecentBlogs from "@/service/blog/fetchBlogs";
import { RootState } from "@/store";
import { BlogPost } from "@/lib/types";
import ServerPagination from "@/components/ui/ServerPagination";

const PAGE_SIZE_OPTIONS = [6, 9, 12, 15];
const DEFAULT_FILTERS = {
  pageSize: 6,
  filterType: "TRENDING",
  searchQuery: "",
  pageNumber: 0,
};
const DEBOUNCE_DELAY = 750;
const STORAGE_KEY = "blog-filters";

export default function AllBlogsPage() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => {
    return DEFAULT_FILTERS.searchQuery;
  });
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const [paginationInfo, setPaginationInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedStored = JSON.parse(stored);
        return {
          pageNumber: parsedStored.pageNumber || 0,
          pageSize: parsedStored.pageSize || DEFAULT_FILTERS.pageSize,
          totalElements: 0,
          totalPages: 0,
          title: "",
        };
      }
    }
    return {
      pageNumber: 0,
      pageSize: DEFAULT_FILTERS.pageSize,
      totalElements: 0,
      totalPages: 0,
      title: "",
    };
  });

  const [filterType, setFilterType] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedStored = JSON.parse(stored);
        return parsedStored.filterType || DEFAULT_FILTERS.filterType;
      }
    }
    return DEFAULT_FILTERS.filterType;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Save to localStorage whenever filters change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        pageNumber: paginationInfo.pageNumber,
        pageSize: paginationInfo.pageSize,
        filterType,
      }));
    }
  }, [paginationInfo.pageNumber, paginationInfo.pageSize, filterType]);

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchBlogs();
  }, [
    paginationInfo.pageNumber,
    paginationInfo.pageSize,
    filterType,
    token,
    debouncedSearchQuery,
  ]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetchRecentBlogs({
        page: paginationInfo.pageNumber,
        size: paginationInfo.pageSize,
        filterType,
        token,
        title: debouncedSearchQuery,
      });

      if (response?.data) {
        setBlogs(response.data.content);
        setPaginationInfo((prev) => ({
          ...prev,
          totalPages: response.data.page.totalPages,
          totalElements: response.data.page.totalElements,
        }));
      }
    } catch (err) {
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

  const handleFilterChange = (value: string) => {
    setFilterType(value);
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

  const handleClearFilters = () => {
    setFilterType(DEFAULT_FILTERS.filterType);
    setPaginationInfo({
      pageNumber: 0,
      pageSize: DEFAULT_FILTERS.pageSize,
      totalElements: 0,
      totalPages: 0,
      title: "",
    });
    setSearchQuery("");
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Blog | Explore All Articles</title>
      </Head>
      <Navbar1 />
      <div
        className="w-full py-8 md:py-10 border-b "
        style={{
          background:
            "linear-gradient(90deg, rgb(179, 245, 220) 0%, rgb(182, 230, 200) 3%, rgb(209, 224, 230) 18%, rgba(202, 206, 156, 0.64) 41%, rgb(210, 235, 214) 95%)",
        }}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
            All Blogs
          </h1>
          <p className="text-base text-center text-gray-600 max-w-2xl mx-auto">
            Explore all blog posts on mental health and more.
          </p>
        </div>
      </div>
      <div className="w-full bg-transparent py-4">
        <div className="container mx-auto px-4 max-w-7xl ">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
                }}
                placeholder="Search blogs..."
                className="pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <Select onValueChange={handleFilterChange} value={filterType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="TRENDING">Trending</SelectItem>
                <SelectItem value="MOST_LIKED">Most Liked</SelectItem>
                <SelectItem value="RECENT">Most Recent</SelectItem>
                <SelectItem value="MOST_VIEWED">Most Viewed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={handlePageSizeChange}
              value={paginationInfo.pageSize.toString()}
            >
              <SelectTrigger className="w-full">
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
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              onClick={handleClearFilters}
            >
              <X className="w-5 h-5" />
              Clear Filters
            </Button>

            <Button
              className="w-full flex items-center justify-center gap-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
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
        ) : (
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
        )}
      </div>
      <div className="container mx-auto px-4 max-w-7xl">
        <ServerPagination
          paginationInfo={paginationInfo}
          elements={blogs}
          handlePageClick={handlePageClick}
        />
      </div>
      <Footer />
    </div>
  );
}