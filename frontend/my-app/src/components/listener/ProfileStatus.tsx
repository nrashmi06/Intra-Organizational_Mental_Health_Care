//It will show the listener profile status in the dashboard. It will show the listener's name, user ID
// Filters to show Active Listeners and Suspended Listeners
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MoreVertical } from "lucide-react";
import { getListenersByProfileStatus } from "@/service/listener/getListenersByProfileStatus";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ViewListener from "./ViewListener";
import Link from "next/link";
import { getApplicationByListenerId } from "@/service/listener/getApplicationByListenerId";
import Image from "next/image";

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
  // Certificate URL state
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
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
    setOpenDropdown(null); // Close the dropdown before opening the modal
    setSelectedListener(listener);
  };

  const closeModal = () => {
    setSelectedListener(null);
  };

  const toggleDropdown = (userId: number) => {
    setOpenDropdown((prev) => (prev === userId ? null : userId));
  };

  const handleAction = async (userId: number) => {
    try {
      const response = await getApplicationByListenerId(userId, token);
      if (!response.certificateUrl) {
        console.error("No certificate URL found for the user");
        return;
      }

      setImage(response.certificateUrl); // Use the fetched URL directly
    } catch (error) {
      console.error("Error fetching certificate:", error);
    }
    setOpenDropdown(null); // Close the dropdown after the action
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

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {listeners.length > 0 ? (
          listeners.map((listener) => (
            <Card
              key={listener.userId}
              className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out relative overflow-visible" // Allow overflow for the dropdown
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

                {/* Dropdown Trigger */}
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-none text-center bg-transparent text-black hover:bg-gray-200"
                    onClick={() => toggleDropdown(listener.userId)}
                    title="Options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {/* Dropdown Menu */}
                  {openDropdown === listener.userId && (
                    <div
                      className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50"
                      style={{ overflow: "visible" }} // Ensure dropdown is not clipped
                    >
                      <button
                        onClick={() => handleViewClick(listener)}
                        className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                      >
                        View
                      </button>
                      <Link
                        href={`dashboard/listener/sessions/${listener.userId}`}
                        className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                      >
                        View All Sessions
                      </Link>
                      <button
                        onClick={() => handleAction(listener.userId)}
                        className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                      >
                        View Certificate
                      </button>
                    </div>
                  )}
                </div>
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

      {image && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setImage(null)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={image}
              alt="Certificate"
              className="max-w-full max-h-full"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw"
              height={500}
              width={500}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListenerProfileStatusTable;
