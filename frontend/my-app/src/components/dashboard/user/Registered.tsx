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
import { getUsersByProfileStatus } from "@/service/user/getUsersByProfileStatus";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Details from "./ModalDetails";
import { User } from "@/lib/types";

export function RegisteredUsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 5;
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  useEffect(() => {
    fetchUsersByProfileStatus("ACTIVE");
  }, []);

  const fetchUsersByProfileStatus = async (status: "ACTIVE" | "SUSPENDED") => {
    try {
      const response = await getUsersByProfileStatus(accessToken, status);
      setUsers(response);
      console.log(response);
      setStatusFilter(status);
    } catch (error) {
      console.error("Error fetching users by profile status:", error);
    }
  };

  const toggleDropdown = (userId: string) => {
    setActiveDropdown((prev) => (prev === userId ? null : userId));
  };

  const handleModalClose = () => {
    setDetailsModal(false);
    setSelectedUser(null);
  };

  const handleDetailsModal = (userId: string) => {
    setSelectedUser(userId);
    setDetailsModal(true);
    setActiveDropdown(null);
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchUsersByProfileStatus(status as "ACTIVE" | "SUSPENDED");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.anonymousName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
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
            id="search-users"
            placeholder="Search users..."
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
              <TableHead>User ID</TableHead>
              <TableHead>Anonymous Name</TableHead>
              <TableHead>Email Id</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
              <TableCell colSpan={5} className="text-center">
                No registered users found.
              </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                {user.anonymousName}
                {user.active && (
                  <span className="relative inline-block align-top ml-1">
                  <span className="absolute top-[-0.5em] right-[-0.5em] inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  </span>
                )}
                </TableCell>

                <TableCell>{user.email}</TableCell>

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
                  onClick={() => toggleDropdown(user.id)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                </TableCell>
                {detailsModal && selectedUser === user.id && (
                <Details
                  userId={user.id}
                  handleClose={handleModalClose}
                  statusFilter={statusFilter}
                  setSuccessMessage={setSuccessMessage}
                />
                )}
                {activeDropdown === user.id && (
                <div
                  ref={dropdownRef}
                  className="fixed right-16 top-[319px] w-44 bg-white border rounded-md shadow-lg z-50"
                >
                  <ul className="flex flex-col justify-center items-start">
                  <Button
                    variant="link"
                    className={`${
                    statusFilter === "ACTIVE"
                      ? "text-red-500"
                      : "text-green-500"
                    }`}
                    onClick={() => handleDetailsModal(user.id)}
                  >
                    {statusFilter === "ACTIVE" ? "Suspend" : "Activate"}
                  </Button>
                  <Button
                    variant="link"
                    className="text-purple-500"
                    href={`/dashboard/user/sessions/${user.id}`}
                  >
                    Sessions
                  </Button>
                  <Button
                    variant="link"
                    className="text-purple-500"
                    href={`/dashboard/user/appointments/${user.id}`}
                  >
                    Appointments
                  </Button>
                  </ul>
                </div>
                )}
              </TableRow>
              ))
            )}
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
          {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} entries
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
            disabled={currentPage * itemsPerPage >= filteredUsers.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
