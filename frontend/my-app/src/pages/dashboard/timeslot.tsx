import React, { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { confirmTimeSlots } from "@/service/timeslot/confirmTimeSlots";
import { fetchTimeSlots } from "@/service/timeslot/fetchTimeSlots";
import deleteTimeSlots from "@/service/timeslot/deleteTimeSlots";
import updateTimeSlot from "@/service/timeslot/updateTimeSlot";
import deleteTimeSlotsById from "@/service/timeslot/deleteTimeSlotById";
import { TimeSlotManager } from "@/components/dashboard/timeslot/TimeSlotManager";
import { SelectedTimeSlots } from "@/components/dashboard/timeslot/SelectedTimeSlot";
import AvailableTimeSlotsCard from "@/components/dashboard/timeslot/AvailableTimeSlotsCard";
import Pagination from "@/components/ui/PaginationComponent";
import InlineLoader from "@/components/ui/inlineLoader";

// Error Message Component
const ErrorMessage = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
      <div className="flex justify-between items-center">
        <AlertDescription>{message}</AlertDescription>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-red-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Alert>
  );
};

const TimeSlotPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [selectedSlots, setSelectedSlots] = useState<
    Array<{
      date: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>
  >([]);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const userID = useSelector((state: RootState) => state.auth.userId);
  const timeSlots = useSelector((state: RootState) => state.timeSlots.timeSlots);
  const totalPages = useSelector(
    (state: RootState) => state.timeSlots.page?.totalPages ?? 0
  );

  const getEndDate = useCallback(() => {
    const today = new Date();
    const endDateFetch = new Date(today.setFullYear(today.getFullYear() + 2));
    return endDateFetch.toISOString().split("T")[0];
  }, []);

  const getStartDate = useCallback(() => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() - 1));
    return startDate.toISOString().split("T")[0];
  }, []);

  const groupSlots = useCallback((slots: any[]) => {
    return slots.reduce((acc: any, slot: any) => {
      acc[slot.date] = acc[slot.date] || [];
      acc[slot.date].push(slot);
      return acc;
    }, {});
  }, []);

  const fetchTimeSlotData = useCallback(async () => {
    if (!token || !userID) {
      setIsLoading(false);
      setError("Authentication required");
      return;
    }

    setIsLoading(true);
    setError(null);

    const today = new Date().toISOString().split("T")[0];
    const end = getEndDate();

    try {
      await dispatch(
        fetchTimeSlots(token, userID, today, end, isAvailable, currentPage - 1, 5)
      );
      setIsLoading(false);
    } catch (error) {
      setError("Error fetching time slots. Please try again.");
      setIsLoading(false);
      console.error("Error fetching time slots:", error);
    }
  }, [token, userID, currentPage, dispatch, getEndDate, isAvailable]);

  // Cleanup old slots
  useEffect(() => {
    const cleanupOldSlots = async () => {
      if (!token || !userID) return;

      const start = getStartDate();
      const end = new Date();
      end.setDate(end.getDate() - 1);
      const formattedEnd = end.toISOString().split("T")[0];

      try {
        await deleteTimeSlots(token, userID, start, formattedEnd);
      } catch (error) {
        console.error("Error cleaning up old slots:", error);
      }
    };

    cleanupOldSlots();
  }, [token, userID, getStartDate]);

  useEffect(() => {
    fetchTimeSlotData();
  }, [fetchTimeSlotData]);

  const handleUpdateTimeSlot = async (
    id: string,
    start: string,
    end: string
  ) => {
    try {
      await updateTimeSlot(token, userID, id, start, end);
      alert("Time slot updated successfully!");
      fetchTimeSlotData();
    } catch (error) {
      console.error("Error updating time slot:", error);
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    try {
      await deleteTimeSlotsById(token, userID, id);
      alert("Time slot deleted successfully!");
      fetchTimeSlotData();
    } catch (error) {
      console.error("Error deleting time slot:", error);
    }
  };

  const validateTimeSlot = useCallback(() => {
    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
      setValidationError("End date cannot be before start date");
      return false;
    }

    // Convert times to comparable format
    const start = new Date(`${startDate}T${newStartTime}`);
    const end = new Date(`${startDate}T${newEndTime}`);

    // Validate times
    if (end <= start) {
      setValidationError("End time must be after start time");
      return false;
    }

    // Check for overlaps with existing slots
    const isOverlapping = (
      startA: Date,
      endA: Date,
      startB: Date,
      endB: Date
    ) => {
      return startA < endB && startB < endA;
    };

    // Check against existing time slots
    const hasExistingOverlap = timeSlots?.some((slot) => {
      const existingStart = new Date(`${slot.date}T${slot.startTime}`);
      const existingEnd = new Date(`${slot.date}T${slot.endTime}`);
      return isOverlapping(start, end, existingStart, existingEnd);
    });

    if (hasExistingOverlap) {
      setValidationError("Time slot overlaps with existing slots");
      return false;
    }

    // Check against selected slots
    const hasSelectedOverlap = selectedSlots.some((slot) => {
      const selectedStart = new Date(`${slot.date}T${slot.startTime}`);
      const selectedEnd = new Date(`${slot.date}T${slot.endTime}`);
      return isOverlapping(start, end, selectedStart, selectedEnd);
    });

    if (hasSelectedOverlap) {
      setValidationError("Time slot overlaps with selected slots");
      return false;
    }

    return true;
  }, [startDate, endDate, newStartTime, newEndTime, timeSlots, selectedSlots]);

  const handleAddTimeSlot = useCallback(() => {
    if (newStartTime && newEndTime) {
      if (validateTimeSlot()) {
        setSelectedSlots((prev) => [
          ...prev,
          {
            date: startDate,
            startTime: newStartTime,
            endTime: newEndTime,
            isAvailable: true,
          },
        ]);
        setNewStartTime("");
        setNewEndTime("");
        setValidationError(null);
      }
    }
  }, [newStartTime, newEndTime, startDate, validateTimeSlot]);

  const handleSlotSelection = useCallback((slot: any) => {
    setSelectedSlots((prev) => {
      const isSelected = prev.some(
        (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
      );
      if (isSelected) {
        return prev.filter(
          (s) => s.startTime !== slot.startTime || s.endTime !== slot.endTime
        );
      }
      return [...prev, slot];
    });
  }, []);

  const handleConfirmSelectedSlots = async () => {
    try {
      await confirmTimeSlots(token, userID, selectedSlots, startDate, endDate);
      setSelectedSlots([]);
      alert("Selected time slots confirmed!");
      fetchTimeSlotData();
    } catch (error) {
      console.error("Error confirming time slots:", error);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={fetchTimeSlotData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const groupedSlots = timeSlots ? groupSlots(timeSlots) : {};

  return (
    <div className="container mx-auto p-6 space-y-6">
      {validationError && (
        <ErrorMessage 
          message={validationError} 
          onClose={() => setValidationError(null)} 
        />
      )}

      <TimeSlotManager
        startDate={startDate}
        endDate={endDate}
        newStartTime={newStartTime}
        newEndTime={newEndTime}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onStartTimeChange={setNewStartTime}
        onEndTimeChange={setNewEndTime}
        onAddTimeSlot={handleAddTimeSlot}
      />

      <SelectedTimeSlots
        selectedSlots={selectedSlots}
        onSlotSelection={handleSlotSelection}
        onConfirmSlots={handleConfirmSelectedSlots}
        onClearSlots={() => setSelectedSlots([])}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <InlineLoader />
        </div>
      ) : (
        <AvailableTimeSlotsCard
          groupedSlots={groupedSlots}
          handleUpdateTimeSlot={handleUpdateTimeSlot}
          handleDeleteTimeSlot={handleDeleteTimeSlot}
          setRefreshKey={fetchTimeSlotData}
          setIsAvailable={setIsAvailable}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

TimeSlotPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default TimeSlotPage;