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

interface Listener {
  listenerId: number;
  userEmail: string;
  canApproveBlogs: boolean;
  maxDailySessions: number;
  totalSessions: number;
  totalMessagesSent: number | null;
  feedbackCount: number;
  averageRating: number;
  joinedAt: string; // ISO 8601 formatted date string
  approvedBy: string;
}

interface DetailsProps {
  userId: number;
  handleClose: () => void;
  statusFilter?: string; // Function to handle modal close
}

const Details: React.FC<DetailsProps> = ({
  userId,
  handleClose,
  statusFilter,
}) => {
  const [listener, setListener] = useState<Listener | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListenerDetails(userId, token);
        setListener(data);
      } catch (error) {
        setError("Error fetching listener details." + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!listener) {
    return <div className="text-center p-4">No details available.</div>;
  }
  const handleAction = async (listenerId: number, statusFilter: string) => {
    const action = statusFilter === "ACTIVE" ? "suspend" : "unsuspend";
    try {
      const response = await changeStatus(listenerId, token, action);
      console.log("Action performed successfully:", response);
      setTimeout(() => {}, 1000);
      router.reload();
    } catch (error) {
      console.error("Error changing approval status:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center border-b pb-4">
            Listener Details
          </h2>

          {/* Content Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex items-center p-4 rounded-lg border">
              <Mail className="mr-2 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{listener.userEmail}</p>
              </div>
            </div>

            {/* Joined At */}
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

            {/* Max Daily Sessions */}
            <div className="flex items-center p-4 rounded-lg border">
              <User className="mr-2 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Max Daily Sessions
                </p>
                <p className="text-sm">{listener.maxDailySessions}</p>
              </div>
            </div>

            {/* Total Sessions */}
            <div className="flex items-center p-4 rounded-lg border">
              <CheckCircle className="mr-2 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Sessions
                </p>
                <p className="text-sm">{listener.totalSessions}</p>
              </div>
            </div>

            {/* Total Messages Sent */}
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

            {/* Feedback Count */}
            <div className="flex items-center p-4 rounded-lg border">
              <User className="mr-2 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Feedback Count
                </p>
                <p className="text-sm">{listener.feedbackCount}</p>
              </div>
            </div>

            {/* Average Rating */}
            <div className="flex items-center p-4 rounded-lg border">
              <Star className="mr-2 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Average Rating
                </p>
                <p className="text-sm">{listener.averageRating.toFixed(1)}</p>
              </div>
            </div>

            {/* Approved By */}
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
              <div className="p-4 flex justify-end">
                <Button
                  variant="outline"
                  className={`${
                    statusFilter === "ACTIVE"
                      ? "text-red-500 bg-red-100"
                      : "text-green-500 bg-green-100"
                  }`}
                  onClick={() =>
                    handleAction(listener.listenerId, statusFilter)
                  }
                >
                  {statusFilter === "ACTIVE" ? "Suspend" : "Unsuspend"} Listener
                </Button>
              </div>
            )}
          </div>

          {/* Can Approve Blogs */}
        </div>
      </div>
    </div>
  );
};

export default Details;
