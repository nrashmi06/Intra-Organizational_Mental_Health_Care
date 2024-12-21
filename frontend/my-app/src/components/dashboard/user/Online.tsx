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
import { getActiveUserByRoleName } from "@/service/SSE/getActiveUserByRoleName";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ModalDetails from "./ModalDetails";
import { User } from "@/lib/types";

export function OnlineListenersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 5 items per table, 2 tables per page
  const [users, setUsers] = useState<User[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);

  const handleModalClose = () => {
    setDetailsModal(false);
  };

  const handleDetailsModal = () => {
    setDetailsModal(true);
  };

  useEffect(() => {
    if (eventSource) {
      eventSource.close();
    }
    const newEventSource = getActiveUserByRoleName("onlineUsers", token, (data) => {
      setUsers(data);
    });
    setEventSource(newEventSource);
    return () => {
      newEventSource?.close();
    };
  }, [token]);

  const filteredUsers = users.filter(
    (user) =>
      user.anonymousName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderTable = (usersSubset: any[]) => (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Anonymous Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersSubset.map((user) => (
            <React.Fragment key={user.userId}>
              <TableRow>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.anonymousName}</TableCell>
                <TableCell className="text-right justify-end">
                  <Button variant="link" onClick={() => handleDetailsModal()}>
                    Details
                  </Button>
                  <Button
                    variant="link"
                    href={`/dashboard/user/sessions/${user.userId}`}
                  >
                    Sessions
                  </Button>
                  <Button
                    variant="link"
                    href={`/dashboard/user/appointments/${user.userId}`}
                  >
                    Appointments
                  </Button>
                </TableCell>
              </TableRow>
              {detailsModal && (
                <ModalDetails
                  userId={user.userId}
                  handleClose={handleModalClose}
                />
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const table1Listeners = paginatedUsers.filter((_, index) => index % 2 === 0);
  const table2Listeners = paginatedUsers.filter((_, index) => index % 2 !== 0);

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
          {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} entries
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
            disabled={currentPage * itemsPerPage >= filteredUsers.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
