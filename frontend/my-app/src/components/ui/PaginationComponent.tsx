import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // Increased for better visibility
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    // Calculate the range of pages to show around current page
    let start = Math.max(2, currentPage - halfVisible + 2);
    let end = Math.min(totalPages - 1, currentPage + halfVisible - 2);

    // Adjust range if we're near the beginning or end
    if (currentPage <= 4) {
      end = 5;
    }
    if (currentPage >= totalPages - 3) {
      start = totalPages - 4;
    }

    // Add the range of pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add the end ellipsis and last page
    if (currentPage < totalPages - 3) {
      pages.push("...");
    }
    if (pages[pages.length - 1] !== totalPages) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 my-8">
      <div className="flex items-center gap-6">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0 transition-colors duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-2">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === "number" ? (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={`
                    h-9 w-9 p-0 font-medium
                    transition-all duration-200
                    ${currentPage === page
                      ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                      : "hover:bg-muted"
                    }
                  `}
                >
                  {page}
                </Button>
              ) : (
                <span className="flex items-center justify-center w-8 text-muted-foreground">
                  •••
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0 transition-colors duration-200"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page indicator */}
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;