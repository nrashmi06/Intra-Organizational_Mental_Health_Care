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

  const InfoCard = ({ icon: Icon, title, value, color }: { icon: any; title: string; value: string | number; color: string }) => (
    <div className="flex items-center p-2 sm:p-3 rounded-lg border hover:shadow-sm transition-shadow bg-white">
      <Icon className={`mr-2 ${color} w-4 h-4 sm:w-5 sm:h-5`} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 truncate">{title}</p>
        <p className="text-xs sm:text-sm truncate">{value}</p>
      </div>
    </div>
  );

  // Add styles to prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
          <div className="flex-none p-3 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">User Details</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {isLoading ? (
              <InlineLoader height="h-60" />
            ) : error ? (
              <div className="flex items-center justify-center h-60 text-red-500 text-center">
                {error}
              </div>
            ) : !user ? (
              <div className="flex items-center justify-center h-60 text-center">
                No details available.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCard icon={Mail} title="Email" value={user.email} color="text-blue-500" />
                  <InfoCard icon={User} title="Anonymous Name" value={user.anonymousName} color="text-indigo-500" />
                  <InfoCard icon={CheckCircle} title="Role" value={user.role} color="text-purple-500" />
                  <InfoCard icon={Shield} title="Status" value={user.profileStatus} color="text-teal-500" />
                  <InfoCard icon={Calendar} title="Created At" value={formatDate(user.createdAt)} color="text-green-500" />
                  <InfoCard icon={Calendar} title="Updated At" value={formatDate(user.updatedAt)} color="text-yellow-500" />
                  <InfoCard icon={Calendar} title="Last Seen" value={formatDate(user.lastSeen)} color="text-orange-500" />
                  <InfoCard icon={Users} title="Total Sessions" value={user.totalSessionsAttended} color="text-purple-500" />
                  <InfoCard
                    icon={Calendar}
                    title="Last Session"
                    value={user.lastSessionDate ? formatDate(user.lastSessionDate) : 'N/A'}
                    color="text-indigo-500"
                  />
                  <InfoCard icon={Calendar} title="Total Appointments" value={user.totalAppointments} color="text-blue-500" />
                  <InfoCard
                    icon={Calendar}
                    title="Last Appointment"
                    value={user.lastAppointmentDate ? formatDate(user.lastAppointmentDate) : 'N/A'}
                    color="text-cyan-500"
                  />
                  <InfoCard icon={MessageSquare} title="Messages Sent" value={user.totalMessagesSent} color="text-green-500" />
                  <InfoCard icon={Book} title="Blogs Published" value={user.totalBlogsPublished} color="text-rose-500" />
                  <InfoCard icon={ThumbsUp} title="Likes Received" value={user.totalLikesReceived} color="text-amber-500" />
                  <InfoCard icon={Eye} title="Views Received" value={user.totalViewsReceived} color="text-violet-500" />
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
                  {statusFilter && (
                    <Button
                      variant="outline"
                      className={`${
                        statusFilter === "ACTIVE"
                          ? "text-red-500 hover:bg-red-50"
                          : "text-green-500 hover:bg-green-50"
                      }`}
                      onClick={() => handleAction(user.userId, statusFilter)}
                    >
                      {statusFilter === "ACTIVE" ? "Suspend" : "Activate"} User
                    </Button>
                  )}
                  {viewSession && (
                    <Button
                      variant="outline"
                      className="text-blue-500 hover:bg-blue-50"
                      onClick={() => router.push(`/dashboard/user/sessions/${userId}`)}
                    >
                      View Sessions
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetails;