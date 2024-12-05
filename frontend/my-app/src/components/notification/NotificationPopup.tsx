import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { X } from "lucide-react"; // Import close icon
import { clearNotifications } from "@/store/notificationSlice"; // Action to clear notifications
import { replyNotification } from "@/service/session/replyNotification"; // Assuming API utility exists
import { useRouter } from "next/router";
import { setSessionId, clearSessionId } from "@/store/chatSlice"; // Assuming actions exist

const NotificationPopup: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch notifications, role, access token, and userId from Redux
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const role = useSelector((state: RootState) => state.auth.role);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // State to manage OK button visibility for each notification
  const [showOkButton, setShowOkButton] = useState<{ [key: string]: boolean }>({});

  // Close the notification popup
  const handleClose = () => {
    dispatch(clearNotifications());
    setShowOkButton({}); // Reset the state when closing
  };

  // Handle accept or reject actions
  const handleAction = async (action: "accept" | "reject", senderId: string, message: string) => {
    try {
      if (!accessToken || !senderId) {
        console.error("Authorization token or senderId is missing.");
        return;
      }
      dispatch(clearNotifications());

      const response = await replyNotification(senderId, action, accessToken);
      console.log(`Session ${action} response:`, response);

      // Extract session ID from the message (assuming the format is "Session ID: <id>")
      const sessionIdMatch = message.match(/Session ID:(\d+)/);
      if (sessionIdMatch && sessionIdMatch[1]) {
        const sessionID = sessionIdMatch[1];
        console.log(`Extracted Session ID: ${sessionID}`);

        // Store session ID in Redux
        dispatch(setSessionId(sessionID));

        // Redirect to the chat page
        router.push(`/chat/${sessionID}`);

        // After action is taken, show OK button for this notification
        setShowOkButton((prevState) => ({
          ...prevState,
          [senderId]: true,
        }));
      }
    } catch (error) {
      console.error(`Failed to ${action} session:`, error);
    }
  };

  // Handle OK button action for "Session Ended" notifications
  const handleOk = (senderId: string, message: string) => {
    // Check if the message indicates session end
    if (message.includes("Session with ID")) {
      // Clear session ID from Redux store
      
      
      // Redirect to the appropriate page
      if (role === "LISTENER") {
        router.push("/listener-report");
      } else {
        router.push("/feedback");
      }
    }

    // Reset OK button visibility for this notification
    setShowOkButton((prevState) => ({
      ...prevState,
      [senderId]: false,
    }));

    dispatch(clearNotifications());
  };

  // Handle Join Session action for both users and listeners
  const handleJoinSession = (message: string) => {
    const sessionIdMatch = message.match(/Session ID:(\d+)/);
    if (sessionIdMatch && sessionIdMatch[1]) {
      const sessionID = sessionIdMatch[1];
      dispatch(clearNotifications());
      dispatch(setSessionId(sessionID));
      router.push(`/chat/${sessionID}`);
    }
  };

  if (notifications.length === 0) return null; // Don't render if no notifications

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="relative bg-blue-500 text-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Render notifications */}
        {notifications.map((notification, index) => {
          const { message, senderId } = notification;
          const isOkVisible = showOkButton[senderId];

          // Check if session ID is in the message, and only show the "Join Session" button
          const sessionIdMatch = message.match(/Session ID:(\d+)/);
          const isSessionEnded = message.includes("Session with ID");

          return (
            <div key={index} className="mb-4">
              <p>{message}</p>

              {/* Show Join Session button if session ID is found */}
              {sessionIdMatch && !isSessionEnded && (
                <div className="mt-4">
                  <button
                    onClick={() => handleJoinSession(message)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Join Session
                  </button>
                </div>
              )}

              {/* Listener buttons: Accept/Reject if session ID is not found and not ended */}
              {!sessionIdMatch && !isSessionEnded && role === "LISTENER" && !isOkVisible && (
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => handleAction("accept", senderId, message)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction("reject", senderId, message)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* OK button for Listener after taking action or when session ends */}
              {role === "LISTENER" && (isOkVisible || isSessionEnded) && (
                <div className="mt-4">
                  <button
                    onClick={() => handleOk(senderId, message)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    OK
                  </button>
                </div>
              )}

              {/* OK button for other roles (users) */}
              {role !== "LISTENER" && !isSessionEnded && (
                <button
                  onClick={() => handleOk(senderId, message)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  OK
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPopup;
