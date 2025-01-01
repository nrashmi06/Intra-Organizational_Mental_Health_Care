import { useEffect, useState, useCallback } from "react";
import { Info, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getListenersByProfileStatus } from "@/service/listener/getListenersByProfileStatus";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import Details from "./ModalDetails";
import ListenerDetailsForAdmin from "@/components/dashboard/listener/ModalApplication";
import { ListenerApplication } from "@/lib/types";
import { getApplicationByListenerUserId } from "@/service/listener/getApplicationByListenerUserId";
import { useRouter } from "next/router";
import InlineLoader from "@/components/ui/inlineLoader";
import ListenerCard from "./ListenerCard";
import { RootState } from "@/store";
import { SuccessMessage } from "./SuccessMessage";
import ServerPagination from "@/components/ui/ServerPagination";

const PAGE_SIZE_OPTIONS = [2, 4, 6, 8];
const DEFAULT_FILTERS = {
  pageSize: 6,
  status: "ACTIVE",
  searchQuery: "",
};
const DEBOUNCE_DELAY = 750;

export function RegisteredListenersTable() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const listeners = useSelector((state: RootState) => state.listeners.listeners);

  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "SUSPENDED">("ACTIVE");
  const [searchQuery, setSearchQuery] = useState(DEFAULT_FILTERS.searchQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [applicationModal, setApplicationModal] = useState(false);
  const [application, setApplication] = useState<ListenerApplication | null>(null);
  const [selectedListener, setSelectedListener] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState({
    pageNumber: 0,
    pageSize: DEFAULT_FILTERS.pageSize,
    totalElements: 0,
    totalPages: 0,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchListeners = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(
        getListenersByProfileStatus({
          status: statusFilter,
          page: paginationInfo.pageNumber,
          size: paginationInfo.pageSize,
          userId: accessToken,
          search: debouncedSearchQuery,
        })
      );
    } catch (error) {
      console.error("Error fetching listeners:", error);
    } finally {
      setLoading(false);
    }
  }, [
    statusFilter,
    paginationInfo.pageNumber,
    paginationInfo.pageSize,
    accessToken,
    dispatch,
    debouncedSearchQuery,
  ]);

  useEffect(() => {
    fetchListeners();
  }, [fetchListeners]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as "ACTIVE" | "SUSPENDED");
    setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
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

  const fetchApplicationData = async (userId: string) => {
    try {
      setSelectedListener(userId);
      const fetchedApplication = await getApplicationByListenerUserId(
        userId,
        accessToken
      );
      setApplication(fetchedApplication);
      setApplicationModal(true);
    } catch (error) {
      console.log("Failed to fetch application details:", error);
    }
  };

  const handleDetailsModal = (userId: string) => {
    setSelectedListener(userId);
    setDetailsModal(true);
  };

  if (loading) {
    return <InlineLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
            }}
            placeholder="Search by anonymous name..."
            className="pl-10 p-3 border rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

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

      {listeners.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No {statusFilter.toLowerCase()} listeners found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {listeners.map((listener) => (
            <ListenerCard
              key={listener.userId}
              listener={listener}
              statusFilter={statusFilter}
              onFirstButtonClick={handleDetailsModal}
              firstButtonLabel="Details"
              firstButtonIcon={<Info className="h-4 w-4 text-blue-600" />}
              onViewSessions={(userId) =>
                router.push(`/dashboard/listener/sessions/${userId}`)
              }
              onViewApplication={(userId) => fetchApplicationData(userId)}
              onViewFeedback={(userId) =>
                router.push(`/dashboard/listener/feedbacks/${userId}`)
              }
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl">
        <ServerPagination
          paginationInfo={paginationInfo}
          handlePageClick={handlePageClick}
          elements={listeners}
        />
      </div>

      {successMessage && <SuccessMessage message={successMessage} />}

      {detailsModal && selectedListener && (
        <Details
          id={selectedListener}
          type="userId"
          handleClose={() => {
            setDetailsModal(false);
            setSelectedListener(null);
          }}
          statusFilter={statusFilter}
          setSuccessMessage={setSuccessMessage}
        />
      )}

      {applicationModal && selectedListener && application && (
        <ListenerDetailsForAdmin
          data={application}
          handleClose={() => {
            setApplicationModal(false);
            setSelectedListener(null);
            setApplication(null);
          }}
        />
      )}
    </div>
  );
}