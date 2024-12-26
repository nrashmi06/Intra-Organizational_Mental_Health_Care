import React, { useEffect, useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
// import ModalDetails from "./ModalDetails";
import { UserSummary } from "@/lib/types";
import { getActiveUserByRoleName } from "@/service/SSE/getActiveUserByRoleName";
import UserIcon from "@/components/ui/userIcon";
import router from "next/router";
import InlineLoader from "@/components/ui/inlineLoader";

export function LiveSessions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const itemsPerPage = 12;

  useEffect(() => {
    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = getActiveUserByRoleName(
      "onlineUsers",
      token,
      (data) => {
        setUsers(data);
        setLoading(false); // Data loaded
      }
    );
    setEventSource(newEventSource);
    setLoading(true); // Start loading
    return () => {
      newEventSource?.close();
    };
  }, [token]);

  const filteredUsers = users.filter(
    (user) =>
      user.anonymousName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toString().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDetailsModal = (userId: string) => {
    setSelectedUserId(userId);
    setDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search listeners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading && <InlineLoader />}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative">
          {paginatedUsers.length === 0 ? (
            <div className="col-span-full text-center p-8 border rounded-lg">
              No users found.
            </div>
          ) : (
            paginatedUsers.map((user) => (
              <div
                key={user.userId}
                className="bg-card border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserIcon role={"user"} />
                    <div>
                      <p className="font-medium">{user.anonymousName}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {user.userId}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDetailsModal(user.userId)}
                      >
                        Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/user/sessions/${user.userId}`)
                        }
                      >
                        Sessions
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/user/appointments/${user.userId}`
                          )
                        }
                      >
                        Appointments
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination Controls */}
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

      {/* Details Modal */}
      {/* {detailsModal && selectedUserId && (
        <ModalDetails
          userId={selectedUserId}
          handleClose={() => {
            setDetailsModal(false);
            setSelectedUserId(null);
          }}
        />
      )} */}
    </div>
  );
}
