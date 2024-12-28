import React, { useState } from 'react';
import { Appointment } from "@/lib/types";
import { format, parseISO, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WeeklySchedule: React.FC<{ 
  appointments: Appointment[];
  date?: Date;
}> = ({
  appointments,
  date = new Date()
}) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const [selectedDay, setSelectedDay] = useState(date);

  // Generate time slots for each hour from 5 AM to 10 PM
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 5; // Start from 5 AM
    return new Date(2024, 0, 1, hour, 0);
  });

  const processAppointmentsForDay = (day: Date) => {
    return appointments
      .filter(apt => {
        const aptDate = parseISO(apt.date);
        return (
          aptDate.getFullYear() === day.getFullYear() &&
          aptDate.getMonth() === day.getMonth() &&
          aptDate.getDate() === day.getDate()
        );
      })
      .map(apt => {
        const aptStart = parseISO(`2024-01-01T${apt.startTime}`);
        const aptEnd = parseISO(`2024-01-01T${apt.endTime}`);
        
        const startHour = aptStart.getHours() + aptStart.getMinutes() / 60;
        const endHour = aptEnd.getHours() + aptEnd.getMinutes() / 60;
        const top = (startHour - 5) * 96;
        const height = (endHour - startHour) * 96;
        
        return {
          ...apt,
          top,
          height,
          startHour,
          endHour
        };
      });
  };

  // Week Navigation Component
  const WeekNav = () => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <button 
        onClick={() => setSelectedDay(addDays(selectedDay, -1))}
        className="p-2"
      >
        <ChevronLeft className="w-5 h-5 text-gray-500" />
      </button>

      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex justify-between min-w-full">
          {weekDays.map((day, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(day)}
              className={`flex flex-col items-center px-3 py-2 ${
                isSameDay(day, selectedDay) 
                  ? 'text-blue-600' 
                  : 'text-gray-600'
              }`}
            >
              <span className="text-xs uppercase">
                {format(day, 'EEE')}
              </span>
              <span className={`text-lg font-semibold mt-1 ${
                isSameDay(day, selectedDay)
                  ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center'
                  : ''
              }`}>
                {format(day, 'd')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => setSelectedDay(addDays(selectedDay, 1))}
        className="p-2"
      >
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Mobile Week Navigation */}
      <div className="md:hidden">
        <WeekNav />
        <div className="p-4 text-center border-b border-gray-200 bg-white">
          <div className="font-semibold text-gray-900">
            {format(selectedDay, 'EEEE, MMMM d')}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:grid grid-cols-[80px_repeat(7,1fr)] border-b sticky top-0 bg-white z-10">
        <div className="p-4 border-r border-gray-200" />
        {weekDays.map((day, i) => (
          <div 
            key={i} 
            className="p-4 text-center border-l border-gray-200"
          >
            <div className="font-semibold text-gray-900">
              {format(day, 'EEE')}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {format(day, 'MMM d')}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex overflow-x-auto">
        {/* Time labels */}
        <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-white sticky left-0 z-10">
          {timeSlots.map((time, i) => (
            <div 
              key={i} 
              className="h-24 border-b border-gray-200 relative"
            >
              <span className="absolute -top-3 right-4 text-sm text-gray-500">
                {format(time, 'h:mm a')}
              </span>
            </div>
          ))}
        </div>

        {/* Days columns - Show only selected day on mobile */}
        <div className={`flex-1 grid ${
          window.innerWidth < 768 ? 'grid-cols-1' : 'grid-cols-7'
        }`}>
          {(window.innerWidth < 768 ? [selectedDay] : weekDays).map((day, dayIdx) => (
            <div 
              key={dayIdx} 
              className="border-l border-gray-200 relative"
              style={{ minWidth: window.innerWidth < 768 ? 'calc(100vw - 80px)' : '120px' }}
            >
              {timeSlots.map((time, timeIdx) => (
                <div
                  key={timeIdx}
                  className="h-24 border-b border-gray-200"
                />
              ))}
              
              {processAppointmentsForDay(day).map((apt, aptIdx) => (
                <div
                  key={aptIdx}
                  className="absolute left-1 right-1 bg-blue-100 rounded-lg border border-blue-200 p-2 overflow-hidden"
                  style={{
                    top: `${apt.top}px`,
                    height: `${apt.height}px`
                  }}
                >
                  <div className="text-sm font-medium text-blue-900 truncate">
                    {apt.appointmentReason}
                  </div>
                  <div className="text-xs text-blue-700">
                    {format(parseISO(`2024-01-01T${apt.startTime}`), 'h:mm a')} - 
                    {format(parseISO(`2024-01-01T${apt.endTime}`), 'h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;