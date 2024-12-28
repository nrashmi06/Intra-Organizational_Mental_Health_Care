import React, { useState } from 'react';
import { MonthlyScheduleProps } from '@/lib/types';
import { getAppointmentsForDay } from '@/components/dashboard/schedule/Calendar';
import { CalendarHeader } from './CalendarHeader';
import { WeekdayHeader } from './WeekdayHeader';
import { CalendarDay } from './CalendarDay';
import { SidePanel } from './SidePanel';
import { MobileDrawer } from './MobileDrawer';

const MonthlySchedule: React.FC<MonthlyScheduleProps> = ({
  appointments,
  date = new Date()
}) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();

  const weeks = Math.ceil((totalDays + startDay) / 7);
  const days = Array.from({ length: weeks * 7 }, (_, i) => {
    const day = new Date(startOfMonth);
    day.setDate(1 - startDay + i);
    return day;
  });

  const handleSelectDay = (day: Date) => {
    setSelectedDay(day);
    setIsDrawerOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl">
      <CalendarHeader date={date} />

      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <WeekdayHeader />

          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dayAppointments = getAppointmentsForDay(appointments, day);
              const isCurrentMonth = day.getMonth() === date.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected = selectedDay?.toDateString() === day.toDateString();

              return (
                <CalendarDay
                  key={i}
                  day={day}
                  isCurrentMonth={isCurrentMonth}
                  isToday={isToday}
                  isSelected={isSelected}
                  appointments={dayAppointments}
                  onSelectDay={handleSelectDay}
                />
              );
            })}
          </div>
        </div>

        <SidePanel 
          selectedDay={selectedDay}
          appointments={selectedDay ? getAppointmentsForDay(appointments, selectedDay) : []}
        />
      </div>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedDay={selectedDay}
        appointments={selectedDay ? getAppointmentsForDay(appointments, selectedDay) : []}
      />
    </div>
  );
};

export default MonthlySchedule;