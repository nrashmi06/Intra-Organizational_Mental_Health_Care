import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { User, Calendar, Clock, Eye, CheckCircle, XCircle } from "lucide-react";
import { Appointment } from "@/lib/types";

interface AppointmentRequestCardProps {
    appointment: Appointment;
    onView: (appointment: Appointment) => void;
    onAccept: (appointment: Appointment) => void;
    onReject: (appointment: Appointment) => void;
  }

export default function AppointmentCard({
    appointment,
    onView,
    onAccept,
    onReject
  }: AppointmentRequestCardProps){
  return (
    <Card className="bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 w-full max-w-md mx-auto">
      <CardHeader className="border-b border-gray-100 bg-gray-50 p-4 md:p-6">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900 break-words">
            {appointment.userName}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 font-medium">Reason for Visit:</p>
          <p className="text-sm mt-1 break-words">{appointment.appointmentReason}</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 text-gray-700">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-sm">{appointment.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-sm">
              {appointment.startTime} - {appointment.endTime}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-100 p-3 md:p-4">
        <div className="flex flex-col space-y-2 w-full">
          <Button
            variant="ghost"
            className="w-full hover:bg-stone-100 text-emerald-700 text-sm font-semibold shadow hover:shadow-lg transition-all duration-300"
            onClick={() => onView(appointment)}
          >
            <div className="flex items-center justify-center gap-1">
            <span><Eye className="w-4 h-4 mr-1.5" strokeWidth={2} /></span>
            <span>View Details</span>
            </div>
          </Button>

          <div className="flex flex-col md:flex-row gap-2 w-full">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow hover:shadow-lg transition-all duration-300"
              onClick={() => onAccept(appointment)}
            >
                <div className="flex items-center justify-center gap-1">
                <span><CheckCircle className="w-4 h-4 " strokeWidth={2} /></span>
                <span>Accept</span>
                </div>
            </Button>

            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow hover:shadow-lg transition-all duration-300"
              onClick={() => onReject(appointment)}
            >
                <div className="flex items-center justify-center gap-1">
                <span><XCircle className="w-4 h-4 " strokeWidth={2} /></span>
                <span>Reject</span>
                </div>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}