'use client';

import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onDateChange,
  className = "",
}) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const handleCalendarToggle = () => {
    setIsCalendarVisible((prev) => !prev); // Toggle calendar visibility
  };

  const handleDateSelect = (newDate: Date) => {
    onDateChange(newDate); // Pass selected date to parent
    setIsCalendarVisible(false); // Close calendar after date is selected
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={`w-[240px] justify-start flex text-left font-normal ${className}`}
        onClick={handleCalendarToggle}
      >

        <span><CalendarIcon className="mr-2 h-4 w-4" /></span>
        <span>{format(date, "PPP")}</span>
      </Button>

      {isCalendarVisible && (
        <div className="absolute z-50 mt-2 w-full sm:w-72 rounded-md border bg-white p-4 shadow-md max-w-full max-h-[90vh] overflow-auto">
          <Calendar
            selected={date}
            onSelect={handleDateSelect}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
