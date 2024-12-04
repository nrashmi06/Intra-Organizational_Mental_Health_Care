import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { X } from "lucide-react"; // Import close icon
import { clearNotifications } from "@/store/notificationSlice"; // Replace with your actual action

const NotificationPopup: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notification.notifications);

  if (notifications.length === 0) return null;

  const handleClose = () => {
    dispatch(clearNotifications()); // Dispatch action to clear notifications
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="relative bg-blue-500 text-white p-6 rounded-lg shadow-lg text-center mb-4 max-w-md w-full">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {notifications.map((message, index) => {
          const messageContent = typeof message === "string" ? message : JSON.stringify(message);

          return (
            <p key={index} className="mb-2">
              {messageContent}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPopup;
