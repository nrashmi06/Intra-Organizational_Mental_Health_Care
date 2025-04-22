import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getListenerDetails } from "@/service/listener/getListenerDetails";
import { Star, X, MessageCircle, Calendar, Shield, Headphones, ThumbsUp, Eye, BookOpen } from "lucide-react";
import { ListenerDetails } from "@/lib/types";
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
  const [detailedListener, setDetailedListener] = useState<ListenerDetails | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [sendMessage, setSendMessage] = useState(false);

  useEffect(() => {
    if (detailedListener) return;
    const fetchListenerDetails = async () => {
      try {
        const details = await getListenerDetails(userId, token, "userId");
        setDetailedListener(details as ListenerDetails);
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
          size={16}
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
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-2 md:p-4"
      onClick={closeModal}
    >
      <div
        className="bg-white max-w-xl w-full rounded-xl shadow-xl p-3 md:p-6 relative my-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Headphones className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
          </div>
          <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
            Listener Details
          </h2>
        </div>

        {detailedListener ? (
          <div className="space-y-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              {[
                { 
                  label: "Email",
                  value: "*******@gmail.com",
                  icon: <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                },
                {
                  label: "Total Sessions",
                  value: detailedListener.totalSessions,
                  icon: <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                },
                {
                  label: "Messages Sent",
                  value: detailedListener.totalMessagesSent ?? "N/A",
                  icon: <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                },
                {
                  label: "Feedback Count",
                  value: detailedListener.feedbackCount,
                  icon: <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                },
                {
                  label: "Joined At",
                  value: new Date(detailedListener.joinedAt).toLocaleDateString(
                    undefined,
                    { year: "numeric", month: "long", day: "numeric" }
                  ),
                  icon: <Calendar className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                },
                {
                  label: "Approved By",
                  value: detailedListener.approvedBy,
                  icon: <Shield className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                },
                {
                  label: "Blogs Published",
                  value: detailedListener.totalBlogsPublished,
                  icon: <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                },
                {
                  label: "Blog Likes",
                  value: detailedListener.totalBlogLikesReceived,
                  icon: <ThumbsUp className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                },
                {
                  label: "Blog Views",
                  value: detailedListener.totalBlogViewsReceived,
                  icon: <Eye className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                },
                {
                  label: "Can Approve Blogs",
                  value: detailedListener.canApproveBlogs ? "Yes" : "No",
                  icon: <Shield className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <p className="font-medium text-gray-900 text-xs md:text-base">{item.label}</p>
                  </div>
                  <p className="text-gray-700 text-xs md:text-base">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center p-2 md:p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-gray-900 text-xs md:text-base">Average Rating:</p>
              <div className="flex space-x-1">
                {renderRatingStars(detailedListener.averageRating)}
              </div>
            </div>
          </div>
        ) : (
          <InlineLoader height="h-72"/>
        )}

        <button
          onClick={() => setSendMessage(true)}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 px-4 md:px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base"
        >
          <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
          <span>Request a Session</span>
        </button>
      </div>
    </div>
  );
};

export default ListenerModal;