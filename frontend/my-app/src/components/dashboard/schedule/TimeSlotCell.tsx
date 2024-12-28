import React from 'react';
import { format, parseISO } from 'date-fns';
import { Appointment } from '@/lib/types';

interface TimeSlotCellProps {
  time: Date;                // The start time of the slot (e.g., "2:00 PM")
  appointments: Appointment[];
  height?: string;           // Custom height for the time slot (e.g., "h-24")
}

function TimeSlotCell({ time, appointments, height = "h-20" }: TimeSlotCellProps) {
  return (
    <div className={`relative ${height} border-b border-gray-200 group`}>
      <div className="absolute inset-0 group-hover:bg-gray-50/50 transition-colors" />
      {appointments.map((apt, idx) => {
        const start = parseISO(`2024-01-01T${apt.startTime}`);
        const end = parseISO(`2024-01-01T${apt.endTime}`);

        // Calculate appointment's start and end times in minutes since start of the day
        const appointmentStartMinutes = start.getHours() * 60 + start.getMinutes();
        const appointmentEndMinutes = end.getHours() * 60 + end.getMinutes();

        // Time slot's start time in minutes since start of the day
        const slotStartMinutes = time.getHours() * 60 + time.getMinutes();
        const slotEndMinutes = slotStartMinutes + 30; // 30-minute slot

        // Check if the appointment starts in this time slot
        if (appointmentStartMinutes < slotEndMinutes && appointmentEndMinutes > slotStartMinutes) {
          // Calculate the top offset for the appointment
          const topOffset = Math.max(0, (appointmentStartMinutes - slotStartMinutes) / 30) * 100;

          // Calculate the height of the appointment (limit to the current slot)
          const heightPercentage =
            Math.min(appointmentEndMinutes, slotEndMinutes) - Math.max(appointmentStartMinutes, slotStartMinutes);
          const heightInSlot = (heightPercentage / 30) * 100;

          return (
            <div
              key={idx}
              className="absolute left-1 right-1 rounded-lg px-2 py-1 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              style={{
                top: `${topOffset}%`,
                height: `${heightInSlot}%`,
                backgroundColor: getStatusColor(apt.status),
                zIndex: 10,
              }}
            >
              <div className="text-xs font-medium text-white truncate">
                {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
              </div>
              <div className="text-xs font-medium text-white truncate">{apt.appointmentReason}</div>
              <div className="text-xs text-white/90 truncate">{apt.userName}</div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// Helper function for status colors
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    CONFIRMED: '#4CAF50',
    CANCELLED: '#F44336',
    REQUESTED: '#FFA726',
    DEFAULT: '#9E9E9E',
  };
  return colors[status] || colors.DEFAULT;
};

export default TimeSlotCell;
