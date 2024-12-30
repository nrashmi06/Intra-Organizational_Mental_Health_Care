import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus } from "lucide-react";
import { DateSelector } from './DateSelector';
import { TimeSelector } from './TimeSelector';

interface TimeSlotManagerProps {
  startDate: string;
  endDate: string;
  newStartTime: string;
  newEndTime: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onAddTimeSlot: () => void;
}

export const TimeSlotManager = ({
  startDate,
  endDate,
  newStartTime,
  newEndTime,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onAddTimeSlot,
}: TimeSlotManagerProps) => {
  return (
    <Card className="border-none shadow-xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-800 to-lime-800 p-6 rounded-t-xl">
        <div className="flex items-center justify-center space-x-3 text-white text-xl">
          <Calendar className="w-7 h-7" />
          <span className="font-bold tracking-wide">Time Slot Manager</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Date Selection Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DateSelector
            id="startDate"
            label="Start Date"
            value={startDate}
            onChange={onStartDateChange}
            accentColor="teal"
          />
          <DateSelector
            id="endDate"
            label="End Date"
            value={endDate}
            onChange={onEndDateChange}
            accentColor="lime"
          />
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
              onChange={onStartTimeChange}
            />
            <TimeSelector
              label="End Time"
              selectedTime={newEndTime}
              onChange={onEndTimeChange}
            />
          </div>
        </div>

        {/* Add Button */}
        <Button
          onClick={onAddTimeSlot}
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
  );
};
