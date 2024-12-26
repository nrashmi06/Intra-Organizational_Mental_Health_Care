import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, MoreVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { getUsersByProfileStatus } from "@/service/user/getUsersByProfileStatus";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Details from "./ModalDetails";
import { User as UserType } from "@/lib/types";
import UserIcon from "@/components/ui/userIcon";
import router from "next/router";
import InlineLoader from "@/components/ui/inlineLoader";

export function RegisteredUsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsersByProfileStatus = useCallback(
    async (status: "ACTIVE" | "SUSPENDED") => {
      try {
        setLoading(true);
        const response = await getUsersByProfileStatus(accessToken, status);
        setUsers(response);
        setLoading(false);
        setStatusFilter(status);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    fetchUsersByProfileStatus("ACTIVE");
  }, [fetchUsersByProfileStatus]);

  const handleDetailsModal = (userId: string) => {
    setSelectedUser(userId);
    setDetailsModal(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.anonymousName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery)
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              fetchUsersByProfileStatus(value as "ACTIVE" | "SUSPENDED")
            }
          >
            <SelectTrigger className="w-[160px] h-11 bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {loading && <InlineLoader />}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:min-h-[350px]">
            {paginatedUsers.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-500">
                  No {statusFilter.toLowerCase()} users found
                </p>
              </div>
            ) : (
              paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white h-min rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-shrink-0">
                        <UserIcon role="user" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {user.anonymousName}
                          </h3>
                          {user.active && (
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          ID: {user.id}
                        </p>
                        <p
                          className="text-xs text-gray-500 truncate"
                          title={user.email}
                        >
                          {user.email}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              className={`${
                                statusFilter === "ACTIVE"
                                  ? "text-red-600"
                                  : "text-green-600"
                              } font-medium`}
                              onClick={() => handleDetailsModal(user.id)}
                            >
                              {statusFilter === "ACTIVE"
                                ? "Suspend User"
                                : "Activate User"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/user/sessions/${user.id}`
                                )
                              }
                            >
                              View Sessions
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/user/appointments/${user.id}`
                                )
                              }
                            >
                              View Appointments
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage * itemsPerPage >= filteredUsers.length}
              className="h-9"
            >
              Next
            </Button>
          </div>
        </div>
        {successMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Success!
                </h3>
                <p className="text-gray-600">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        {detailsModal && selectedUser && (
          <Details
            userId={selectedUser}
            handleClose={() => {
              setDetailsModal(false);
              setSelectedUser(null);
            }}
            statusFilter={statusFilter}
            setSuccessMessage={setSuccessMessage}
          />
        )}
      </>
    </div>
  );
}
