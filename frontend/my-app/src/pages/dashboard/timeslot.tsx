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

const TimeSlotPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlots, setSelectedSlots] = useState<Array<{ date: string; startTime: string; endTime: string; isAvailable: boolean }>>([]);
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [groupedSlots, setGroupedSlots] = useState<any>({});
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const userID = useSelector((state: RootState) => state.auth.userId);
  const timeSlots = useSelector((state: RootState) => state.timeSlots.timeSlots);

  const getEndDate = () => {
    const today = new Date();
    const endDateFetch = new Date(today.setFullYear(today.getFullYear() + 2));
    return endDateFetch.toISOString().split('T')[0];
  };

  const getStartDate = () => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() - 1));
    return startDate.toISOString().split('T')[0];
  }

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const end = getEndDate();
    
    if (token && userID) {
      dispatch(fetchTimeSlots(token, userID, today, end, true, 0, 100))
        .then(() => {
          // Group the time slots by date after they're loaded from Redux
          const groupedConfirmedSlots = timeSlots.reduce((acc: any, slot: any) => {
            acc[slot.date] = acc[slot.date] || [];
            acc[slot.date].push(slot);
            return acc;
          }, {});
          setGroupedSlots(groupedConfirmedSlots);
        })
        .catch((error: any) => {
          console.error('Error fetching time slots:', error);
        });
    }
  }, [dispatch, token, userID, refreshKey]);

  useEffect(() => {
    const start = getStartDate();
    const end = new Date();
    end.setDate(end.getDate() - 1);
    const formattedEnd = end.toISOString().split('T')[0];

    if (token && userID) {
      deleteTimeSlots(token, userID, start, formattedEnd);
    }
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


  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const end = getEndDate();
    const fetchData = async () => {
      try {
        await dispatch(fetchTimeSlots(token, userID, today, end, true, 0, 100));

        const groupedConfirmedSlots = timeSlots.reduce((acc: any, slot: any) => {
          acc[slot.date] = acc[slot.date] || [];
          acc[slot.date].push(slot);
          return acc;
        }, {});
        setGroupedSlots(groupedConfirmedSlots);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [refreshKey]);

  useEffect(() => {
    const start = getStartDate();
    const end = new Date();
    end.setDate(end.getDate() - 1);
    const formattedEnd = end.toISOString().split('T')[0];

    deleteTimeSlots(token,userID, start, formattedEnd); // Delete old slots
  }, []);

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

<AvailableTimeSlotsCard
      groupedSlots={groupedSlots}
      handleUpdateTimeSlot={handleUpdateTimeSlot}
      handleDeleteTimeSlot={handleDeleteTimeSlot}
      setRefreshKey={setRefreshKey}
    />
    </div>
  );
};

TimeSlotPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default TimeSlotPage;
