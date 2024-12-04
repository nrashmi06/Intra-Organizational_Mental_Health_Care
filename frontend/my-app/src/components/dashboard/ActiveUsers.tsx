import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, MoreVertical, X } from "lucide-react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { getActiveUserByRoleName } from "@/service/SSE/getActiveUserByRoleName";
import { getListenerDetails } from "@/service/listener/getListenerDetails";
import { getUserDetails } from "@/service/user/getUserDetails";
import { getApplicationByListenerId } from "@/service/listener/getApplicationByListenerId";
import { useRouter } from "next/router";
import UserDetails, { UserDetailsProps } from "../activeUser/UserDetails";
import ListenerDetails, {
  ListenerDetailsProps,
} from "../activeUser/ListenerDetails";

interface User {
  userId: string;
  anonymousName: string;
  userType: "USER" | "LISTENER" | "ADMIN";
}

const ListenerProfileStatusTable: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [users, setUsers] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "onlineUsers" | "onlineListeners" | "onlineAdmins"
  >("onlineUsers");
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [selectedUserDetails, setSelectedUserDetails] = useState<
    | {
        listenerId: number;
        userEmail: string;
        canApproveBlogs: boolean;
        maxDailySessions: number;
        totalSessions: number;
        totalMessagesSent: number | null;
        feedbackCount: number;
        averageRating: number;
        joinedAt: string;
        approvedBy: string;
      }
    | {
        id: number;
        email: string;
        anonymousName: string;
        role: string;
        profileStatus: string;
        createdAt: string;
        updatedAt: string;
        lastSeen: string;
        active: boolean;
      }
    | null
  >(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<
    "USER" | "LISTENER" | "ADMIN"
  >("USER");

  const router = useRouter();

  useEffect(() => {
    if (eventSource) {
      eventSource.close();
    }
    const newEventSource = getActiveUserByRoleName(
      statusFilter,
      token,
      (data) => {
        const mappedUsers = data.map((user: any) => ({
          ...user,
          userType:
            statusFilter === "onlineUsers"
              ? "USER"
              : statusFilter === "onlineListeners"
              ? "LISTENER"
              : "ADMIN",
        }));
        setUsers(mappedUsers);
      }
    ) as EventSource;

    setEventSource(newEventSource);

    return () => {
      newEventSource.close();
    };
  }, [statusFilter, token]);

  const fetchListenersByProfileStatus = (
    type: "onlineUsers" | "onlineListeners" | "onlineAdmins"
  ) => {
    setStatusFilter(type);
  };

  const toggleDropdown = (userId: string) => {
    setOpenDropdown((prev) => (prev === userId ? null : userId));
  };

  const handleAction = async (action: string, user: User) => {
    setOpenDropdown(null);

    try {
      switch (action) {
        case "View":
          let userDetails;
          if (user.userType === "LISTENER") {
            userDetails = await getListenerDetails(Number(user.userId), token);
          } else if (user.userType === "USER") {
            userDetails = await getUserDetails(Number(user.userId), token);
          }

          setSelectedUserDetails(userDetails);
          setCurrentUserType(user.userType);
          setIsDetailsModalOpen(true);
          break;

        case "View Sessions":
          const sessionsPath =
            user.userType === "LISTENER"
              ? `/dashboard/listener/sessions/${user.userId}`
              : user.userType === "USER"
              ? `/dashboard/user/sessions/${user.userId}`
              : `/dashboard/admin/sessions/${user.userId}`;

          router.push(sessionsPath);
          break;

        case "View Appointments":
          if (user.userType === "USER") {
            router.push(`/dashboard/user/appointments/${user.userId}`);
          }
          break;

        case "View Certificate":
          if (user.userType === "LISTENER") {
            const response = await getApplicationByListenerId(
              Number(user.userId),
              token
            );

            if (!response) {
              console.error("Nothing found for the listener");
              return;
            }
          }
          break;

        case "View Admin Profile":
          router.push(`/dashboard/admin/${user.userId}`);
          break;

        default:
          console.error("Unknown action");
      }
    } catch (error) {
      console.error(`Error performing action: ${action}`, error);
    }
  };

  const renderDropdownActions = (user: User) => {
    switch (user.userType) {
      case "USER":
        return (
          <>
            <button
              onClick={() => handleAction("View", user)}
              className="block px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              View User
            </button>
            <button
              onClick={() => handleAction("View Sessions", user)}
              className="block px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              View Sessions
            </button>
            <button
              onClick={() => handleAction("View Appointments", user)}
              className="block px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              View Appointments
            </button>
          </>
        );
      case "LISTENER":
        return (
          <>
            <button
              onClick={() => handleAction("View", user)}
              className="block px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              View Listener
            </button>
            <button
              onClick={() => handleAction("View Sessions", user)}
              className="block px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              View Sessions
            </button>
            {/* <button
              onClick={() => handleAction("View Certificate", user)}
              className="block px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              View Application
            </button> */}
          </>
        );
      case "ADMIN":
        return (
          <button
            onClick={() => handleAction("View Admin Profile", user)}
            className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            View Admin Profile
          </button>
        );
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
                    {user.userType} ID: {user.userId}
                  </div>
                </div>
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

                  {openDropdown === user.userId && (
                    <div
                      className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50"
                      style={{ overflow: "visible" }}
                    >
                      {renderDropdownActions(user)}
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

      {/* User Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentUserType === "LISTENER" ? "Listener" : "User"} Details
            </DialogTitle>
            <Button
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {selectedUserDetails ? (
            currentUserType === "LISTENER" ? (
              <ListenerDetails
                details={selectedUserDetails as ListenerDetailsProps["details"]}
              />
            ) : (
              <UserDetails
                details={selectedUserDetails as UserDetailsProps["details"]}
              />
            )
          ) : (
            <p>Loading details...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListenerProfileStatusTable;
