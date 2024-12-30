import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { confirmTimeSlots } from '@/service/timeslot/confirmTimeSlots';
import { fetchTimeSlots } from '@/service/timeslot/fetchTimeSlots';
import deleteTimeSlots from '@/service/timeslot/deleteTimeSlots';
import updateTimeSlot from '@/service/timeslot/updateTimeSlot';
import deleteTimeSlotsById from '@/service/timeslot/deleteTimeSlotById';
import { TimeSlotManager } from '@/components/dashboard/timeslot/TimeSlotManager';
import { SelectedTimeSlots } from '@/components/dashboard/timeslot/SelectedTimeSlot';
import AvailableTimeSlotsCard from '@/components/dashboard/timeslot/AvailableTimeSlotsCard';
import Pagination from '@/components/ui/PaginationComponent';
import InlineLoader from "@/components/ui/inlineLoader";

const TimeSlotPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlots, setSelectedSlots] = useState<Array<{ date: string; startTime: string; endTime: string; isAvailable: boolean }>>([]);
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupedSlots, setGroupedSlots] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const userID = useSelector((state: RootState) => state.auth.userId);
  const timeSlots = useSelector((state: RootState) => state.timeSlots.timeSlots);
  const totalPages = useSelector((state: RootState) => state.timeSlots.page?.totalPages ?? 0);

  const getEndDate = () => {
    const today = new Date();
    const endDateFetch = new Date(today.setFullYear(today.getFullYear() + 2));
    return endDateFetch.toISOString().split('T')[0];
  };

  const getStartDate = () => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() - 1));
    return startDate.toISOString().split('T')[0];
  };

  useEffect(() => {

    const fetchAndGroupSlots = async () => {
      if (!token || !userID) {
        setIsLoading(false);
        setError('Authentication required');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      const today = new Date().toISOString().split('T')[0];
      const end = getEndDate();
      
      try {
        await dispatch(fetchTimeSlots(token, userID, today, end, true, currentPage-1, 5));
        
        if (timeSlots) {
          const groupedConfirmedSlots = timeSlots.reduce((acc: any, slot: any) => {
            acc[slot.date] = acc[slot.date] || [];
            acc[slot.date].push(slot);
            return acc;
          }, {});
          
          setGroupedSlots(groupedConfirmedSlots);
          setIsLoading(false);
        }
      } catch (error) {
        if (!groupedSlots) {
          setError('Error fetching time slots. Please try again.');
          setIsLoading(false);
        }
        console.error('Error fetching time slots:', error);
      }
    };
  
    fetchAndGroupSlots();

  }, [dispatch, token, userID, refreshKey, currentPage, timeSlots]); 

  useEffect(() => {
    const cleanupOldSlots = async () => {
      if (!token || !userID) return;

      const start = getStartDate();
      const end = new Date();
      end.setDate(end.getDate() - 1);
      const formattedEnd = end.toISOString().split('T')[0];

      try {
        await deleteTimeSlots(token, userID, start, formattedEnd);
      } catch (error) {
        console.error('Error cleaning up old slots:', error);
      }
    };

    cleanupOldSlots();
  }, [token, userID]);

  const handleUpdateTimeSlot = async (id: string, start: string, end: string) => {
    try {
      await updateTimeSlot(token, userID, id, start, end);
      alert('Time slot updated successfully!');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating time slot:', error);
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    try {
      await deleteTimeSlotsById(token, userID, id);
      alert('Time slot deleted successfully!');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting time slot:', error);
    }
  };

  const handleAddTimeSlot = () => {
    if (newStartTime && newEndTime) {
      const newSlot = {
        date: startDate,
        startTime: newStartTime,
        endTime: newEndTime,
        isAvailable: true
      };
      setSelectedSlots([...selectedSlots, newSlot]);
      setNewStartTime('');
      setNewEndTime('');
    }
  };

  const handleSlotSelection = (slot: any) => {
    const isSelected = selectedSlots.some(s => s.startTime === slot.startTime && s.endTime === slot.endTime);
    if (isSelected) {
      setSelectedSlots(selectedSlots.filter(s => s.startTime !== slot.startTime || s.endTime !== slot.endTime));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleClearSelectedSlots = () => {
    setSelectedSlots([]);
  };

  const handleConfirmSelectedSlots = async () => {
    try {
      const response = await confirmTimeSlots(token,userID, selectedSlots, startDate, endDate);
      console.log(response);
      setSelectedSlots([]);
      alert('Selected time slots confirmed!');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error confirming time slots:', error);
    }
  };
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">{error}</p>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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
        onClearSlots={handleClearSelectedSlots}
      />

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <InlineLoader  />
        </div>
      ) : (
        <AvailableTimeSlotsCard
          key={JSON.stringify(groupedSlots)}
          groupedSlots={{...groupedSlots}}
          handleUpdateTimeSlot={handleUpdateTimeSlot}
          handleDeleteTimeSlot={handleDeleteTimeSlot}
          setRefreshKey={setRefreshKey}
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