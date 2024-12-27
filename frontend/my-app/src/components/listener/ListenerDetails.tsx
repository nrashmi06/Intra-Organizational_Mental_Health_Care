//to display the listener details in the match-a-listener page

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getListenerDetails } from "@/service/listener/getListenerDetails";
import { Star, X, MessageCircle, Calendar, Shield, Headphones } from "lucide-react";
import { ListenerDetails } from "@/lib/types";
import "@/styles/global.css";
import InlineLoader from "../ui/inlineLoader";
import SendMessageModal from "./SendMessageModal";
interface ListenerModalProps {
  closeModal: () => void;
  userId: string;
}

const ListenerModal: React.FC<ListenerModalProps> = ({
  closeModal,
  userId,
}) => {
  const [detailedListener, setDetailedListener] =
    useState<ListenerDetails | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [sendMessage, setSendMessage] = useState(false);

  useEffect(() => {
    if (detailedListener) return;
    const fetchListenerDetails = async () => {
      try {
        console.log("Fetching listener details for:", userId);
        const details = await getListenerDetails(userId, token, "userId");
        setDetailedListener(details);
        console.log("Listener details:", details);
      } catch (error) {
        console.error("Error fetching listener details:", error);
      }
    };

    fetchListenerDetails();
  }, [userId, token]);

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          className={`${
            i <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          } transition-colors`}
        />
      );
    }
    return stars;
  };

  if (sendMessage) {
    return (
      <SendMessageModal
        closeModal={() => setSendMessage(false)}
        userId={userId}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white max-w-xl w-full rounded-xl shadow-xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Headphones className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Listener Details
          </h2>
        </div>

        {detailedListener ? (
          <div className="space-y-4">
            {[
              { label: "User Email", value: detailedListener.userEmail },
              {
                label: "Total Sessions",
                value: detailedListener.totalSessions,
                icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
              },
              {
                label: "Total Messages Sent",
                value: detailedListener.totalMessagesSent ?? "N/A",
                icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
              },
              {
                label: "Joined At",
                value: new Date(detailedListener.joinedAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                ),
                icon: <Calendar className="w-4 h-4 text-blue-500" />,
              },
              {
                label: "Approved By",
                value: detailedListener.approvedBy,
                icon: <Shield className="w-4 h-4 text-blue-500" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <p className="font-medium text-gray-900">{item.label}</p>
                </div>
                <p className="text-gray-700">{item.value}</p>
              </div>
            ))}

            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-gray-900">Average Rating:</p>
              <div className="flex space-x-1">
                {renderRatingStars(detailedListener.averageRating)}
              </div>
            </div>
          </div>
        ) : (
          <InlineLoader height="h-72"/>
        )}

        <button
          onClick={() => {
            setSendMessage(true);
          }}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Request a Session</span>
        </button>
      </div>
    </div>
  );
};

export default ListenerModal;
