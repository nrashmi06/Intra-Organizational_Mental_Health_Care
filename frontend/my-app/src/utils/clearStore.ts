import { useDispatch, useSelector } from "react-redux";
import { clearDetailedApplication } from "@/store/detailedApplicationSlice";
import { clearAppointments } from "@/store/appointmentSlice";
import { clearTimeSlots } from "@/store/timeSlotSlice";
import { clearNotifications } from "@/store/notificationSlice";
import { clearUser } from "@/store/authSlice";
import { clearHelplines } from "@/store/emergencySlice";
import { clearEventSources } from "@/store/eventsourceSlice";
import type { RootState } from "@/store";
import { clearListeners } from "@/store/listenerSlice";

export default function useClearStore() {
  const dispatch = useDispatch();
  const eventSourceConnections = useSelector(
    (state: RootState) => state.Source.connections
  );

  const clearStore = () => {
    dispatch(clearDetailedApplication());
    dispatch(clearAppointments());
    dispatch(clearTimeSlots());

    if (eventSourceConnections.length > 0) {
      dispatch(clearEventSources());
    }

    dispatch(clearNotifications());
    dispatch(clearUser());
    dispatch(clearHelplines());
    dispatch(clearListeners());
  };

  return clearStore;
}
