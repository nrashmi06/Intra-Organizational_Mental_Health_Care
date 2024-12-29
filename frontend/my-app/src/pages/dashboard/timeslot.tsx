import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Badge from "@/components/ui/badge";
import { Calendar, Clock, Plus } from "lucide-react";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { confirmTimeSlots } from '@/service/timeslot/confirmTimeSlots';
import { fetchTimeSlots } from '@/service/timeslot/fetchTimeSlots';
import deleteTimeSlots from '@/service/timeslot/deleteTimeSlots';
import updateTimeSlot from '@/service/timeslot/updateTimeSlot';
import deleteTimeSlotsById from '@/service/timeslot/deleteTimeSlotById';
import { TimeSelector } from '@/components/dashboard/timeslot/TimeSelector';

const TimeSlotPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlots, setSelectedSlots] = useState<Array<{ date: string; startTime: string; endTime: string; isAvailable: boolean }>>([]);
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [groupedSlots, setGroupedSlots] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    timeSlotId: string;
  } | null>(null);
  
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
      setIsModalOpen(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating time slot:', error);
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    try {
      await deleteTimeSlotsById(token, userID, id);
      alert('Time slot deleted successfully!');
      setIsModalOpen(false);
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
      <Card className="border-none  shadow-xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-800 to-lime-800 p-6 rounded-t-xl">
        <div className="flex items-center justify-center space-x-3 text-white text-xl">
          <Calendar className="w-7 h-7" />
          <span className="font-bold tracking-wide">Time Slot Manager</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Date Selection Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 group">
            <Label 
              htmlFor="startDate" 
              className="flex items-center gap-2 text-base font-medium group-hover:text-teal-700 transition-colors"
            >
              <Calendar className="w-5 h-5 text-teal-600" />
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                         hover:border-teal-400 transition-all duration-200"
            />
          </div>

          <div className="space-y-3 group">
            <Label 
              htmlFor="endDate" 
              className="flex items-center gap-2 text-base font-medium group-hover:text-lime-700 transition-colors"
            >
              <Calendar className="w-5 h-5 text-lime-600" />
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-2 rounded-lg p-3 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 
                         hover:border-lime-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Time Selection Section */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <Clock className="w-6 h-6 text-teal-600" />
            <h3 className="text-lg font-semibold">Time Selection</h3>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TimeSelector
              label="Start Time"
              selectedTime={newStartTime}
              onChange={setNewStartTime}
            />
            <TimeSelector
              label="End Time"
              selectedTime={newEndTime}
              onChange={setNewEndTime}
            />
            </div>
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddTimeSlot}
          className="w-full bg-gradient-to-r from-teal-800 to-lime-800 
                     hover:from-teal-700 hover:to-lime-700 
                     active:from-teal-900 active:to-lime-900
                     text-white py-6 rounded-lg text-lg font-semibold
                     shadow-md hover:shadow-lg
                     transform hover:-translate-y-0.5
                     transition-all duration-200
                     flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Time Slot
        </Button>
      </CardContent>
    </Card>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Selected Time Slots
              </span>
              <Badge variant="secondary">
                {selectedSlots.length} selected
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No time slots selected
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="p-4 bg-teal-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handleSlotSelection(slot)}
                  >
                    <div>{slot.startTime} - {slot.endTime}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={handleConfirmSelectedSlots}
                  className="w-full bg-gradient-to-r from-teal-800 to-green-800 hover:from-teal-900 hover:to-green-900 transition-all"
                >
                  Confirm Selected Slots
                </Button>
                <Button
                  onClick={handleClearSelectedSlots}
                  variant="outline"
                  className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50"
                >
                  Clear All Selected Time Slots
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>
            <div className='flex justify-left'>
              <Calendar className="w-6 h-6" />
              Available Time Slots
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
        <div className="space-y-4">
            {Object.entries(groupedSlots)
              .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()) // Sort dates in ascending order
              .map(([date, slots]) => (
                <div key={date} className="space-y-2">
                  <h3 className="font-semibold text-lg">{date}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(slots as Array<{ startTime: string; endTime: string; isAvailable: boolean; timeSlotId: string }>).map((slot, index) => {
                      const isSelected = selectedSlot && selectedSlot.timeSlotId === slot.timeSlotId;
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white hover:bg-gray-50 border-2 border-gray-200'
                          }`}
                          onClick={() => {
                            setSelectedSlot(slot);
                            console.log("slot selected : ", slot);
                            setNewStartTime(slot.startTime);
                            setNewEndTime(slot.endTime);
                            setIsModalOpen(true);
                          }}
                        >
                          <div className="text-center">
                            <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
                            <p className={`text-sm ${slot.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                              {slot.isAvailable ? 'Available' : 'Booked'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          {/* Modal for Update/Delete */}
          {isModalOpen && selectedSlot && (
            console.log("selected slot : ", selectedSlot),
            console.log("ID of selected slot : ", selectedSlot.timeSlotId),
            console.log("selected slot start time : ", selectedSlot.startTime), 
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Manage Time Slot</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="updateStartTime">Start Time</Label>
                    <Input
                      id="updateStartTime"
                      type="time"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="updateEndTime">End Time</Label>
                    <Input
                      id="updateEndTime"
                      type="time"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-4">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleUpdateTimeSlot(selectedSlot.timeSlotId , newStartTime , newEndTime) }
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => handleDeleteTimeSlot(selectedSlot.timeSlotId)}
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

TimeSlotPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default TimeSlotPage;
