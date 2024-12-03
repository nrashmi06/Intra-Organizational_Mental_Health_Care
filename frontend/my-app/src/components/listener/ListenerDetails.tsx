//to display individual listener details in a modal on MAKE-A-REQUEST page

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getListenerDetails } from "@/service/listener/getListenerDetails";
import { Star } from "lucide-react"; // Importing Lucid React Icons

interface ListenerModalProps {
  selectedListener: CompleteListenerDetails;
  closeModal: () => void;
}
interface CompleteListenerDetails {
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
  anonymousName: string;
  userId: number;
}

const ListenerModal: React.FC<ListenerModalProps> = ({
  selectedListener,
  closeModal,
}) => {
  const [detailedListener, setDetailedListener] =
    useState<CompleteListenerDetails | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchListenerDetails = async () => {
      try {
        console.log("Fetching listener details for:", selectedListener.userId);
        const details = await getListenerDetails(
          selectedListener.userId,
          token
        );
        setDetailedListener(details);
        console.log("Listener details:", details);
      } catch (error) {
        console.error("Error fetching listener details:", error);
      }
    };

    fetchListenerDetails();
  }, [selectedListener.userId, token]);

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          className={`text-${i <= rating ? "yellow-500" : "gray-300"}`}
        />
      );
    }
    return stars;
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
            {[
              { label: "User Email", value: detailedListener.userEmail },

              {
                label: "Total Sessions",
                value: detailedListener.totalSessions,
              },
              {
                label: "Total Messages Sent",
                value: detailedListener.totalMessagesSent ?? "N/A",
              },
              {
                label: "Joined At",
                value: new Date(detailedListener.joinedAt).toLocaleDateString(),
              },
              { label: "Approved By", value: detailedListener.approvedBy },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <p className="font-medium text-gray-900">{item.label}:</p>
                <p className="text-gray-700">{item.value}</p>
              </div>
            ))}

            {/* Rating with Stars */}
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-900">Average Rating:</p>
              <div className="flex space-x-1">
                {renderRatingStars(detailedListener.averageRating)}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <button
          onClick={() =>
            console.log("Request a session functionality will be implemented")
          }
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          Request a Session
        </button>
      </div>
    </div>
  );
};

export default ListenerModal;
