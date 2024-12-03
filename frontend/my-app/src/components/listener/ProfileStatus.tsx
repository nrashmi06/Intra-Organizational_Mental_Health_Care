import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { getListenersByProfileStatus } from "@/service/listener/getListenersByProfileStatus";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { View } from "lucide-react";
import ViewListener from "./ViewListener";

interface Listener {
  userId: number;
  anonymousName: string;
}

const ListenerProfileStatusTable: React.FC = () => {
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "SUSPENDED">(
    "ACTIVE"
  );
  const [selectedListener, setSelectedListener] = useState<Listener | null>(
    null
  );
  const token = useSelector((state: RootState) => state.auth.accessToken); // Retrieve the token from Redux store

  useEffect(() => {
    fetchListenersByProfileStatus("ACTIVE");
  }, []);

  const fetchListenersByProfileStatus = async (
    status: "ACTIVE" | "SUSPENDED"
  ) => {
    try {
      const response = await getListenersByProfileStatus(token, status);
      console.log("Listeners by profile status:", response);
      setListeners(response);
      setStatusFilter(status);
    } catch (error) {
      console.error("Error fetching listeners by profile status:", error);
    }
  };

  const handleViewClick = (listener: Listener) => {
    setSelectedListener(listener);
  };

  const closeModal = () => {
    setSelectedListener(null);
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Listener Profile Status</h2>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "ACTIVE" ? "default" : "outline"}
            onClick={() => fetchListenersByProfileStatus("ACTIVE")}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "SUSPENDED" ? "default" : "outline"}
            onClick={() => fetchListenersByProfileStatus("SUSPENDED")}
          >
            Suspended
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
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

      {selectedListener && (
        <ViewListener
          selectedListener={selectedListener}
          closeModal={closeModal}
          action={statusFilter === "ACTIVE" ? "suspend" : "unsuspend"}
        />
      )}
    </div>
  );
};

export default ListenerProfileStatusTable;
