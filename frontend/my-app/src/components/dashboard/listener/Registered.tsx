import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  Search,
  X,
} from "lucide-react";
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
import Pagination3 from "@/components/ui/pagination3";
import ListenerCard from "./ListenerCard";

export function RegisteredListenersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "SUSPENDED">("ACTIVE");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
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

  const fetchListenersByProfileStatus = useCallback(
    async (status: "ACTIVE" | "SUSPENDED") => {
      try {
        setLoading(true);
        const response = await getListenersByProfileStatus(accessToken, status);
        setListeners(response);
        setStatusFilter(status);
      } catch (error) {
        console.error("Error fetching listeners:", error);
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    fetchListenersByProfileStatus("ACTIVE");
  }, [fetchListenersByProfileStatus]);

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

  const filteredListeners = listeners.filter(
    (listener) =>
      listener.anonymousName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      listener.userId.toString().includes(searchQuery)
  );

  const paginatedListeners = filteredListeners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            fetchListenersByProfileStatus(value as "ACTIVE" | "SUSPENDED")
          }
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
          {paginatedListeners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No {statusFilter.toLowerCase()} listeners found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedListeners.map((listener) => (
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
              ))}
            </div>
          )}
        </>
      )}
      <Pagination3
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        filteredElements={filteredListeners}
      />
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
