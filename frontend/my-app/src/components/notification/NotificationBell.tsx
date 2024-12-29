import React, { useState } from "react";
import { Bell, MessageCircle, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/router";
import { setSessionId } from "@/store/chatSlice";
import { replyNotification } from "@/service/session/replyNotification";
import { clearStoredRequest } from "@/store/notificationSlice";

const NotificationBell: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
        console.log(`Redirecting to session: ${sessionID}`);
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
      {/* Notification Bell */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-5 right-5 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-40"
      >
        <Bell className="h-6 w-6 text-green-600" />
        {hasNotifications && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {notifications ? 1 : 0}
          </span>
        )}
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-50 ${
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 right-0 w-full sm:w-96 bg-white shadow-xl transition-transform duration-300 transform z-50 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {notifications && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Sender Info */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        User ID: {notifications.senderId}
                      </p>
                      <p className="text-sm text-gray-500">New session request</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="p-4 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-600">{notifications.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 flex gap-3">
                  <button
                    onClick={() =>
                      handleAction(
                        "accept",
                        notifications.senderId,
                        notifications.message
                      )
                    }
                    className="flex-1 bg-white border border-green-500 text-green-600 hover:bg-green-50 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() =>
                      handleAction(
                        "reject",
                        notifications.senderId,
                        notifications.message
                      )
                    }
                    className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {!hasNotifications && (
              <div className="text-center text-gray-500 py-8">
                <p>No notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationBell;