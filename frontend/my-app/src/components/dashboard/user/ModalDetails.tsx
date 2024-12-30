import React, { useEffect, useState } from "react";
import { User, CheckCircle, Mail, Shield, X, MessageSquare, Book, ThumbsUp, Eye, Users, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getUserDetails } from "@/service/user/getUserDetails";
import { changeStatus } from "@/service/user/ChangeStatus";
import router from "next/router";
import { Button } from "@/components/ui/button";
import { UserDetails } from "@/lib/types";
import InlineLoader from "@/components/ui/inlineLoader";

interface DetailsProps {
  userId: string;
  handleClose: () => void;
  statusFilter?: string;
  setSuccessMessage?: (message: string | null) => void;
  viewSession?: boolean;
}

const ModalDetails: React.FC<DetailsProps> = ({
  userId,
  handleClose,
  statusFilter,
  setSuccessMessage,
  viewSession
}) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDetails(userId, token);
        setUser(data);
      } catch (error) {
        setError("Error fetching user details." + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  const handleAction = async (userId: string, statusFilter: string) => {
    const action = statusFilter === "ACTIVE" ? "suspend" : "unsuspend";
    try {
      await changeStatus(userId, token, action);
      setSuccessMessage?.(`User ${action}ed successfully.`);
      setTimeout(() => {
        setSuccessMessage?.(null);
      }, 2000);
      router.reload();
    } catch (error) {
      console.error("Error changing approval status:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 pb-0">
          <h2 className="text-xl font-semibold text-center border-b pb-4">
            User Details
          </h2>
        </div>

        <div className="min-h-96 p-6 pt-4">
          {isLoading ? (
            <InlineLoader height="h-80"/>
          ) : error ? (
            <div className="flex items-center justify-center h-[400px] text-red-500 text-center">
              {error}
            </div>
          ) : !user ? (
            <div className="flex items-center justify-center h-[400px] text-center">
              No details available.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="flex items-center p-4 rounded-lg border">
                <Mail className="mr-2 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <User className="mr-2 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Anonymous Name</p>
                  <p className="text-sm">{user.anonymousName}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <CheckCircle className="mr-2 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-sm">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <Shield className="mr-2 text-teal-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-sm">{user.profileStatus}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center p-4 rounded-lg border">
                <Calendar className="mr-2 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="text-sm">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <Calendar className="mr-2 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Updated At</p>
                  <p className="text-sm">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <Calendar className="mr-2 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Seen</p>
                  <p className="text-sm">{formatDate(user.lastSeen)}</p>
                </div>
              </div>

              {/* Session Information */}
              <div className="flex items-center p-4 rounded-lg border">
                <Users className="mr-2 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Sessions Attended</p>
                  <p className="text-sm">{user.totalSessionsAttended}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <Calendar className="mr-2 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Session Date</p>
                  <p className="text-sm">{user.lastSessionDate ? formatDate(user.lastSessionDate) : 'N/A'}</p>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="flex items-center p-4 rounded-lg border">
                <Calendar className="mr-2 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                  <p className="text-sm">{user.totalAppointments}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <Calendar className="mr-2 text-cyan-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Appointment Date</p>
                  <p className="text-sm">{user.lastAppointmentDate ? formatDate(user.lastAppointmentDate) : 'N/A'}</p>
                </div>
              </div>

              {/* Activity Metrics */}
              <div className="flex items-center p-4 rounded-lg border">
                <MessageSquare className="mr-2 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Messages Sent</p>
                  <p className="text-sm">{user.totalMessagesSent}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <Book className="mr-2 text-rose-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Blogs Published</p>
                  <p className="text-sm">{user.totalBlogsPublished}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <ThumbsUp className="mr-2 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Likes Received</p>
                  <p className="text-sm">{user.totalLikesReceived}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <Eye className="mr-2 text-violet-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Views Received</p>
                  <p className="text-sm">{user.totalViewsReceived}</p>
                </div>
              </div>

              {/* Active Status */}
              <div className="p-4 rounded-lg border">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-sm">{user.isActive ? "Yes" : "No"}</p>
              </div>

              {/* Action Buttons */}
              {statusFilter && (
                <div className="p-4 flex justify-end">
                  <Button
                    variant="outline"
                    className={`${
                      statusFilter === "ACTIVE"
                        ? "text-red-500 bg-red-100"
                        : "text-green-500 bg-green-100"
                    }`}
                    onClick={() => handleAction(user.userId, statusFilter)}
                  >
                    {statusFilter === "ACTIVE" ? "Suspend" : "Activate"} User
                  </Button>
                </div>
              )}
              {viewSession && (
                <div className="p-4 flex justify-end">
                  <Button
                    variant="outline"
                    className="text-blue-500 bg-blue-100"
                    onClick={() => router.push(`/dashboard/user/sessions/${userId}`)}
                  >
                    View Sessions
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetails;