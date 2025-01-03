//for server side pagination
const getPageNumbers = (currentPage: number, totalPages: number) => {
  const delta = 2;
  const range: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    } else if (i < currentPage - delta || i > currentPage + delta) {
      if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
  }

  return range;
};
interface PaginationInfo {
  pageNumber: number;
  totalPages: number;
  totalElements: number;
}

interface Pagination2Props {
  paginationInfo: PaginationInfo;
  elements: any[];
  handlePageClick: (pageNum: number) => void;
}

export default function Pagination2({
  paginationInfo,
  elements = [],
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
        Showing {elements.length} of {paginationInfo.totalElements} items
      </div>
    </div>
  );
}
