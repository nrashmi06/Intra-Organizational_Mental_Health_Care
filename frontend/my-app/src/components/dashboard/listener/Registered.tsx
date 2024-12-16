"use client";
import { useEffect, useState, useRef } from "react";
import { MoreHorizontal, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Listener {
  userId: number;
  anonymousName: string;
}
import { getListenersByProfileStatus } from "@/service/listener/getListenersByProfileStatus";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Details from "./ModalDetails";
import ListenerDetailsForAdmin from "@/components/dashboard/listener/ModalApplication";

export function RegisteredListenersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 5;
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [applicationModal, setApplicationModal] = useState(false);
  useEffect(() => {
    fetchListenersByProfileStatus("ACTIVE");
  }, []);

  const fetchListenersByProfileStatus = async (
    status: "ACTIVE" | "SUSPENDED"
  ) => {
    try {
      const response = await getListenersByProfileStatus(accessToken, status);
      setListeners(response);
      setStatusFilter(status);
    } catch (error) {
      console.error("Error fetching listeners by profile status:", error);
    }
  };
  const handleModalClose = () => {
    setApplicationModal(false);
    setDetailsModal(false);
  };

  const handleApplicationModal = () => {
    setApplicationModal(true);
  };

  const handleDetailsModal = () => {
    setDetailsModal(true);
  };
  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchListenersByProfileStatus(status as "ACTIVE" | "SUSPENDED");
  };

  const filteredListeners = listeners.filter((listener) => {
    const matchesSearch =
      listener.anonymousName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      listener.userId
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedListeners = filteredListeners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-listeners"
            placeholder="Search listeners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listener ID</TableHead>
              <TableHead>Anonymous Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedListeners.map((listener) => (
              <TableRow key={listener.userId}>
                <TableCell>{listener.userId}</TableCell>
                <TableCell>{listener.anonymousName}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${
                    statusFilter === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  >
                    {statusFilter}
                  </div>
                </TableCell>
                <TableCell className="text-right relative">
                  <Button
                    variant="link"
                    onClick={() => setDropdown((prev) => !prev)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
                {detailsModal && (
                  <Details
                    userId={listener.userId}
                    handleClose={handleModalClose}
                    statusFilter={statusFilter}
                  />
                )}
                {applicationModal && (
                  <ListenerDetailsForAdmin
                    userId={listener.userId}
                    handleClose={handleModalClose}
                  />
                )}
                {dropdown && (
                  <div
                    ref={dropdownRef}
                    className="fixed right-16 top-[319px] w-44 bg-white border rounded-md shadow-lg"
                  >
                    <ul className="flex flex-col justify-center items-start">
                      <Button
                        variant="link"
                        className="text-purple-500"
                        onClick={() => handleDetailsModal()}
                      >
                        Details
                      </Button>
                      <Button
                        variant="link"
                        className="text-purple-500"
                        href={`/dashboard/listener/sessions/${listener.userId}`}
                      >
                        Sessions
                      </Button>
                      <Button
                        variant="link"
                        className="text-purple-500"
                        onClick={() => handleApplicationModal()}
                      >
                        Application
                      </Button>
                    </ul>
                  </div>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredListeners.length)} of{" "}
          {filteredListeners.length} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage * itemsPerPage >= filteredListeners.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
