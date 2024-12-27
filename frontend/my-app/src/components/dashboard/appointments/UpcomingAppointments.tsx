import React, { useEffect, useState } from 'react';
import { getAdminUpcomingAppointmentsForAdmin } from '@/service/appointment/getAdminUpcomingAppointmentsForAdmin';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Appointment } from '@/lib/types';
import AppointmentCard from './AppointmentCard';

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAdminUpcomingAppointmentsForAdmin(token);
        setAppointments(response); // Update state with fetched appointments
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, [token]);

  // Sort appointments in chronological order
  const sortedAppointments = appointments.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div>
      {/* Upcoming Appointments Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Upcoming Appointments</h2>
        <div className="mt-6">
          {appointments.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {sortedAppointments.map((appointment) => (
                <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming appointments found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
