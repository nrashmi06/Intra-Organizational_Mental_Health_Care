import React, { useEffect, useState } from "react";
import { Search, User2, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getActiveUserByRoleName } from "@/service/SSE/getActiveUserByRoleName";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ModalDetails from "./ModalDetails";
import { Admin } from "@/lib/types";
import UserIcon from "@/components/ui/userIcon";
import "@/styles/global.css";
import InlineLoader from "@/components/ui/inlineLoader";

export function OnlineAdminsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjusted for grid layout
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventSource) {
      eventSource.close();
    }
    setLoading(true);
    const newEventSource = getActiveUserByRoleName(
      "onlineAdmins",
      token,
      (data) => {
        setAdmins(data);
        setLoading(false);
      }
    );
    setEventSource(newEventSource);

    return () => {
      newEventSource?.close();
    };
  }, [token]);

  const handleDetailsModal = (userId: string) => {
    setSelectedUserId(userId);
    setDetailsModal(true);
  };

  const filteredAdmins = admins.filter(
    (user) =>
      user.anonymousName
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.userId.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      {loading && <InlineLoader />}
      {!loading && (
        <>
          {paginatedAdmins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No admins found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedAdmins.map((admin) => (
                <Card
                  key={admin.userId}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <UserIcon role={"admin"} />
                          <div>
                            <p className="font-medium text-gray-900">
                              {admin.anonymousName}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {admin.userId}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center space-x-2"
                          onClick={() => handleDetailsModal(admin.userId)}
                        >
                          <User2 className="h-4 w-4" />
                          <span>View Details</span>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center space-x-2"
                          href={`/dashboard/admin/appointments/${admin.userId}?req=onlineAdmins`}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Appointments</span>
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredAdmins.length)} of{" "}
          {filteredAdmins.length} entries
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
            disabled={currentPage * itemsPerPage >= filteredAdmins.length}
          >
            Next
          </Button>
        </div>
      </div>

      {detailsModal && (
        <ModalDetails
          userId={selectedUserId}
          handleClose={() => {
            setDetailsModal(false);
            setSelectedUserId("");
          }}
        />
      )}
    </div>
  );
}
