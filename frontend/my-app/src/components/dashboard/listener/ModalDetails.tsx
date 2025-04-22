import React, { useEffect, useState } from "react";
import {
  User,
  CheckCircle,
  Calendar,
  Mail,
  Star,
  Shield,
  X,
  Book,
  Eye,
  ThumbsUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getListenerDetails } from "@/service/listener/getListenerDetails";
import { changeStatus } from "@/service/listener/changeStatus";
import router from "next/router";
import { Button } from "@/components/ui/button";
import { ListenerDetails } from "@/lib/types";
import InlineLoader from "@/components/ui/inlineLoader";

interface DetailsProps {
  id: string;
  type: string;
  handleClose: () => void;
  statusFilter?: string;
  setSuccessMessage?: (message: string | null) => void;
  viewSession?: boolean;
}

const DetailsModal: React.FC<DetailsProps> = ({
  id,
  type,
  handleClose,
  statusFilter,
  setSuccessMessage,
  viewSession,
}) => {
  const [listener, setListener] = useState<ListenerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListenerDetails(id, token, type) as ListenerDetails;
        setListener(data);
      } catch (error) {
        setError("Error fetching listener details." + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, id]);

  // Add styles to prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAction = async (listenerId: string, statusFilter: string) => {
    const action = statusFilter === "ACTIVE" ? "suspend" : "unsuspend";
    try {
      await changeStatus(listenerId, token, action);
      setSuccessMessage?.(`Listener ${action}ed successfully.`);
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
          <div className="flex-none p-3 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Listener Details</h2>
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
            ) : !listener ? (
              <div className="flex items-center justify-center h-60 text-center">
                No details available.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCard icon={Mail} title="Email" value={listener.userEmail} color="text-blue-500" />
                  <InfoCard 
                    icon={Calendar} 
                    title="Joined At" 
                    value={formatDate(listener.joinedAt)} 
                    color="text-green-500" 
                  />
                  <InfoCard 
                    icon={CheckCircle} 
                    title="Total Sessions" 
                    value={listener.totalSessions} 
                    color="text-purple-500" 
                  />
                  <InfoCard 
                    icon={User} 
                    title="Messages Sent" 
                    value={listener.totalMessagesSent ?? 'N/A'} 
                    color="text-red-500" 
                  />
                  <InfoCard 
                    icon={User} 
                    title="Feedback Count" 
                    value={listener.feedbackCount} 
                    color="text-orange-500" 
                  />
                  <InfoCard 
                    icon={Star} 
                    title="Average Rating" 
                    value={listener.averageRating.toFixed(1)} 
                    color="text-yellow-500" 
                  />
                  <InfoCard 
                    icon={Shield} 
                    title="Approved By" 
                    value={listener.approvedBy} 
                    color="text-teal-500" 
                  />
                  <InfoCard 
                    icon={CheckCircle} 
                    title="Can Approve Blogs" 
                    value={listener.canApproveBlogs ? "Yes" : "No"} 
                    color="text-indigo-500" 
                  />
                  <InfoCard 
                    icon={Book} 
                    title="Blogs Published" 
                    value={listener.totalBlogsPublished} 
                    color="text-rose-500" 
                  />
                  <InfoCard 
                    icon={ThumbsUp} 
                    title="Likes Received" 
                    value={listener.totalBlogLikesReceived} 
                    color="text-amber-500" 
                  />
                  <InfoCard 
                    icon={Eye} 
                    title="Views Received" 
                    value={listener.totalBlogViewsReceived} 
                    color="text-violet-500" 
                  />
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
                      onClick={() => handleAction(listener.listenerId, statusFilter)}
                    >
                      {statusFilter === "ACTIVE" ? "Suspend" : "Activate"} Listener
                    </Button>
                  )}
                  {viewSession && (
                    <Button
                      variant="outline"
                      className="text-blue-500 hover:bg-blue-50"
                      onClick={() => {
                        handleClose(); // close modal first
                        router.push(`/dashboard/listener/sessions/${id}`);
                      }}
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

export default DetailsModal;