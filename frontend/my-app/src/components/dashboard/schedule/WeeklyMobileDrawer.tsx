import React from 'react';
import { format, parseISO, isSameDay, setHours } from 'date-fns';
import { Appointment } from "@/lib/types";
import { AppointmentItem } from '@/components/dashboard/schedule/AppointmentItem';

interface WeeklyMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: { date: Date; hour: number } | null;
  appointments: Appointment[];
}

export const WeeklyMobileDrawer: React.FC<WeeklyMobileDrawerProps> = ({
  isOpen,
  onClose,
  selectedSlot,
  appointments
}) => {
  if (!selectedSlot) return null;

  const filteredAppointments = appointments.filter(apt => {
    const aptDate = parseISO(apt.date);
    const aptHour = parseInt(apt.startTime.split(':')[0]);
    return isSameDay(aptDate, selectedSlot.date) && aptHour === selectedSlot.hour;
  });

  return (
    <div className={`
      fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden
      transition-opacity duration-300
      ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <div className={`
        fixed bottom-0 left-0 right-0 
        bg-white rounded-t-xl 
        transform transition-transform duration-300
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        max-h-[80vh] overflow-y-auto
      `}>
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {format(selectedSlot.date, 'MMM d')} at {format(setHours(selectedSlot.date, selectedSlot.hour), 'h a')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt, idx) => (
              <AppointmentItem key={idx} appointment={apt} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No appointments for this time slot
            </p>
          )}
        </div>
      </div>
    </div>
  );
};