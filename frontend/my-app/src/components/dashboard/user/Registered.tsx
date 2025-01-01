import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, Search } from "lucide-react";
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
import { User as UserType } from "@/lib/types";
import router from "next/router";
import InlineLoader from "@/components/ui/inlineLoader";
import UserCard from "./UserCard";
import Pagination from "../Pagination";

const DEBOUNCE_DELAY = 750;
const PAGE_SIZE = 4;

export function RegisteredUsersTable() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Search state with debouncing
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [paginationInfo, setPaginationInfo] = useState({
    pageNumber: 0,
    pageSize: PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
  });

  // Implement debouncing for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsersByProfileStatus = useCallback(
    async (status: "ACTIVE" | "SUSPENDED") => {
      try {
        setLoading(true);
        const response = await getUsersByProfileStatus({
          status,
          token: accessToken,
          page: paginationInfo.pageNumber,
          size: paginationInfo.pageSize,
          search: debouncedSearchQuery,
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
      debouncedSearchQuery,
    ]
  );

  // Effect to fetch users when relevant dependencies change
  useEffect(() => {
    fetchUsersByProfileStatus(statusFilter as "ACTIVE" | "SUSPENDED");
  }, [
    fetchUsersByProfileStatus,
    paginationInfo.pageNumber,
    paginationInfo.pageSize,
    debouncedSearchQuery,
  ]);

  const handleDetailsModal = (userId: string) => {
    setSelectedUser(userId);
    setDetailsModal(true);
  };

  const handlePageChange = (page: number) => {
    setPaginationInfo((prev) => ({
      ...prev,
      pageNumber: page - 1, // Convert to 0-based index for the API
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name.."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
              }}
              className="pl-10 h-11 bg-white"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
              fetchUsersByProfileStatus(value as "ACTIVE" | "SUSPENDED");
            }}
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
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {users.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                  <p className="text-gray-500">
                    No {statusFilter.toLowerCase()} users found
                  </p>
                </div>
              ) : (
                users.map((user) => (
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
                ))
              )}
            </div>

            {users.length > 0 && (
              <Pagination
                currentPage={paginationInfo.pageNumber + 1} // Convert from 0-based to 1-based for display
                totalPages={paginationInfo.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

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
