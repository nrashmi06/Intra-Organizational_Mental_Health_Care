import React from 'react';
import { format } from "date-fns";

interface CalendarHeaderProps {
  date: Date;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ date }) => (
  <div className="p-4 border-b flex justify-between items-center">
    <h2 className="text-xl font-semibold text-gray-800">
      {format(date, 'MMMM yyyy')}
    </h2>
  </div>
);