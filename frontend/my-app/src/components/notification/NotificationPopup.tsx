import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { X } from 'lucide-react'; // Import close icon
import { clearNotifications } from '@/store/notificationSlice'; // Replace with your actual action
import { replyNotification } from '@/service/session/replyNotification'; // Assuming API utility exists

const NotificationPopup: React.FC = () => {
  const dispatch = useDispatch();

  // Fetch notifications, role, access token, and userId from Redux
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const role = useSelector((state: RootState) => state.auth.role);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Close the notification popup
  const handleClose = () => {
    dispatch(clearNotifications());
  };

  // Handle accept or reject actions
  const handleAction = async (action: "accept" | "reject", senderId: string) => {
    try {
      if (!accessToken || !senderId) {
        console.error("Authorization token or senderId is missing.");
        return;
      }

      const response = await replyNotification(senderId, action, accessToken);
      console.log(`Session ${action} response:`, response);
      dispatch(clearNotifications()); // Clear notifications after action
    } catch (error) {
      console.error(`Failed to ${action} session:`, error);
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

          return (
            <div key={index} className="mb-4">
              <p>{message}</p>
              {role === "LISTENER" && (
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => handleAction("accept", senderId)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction("reject", senderId)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* OK button for non-LISTENER roles */}
        {role !== "LISTENER" && (
          <button
            onClick={handleClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
