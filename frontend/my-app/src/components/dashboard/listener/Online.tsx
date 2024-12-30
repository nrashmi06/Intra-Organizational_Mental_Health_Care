import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getActiveListeners } from "@/service/SSE/getActiveListeners";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import DetailsModal from "./ModalDetails";
import ApplicationModal from "@/components/dashboard/listener/ModalApplication";
import { ListenerApplication } from "@/lib/types";
import { getApplicationByListenerUserId } from "@/service/listener/getApplicationByListenerUserId";
import { Listener } from "@/lib/types";
import router from "next/router";
import InlineLoader from "@/components/ui/inlineLoader";
import ListenerCard from "./ListenerCard";

export function OnlineListenersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [applicationModal, setApplicationModal] = useState(false);
  const [application, setApplication] = useState<ListenerApplication | null>(null);
  const [selectedListener, setSelectedListener] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleModalClose = () => {
    setApplicationModal(false);
    setDetailsModal(false);
    setSelectedListener(null);
  };

  const handleApplicationModal = async (userId: string) => {
    setSelectedListener(userId);
    await fetchApplicationData(userId);
  };

  const handleDetailsModal = (userId: string) => {
    setSelectedListener(userId);
    setDetailsModal(true);
  };

  useEffect(() => {
    if (eventSource) {
      eventSource.close();
    }
    setLoading(true);

    const newEventSource = getActiveListeners(token, (data) => {
      setListeners(data);
      setLoading(false);
    });

    setEventSource(newEventSource);

    return () => {
      newEventSource.close();
    };
  }, [token]);

  const fetchApplicationData = async (userId: string) => {
    try {
      const fetchedApplication = await getApplicationByListenerUserId(userId, token);
      setApplication(fetchedApplication);
      setApplicationModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredListeners = listeners.filter(
    (listener) =>
      listener.anonymousName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listener.userId.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredListeners.length / itemsPerPage);
  const paginatedListeners = filteredListeners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => goToPage(i)}
          variant={currentPage === i ? "default" : "outline"}
          className={`h-8 w-8 p-0 ${
            currentPage === i
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "hover:bg-accent"
          }`}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listeners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">
            {listeners.length} Online Listeners
          </span>
        </div>
      </div>

      {loading && <InlineLoader />}
      {!loading && (
        <>
          {paginatedListeners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No listeners found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {paginatedListeners.map((listener) => (
                <ListenerCard
                  key={listener.userId}
                  listener={listener}
                  onFirstButtonClick={(userId) => handleDetailsModal(userId)}
                  firstButtonLabel="Details"
                  firstButtonIcon={<Info className="h-4 w-4" />}
                  onViewSessions={(userId) =>
                    router.push(`/dashboard/listener/sessions/${userId}`)
                  }
                  onViewApplication={(userId) => handleApplicationModal(userId)}
                  onViewFeedback={(userId) =>
                    router.push(`/dashboard/listener/feedbacks/${userId}`)
                  }
                />
              ))}
            </div>
          )}

{filteredListeners.length > 0 && (
  <div className="flex flex-col items-center gap-4 mt-6">
    <div className="text-sm text-muted-foreground">
      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredListeners.length)} of {filteredListeners.length} results
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 mx-2">{renderPageNumbers()}</div>

      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => goToPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
)}
        </>
      )}

      {detailsModal && selectedListener && (
        <DetailsModal
          id={selectedListener}
          type="userId"
          handleClose={handleModalClose}
        />
      )}
      {applicationModal && application && (
        <ApplicationModal data={application} handleClose={handleModalClose} />
      )}
    </div>
  );
}