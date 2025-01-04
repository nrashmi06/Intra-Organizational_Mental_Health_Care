import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { getActiveListeners } from "@/service/SSE/getActiveListeners";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import DetailsModal from "./ModalDetails";
import ApplicationModal from "@/components/dashboard/listener/ModalApplication";
import { ListenerApplication } from "@/lib/types";
import { getApplicationByListenerUserId } from "@/service/listener/getApplicationByListenerUserId";
import { Listener } from "@/lib/types";
import router from "next/router";
import InlineLoader from "@/components/ui/inlineLoader";
import ListenerCard from "./ListenerCard";
import {
  addEventSource,
  clearEventSources,
  removeEventSource,
} from "@/store/eventsourceSlice";
import Pagination3 from "@/components/ui/ClientPagination";

export function OnlineListenersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [listeners, setListeners] = useState<Listener[]>([]);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [applicationModal, setApplicationModal] = useState(false);
  const [application, setApplication] = useState<ListenerApplication | null>(
    null
  );
  const [selectedListener, setSelectedListener] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

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
    setLoading(true);
    const eventSource = getActiveListeners(token, (data) => {
      setListeners(data);
      setLoading(false);
    });

    if (eventSource) {
      const eventSourceEntry = {
        id: "onlineListeners",
        eventSource,
      };
      dispatch(addEventSource(eventSourceEntry));
    }

    return () => {
      dispatch(removeEventSource("onlineListeners"));
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

  const fetchApplicationData = async (userId: string) => {
    try {
      const fetchedApplication = await getApplicationByListenerUserId(
        userId,
        token
      );
      setApplication(fetchedApplication);
      setApplicationModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredListeners = listeners.filter(
    (listener) =>
      listener.anonymousName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      listener.userId
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const paginatedListeners = filteredListeners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
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
            {listeners.length} Online Listeners
          </span>
        </div>
      </div>

      {loading && <InlineLoader />}
      {!loading && (
        <>
          {paginatedListeners.length === 0 ? (
            <div className="text-center py-8 text-black">
              No listeners found.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <Pagination3
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              filteredElements={filteredListeners}
            />
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
