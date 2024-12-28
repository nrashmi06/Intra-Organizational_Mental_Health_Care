import React from 'react';
import { format, parseISO, isSameDay, setHours } from 'date-fns';
import { Appointment } from "@/lib/types";
import { AppointmentItem } from '@/components/dashboard/schedule/AppointmentItem';

interface WeeklySidePanelProps {
  selectedSlot: { date: Date; hour: number } | null;
  appointments: Appointment[];
}

export const WeeklySidePanel: React.FC<WeeklySidePanelProps> = ({ selectedSlot, appointments }) => {
  const filteredAppointments = selectedSlot
    ? appointments.filter(apt => {
        const aptDate = parseISO(apt.date);
        const aptHour = parseInt(apt.startTime.split(':')[0]);
        return isSameDay(aptDate, selectedSlot.date) && aptHour === selectedSlot.hour;
      })
    : [];

  return (
    <div className="hidden md:block w-96 border-l border-gray-200">
      {selectedSlot ? (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            {format(selectedSlot.date, 'MMMM d, yyyy')} at {format(setHours(selectedSlot.date, selectedSlot.hour), 'h:mm a')}
          </h3>
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
      ) : (
        <div className="p-4 text-center text-gray-500">
          Select a time slot to view appointments
        </div>
      )}
    </div>
  );
};