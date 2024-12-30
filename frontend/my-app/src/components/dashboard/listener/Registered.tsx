import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, Search, X } from "lucide-react";
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
import { ListenerApplication, Listener } from "@/lib/types";
import { getApplicationByListenerUserId } from "@/service/listener/getApplicationByListenerUserId";
import { useRouter } from "next/router";
import InlineLoader from "@/components/ui/inlineLoader";
import Pagination from "@/components/dashboard/Pagination";
import ListenerCard from "./ListenerCard";

const DEBOUNCE_DELAY = 750;
const PAGE_SIZE = 1;

export function RegisteredListenersTable() {
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "SUSPENDED">(
    "ACTIVE"
  );
  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [applicationModal, setApplicationModal] = useState(false);
  const [application, setApplication] = useState<ListenerApplication | null>(
    null
  );
  const [selectedListener, setSelectedListener] = useState<string | null>(null);
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

  const fetchListenersByProfileStatus = useCallback(
    async (status: "ACTIVE" | "SUSPENDED") => {
      try {
        setLoading(true);
        const response = await getListenersByProfileStatus({
          status,
          token: accessToken,
          page: paginationInfo.pageNumber,
          size: paginationInfo.pageSize,
          search: debouncedSearchQuery,
        });

        if (response && response.content) {
          setListeners(response.content);
          setPaginationInfo((prev) => ({
            ...prev,
            totalElements: response.page.totalElements,
            totalPages: response.page.totalPages,
          }));
          setStatusFilter(status);
        }
      } catch (error) {
        console.error("Error fetching listeners:", error);
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

  useEffect(() => {
    fetchListenersByProfileStatus(statusFilter);
  }, [
    fetchListenersByProfileStatus,
    paginationInfo.pageNumber,
    paginationInfo.pageSize,
    debouncedSearchQuery,
  ]);

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

  const handlePageChange = (page: number) => {
    setPaginationInfo((prev) => ({
      ...prev,
      pageNumber: page - 1, // Convert to 0-based index for the API
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
            }}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setPaginationInfo((prev) => ({ ...prev, pageNumber: 0 }));
            fetchListenersByProfileStatus(value as "ACTIVE" | "SUSPENDED");
          }}
        >
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && <InlineLoader />}

      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listeners.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No {statusFilter.toLowerCase()} listeners found.
              </div>
            ) : (
              listeners.map((listener) => (
                <ListenerCard
                  key={listener.userId}
                  listener={listener}
                  statusFilter={statusFilter}
                  onFirstButtonClick={handleDetailsModal}
                  firstButtonLabel="Suspend"
                  firstButtonIcon={<X className="h-4 w-4 text-red-600" />}
                  onViewSessions={(userId) =>
                    router.push(`/dashboard/listener/sessions/${userId}`)
                  }
                  onViewApplication={(userId) => fetchApplicationData(userId)}
                  onViewFeedback={(userId) =>
                    router.push(`/dashboard/listener/feedbacks/${userId}`)
                  }
                />
              ))
            )}
          </div>

          {listeners.length > 0 && (
            <Pagination
              currentPage={paginationInfo.pageNumber + 1}
              totalPages={paginationInfo.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {successMessage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
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
