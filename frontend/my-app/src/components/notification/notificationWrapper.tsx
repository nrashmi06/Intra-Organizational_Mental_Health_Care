import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setNotification } from "@/store/notificationSlice";
import { subscribeToNotifications } from "@/service/notification/subscribeNotification";
import NotificationPopup from "@/components/notification/NotificationPopup";
import NotificationBell from "./NotificationBell";
import { addEventSource, removeEventSource } from "@/store/eventsourceSlice";

const NotificationWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    if (accessToken && userId) {
      const onNotificationReceived = (message: string, senderId: string) => {
        dispatch(setNotification({ message, senderId }));
      };

      const eventSource = subscribeToNotifications(
        accessToken,
        parseInt(userId),
        onNotificationReceived
      );

      const eventSourceEntry = {
        id: "notificationSource",
        eventSource,
      };

      dispatch(addEventSource(eventSourceEntry));
      return () => {
        dispatch(removeEventSource("notificationSource"));
        eventSource.close();
      };
    }
  }, [accessToken, userId, dispatch]);

  return (
    <>
      <NotificationPopup />
      {children}
      <NotificationBell />
    </>
  );
};

export default NotificationWrapper;
