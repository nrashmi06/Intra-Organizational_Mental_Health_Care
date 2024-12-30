// useClearStore.ts
import { useDispatch } from "react-redux";
import { clearDetailedApplication } from "@/store/detailedApplicationSlice";
import { clearAppointments } from "@/store/appointmentSlice";
import { clearTimeSlots } from "@/store/timeSlotSlice";

export default function useClearStore() {
  const dispatch = useDispatch();

  // Dispatch action to clear the detailed application
  const clearStore = () => {
    dispatch(clearDetailedApplication());
    dispatch(clearAppointments());
    dispatch(clearTimeSlots());
  };

  return clearStore;
}
