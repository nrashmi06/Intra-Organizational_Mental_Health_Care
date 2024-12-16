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
import Details from "./ModalDetails";
import ListenerDetailsForAdmin from "@/components/dashboard/listener/ModalApplication";
interface Listener {
  userId: string;
  anonymousName: string;
}

export function OnlineListenersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 5 items per table, 2 tables per page
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [applicationModal, setApplicationModal] = useState(false);

  const handleModalClose = () => {
    setApplicationModal(false);
    setDetailsModal(false);
  };

  const handleApplicationModal = () => {
    setApplicationModal(true);
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

  const renderTable = (listenersSubset: any[]) => (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">ID</TableHead>
            <TableHead className="font-bold">Anonymous Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listenersSubset.map((listener) => (
            <React.Fragment key={listener.userId}>
              <TableRow>
                <TableCell>{listener.userId}</TableCell>
                <TableCell>{listener.anonymousName}</TableCell>
                <TableCell className="text-right justify-end">
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
                    onClick={() => handleApplicationModal()}
                  >
                    Application
                  </Button>
                </TableCell>
              </TableRow>
              {detailsModal && (
                <Details
                  userId={listener.userId}
                  handleClose={handleModalClose}
                />
              )}
              {applicationModal && (
                <ListenerDetailsForAdmin
                  userId={listener.userId}
                  handleClose={handleModalClose}
                />
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const table1Listeners = paginatedListeners.filter(
    (_, index) => index % 2 === 0
  );
  const table2Listeners = paginatedListeners.filter(
    (_, index) => index % 2 !== 0
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {renderTable(table1Listeners)}
        {renderTable(table2Listeners)}
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
