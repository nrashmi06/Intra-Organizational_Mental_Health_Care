import React from 'react';
import { format } from "date-fns";
import { Appointment } from "@/lib/types";
import { AppointmentItem } from './AppointmentItem';

interface SidePanelProps {
  selectedDay: Date | null;
  appointments: Appointment[];
}

export const SidePanel: React.FC<SidePanelProps> = ({ selectedDay, appointments }) => (
  <div className="hidden md:block w-96 border-l border-gray-200">
    {selectedDay ? (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {format(selectedDay, 'MMMM d, yyyy')}
        </h3>
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
    ) : (
      <div className="p-4 text-center text-gray-500">
        Select a day to view appointments
      </div>
    )}
  </div>
);