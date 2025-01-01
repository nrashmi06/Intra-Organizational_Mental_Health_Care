import React, { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import ModalDetails from "./ModalDetails";
import { UserSummary } from "@/lib/types";
import { getActiveUserByRoleName } from "@/service/SSE/getActiveUserByRoleName";
import router from "next/router";
import InlineLoader from "@/components/ui/inlineLoader";
import Pagination3 from "@/components/ui/ClientPagination";
import UserCard from "./UserCard";
import {
  addEventSource,
  clearEventSources,
  removeEventSource,
} from "@/store/eventsourceSlice";

export function OnlineUsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const eventSource = getActiveUserByRoleName(
      "onlineUsers",
      token,
      (data) => {
        setUsers(data);
        setLoading(false);
      }
    );
    setLoading(true);
    if (eventSource) {
      const eventSourceEntry = {
        id: "onlineUsers",
        eventSource,
      };

      dispatch(addEventSource(eventSourceEntry));
    }
    return () => {
      dispatch(removeEventSource("onlineUsers"));
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [token, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearEventSources());
    };
  }, [dispatch]);

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
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">
            {users.length} Online Users
          </span>
        </div>
      </div>

      {loading && <InlineLoader />}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {paginatedUsers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            paginatedUsers.map((user) => (
              <UserCard
                key={user.userId}
                user={user}
                onFirstButtonClick={(userId) => handleDetailsModal(userId)}
                firstButtonLabel="Details"
                onViewSessions={(userId) =>
                  router.push(`/dashboard/user/sessions/${userId}`)
                }
                onViewAppointments={(userId) =>
                  router.push(`/dashboard/user/appointments/${userId}`)
                }
                onViewReports={(userId) =>
                  router.push(`/dashboard/user/reports/${userId}`)
                }
              />
            ))
          )}
        </div>
      )}

      <Pagination3
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        filteredElements={filteredUsers}
      />

      {detailsModal && selectedUserId && (
        <ModalDetails
          userId={selectedUserId}
          handleClose={() => {
            setDetailsModal(false);
            setSelectedUserId(null);
          }}
        />
      )}
    </div>
  );
}
