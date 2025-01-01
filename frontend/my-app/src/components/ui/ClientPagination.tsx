//for client side pagination

import { Button } from "./button";
interface Pagination3Props {
    currentPage: number;
    itemsPerPage: number;
    filteredElements: any[];
    setCurrentPage: (page: number) => void;
}

export default function Pagination3({
    currentPage,
    itemsPerPage,
    filteredElements,
    setCurrentPage,
}: Pagination3Props) {
    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredElements.length)} of{" "}
                {filteredElements.length} entries
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage * itemsPerPage >= filteredElements.length}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
