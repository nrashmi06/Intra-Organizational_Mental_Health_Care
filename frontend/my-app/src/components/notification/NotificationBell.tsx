import React, { useState } from "react";
import { Bell, MessageCircle, User, X, Check, XCircle, AlertCircle, ChevronRight, Sparkles } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/router";
import { setSessionId } from "@/store/chatSlice";
import { replyNotification } from "@/service/session/replyNotification";
import { clearStoredRequest } from "@/store/notificationSlice";

const NotificationBell: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const notifications = useSelector(
    (state: RootState) => state.notification.storedSessionRequest
  );

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleAction = async (
    action: "accept" | "reject",
    senderId: string,
    message: string
  ) => {
    try {
      if (!accessToken || !senderId) {
        console.error("Authorization token or senderId is missing.");
        return;
      }

      const response = await replyNotification(senderId, action, accessToken);
      console.log(`Session ${action} response:`, response);

      const sessionIdMatch = message.match(/Session ID:(\d+)/);
      const sessionID = sessionIdMatch?.[1];

      dispatch(clearStoredRequest());

      if (action === "accept" && sessionID) {
        dispatch(setSessionId(sessionID));
        setIsDrawerOpen(false);
        router.push(`/chat/${sessionID}`);
      } else {
        setIsDrawerOpen(false);
      }
    } catch (error) {
      console.error(`Failed to ${action} session:`, error);
    }
  };

  const hasNotifications = !!notifications;
  if (!hasNotifications) return null;

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-5 right-5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-4 shadow-lg transition-all duration-300 z-40 
          ${isHovered ? 'scale-110 shadow-xl' : ''}`}
      >
        <Bell className="h-6 w-6 text-white" />
        {hasNotifications && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center animate-pulse">
            <Sparkles className="h-4 w-4" />
          </span>
        )}
      </button>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-50 
          ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div
        className={`fixed top-0 bottom-0 right-0 w-full sm:w-96 bg-gradient-to-b from-white to-gray-50 shadow-2xl transition-transform duration-300 transform z-50 
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b bg-gradient-to-r from-purple-500 to-indigo-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-white" />
                <h3 className="text-xl font-bold text-white">Notifications</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {notifications && (
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-102">
                <div className="p-6 border-b border-purple-100">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-full">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        User ID: {notifications.senderId}
                      </p>
                      <div className="flex items-center space-x-2 text-purple-500">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm">New session request</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-purple-50">
                  <div className="flex items-start space-x-4">
                    <MessageCircle className="h-5 w-5 text-purple-500 mt-1" />
                    <p className="text-gray-700 break-words break-all leading-relaxed">
                      {notifications.message}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <button
                    onClick={() =>
                      handleAction(
                        "accept",
                        notifications.senderId,
                        notifications.message
                      )
                    }
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-102 flex items-center justify-center space-x-2"
                  >
                    <Check className="h-5 w-5" />
                    <span>Accept Request</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      handleAction(
                        "reject",
                        notifications.senderId,
                        notifications.message
                      )
                    }
                    className="w-full bg-white border-2 border-red-500 text-red-500 py-3 px-6 rounded-lg transition-all duration-300 hover:bg-red-50 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="h-5 w-5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            )}

            {!hasNotifications && (
              <div className="text-center text-gray-500 py-8 space-y-3">
                <Bell className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-lg font-medium">No notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationBell;


