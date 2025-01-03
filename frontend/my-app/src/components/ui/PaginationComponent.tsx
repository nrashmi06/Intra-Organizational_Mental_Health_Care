// Pagination for timeslots, appointments
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 7; // Show fewer pages on mobile
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    // Mobile layout logic
    if (isMobile) {
      if (currentPage === 1) {
        pages.push(2, "...", totalPages);
      } else if (currentPage === totalPages) {
        pages.push("...", totalPages - 1, totalPages);
      } else {
        pages.push("...", currentPage, "...", totalPages);
      }
      return pages;
    }

    // Desktop layout logic
    if (currentPage > 4) {
      pages.push("...");
    }

    let start = Math.max(2, currentPage - halfVisible + 2);
    let end = Math.min(totalPages - 1, currentPage + halfVisible - 2);

    if (currentPage <= 4) {
      end = 5;
    }
    if (currentPage >= totalPages - 3) {
      start = totalPages - 4;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }
    if (pages[pages.length - 1] !== totalPages) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-2 my-4 sm:my-8 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-6">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 sm:h-9 sm:w-9 p-0 transition-colors duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === "number" ? (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={`
                    h-8 w-8 sm:h-9 sm:w-9 p-0 font-medium text-sm
                    transition-all duration-200
                    ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "hover:bg-muted"
                    }
                  `}
                >
                  {page}
                </Button>
              ) : (
                <span className="flex items-center justify-center w-6 sm:w-8 text-muted-foreground">
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
          className="h-8 w-8 sm:h-9 sm:w-9 p-0 transition-colors duration-200"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page indicator */}
      <div className="text-xs sm:text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;