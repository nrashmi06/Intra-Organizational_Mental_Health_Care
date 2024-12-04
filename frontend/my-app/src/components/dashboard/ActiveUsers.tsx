import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, MoreVertical } from "lucide-react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { getActiveUserByRoleName } from "@/service/SSE/getActiveUserByRoleName";
import Link from "next/link";
import { useRouter } from "next/router";
interface User {
  userId: string;
  anonymousName: string;
}

const ListenerProfileStatusTable: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken); // Retrieve the token from Redux store
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "onlineUsers" | "onlineListeners" | "onlineAdmins"
  >("onlineUsers");
  const [eventSource, setEventSource] = useState<EventSource | null>(null); // Track the active EventSource
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (eventSource) {
      eventSource.close();
    }
    const newEventSource = getActiveUserByRoleName(
      statusFilter,
      token,
      (data) => {
        setUsers(data);
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

  const toggleDropdown = (userId: string) => {
    setOpenDropdown((prev) => (prev === userId ? null : userId));
  };
  const router = useRouter();
  // Handle action click
  const handleAction = (action: string, user: User) => {
    setOpenDropdown(null); // Close the dropdown
    switch (action) {
      case "View":
        // Navigate to the "View" page
        console.log(`Navigating to View page for ${user.userId}`);
        break;
      case "View Sessions":
        console.log(`Navigating to View Sessions for ${user.userId}`);
        break;
      case "View Appointments":
        console.log(`Navigating to View Appointments for ${user.userId}`);
        break;
      case "View Certificate":
        console.log(`Navigating to View Certificate for ${user.userId}`);
        break;
      case "View Admin Profile":
        console.log(`Navigating to Admin Profile for ${user.userId}`);
        router.push(`/dashboard/admin/${user.userId}`);
        break;
      default:
        console.error("Unknown action");
    }
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
        {users.length > 0 ? (
          users.map((user) => (
            <Card
              key={user.userId}
              className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out relative"
            >
              <CardHeader className="flex items-start justify-between mb-2">
                <div className="flex flex-col">
                  <div className="relative mb-1">
                    <div className="h-12 w-12 bg-[repeating-conic-gradient(#000_0_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg_360deg)] rounded-full" />
                    <CheckCircle2 className="absolute right-0 bottom-0 h-4 w-4 text-gray-500" />
                  </div>
                  <CardTitle>{user.anonymousName}</CardTitle>
                  <div className="text-sm text-gray-500">
                    {statusFilter === "onlineAdmins"
                      ? "Admin user ID"
                      : statusFilter === "onlineListeners"
                      ? "Listener user ID"
                      : "User ID"}
                    {": "}
                    {user.userId}
                  </div>
                </div>
                {/* Dropdown Trigger */}
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-none text-center bg-transparent text-black hover:bg-gray-200"
                    onClick={() => toggleDropdown(user.userId)}
                    title="Options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {/* Dropdown Menu */}
                  {openDropdown === user.userId && (
                    <div
                      className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50"
                      style={{ overflow: "visible" }} // Ensure dropdown is not clipped
                    >
                      {statusFilter === "onlineUsers" && (
                        <>
                          <button
                            onClick={() => handleAction("View", user)}
                            className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleAction("View Sessions", user)}
                            className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            View Sessions
                          </button>
                          <button
                            onClick={() =>
                              handleAction("View Appointments", user)
                            }
                            className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            View Appointments
                          </button>
                        </>
                      )}
                      {statusFilter === "onlineListeners" && (
                        <>
                          <button
                            onClick={() => handleAction("View", user)}
                            className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleAction("View Sessions", user)}
                            className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            View Sessions
                          </button>
                          <button
                            onClick={() =>
                              handleAction("View Certificate", user)
                            }
                            className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            View Certificate
                          </button>
                        </>
                      )}
                      {statusFilter === "onlineAdmins" && (
                        <button
                          onClick={() =>
                            handleAction("View Admin Profile", user)
                          }
                          className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
                        >
                          View Admin Profile
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">
            No active users found
          </div>
        )}
      </div>
    </div>
  );
};

export default ListenerProfileStatusTable;
