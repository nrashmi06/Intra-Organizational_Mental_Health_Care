import React from "react";
import { Appointment } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, FileText, UserCog } from "lucide-react";
import Badge from "@/components/ui/badge";

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      CONFIRMED: "bg-gradient-to-r from-emerald-400 to-emerald-600",
      CANCELLED: "bg-gradient-to-r from-red-400 to-red-600",
      REQUESTED: "bg-gradient-to-r from-amber-400 to-amber-600",
    };
    return `${statusStyles[status as keyof typeof statusStyles] || "bg-gradient-to-r from-gray-400 to-gray-600"} text-white`;
  };

  return (
    <Card className="overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]">
      <CardContent className="p-6">
        {/* Header Section with Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* User Avatar with Gradient Border */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin-slow" />
              <div className="relative w-16 h-16 bg-white rounded-full p-0.5">
                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </div>
            
            {/* User Info */}
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-gray-800">{appointment.userName}</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <UserCog className="w-4 h-4" />
                <span className="text-sm font-medium">{appointment.adminName}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <Badge 
            className={`${getStatusBadge(appointment.status)} px-4 py-1.5 rounded-full text-sm font-medium shadow-sm`}
          >
            {appointment.status}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date */}
          <div className="bg-gray-50 rounded-xl p-4 transition-colors hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{appointment.date}</span>
            </div>
          </div>

          {/* Time */}
          <div className="bg-gray-50 rounded-xl p-4 transition-colors hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {appointment.startTime} - {appointment.endTime}
              </span>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-gray-50 rounded-xl p-4 transition-colors hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FileText className="w-5 h-5 text-pink-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 truncate">
                {appointment.appointmentReason}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;