import React from 'react';
import { format } from "date-fns";
import { Appointment } from "@/lib/types";
import { AppointmentItem } from './AppointmentItem';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: Date | null;
  appointments: Appointment[];
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  selectedDay,
  appointments
}) => {
  if (!selectedDay) return null;

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
            {format(selectedDay, 'MMMM d, yyyy')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          {appointments.length > 0 ? (
            appointments.map((apt, idx) => (
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