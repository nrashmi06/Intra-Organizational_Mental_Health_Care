import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getListenerDetails } from "@/service/listener/getListenerDetails";
import { Star, X, MessageCircle, Calendar, Shield } from "lucide-react";
import { initiateSession } from "@/service/session/initiateSession";
import { ListenerDetails } from "@/lib/types";
import "@/styles/global.css";
interface ListenerModalProps {
  closeModal: () => void;
  userId: string;
}

const SendMessageModal: React.FC<{
  closeModal: () => void;
  userId: string;
}> = ({ closeModal, userId }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [alert, setAlert] = useState("");
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setAlert("Message cannot be empty.");
      return;
    }

    setIsSending(true);
    try {
      const response = await initiateSession(userId, message, token);
      if (response) {
        setAlert("Message sent successfully!");
        setMessage("");
        setTimeout(() => {
          setAlert("");
          closeModal();
        }, 3000);
      } else {
        setAlert("Unfortunately, the listener went offline. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setAlert("Unfortunately, the listener went offline. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

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
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Send Message
          </h2>
          <p className="text-gray-600">
            Share what&apos;s on your mind confidentially
          </p>
        </div>

        <form onSubmit={handleSendMessage}>
          <textarea
            className="w-full h-32 p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all resize-none"
            placeholder="Your message is private and secure..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className={`mt-4 w-full flex items-center justify-center space-x-2 ${
              isSending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-3 px-6 rounded-xl font-medium transition-all duration-200`}
            disabled={isSending}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{isSending ? "Sending..." : "Send Message"}</span>
          </button>
        </form>

        {alert && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              alert.includes("success")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {alert}
          </div>
        )}
      </div>
    </div>
  );
};

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
        const details = await getListenerDetails(userId, token);
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
            <Shield className="w-6 h-6 text-blue-500" />
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
          <div className="flex items-center justify-center h-40">
            <div className="loader" />
          </div>
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
