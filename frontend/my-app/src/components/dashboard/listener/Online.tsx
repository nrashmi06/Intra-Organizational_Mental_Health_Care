import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function OnlineListenersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [applicationModal, setApplicationModal] = useState(false);
  const [application, setApplication] = useState<ListenerApplication | null>(null);

  const handleModalClose = () => {
    setApplicationModal(false);
    setDetailsModal(false);
  };

  const handleApplicationModal = async (userId: number) => {
    await fetchApplicationData(userId);
  };

  const handleDetailsModal = () => {
    setDetailsModal(true);
  };

  useEffect(() => {
    if (eventSource) {
      eventSource.close();
    }
    const newEventSource = getActiveListeners(token, (data) => {
      setListeners(data);
    });
    setEventSource(newEventSource);
    return () => {
      newEventSource.close();
    };
  }, [token]);

  const fetchApplicationData = async (userId: number) => {
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

  const paginatedListeners = filteredListeners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4" />
          <Input
            id="search"
            placeholder="Search listeners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Anonymous Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedListeners.map((listener) => (
              <React.Fragment key={listener.userId}>
                <TableRow>
                  <TableCell>{listener.userId}</TableCell>
                  <TableCell>{listener.anonymousName}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" onClick={() => handleDetailsModal()}>
                      Details
                    </Button>
                    <Button
                      variant="link"
                      href={`/dashboard/listener/sessions/${listener.userId}`}
                    >
                      Sessions
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleApplicationModal(listener.userId)}
                    >
                      Application
                    </Button>
                  </TableCell>
                </TableRow>
                {detailsModal && (
                  <DetailsModal
                    userId={listener.userId}
                    handleClose={handleModalClose}
                  />
                )}
                {applicationModal && application && (
                  <ApplicationModal
                    data={application}
                    handleClose={handleModalClose}
                  />
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredListeners.length)} of{" "}
          {filteredListeners.length} entries
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
            disabled={currentPage * itemsPerPage >= filteredListeners.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
