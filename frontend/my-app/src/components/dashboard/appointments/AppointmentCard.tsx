import React from "react";
import { Appointment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const getStatusColor = (status: string) => {
    const statusColors = {
      CONFIRMED: "bg-emerald-100 text-emerald-800",
      CANCELLED: "bg-red-100 text-red-800",
      REQUESTED: "bg-amber-100 text-amber-800",
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Left section with status and user info */}
          <div className="w-full md:w-1/3 p-4 bg-gray-50">
            <div className="flex flex-col space-y-4">
              {/* Status Badge */}
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
              
              {/* User Info */}
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-lg font-semibold">{appointment.userName}</span>
              </div>
              
              {/* Admin Info - Only visible on mobile */}
              <div className="md:hidden flex items-center space-x-2 text-sm text-gray-600">
                <span>Admin: {appointment.adminName}</span>
              </div>
            </div>
          </div>

          {/* Right section with appointment details */}
          <div className="w-full md:w-2/3 p-4">
            <div className="flex flex-col space-y-4">
              {/* Appointment Reason */}
              <h3 className="text-lg font-semibold">{appointment.appointmentReason}</h3>

              {/* Date and Time Info */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>{appointment.date}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{appointment.startTime} - {appointment.endTime}</span>
                </div>
              </div>

              {/* Admin Info - Only visible on desktop */}
              <div className="hidden md:block text-md text-gray-600">
                Admin: {appointment.adminName}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;