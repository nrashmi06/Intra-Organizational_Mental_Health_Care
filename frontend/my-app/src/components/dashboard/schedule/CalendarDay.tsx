import React from 'react';
import { format, parseISO } from "date-fns";
import { CalendarDayProps } from '@/lib/types';
import { getStatusColor } from '@/components/dashboard/schedule/Calendar';

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  appointments,
  onSelectDay,
}) => (
  <div
    onClick={() => onSelectDay(day)}
    className={`
      min-h-[100px] md:min-h-[150px] 
      border-b border-r border-gray-200
      transition-all duration-200
      cursor-pointer
      ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
      ${isSelected ? 'bg-blue-50' : ''}
      ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
      hover:bg-gray-50
    `}
  >
    <div className={`
      p-2 text-right
      ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
    `}>
      <span className="text-sm font-medium">{format(day, 'd')}</span>
      {appointments.length > 0 && (
        <div className="md:hidden mt-1 text-xs font-medium text-blue-600">
          {appointments.length} task{appointments.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>

    <div className="hidden md:block p-1 space-y-1">
      {appointments.slice(0, 2).map((apt, idx) => (
        <div
          key={idx}
          className="text-xs p-1 rounded"
          style={{ 
            backgroundColor: getStatusColor(apt.status) ,
            borderLeft: `2px solid ${getStatusColor(apt.status)}`
          }}
        >
          {format(parseISO(`2024-01-01T${apt.startTime}`), 'h:mm a')}
        </div>
      ))}
      {appointments.length > 2 && (
        <div className="text-xs text-blue-600 p-1">
          +{appointments.length - 2} more
        </div>
      )}
    </div>
  </div>
);
