import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
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
import { BlogPost } from "@/lib/types";
import ServerPagination from "../ui/ServerPagination";

const PAGE_SIZE_OPTIONS = [3, 6, 9, 12];
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
    return DEFAULT_FILTERS.searchQuery;
  });
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const [paginationInfo, setPaginationInfo] = useState({
    pageNumber: 0,
    pageSize: DEFAULT_FILTERS.pageSize,
    totalElements: 0,
    totalPages: 0,
  });

  const [filterType, setFilterType] = useState<string>(() => {
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
        const data = response.data as {
          content: BlogPost[];
          page: { totalPages: number; totalElements: number };
        };
        setBlogs(data.content);
        setPaginationInfo((prev) => ({
          ...prev,
          totalPages: data.page.totalPages,
          totalElements: data.page.totalElements,
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
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
  };

  const handlePageClick = (pageNum: number) => {
    setPaginationInfo((prev) => ({
      ...prev,
      pageNumber: pageNum - 1,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="w-full bg-white border-b py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
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
                  summary:
                    blog.summary.length > 200
                      ? `${blog.summary.substring(0, 200)}...`
                      : blog.summary,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {paginationInfo.totalPages > 1 && (
        <ServerPagination
          paginationInfo={paginationInfo}
          elements={blogs}
          handlePageClick={handlePageClick}
        />  
      )}
    </div>
  );
};

export default BlogsByAuthor;