import { Appointment } from "@/lib/types";
import { addMinutes, format, parseISO } from "date-fns";
import TimeSlotCell from "@/components/dashboard/schedule/TimeSlotCell";

// WeeklySchedule.tsx - Updated weekly view
const WeeklySchedule: React.FC<{ appointments: Appointment[]; date?: Date }> = ({
  appointments,
  date = new Date()
}) => {
  const weekDays = Array.from({ length: 40 }, (_, i) => {
    const day = new Date(date);
    day.setDate(date.getDate() - date.getDay() + i);
    return day;
  });

  const timeSlots = Array.from({ length: 28 }, (_, i) => {
    const baseTime = new Date();
    baseTime.setHours(1, 0, 0, 0);
    return addMinutes(baseTime, i * 30);
  });

  const getAppointmentsForSlot = (time: Date, day: Date) => {
    return appointments.filter(apt => {
      const aptDate = parseISO(apt.date);
      if (aptDate.toDateString() !== day.toDateString()) return false;

      const aptStart = parseISO(`2024-01-01T${apt.startTime}`);
      const aptEnd = parseISO(`2024-01-01T${apt.endTime}`);
      const slotTime = parseISO(`2024-01-01T${format(time, 'HH:mm:ss')}`);
      const slotEnd = addMinutes(slotTime, 30);
      
      return aptStart < slotEnd && aptEnd > slotTime;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-8 border-b">
        <div className="w-20" />
        {weekDays.map((day, i) => (
          <div key={i} className="p-2 text-center border-l">
            <div className="font-medium">{format(day, 'EEE')}</div>
            <div className="text-sm text-gray-500">{format(day, 'd')}</div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex h-[calc(100vh-200px)] overflow-y-auto">
        {/* Time labels */}
        <div className="w-20 flex-shrink-0 border-r">
          {timeSlots.map((time, i) => (
            <div key={i} className="h-20 -mt-3 text-right pr-2">
              <span className="text-xs text-gray-500">
                {format(time, 'h:mm a')}
              </span>
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx} className="border-l">
              {timeSlots.map((time, timeIdx) => (
                <TimeSlotCell
                  key={timeIdx}
                  time={time}
                  appointments={getAppointmentsForSlot(time, day)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;