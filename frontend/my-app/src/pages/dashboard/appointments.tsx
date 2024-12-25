import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getAdminUpcomingAppointmentsByStatus } from '@/service/appointment/getAdminUpcomingAppointmentsByStatus';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import { Appointment } from '@/lib/types';

const AppointmentsPage = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);

  useEffect(() => {
    handleGetAppointments();
  }, [token]);

  const handleGetAppointments = async () => {
    try {
      const response = await getAdminUpcomingAppointmentsByStatus(token, 'REQUESTED');
      if (response) {
        setAppointments(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'bg-yellow-500';
      case 'CONFIRMED': return 'bg-green-500';
      case 'CANCELED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {appointments.length} Pending
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appointment: Appointment) => (
          <Card key={appointment.appointmentId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-center">
                <span className="truncate">{appointment.appointmentReason}</span>
                <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                  {appointment.status}
                </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{appointment.userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{appointment.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {appointment.startTime} - {appointment.endTime}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

AppointmentsPage.getLayout = (page : any) => <DashboardLayout>{page}</DashboardLayout>;
export default AppointmentsPage;