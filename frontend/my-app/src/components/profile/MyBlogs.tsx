import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InlineLoader from "@/components/ui/inlineLoader";
import fetchBlogs from "@/service/blog/fetchBlogs";
import BlogCard from "@/components/blog/BlogCard";
import Pagination from "@/components/dashboard/Pagination";
import { BlogPost } from "@/lib/types";

const PAGE_SIZE_OPTIONS = [3, 6];
const DEFAULT_FILTERS = {
  pageSize: 3,
  filterType: "TRENDING",
  searchQuery: "",
};
const DEBOUNCE_DELAY = 750;

interface AuthorBlogsProps {
  userId: string;
  token: string;
}

const BlogsByAuthor = ({ userId, token }: AuthorBlogsProps) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authorBlogSearchQuery") || DEFAULT_FILTERS.searchQuery;
    }
    return DEFAULT_FILTERS.searchQuery;
  });
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const [paginationInfo, setPaginationInfo] = useState({
    pageNumber: 0,
    pageSize: typeof window !== "undefined"
      ? Number(localStorage.getItem("authorBlogPageSize")) || DEFAULT_FILTERS.pageSize
      : DEFAULT_FILTERS.pageSize,
    totalElements: 0,
    totalPages: 0,
  });

  const [filterType, setFilterType] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authorBlogFilterType") || DEFAULT_FILTERS.filterType;
    }
    return DEFAULT_FILTERS.filterType;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (userId && token) {
      fetchAuthorBlogs();
    }
  }, [
    paginationInfo.pageNumber,
    paginationInfo.pageSize,
    filterType,
    token,
    debouncedSearchQuery,
    userId,
  ]);

  const fetchAuthorBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetchBlogs({
        userId,
        token,
        title: debouncedSearchQuery,
        size: paginationInfo.pageSize,
        page: paginationInfo.pageNumber,
        filterType,
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
      setError("Failed to fetch author's blogs: " + err);
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
    localStorage.setItem("authorBlogPageSize", newSize);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
    localStorage.setItem("authorBlogFilterType", value);
  };

  const handlePageClick = (pageNum: number) => {
    setPaginationInfo((prev) => ({
      ...prev,
      pageNumber: pageNum - 1,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchQuery(DEFAULT_FILTERS.searchQuery);
    setPaginationInfo((prev) => ({
      ...prev,
      pageSize: DEFAULT_FILTERS.pageSize,
      pageNumber: 0,
    }));
    setFilterType(DEFAULT_FILTERS.filterType);
    localStorage.removeItem("authorBlogSearchQuery");
    localStorage.removeItem("authorBlogPageSize");
    localStorage.removeItem("authorBlogFilterType");
  };

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="w-full">
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
                  localStorage.setItem("authorBlogSearchQuery", e.target.value);
                }}
                placeholder="Search blogs..."
                className="p-3 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

              <Select onValueChange={handleFilterChange} value={filterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 max-w-7xl py-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <InlineLoader />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No blogs found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                post={{
                  ...blog,
                  summary: blog.summary.length > 200
                    ? `${blog.summary.substring(0, 200)}...`
                    : blog.summary,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {paginationInfo.totalPages > 1 && (
        <Pagination
          currentPage={paginationInfo.pageNumber + 1}
          totalPages={paginationInfo.totalPages}
          onPageChange={handlePageClick}
        />
      )}
    </div>
  );
};

export default BlogsByAuthor;