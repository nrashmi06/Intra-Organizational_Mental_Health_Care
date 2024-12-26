import React, { useEffect, useState } from "react";
import { Search, Users, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getActiveListeners } from "@/service/SSE/getActiveListeners";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import DetailsModal from "./ModalDetails";
import ApplicationModal from "@/components/dashboard/listener/ModalApplication";
import { ListenerApplication } from "@/lib/types";
import { getApplicationByListenerUserId } from "@/service/listener/getApplicationByListenerUserId";
import { Listener } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import router from "next/router";
import UserIcon from "@/components/ui/userIcon";
import InlineLoader from "@/components/ui/inlineLoader";

export function OnlineListenersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Changed to match the other table's items per page
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [applicationModal, setApplicationModal] = useState(false);
  const [application, setApplication] = useState<ListenerApplication | null>(
    null
  );
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
    setLoading(true); // Start loader here

    const newEventSource = getActiveListeners(token, (data) => {
      setListeners(data);
      setLoading(false); // Stop loader after receiving data
    });

    setEventSource(newEventSource);

    return () => {
      newEventSource.close();
    };
  }, [token]);

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
    <div className="space-y-8">
      {/* Search Bar */}
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
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">
            {listeners.length} Online Listeners
          </span>
        </div>
      </div>

      {loading && <InlineLoader />}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:min-h-[350px]">
          {paginatedListeners.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">No online listeners found</p>
            </div>
          ) : (
            paginatedListeners.map((listener) => (
              <div
                key={listener.userId}
                className="bg-white h-min rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    {/* Listener Icon */}
                    <div className="flex-shrink-0">
                      <UserIcon role="listener" />
                    </div>

                    {/* Listener Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {listener.anonymousName}
                        </h3>
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        ID: {listener.userId}
                      </p>
                    </div>

                    {/* Actions Menu */}
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
                            onClick={() => handleDetailsModal(listener.userId)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/listener/sessions/${listener.userId}`
                              )
                            }
                          >
                            View Sessions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleApplicationModal(listener.userId)
                            }
                          >
                            View Application
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

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <p className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredListeners.length)} of{" "}
          {filteredListeners.length} listeners
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
            disabled={currentPage * itemsPerPage >= filteredListeners.length}
            className="h-9"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
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
