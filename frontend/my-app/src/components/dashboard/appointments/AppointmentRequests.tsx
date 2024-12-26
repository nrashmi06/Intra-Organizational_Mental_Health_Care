import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getAdminUpcomingAppointmentsByStatus } from '@/service/appointment/getAdminUpcomingAppointmentsByStatus';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { Calendar, Clock, User, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Appointment } from '@/lib/types';
import AppointmentDetailView from '@/components/dashboard/AppointmentDetailView';
import StatusInputComponent from '@/components/dashboard/appointments/MessageRequestBox';

export function AppointmentRequests() {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAcceptOrReject, setIsAcceptOrReject] = useState(false); 
  const [status, setStatus] = useState('');
  useEffect(() => {
    handleGetRequestedAppointments();
  }, [token, refreshKey]);

  const handleGetRequestedAppointments = async () => {
    try {
      const response = await getAdminUpcomingAppointmentsByStatus(token, 'REQUESTED');
      if (response) {
        setAppointments(response);
      }
    } catch (error) {
      console.error('Error fetching requested appointments:', error);
    }
  };

  const handleAccept = async (appointment : Appointment) => {
    try {
      setStatus('CONFIRMED');
      setIsAcceptOrReject(true); 
      setSelectedAppointment(appointment);
      setShowPopUp(true);
      setRefreshKey((prev) => prev + 1); 
    } catch (error) {
      console.error('Error accepting appointment:', error);
    }
  };
  
  const handleReject = async (appointment : Appointment) => {
    try {
      setStatus('CANCELLED');
      setIsAcceptOrReject(true); 
      await setSelectedAppointment(appointment);
      setShowPopUp(true);
    } catch (error) {
      console.error('Error rejecting appointment:', error);
    }
  };
  
  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowPopUp(true);
    setIsAcceptOrReject(false); // Reset this when viewing details
  };

  const closePopUp = () => {
    setShowPopUp(false);
    setSelectedAppointment(null);
    setIsAcceptOrReject(false); // Reset when closing pop-up
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Requested Appointments</h1>
        <Badge className="bg-yellow-500 text-white px-4 py-2 text-sm font-semibold flex items-center">
          <span>{appointments.length}</span>
          <span className="ml-1">Pending</span>
        </Badge>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm">
          <p className="text-gray-500">No requested appointments at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment: Appointment) => (
            <Card 
              key={appointment.appointmentId} 
              className="bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <CardHeader className="border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{appointment.userName}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium">Reason for Visit:</p>
                  <p className="text-sm mt-1">{appointment.appointmentReason}</p>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{appointment.date}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">
                    {appointment.startTime} - {appointment.endTime}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="border-t border-gray-100 p-3">
                <div className="flex flex-col space-y-2 w-full">
                  <Button 
                    value="View Details"
                    variant="ghost"
                    className="w-full hover:bg-stone-100 text-emerald-700 text-sm font-semibold shadow hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center h-9"
                    onClick={() => handleView(appointment)}
                  >
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1.5" strokeWidth={2} />
                      <span>View Details</span>
                    </div>
                  </Button>
                  
                  <div className="flex gap-2 w-full">
                    <Button 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center h-9"
                      onClick={() => handleAccept(appointment)}
                    >
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1.5" strokeWidth={2} />
                        <span>Accept</span>
                      </div>
                    </Button>
                    
                    <Button 
                      variant='outline'
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center h-9"
                      onClick={() => handleReject(appointment)}
                    >
                      <div className="flex items-center">
                        <XCircle className="w-4 h-4 mr-1.5" strokeWidth={2} />
                        <span>Reject</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {showPopUp && selectedAppointment && !isAcceptOrReject && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg relative w-[80%] max-w-[800px] h-auto max-h-[80vh] overflow-y-auto">
      <Button
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        onClick={closePopUp}
      >
        <XCircle className="w-6 h-6" />
      </Button>
      <AppointmentDetailView 
        appointmentId={selectedAppointment.appointmentId} 
        token={token} 
      />
    </div>
  </div>
)}

{showPopUp && selectedAppointment && isAcceptOrReject && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg relative w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] max-w-lg max-h-[80vh] overflow-hidden">
      <Button
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        onClick={closePopUp}
      >
        <XCircle className="w-6 h-6" />
      </Button>
      <StatusInputComponent
        appointmentId={selectedAppointment.appointmentId}
        token={token}
        status={status === 'CONFIRMED' ? 'CONFIRMED' : 'CANCELLED'}
      />
    </div>
  </div>
)}




    </div>
  );
}

export default AppointmentRequests;
