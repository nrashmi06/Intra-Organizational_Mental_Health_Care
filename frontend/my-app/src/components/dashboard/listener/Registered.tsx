"use client";
import { useEffect, useState, useRef } from "react";
import { CheckCircle2, MoreHorizontal, Search } from "lucide-react";
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
import { getListenersByProfileStatus } from "@/service/listener/getListenersByProfileStatus";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Details from "./ModalDetails";
import ListenerDetailsForAdmin from "@/components/dashboard/listener/ModalApplication";
import { ListenerApplication } from "@/lib/types";
import { getApplicationByListenerUserId } from "@/service/listener/getApplicationByListenerUserId";
import { Listener } from "@/lib/types";

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
  const [application, setApplication] = useState<ListenerApplication | null>(
    null
  );
  const [selectedListener, setSelectedListener] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  const fetchApplicationData = async (userId: number) => {
    try {
      const fetchedApplication = await getApplicationByListenerUserId(
        userId,
        accessToken
      );
      setApplication(fetchedApplication);
      setApplicationModal(true);
    } catch (error) {
      console.log("Failed to fetch application details." + error);
    }
  };

  const handleModalClose = () => {
    setApplicationModal(false);
    setDetailsModal(false);
    setSelectedListener(null);
    setApplication(null);
  };

  const handleApplicationModal = async (userId: number) => {
    setSelectedListener(userId);
    await fetchApplicationData(userId);
    setDropdown(false);
  };

  const handleDetailsModal = (userId: number) => {
    setSelectedListener(userId);
    setDetailsModal(true);
    setDropdown(false);
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
              <TableHead>ID</TableHead>
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
                {detailsModal && selectedListener === listener.userId && (
                  <Details
                    userId={listener.userId}
                    handleClose={handleModalClose}
                    statusFilter={statusFilter}
                    setSuccessMessage={setSuccessMessage}
                  />
                )}
                {applicationModal &&
                  selectedListener === listener.userId &&
                  application && (
                    <ListenerDetailsForAdmin
                      data={application}
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
                        className={`${
                          statusFilter === "ACTIVE"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                        onClick={() => handleDetailsModal(listener.userId)}
                      >
                        {statusFilter === "ACTIVE" ? "Suspend" : "Activate"}
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
                        onClick={() => handleApplicationModal(listener.userId)}
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
      {successMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all scale-in-center">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Success!</h3>
              <p className="text-gray-600">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

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
