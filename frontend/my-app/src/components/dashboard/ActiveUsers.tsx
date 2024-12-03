import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, View } from "lucide-react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { getActiveUserByRoleName } from "@/service/SSE/getActiveUserByRoleName";

interface Listener {
  userId: string;
  anonymousName: string;
}

const ListenerProfileStatusTable: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken); // Retrieve the token from Redux store
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "onlineUsers" | "onlineListeners" | "onlineAdmins"
  >("onlineUsers");
  const [eventSource, setEventSource] = useState<EventSource | null>(null); // Track the active EventSource

  useEffect(() => {
    // Clean up the previous EventSource
    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = getActiveUserByRoleName(
      statusFilter,
      token,
      (data) => {
        setListeners(data);
      }
    ) as EventSource;

    setEventSource(newEventSource);

    return () => {
      newEventSource.close(); // Clean up when component unmounts or filter changes
    };
  }, [statusFilter, token]);
  // React to changes in statusFilter or token

  const fetchListenersByProfileStatus = (
    type: "onlineUsers" | "onlineListeners" | "onlineAdmins"
  ) => {
    setStatusFilter(type); // Update the status filter
  };

  const handleViewClick = (listener: Listener) => {
    console.log("View Listener Details:", listener);
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Active Users</h2>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "onlineUsers" ? "default" : "outline"}
            onClick={() => fetchListenersByProfileStatus("onlineUsers")}
          >
            Users
          </Button>
          <Button
            variant={statusFilter === "onlineListeners" ? "default" : "outline"}
            onClick={() => fetchListenersByProfileStatus("onlineListeners")}
          >
            Listeners
          </Button>
          <Button
            variant={statusFilter === "onlineAdmins" ? "default" : "outline"}
            onClick={() => fetchListenersByProfileStatus("onlineAdmins")}
          >
            Admins
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {listeners.length > 0 ? (
          listeners.map((listener) => (
            <Card
              key={listener.userId}
              className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out relative"
            >
              <CardHeader className="flex items-start justify-between mb-2">
                <div className="flex flex-col">
                  <div className="relative mb-1">
                    <div className="h-12 w-12 bg-[repeating-conic-gradient(#000_0_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg_360deg)] rounded-full" />
                    <CheckCircle2 className="absolute right-0 bottom-0 h-4 w-4 text-gray-500" />
                  </div>
                  <CardTitle>{listener.anonymousName}</CardTitle>
                  <div className="text-sm text-gray-500">
                    Listener user ID: {listener.userId}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 border-none text-center bg-transparent text-black hover:bg-gray-200"
                  onClick={() => handleViewClick(listener)}
                >
                  <View className="h-4 w-4" />
                </Button>
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">
            No listeners found
          </div>
        )}
      </div>
    </div>
  );
};

export default ListenerProfileStatusTable;
