import React, { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, parseISO, setHours } from 'date-fns';
import { TimeSlotProps, WeeklyScheduleProps } from '@/lib/types';
import { getStatusColor } from '@/components/dashboard/schedule/Calendar';
import { getAppointmentsForDay } from '@/components/dashboard/schedule/Calendar';
import { SidePanel } from './SidePanel';
import { MobileDrawer } from './MobileDrawer';
import { CalendarHeader } from './CalendarHeader';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TIME_LABELS = HOURS.map(hour => 
  format(setHours(new Date(), hour), 'h a')
);

const TimeSlot: React.FC<TimeSlotProps> = ({
  hour,
  date,
  appointments,
  isToday,
  onSelectSlot
}) => {
  const slotAppointments = appointments.filter(apt => {
    const aptHour = parseInt(apt.startTime.split(':')[0]);
    return aptHour === hour;
  });

  return (
    <div 
      onClick={() => onSelectSlot(date, hour)}
      className={`
        relative h-20 border-b border-r border-gray-200 p-1
        ${isToday ? 'bg-blue-50' : 'bg-white'}
        hover:bg-gray-50 cursor-pointer
        transition-colors duration-200
      `}
    >
      {slotAppointments.map((apt, idx) => (
        <div
          key={idx}
          className="absolute inset-x-1 p-1 rounded text-xs"
          style={{
            backgroundColor: getStatusColor(apt.status) + '20',
            borderLeft: `2px solid ${getStatusColor(apt.status)}`,
            top: `${(idx * 24)}px`,
            maxHeight: '20px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >
          {format(parseISO(`2024-01-01T${apt.startTime}`), 'h:mm a')} - {apt.appointmentReason}
        </div>
      ))}
    </div>
  );
};

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  appointments,
  date = new Date()
}) => {
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; hour: number } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const weekStart = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  const handleSelectSlot = (date: Date, hour: number) => {
    setSelectedSlot({ date, hour });
    setIsDrawerOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <CalendarHeader date={date} />
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="grid grid-cols-8 divide-x">
              <div className="p-2 md:p-4 text-gray-500 font-medium text-xs md:text-sm">Time</div>
              {weekDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`p-1 md:p-4 text-center ${
                    isSameDay(day, today) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-medium text-xs md:text-sm truncate">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 truncate">
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Grid */}
          <div className="overflow-auto max-h-[800px]">
            <div className="grid grid-cols-8 divide-x">
              {/* Time Labels */}
              <div className="sticky left-0 bg-white">
                {TIME_LABELS.map((label, idx) => (
                  <div
                    key={idx}
                    className="h-20 border-b border-r border-gray-200 p-1 md:p-2 text-xs md:text-sm text-gray-500"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Days */}
              {weekDays.map((day, dayIdx) => (
                <div key={dayIdx}>
                  {HOURS.map((hour, hourIdx) => (
                    <TimeSlot
                      key={hourIdx}
                      hour={hour}
                      date={day}
                      appointments={appointments.filter(apt => 
                        isSameDay(parseISO(apt.date), day)
                      )}
                      isToday={isSameDay(day, today)}
                      onSelectSlot={handleSelectSlot}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <SidePanel 
          selectedDay={selectedSlot ? selectedSlot.date : null}
          appointments={selectedSlot ? getAppointmentsForDay(appointments, selectedSlot.date) : []}
        />
      </div>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedDay={selectedSlot?.date || null}
        appointments={selectedSlot?.date ? getAppointmentsForDay(appointments, selectedSlot?.date) : []}
      />
    </div>
  );
};

export default WeeklySchedule;