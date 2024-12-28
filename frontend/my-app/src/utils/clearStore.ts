// useClearStore.ts
import { useDispatch } from "react-redux";
import { clearDetailedApplication } from "@/store/detailedApplicationSlice";

export default function useClearStore() {
  const dispatch = useDispatch();

  // Dispatch action to clear the detailed application
  const clearStore = () => {
    dispatch(clearDetailedApplication());
  };

  return clearStore;
}
