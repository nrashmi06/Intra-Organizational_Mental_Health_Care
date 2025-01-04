import axiosInstance from "@/utils/axios";
import { TIME_SLOT_API_ENDPOINTS } from "@/mapper/timeslotMapper";

const handleDeleteTimeSlot = async (
  token: string,
  userID: string | null,
  timeSlotId: string
) => {
  try {
    if (!userID) {
      throw new Error("User ID is required to delete the time slot.");
    }

    const url = `${TIME_SLOT_API_ENDPOINTS.DELETE_TIME_SLOT_BY_ID(userID, timeSlotId)}?idType=userId`;
    const response = await axiosInstance.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      console.error("Error deleting time slot:", response.data);
      return
    }

    return { message: "Time slot deleted successfully." };
  } catch (error) {
    console.error("Error deleting time slot:", error);
    return { message: "An error occurred while deleting the time slot." };
  }
};

export default handleDeleteTimeSlot;
