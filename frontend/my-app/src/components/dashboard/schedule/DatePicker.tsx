import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { createPortal } from "react-dom";

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
    setIsCalendarVisible((prev) => !prev);
  };

  const handleDateSelect = (newDate: Date) => {
    onDateChange(newDate);
    setIsCalendarVisible(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={`${className}`}
        onClick={handleCalendarToggle}
      >
        <CalendarIcon className="h-4 w-4" />
        <span className="hidden sm:inline-block sm:ml-2">
          {format(date, "PPP")}
        </span>
      </Button>

      {isCalendarVisible &&
        createPortal(
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-[9999]"
              onClick={() => setIsCalendarVisible(false)}
            />

            {/* Calendar Container */}
            <div className="fixed z-[9999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[320px] rounded-lg border bg-white p-4 shadow-lg">
              <Calendar
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border-none"
              />
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

export default DatePicker;
