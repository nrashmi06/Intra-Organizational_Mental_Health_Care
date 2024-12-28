import React, { useState } from 'react';
import { Appointment } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    CONFIRMED: '#4CAF50',
    CANCELED: '#F44336',
    REQUESTED: '#FFA726',
    DEFAULT: '#9E9E9E'
  };
  return colors[status] || colors.DEFAULT;
};

const MonthlySchedule: React.FC<{ 
  appointments: Appointment[]; 
  date?: Date 
}> = ({
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

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => {
      const aptDate = parseISO(apt.date);
      return aptDate.toDateString() === day.toDateString();
    });
  };

  const AppointmentItem = ({ appointment }: { appointment: Appointment }) => (
    <div
      className="p-3 rounded-lg mb-2 text-sm break-words shadow-sm"
      style={{ 
        backgroundColor: getStatusColor(appointment.status) + '20',
        borderLeft: `4px solid ${getStatusColor(appointment.status)}`
      }}
    >
      <div className="font-semibold text-base">
        {format(parseISO(`2024-01-01T${appointment.startTime}`), 'h:mm a')}
      </div>
      <div className="text-gray-700 mt-1">
        {appointment.appointmentReason}
      </div>
    </div>
  );

  // Mobile Drawer Component
  const AppointmentDrawer = () => {
    if (!selectedDay) return null;
    const dayAppointments = getAppointmentsForDay(selectedDay);

    return (
      <div className={`
        fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden
        transition-opacity duration-300
        ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <div className={`
          fixed bottom-0 left-0 right-0 
          bg-white rounded-t-xl 
          transform transition-transform duration-300
          ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}
          max-h-[80vh] overflow-y-auto
        `}>
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {format(selectedDay, 'MMMM d, yyyy')}
            </h2>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            {dayAppointments.length > 0 ? (
              dayAppointments.map((apt, idx) => (
                <AppointmentItem key={idx} appointment={apt} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No appointments for this day
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xl">
      {/* Calendar Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {format(date, 'MMMM yyyy')}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Main Calendar Grid */}
        <div className="flex-1">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 text-center font-medium text-gray-600">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.charAt(0)}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dayAppointments = getAppointmentsForDay(day);
              const isCurrentMonth = day.getMonth() === date.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected = selectedDay?.toDateString() === day.toDateString();

              return (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedDay(day);
                    setIsDrawerOpen(true);
                  }}
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
                  {/* Day Number */}
                  <div className={`
                    p-2 text-right
                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  `}>
                    <span className="text-sm font-medium">
                      {format(day, 'd')}
                    </span>
                    {dayAppointments.length > 0 && (
                      <div className="md:hidden mt-1 text-xs font-medium text-blue-600">
                        {dayAppointments.length} task{dayAppointments.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Appointments Preview - Hidden on Mobile */}
                  <div className="hidden md:block p-1 space-y-1">
                    {dayAppointments.slice(0, 2).map((apt, idx) => (
                      <div
                        key={idx}
                        className="text-xs p-1 rounded"
                        style={{ 
                          backgroundColor: getStatusColor(apt.status) + '20',
                          borderLeft: `2px solid ${getStatusColor(apt.status)}`
                        }}
                      >
                        {format(parseISO(`2024-01-01T${apt.startTime}`), 'h:mm a')}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-blue-600 p-1">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel for Desktop */}
        <div className="hidden md:block w-96 border-l border-gray-200">
          {selectedDay ? (
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">
              {format(selectedDay, 'MMMM d, yyyy')}
              </h3>
              {getAppointmentsForDay(selectedDay).length > 0 ? (
              getAppointmentsForDay(selectedDay).map((apt, idx) => (
                <AppointmentItem key={idx} appointment={apt} />
              ))
              ) : (
              <p className="text-gray-500 text-center py-4">
                No appointments for this day
              </p>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Select a day to view appointments
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AppointmentDrawer />
    </div>
  );
};

export default MonthlySchedule;