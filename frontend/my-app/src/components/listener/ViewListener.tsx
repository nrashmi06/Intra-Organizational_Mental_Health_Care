import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getListenerDetails } from "@/service/listener/getListenerDetails";
import { changeStatus } from "@/service/listener/changeStatus";
import { useRouter } from "next/router";
interface ListenerModalProps {
  selectedListener: ListenerDetails;
  closeModal: () => void;
  action: string;
}

interface ListenerDetails {
  anonymousName: string;
  userId: number;
}

interface ListenerDetailsProps {
  listenerId: number;
  userEmail: string;
  canApproveBlogs: boolean;
  totalSessions: number;
  totalMessagesSent: number | null;
  feedbackCount: number | null;
  averageRating: number;
  joinedAt: string;
  approvedBy: string;
}

const ViewListener: React.FC<ListenerModalProps> = ({
  selectedListener,
  closeModal,
  action,
}) => {
  const [detailedListener, setDetailedListener] =
    useState<ListenerDetailsProps | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const router = useRouter();

  useEffect(() => {
    const fetchListenerDetails = async () => {
      try {
        console.log("Fetching listener details for:", selectedListener.userId);
        const details = await getListenerDetails(
          selectedListener.userId,
          token
        );
        setDetailedListener(details);
      } catch (error) {
        console.error("Error fetching listener details:", error);
      }
    };

    fetchListenerDetails();
  }, [selectedListener.userId, token]);
  const handleAction = async (listenerId: number, action: string) => {
    try {
      const response = await changeStatus(listenerId, token, action);
      console.log("Action performed successfully:", response);
      setTimeout(() => {}, 1000);
      router.reload();
      // Optionally refresh details or notify the user
    } catch (error) {
      console.error("Error changing approval status:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white max-w-xl w-full rounded-lg shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Listener Details
        </h2>
        {detailedListener ? (
          <div className="space-y-4">
            <div className="text-lg">
              <span className="font-medium text-gray-900">Listener ID:</span>{" "}
              {detailedListener.listenerId}
            </div>
            <div className="text-lg">
              <span className="font-medium text-gray-900">User Email:</span>{" "}
              {detailedListener.userEmail}
            </div>
            <div className="text-lg">
              <span className="font-medium text-gray-900">
                Can Approve Blogs:
              </span>{" "}
              {detailedListener.canApproveBlogs ? "Yes" : "No"}
            </div>
            <div className="text-lg">
              <span className="font-medium text-gray-900">Total Sessions:</span>{" "}
              {detailedListener.totalSessions}
            </div>
            <div className="text-lg">
              <span className="font-medium text-gray-900">
                Total Messages Sent:
              </span>{" "}
              {detailedListener.totalMessagesSent !== null
                ? detailedListener.totalMessagesSent
                : "No messages sent"}
            </div>
            <div className="text-lg">
              <span className="font-medium text-gray-900">Feedback Count:</span>{" "}
              {detailedListener.feedbackCount !== null
                ? detailedListener.feedbackCount
                : "No feedback provided"}
            </div>
            <div className="text-lg">
              <span className="font-medium text-gray-900">Average Rating:</span>{" "}
              {detailedListener.averageRating.toFixed(2)}
            </div>
            <div className="text-lg">
              <span className="font-medium text-gray-900">Joined At:</span>{" "}
              {new Date(detailedListener.joinedAt).toLocaleString()}
            </div>
            <div className="text-lg">
              <span className="font-medium text-gray-900">Approved By:</span>{" "}
              {detailedListener.approvedBy}
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() =>
                  handleAction(detailedListener.listenerId, action)
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                {action === "suspend" ? "Suspend" : "Unsuspend"} Listener
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading listener details...</p>
        )}
      </div>
    </div>
  );
};

export default ViewListener;
