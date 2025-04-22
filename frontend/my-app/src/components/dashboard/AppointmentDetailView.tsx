import React, { useState, useEffect } from 'react';
import { Clock, User, UserCog, CalendarCheck, FileText, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getAppointmentDetails } from '@/service/user/GetAppointmentDetails';
import { AppointmentDetails } from '@/lib/types';

interface DetailViewProps {
  appointmentId: string | null;
  token: string;
}

const AppointmentDetailView: React.FC<DetailViewProps> = ({
  appointmentId,
  token,
}) => {
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!appointmentId) {
        setAppointmentDetails(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getAppointmentDetails(appointmentId, token);
        setAppointmentDetails(data as AppointmentDetails);
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError("Failed to load appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, token]);

  const getStatusStyle = (status: AppointmentDetails['status']) => {
    const styles = {
      REQUESTED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CANCELED: 'bg-red-100 text-red-800 border-red-200',
      CONFIRMED: 'bg-green-100 text-green-800 border-green-200'
    };
    return styles[status];
  };

  const getStatusIcon = (status: AppointmentDetails['status']) => {
    const icons = {
      REQUESTED: <Clock size={16} />,
      CANCELED: <X size={16} />,
      CONFIRMED: <CalendarCheck size={16} />
    };
    return icons[status];
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 animate-pulse">Loading appointment details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-50 border border-red-200">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  if (!appointmentDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Select an appointment to view details.</div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className={`${
        appointmentDetails.status === 'CONFIRMED' ? 'bg-gradient-to-r from-green-600 to-green-700' :
        appointmentDetails.status === 'REQUESTED' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
        'bg-gradient-to-r from-gray-600 to-gray-700'
      } text-white rounded-t-lg`}>
        <div className="flex justify-between items-center">
          <CardTitle>
            Appointment Details
          </CardTitle>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyle(appointmentDetails.status)}`}>
            {getStatusIcon(appointmentDetails.status)} {appointmentDetails.status}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6">
          {/* Appointment ID */}
          <div className="text-sm text-gray-600">
            Appointment #{appointmentDetails.appointmentId}
          </div>

          {/* Main Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Participants */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <User size={20} />
                <h3 className="font-semibold">Participants</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-700">{appointmentDetails.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCog size={16} className="text-gray-400" />
                  <span className="text-gray-700">{appointmentDetails.adminName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Phone: </span>
                  <span className="text-gray-700">{appointmentDetails.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Time Slot */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <Clock size={20} />
                <h3 className="font-semibold">Time Slot</h3>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <CalendarCheck size={16} className="text-gray-400" />
                    <span className="text-gray-700">Date: {(appointmentDetails.timeSlotDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck size={16} className="text-gray-400" />
                    <span className="text-gray-700">From: {formatTime(appointmentDetails.timeSlotStartTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 pl-6">
                    <span className="text-gray-700">To: {formatTime(appointmentDetails.timeSlotEndTime)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Reason */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <FileText size={20} />
              <h3 className="font-semibold">Appointment Reason</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">
              {appointmentDetails.appointmentReason}
            </p>
          </div>

          {/* Severity Level */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <FileText size={20} />
              <h3 className="font-semibold">Severity Level</h3>
            </div>
            <p className={`text-gray-700 ${appointmentDetails.severityLevel === 'HIGH' ? 'text-red-600' : appointmentDetails.severityLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'}`}>
              {appointmentDetails.severityLevel}
            </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentDetailView;