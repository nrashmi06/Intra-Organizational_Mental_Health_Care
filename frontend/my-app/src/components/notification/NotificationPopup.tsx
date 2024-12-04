import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { X } from "lucide-react"; // Import close icon
import { clearNotifications } from "@/store/notificationSlice"; // Replace with your actual action
import { replyNotification } from "@/service/session/replyNotification"; // Assuming API utility exists
import { useRouter } from "next/router";
import { setSessionId } from "@/store/chatSlice"; // Assuming the action exists to store sessionID in Redux

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

  // Handle OK button action
  const handleOk = (senderId: string) => {
    // Reset OK button visibility for this notification
    setShowOkButton((prevState) => ({
      ...prevState,
      [senderId]: false,
    }));
    dispatch(clearNotifications());
    setShowOkButton({}); // Reset the state when closing
  };

  // Check if session ID is available and allow the user to join the session directly
  const handleJoinSession = (message: string) => {
    const sessionIdMatch = message.match(/Session ID:(\d+)/);
    if (sessionIdMatch && sessionIdMatch[1]) {
      const sessionID = sessionIdMatch[1];
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

          return (
            <div key={index} className="mb-4">
              <p>{message}</p>

              {/* Listener buttons: Accept/Reject */}
              {role === "LISTENER" && !isOkVisible && (
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

              {/* OK button for Listener after taking action */}
              {role === "LISTENER" && isOkVisible && (
                <div className="mt-4">
                  <button
                    onClick={() => handleOk(senderId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    OK
                  </button>
                </div>
              )}

              {/* OK button for other roles */}
              {role !== "LISTENER" && (
                <button
                  onClick={handleClose}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  OK
                </button>
              )}

              {/* If session ID is found in the notification, allow joining the session */}
              <div className="mt-4">
                <button
                  onClick={() => handleJoinSession(message)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                >
                  Join Session
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPopup;
