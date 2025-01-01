import React from "react";

interface PaginationInfo {
  pageNumber: number;
  totalPages: number;
  totalElements: number;
}

interface Pagination2Props {
  paginationInfo: PaginationInfo;
  blogs: any[];
  getPageNumbers: (
    currentPage: number,
    totalPages: number
  ) => (number | string)[];
  handlePageClick: (pageNum: number) => void;
}

export default function Pagination2({
  paginationInfo,
  blogs,
  getPageNumbers,
  handlePageClick,
}: Pagination2Props) {
  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex justify-center items-center gap-2 py-6">
        {getPageNumbers(
          paginationInfo.pageNumber + 1,
          paginationInfo.totalPages
        ).map((pageNum, index) => (
          <button
            key={index}
            onClick={() =>
              typeof pageNum === "number" ? handlePageClick(pageNum) : undefined
            }
            className={`px-4 py-2 rounded-lg transition-colors ${
              pageNum === "..."
                ? "cursor-default"
                : pageNum === paginationInfo.pageNumber + 1
                ? "bg-green-500 text-white"
                : "hover:bg-gray-100"
            } ${
              typeof pageNum === "number"
                ? "min-w-[40px] font-medium"
                : "pointer-events-none"
            }`}
            disabled={pageNum === "..."}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <div className="text-center text-gray-600 pb-6">
        Showing {blogs.length} of {paginationInfo.totalElements} blogs
      </div>
    </div>
  );
}
