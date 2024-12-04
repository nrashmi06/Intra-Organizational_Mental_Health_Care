import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setNotification } from '@/store/notificationSlice';
import { subscribeToNotifications } from '@/service/notification/subscribeNotification';
import NotificationPopup from '@/components/notification/NotificationPopup';


const NotificationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.userId);
  

  useEffect(() => {
    if (accessToken && userId) {
      const onNotificationReceived = (message: string, senderId: string) => {
        // Dispatch both the message and senderId in the notification
        dispatch(setNotification({ message, senderId }));
      };

      // Subscribe to notifications and pass the callback
      const eventSource = subscribeToNotifications(accessToken, parseInt(userId), onNotificationReceived);

      // Clean up the event source when component unmounts
      return () => {
        eventSource.close();
      };
    }
  }, [accessToken, userId, dispatch]);

  return (
    <>
      <NotificationPopup />
      {children}
    </>
  );
};

export default NotificationWrapper;
