import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { X, RotateCcw } from "lucide-react";
import {
  clearNotifications,
  hidePopup,
  showPopup,
  clearStoredRequest,
} from "@/store/notificationSlice";
import { replyNotification } from "@/service/session/replyNotification";
import { useRouter } from "next/router";
import { setSessionId } from "@/store/chatSlice";

const NotificationPopup: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const notifications = useSelector(
    (state: RootState) => state.notification.visibleNotifications
  );
  const storedRequest = useSelector(
    (state: RootState) => state.notification.storedSessionRequest
  );
  const isPopupVisible = useSelector(
    (state: RootState) => state.notification.isPopupVisible
  );
  const role = useSelector((state: RootState) => state.auth.role);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [showOkButton, setShowOkButton] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (notifications.length > 0 && isPopupVisible) {
      const audio = new Audio("/pop.mp3");
      audio.play().catch((err) => console.error("Failed to play sound:", err));
    }
  }, [notifications, isPopupVisible]);

  const handleClose = () => {
    const currentNotification = notifications[0];
    if (
      currentNotification &&
      currentNotification.message.includes("User ID:") &&
      !currentNotification.message.includes("accepted") &&
      !currentNotification.message.includes("rejected") &&
      !currentNotification.message.includes("ended")
    ) {
      // Only hide the popup for session requests
      dispatch(hidePopup());
    } else {
      // Clear everything for other types of notifications
      dispatch(clearNotifications());
    }
    setShowOkButton({});
  };

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

      // Clear everything as the request has been handled
      dispatch(clearStoredRequest());
      if (action === "reject") {
        dispatch(clearNotifications());
      }

      const sessionIdMatch = message.match(/Session ID:(\d+)/);
      if (sessionIdMatch && sessionIdMatch[1]) {
        const sessionID = sessionIdMatch[1];
        console.log(`Extracted Session ID: ${sessionID}`);

        dispatch(setSessionId(sessionID));
        router.push(`/chat/${sessionID}`);
        setShowOkButton((prevState) => ({
          ...prevState,
          [senderId]: true,
        }));
      }
    } catch (error) {
      console.error(`Failed to ${action} session:`, error);
    }
  };

  const handleOk = (senderId: string, message: string) => {
    if (message.includes("Session with ID")) {
      if (role === "LISTENER") {
        router.push("/listener-report");
      } else {
        router.push("/feedback");
      }
    }

    setShowOkButton((prevState) => ({
      ...prevState,
      [senderId]: false,
    }));

    dispatch(clearNotifications());
  };

  const handleJoinSession = (message: string) => {
    const sessionIdMatch = message.match(/Session ID:(\d+)/);
    if (sessionIdMatch && sessionIdMatch[1]) {
      const sessionID = sessionIdMatch[1];
      dispatch(clearStoredRequest());
      dispatch(clearNotifications());
      dispatch(setSessionId(sessionID));
      router.push(`/chat/${sessionID}`);
    }
  };

  const getNotificationContent = (message: string) => {
    if (message.includes("rejected")) {
      return {
        title: "Session Request Rejected",
        details: "",
      };
    } else if (message.includes("accepted")) {
      return {
        title: "Session Request Accepted",
        details: "",
      };
    } else if (message.includes("ended")) {
      return {
        title: "Session Ended",
        details: "",
      };
    }
    return {
      title: "A user is requesting a session with you!",
      details: "They have sent the message:",
    };
  };

  if (!isPopupVisible || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end justify-end z-[9999] space-y-2">
      {/* Restore button - only show if there's a stored request and popup is hidden */}
      {!isPopupVisible && storedRequest && (
        <button
          onClick={() => dispatch(showPopup())}
          className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full shadow-lg"
          aria-label="Restore notification"
        >
          <RotateCcw size={20} />
        </button>
      )}

      <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 p-6 rounded-lg shadow-lg w-80 backdrop-blur-sm border border-gray-300 space-y-4 animate-slide-in-up">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-purple-700">
            Notification
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {notifications.map((notification, index) => {
          const { message, senderId } = notification;
          const { title, details } = getNotificationContent(message);
          const isOkVisible = showOkButton[senderId];
          const sessionIdMatch = message.match(/Session ID:(\d+)/);
          const isSessionEnded = message.includes("Session with ID");

          return (
            <div key={index} className="space-y-4">
              <p className="text-base font-semibold">{title}</p>
              <div className="text-sm text-gray-700 mt-2">
                <p>{details}</p>
                <div className="mt-2 flex items-start space-x-2">
                  <p className="italic break-words break-all">{message}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {sessionIdMatch && !isSessionEnded && (
                  <button
                    onClick={() => handleJoinSession(message)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium"
                  >
                    Join Session
                  </button>
                )}

                {!sessionIdMatch &&
                  !isSessionEnded &&
                  role === "LISTENER" &&
                  !isOkVisible && (
                    <div className="flex justify-between space-x-2">
                      <button
                        onClick={() =>
                          handleAction("accept", senderId, message)
                        }
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleAction("reject", senderId, message)
                        }
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                {(isOkVisible || isSessionEnded) && (
                  <button
                    onClick={() => handleOk(senderId, message)}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
                  >
                    OK
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPopup;