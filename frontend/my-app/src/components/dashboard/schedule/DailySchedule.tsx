import React from 'react';
import { format, parseISO, addMinutes } from 'date-fns';
import { Appointment } from '@/lib/types';
import TimeSlotCell from '@/components/dashboard/schedule/TimeSlotCell';

const DailySchedule: React.FC<{ appointments: Appointment[]; date: Date }> = ({
  appointments,
  date,
}) => {
  // Generate time slots for every 30 minutes from 7AM to 9PM
  const timeSlots = Array.from({ length: 40 }, (_, i) => {
    const baseTime = new Date(date);
    baseTime.setHours(7, 0, 0, 0); // Start at 7:00 AM
    return addMinutes(baseTime, i * 30);
  });

  const getAppointmentsForSlot = (time: Date) => {
    const slotEnd = addMinutes(time, 30);
    return appointments.filter(apt => {
      const aptStart = parseISO(`2024-01-01T${apt.startTime}`);
      const aptEnd = parseISO(`2024-01-01T${apt.endTime}`);
      return aptStart < slotEnd && aptEnd > time;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex h-[calc(100vh-200px)] overflow-y-auto">
        {/* Time labels */}
        <div className="w-20 flex-shrink-0 border-r border-gray-200">
          {timeSlots.map((time, i) => (
            <div key={i} className="h-20 -mt-3 text-right pr-2">
              <span className="text-xs text-gray-500">
                {format(time, 'h:mm a')}
              </span>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="relative">
            {timeSlots.map((time, i) => (
              <TimeSlotCell
                key={i}
                time={time}
                appointments={getAppointmentsForSlot(time)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { DailySchedule };
