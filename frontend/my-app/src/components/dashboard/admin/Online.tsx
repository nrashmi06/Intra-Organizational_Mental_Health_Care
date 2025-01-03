import React, { useEffect, useState } from "react";
import { Search, User2, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getActiveUserByRoleName } from "@/service/SSE/getActiveUserByRoleName";
import ModalDetails from "./ModalDetails";
import { Admin } from "@/lib/types";
import UserIcon from "@/components/ui/userIcon";
import InlineLoader from "@/components/ui/inlineLoader";
import { addEventSource, clearEventSources, removeEventSource } from "@/store/eventsourceSlice";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";

export function OnlineAdminsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [admins, setAdmins] = useState<Admin[]>([]);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setLoading(true);
    const eventSource = getActiveUserByRoleName(
      "onlineAdmins",
      token,
      (data) => {
        setAdmins(data);
        setLoading(false);
      }
    );
    if (eventSource) {
      const eventSourceEntry = {
        id: "onlineAdmins",
        eventSource,
      };
      dispatch(addEventSource(eventSourceEntry));
    }

    return () => {
      dispatch(removeEventSource("onlineAdmins"));
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
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-shadow"
            />
          </div>
        </div>
      </div>

      {loading && <InlineLoader />}
      
      {!loading && (
        <>
          {paginatedAdmins.length === 0 ? (
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg rounded-xl p-8">
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No admins found.
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {paginatedAdmins.map((admin) => (
                <Card
                  key={admin.userId}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-lime-100 to-teal-300 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all duration-300">
                            <UserIcon role="admin" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                            {admin.anonymousName}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            ID: {admin.userId}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => handleDetailsModal(admin.userId)}
                          className="w-full h-10 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors rounded-xl flex items-center justify-center space-x-2"
                        >
                          <User2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          <span className="font-medium">View Details</span>
                        </Button>

                        <Button
                          variant="outline"
                          href={`/dashboard/admin/appointments/${admin.userId}?req=onlineAdmins`}
                          className="w-full h-10 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors rounded-xl flex items-center justify-center space-x-2"
                        >
                          <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          <span className="font-medium">Appointments</span>
                          <ExternalLink className="h-4 w-4 ml-1 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
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
                className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage * itemsPerPage >= filteredAdmins.length}
                className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {detailsModal && (
        createPortal(
          <ModalDetails
            userId={selectedUserId}
            handleClose={() => {
              setDetailsModal(false);
              setSelectedUserId("");
            }}
          />,
          document.body
        )
      )}
    </div>
  );
}
