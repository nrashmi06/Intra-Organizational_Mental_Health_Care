//to display individual listener details in a modal on Match-A-Listener page

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getListenerDetails } from "@/service/listener/getListenerDetails";
import { Star, X } from "lucide-react"; // Importing Lucid React Icons
import { initiateSession } from "@/service/session/initiateSession";

interface ListenerModalProps {
  selectedListener: CompleteListenerDetails;
  closeModal: () => void;
}
export interface CompleteListenerDetails {
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

const SendMessageModal: React.FC<{
  closeModal: () => void;
  selectedListener: CompleteListenerDetails;
}> = ({ closeModal, selectedListener }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [alert, setAlert] = useState(""); // Alert message state
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setAlert("Message cannot be empty.");
      return;
    }

    setIsSending(true);
    try {
      const response = await initiateSession(
        selectedListener.userId,
        message,
        token
      );

      if (response) {
        setAlert("Message sent successfully!");
        setMessage("");

        // Wait for 3 seconds and close the modal
        setTimeout(() => {
          setAlert("");
          closeModal();
        }, 3000);
      } else {
        setAlert("Failed to send the message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setAlert("An error occurred. Please try again.");
    } finally {
      setIsSending(false);
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
          <X />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Send Message
        </h2>

        <form onSubmit={handleSendMessage}>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className={`mt-4 w-full ${
              isSending ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-300`}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>

        {alert && (
          <p className="text-center mt-4 text-green-600 font-medium">{alert}</p>
        )}
      </div>
    </div>
  );
};

const ListenerModal: React.FC<ListenerModalProps> = ({
  selectedListener,
  closeModal,
}) => {
  const [detailedListener, setDetailedListener] =
    useState<CompleteListenerDetails | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [sendMessage, setSendMessage] = useState(false);

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
          onClick={() => {
            setDetailedListener(null);
            setSendMessage(true);
          }}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          Request a Session
        </button>
      </div>

      {sendMessage && (
        <SendMessageModal
          closeModal={() => setSendMessage(false)}
          selectedListener={selectedListener}
        />
      )}
    </div>
  );
};

export default ListenerModal;
