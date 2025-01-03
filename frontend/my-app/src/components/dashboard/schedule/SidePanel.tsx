import React from "react";
import { format } from "date-fns";
import { Appointment } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import Badge from "@/components/ui/badge";

interface SidePanelProps {
  selectedDay: Date | null;
  appointments: Appointment[];
}

const getStatusConfig = (status: string) => {
  const configs = {
    CANCELLED: {
      cardClass: "bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200",
      accentClass: "bg-gradient-to-r from-red-500 to-red-600",
      badgeClass: "bg-red-500  ring-1 ring-red-500/30",
      timeBlockClass: "bg-red-100/50",
      iconColor: "text-red-500"
    },
    CONFIRMED: {
      cardClass: "bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200",
      accentClass: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      badgeClass: "bg-teal-500 ring-1 ring-emerald-500/30",
      timeBlockClass: "bg-emerald-100/50",
      iconColor: "text-emerald-500"
    },
    REQUESTED: {
      cardClass: "bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200",
      accentClass: "bg-gradient-to-r from-amber-500 to-amber-600",
      badgeClass: "bg-yellow-500 ring-1 ring-amber-500/30",
      timeBlockClass: "bg-amber-100/50",
      iconColor: "text-amber-500"
    },
    DEFAULT: {
      cardClass: "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200",
      accentClass: "bg-gradient-to-r from-gray-500 to-gray-600",
      badgeClass: "bg-gray-100 ring-1 ring-gray-500/30",
      timeBlockClass: "bg-gray-100/50",
      iconColor: "text-gray-500"
    }
  };
  
  return configs[status.toUpperCase() as keyof typeof configs] || configs.DEFAULT;
};

export const SidePanel: React.FC<SidePanelProps> = ({
  selectedDay,
  appointments,
}) => {
  return (
    <div className="hidden md:block w-96 border-l border-gray-200 bg-white h-full">
      <div className="h-full flex flex-col">
        {selectedDay ? (
          <>
            <div className="sticky top-0 bg-white/80 backdrop-blur-sm px-6 py-4 border-b border-gray-200 z-20">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {format(selectedDay, "MMMM d, yyyy")}
                </h3>
                <span className="text-sm font-medium text-gray-500">
                  {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {appointments.length > 0 ? (
                    <div className="space-y-4 pb-4">
                      {appointments.map((apt, idx) => {
                        const statusConfig = getStatusConfig(apt.status);
                        return (
                          <Card
                            key={idx}
                            className={`group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 ${statusConfig.cardClass}`}
                          >
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${statusConfig.accentClass}`} />
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-semibold text-gray-900 flex-1 whitespace-normal break-words">
  {apt.appointmentReason}
</h3>

                                <Badge
                                  className={`${statusConfig.badgeClass} text-xs font-medium px-3 py-1 rounded-full transition-transform duration-300 group-hover:scale-105 whitespace-nowrap`}
                                >
                                  {apt.status}
                                </Badge>
                              </div>

                              <div className={`flex items-center text-sm mb-4 ${statusConfig.timeBlockClass} p-3 rounded-lg`}>
                                <Clock className={`w-4 h-4 mr-2 flex-shrink-0 ${statusConfig.iconColor}`} />
                                <span className="font-medium text-gray-700">
                                  {format(new Date(`2024-01-01T${apt.startTime}`), "h:mm a")} -
                                  {format(new Date(`2024-01-01T${apt.endTime}`), "h:mm a")}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200/50">
                                <div className="flex items-center min-w-0">
                                  <User className={`w-4 h-4 mr-2 flex-shrink-0 ${statusConfig.iconColor}`} />
                                  <span className="font-medium text-gray-700 truncate">
                                    {apt.userName}
                                  </span>
                                </div>
                                <span className="text-gray-500 font-medium ml-2 truncate">
                                  with {apt.adminName}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Calendar className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-center font-medium">
                        No appointments scheduled
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <Calendar className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center font-medium">
              Select a day to view appointments
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;