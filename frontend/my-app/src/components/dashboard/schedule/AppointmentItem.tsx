import React from 'react';
import { format, parseISO } from "date-fns";
import { AppointmentItemProps } from '@/lib/types';
import { getStatusColor } from '@/components/dashboard/schedule/Calendar';

export const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment }) => (
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