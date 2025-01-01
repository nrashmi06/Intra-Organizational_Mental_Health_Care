import { useEffect, useState, useCallback } from "react";
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
import { User as UserType } from "@/lib/types";
import router from "next/router";
import InlineLoader from "@/components/ui/inlineLoader";
import UserCard from "./UserCard";

import { SuccessMessage } from "../listener/SuccessMessage";
import ServerPagination from "@/components/ui/ServerPagination";

const PAGE_SIZE_OPTIONS = [2,4,6,8];
const DEFAULT_FILTERS = {
  pageSize: 6,
  status: "ACTIVE",
};

export function RegisteredUsersTable() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    pageNumber: 0,
    pageSize: DEFAULT_FILTERS.pageSize,
    totalElements: 0,
    totalPages: 0,
  });

  const fetchUsersByProfileStatus = useCallback(
    async (status: "ACTIVE" | "SUSPENDED") => {
      try {
        setLoading(true);
        const response = await getUsersByProfileStatus({
          status,
          token: accessToken,
          page: paginationInfo.pageNumber,
          size: paginationInfo.pageSize,
        });

        if (response && response.content) {
          setUsers(response.content);
          setPaginationInfo((prev) => ({
            ...prev,
            totalElements: response.page.totalElements,
            totalPages: response.page.totalPages,
          }));
          setStatusFilter(status);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      accessToken,
      paginationInfo.pageNumber,
      paginationInfo.pageSize,
    ]
  );

  useEffect(() => {
    fetchUsersByProfileStatus(statusFilter as "ACTIVE" | "SUSPENDED");
  }, [
    fetchUsersByProfileStatus,
    paginationInfo.pageNumber,
    paginationInfo.pageSize,
  ]);

  const handleStatusFilterChange = (value: string) => {
    setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
    fetchUsersByProfileStatus(value as "ACTIVE" | "SUSPENDED");
  };

  const handlePageSizeChange = (newSize: string) => {
    setPaginationInfo((prev) => ({
      ...prev,
      pageSize: Number(newSize),
      pageNumber: 0,
    }));
  };

  const handlePageClick = (pageNum: number | string) => {
    if (typeof pageNum === "number") {
      setPaginationInfo((prev) => ({
        ...prev,
        pageNumber: pageNum - 1,
      }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDetailsModal = (userId: string) => {
    setSelectedUser(userId);
    setDetailsModal(true);
  };

  if (loading) {
    return <InlineLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={handlePageSizeChange}
          value={paginationInfo.pageSize.toString()}
        >
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No {statusFilter.toLowerCase()} users found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {users.map((user) => (
            <UserCard
              key={user.userId}
              user={user}
              onFirstButtonClick={(userId) => handleDetailsModal(userId)}
              firstButtonLabel="Suspend"
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
          ))}
        </div>
      )}
      <div className="container mx-auto px-4 max-w-7xl">
        <ServerPagination
          paginationInfo={paginationInfo}
          handlePageClick={handlePageClick}
          elements={users}
        />
      </div>
      {successMessage && <SuccessMessage message={successMessage} />}
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
    </div>
  );
}
