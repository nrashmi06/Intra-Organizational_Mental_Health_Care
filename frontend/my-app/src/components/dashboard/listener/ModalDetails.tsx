import React, { useEffect, useState } from "react";
import {
  User,
  CheckCircle,
  Calendar,
  Mail,
  Star,
  Shield,
  X,
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
        const data = await getListenerDetails(id, token, type);
        setListener(data);
      } catch (error) {
        setError("Error fetching listener details." + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, id]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header - Always visible */}
        <div className="p-6 pb-0">
          <h2 className="text-xl font-semibold text-center border-b pb-4">
            Listener Details
          </h2>
        </div>

        {/* Content area with conditional rendering */}
        <div className="min-h-[400px] p-6 pt-4">
          {isLoading ? (
            <InlineLoader height="h-72"/>
          ) : error ? (
            <div className="flex items-center justify-center h-[400px] text-red-500 text-center">
              {error}
            </div>
          ) : !listener ? (
            <div className="flex items-center justify-center h-[400px] text-center">
              No details available.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-4 rounded-lg border">
                <Mail className="mr-2 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{listener.userEmail}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <Calendar className="mr-2 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Joined At</p>
                  <p className="text-sm">
                    {new Date(listener.joinedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <CheckCircle className="mr-2 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Sessions
                  </p>
                  <p className="text-sm">{listener.totalSessions}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <User className="mr-2 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Messages Sent
                  </p>
                  <p className="text-sm">
                    {listener.totalMessagesSent !== null
                      ? listener.totalMessagesSent
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <User className="mr-2 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Feedback Count
                  </p>
                  <p className="text-sm">{listener.feedbackCount}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <Star className="mr-2 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Average Rating
                  </p>
                  <p className="text-sm">{listener.averageRating.toFixed(1)}</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-lg border">
                <Shield className="mr-2 text-teal-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Approved By</p>
                  <p className="text-sm">{listener.approvedBy}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm font-medium text-gray-500">
                  Can Approve Blogs
                </p>
                <p className="text-sm">
                  {listener.canApproveBlogs ? "Yes" : "No"}
                </p>
              </div>
              {statusFilter && (
                <div className="col-span-2 p-4 flex justify-end">
                  <Button
                    variant="outline"
                    className={`${
                      statusFilter === "ACTIVE"
                        ? "text-red-500 bg-red-100 hover:bg-red-200"
                        : "text-green-500 bg-green-100 hover:bg-green-200"
                    }`}
                    onClick={() => handleAction(listener.listenerId, statusFilter)}
                  >
                    {statusFilter === "ACTIVE" ? "Suspend" : "Activate"} Listener
                  </Button>
                </div>
              )}
              {viewSession && (
                <div className="p-4 flex justify-end">
                  <Button
                    variant="outline"
                    className="text-blue-500 bg-blue-100"
                    onClick={() => router.push(`/dashboard/listener/sessions/${id}`)}
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

export default DetailsModal;