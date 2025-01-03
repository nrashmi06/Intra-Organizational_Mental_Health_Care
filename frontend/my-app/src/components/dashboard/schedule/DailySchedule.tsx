import React, { useMemo } from "react";
import { Appointment } from "@/lib/types";
import { format, parseISO } from "date-fns";

const getColorByStatus = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-200";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-yellow-200";
  }
};

const DailySchedule: React.FC<{
  appointments: Appointment[];
  date: Date;
}> = ({ appointments, date }) => {
  // Generate time slots for each hour from 5 AM to 10 PM
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 5; // Start from 5 AM
    return new Date(2024, 0, 1, hour, 0);
  });

  // Filter and process appointments for the given day
  const processedAppointments = useMemo(() => {
    return appointments
      .filter((apt) => {
        const aptDate = parseISO(apt.date);
        return (
          aptDate.getFullYear() === date.getFullYear() &&
          aptDate.getMonth() === date.getMonth() &&
          aptDate.getDate() === date.getDate()
        );
      })
      .map((apt) => {
        const aptStart = parseISO(`2024-01-01T${apt.startTime}`);
        const aptEnd = parseISO(`2024-01-01T${apt.endTime}`);

        // Calculate position and height
        const startHour = aptStart.getHours() + aptStart.getMinutes() / 60;
        const endHour = aptEnd.getHours() + aptEnd.getMinutes() / 60;
        const top = (startHour - 5) * 96; // 96px per hour (24px * 4 quarters)
        const height = (endHour - startHour) * 96;

        return {
          ...apt,
          top,
          height,
          startHour,
          endHour,
        };
      });
  }, [appointments, date]); // Recalculate only when `appointments` or `date` changes

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 text-center border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="font-semibold text-gray-900">
          {format(date, "EEEE, MMMM d")}
        </div>
      </div>

      {/* Time grid */}
      <div className="flex">
        {/* Time labels */}
        <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-white sticky left-0 z-10">
          {timeSlots.map((time, i) => (
            <div key={i} className="h-24 border-b border-gray-200 relative">
              <span className="absolute -top-3 right-4 text-sm text-gray-500">
                {format(time, "h:mm a")}
              </span>
            </div>
          ))}
        </div>

        {/* Day column */}
        <div className="flex-1 relative">
          {/* Hour cells */}
          {timeSlots.map((time, timeIdx) => (
            <div key={timeIdx} className="h-24 border-b border-gray-200" />
          ))}

          {/* Appointments overlay */}
          {processedAppointments.map((apt, aptIdx) => (
            <div
              key={aptIdx}
              className={`absolute left-1 right-1 ${getColorByStatus(
                apt.status
              )} rounded-lg border border-blue-200 p-2`}
              style={{
                top: `${apt.top}px`,
                height: `${apt.height}px`,
              }}
              title={apt.appointmentReason} // Tooltip displays full text
            >
              <div className="text-sm sm:text-base font-medium text-blue-900 whitespace-normal">
                {apt.appointmentReason} {/* Full text displayed */}
              </div>
              <div className="text-xs sm:text-sm text-blue-700">
                {format(parseISO(`2024-01-01T${apt.startTime}`), "h:mm a")} -{" "}
                {format(parseISO(`2024-01-01T${apt.endTime}`), "h:mm a")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailySchedule;
