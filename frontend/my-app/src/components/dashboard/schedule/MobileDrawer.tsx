import React from "react";
import { format } from "date-fns";
import { Appointment } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { X, Clock, User, Calendar } from "lucide-react";
import Badge from "@/components/ui/badge";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: Date | null;
  appointments: Appointment[];
}

const getStatusConfig = (status: string) => {
  const configs = {
    CANCELLED: {
      cardClass: "bg-gradient-to-br from-red-50 to-red-100",
      accentClass: "bg-gradient-to-r from-red-500 to-red-600",
      badgeClass: "bg-red-500 text-red-700 ring-1 ring-red-500/30",
      iconColor: "text-red-500",
      timeBlockClass: "bg-red-100/50",
    },
    CONFIRMED: {
      cardClass: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      accentClass: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      badgeClass: "bg-emerald-500 text-emerald-700 ring-1 ring-emerald-500/30",
      iconColor: "text-emerald-500",
      timeBlockClass: "bg-emerald-100/50",
    },
    REQUESTED: {
      cardClass: "bg-gradient-to-br from-amber-50 to-amber-100",
      accentClass: "bg-gradient-to-r from-amber-500 to-amber-600",
      badgeClass: "bg-yellow-500 text-amber-700 ring-1 ring-amber-500/30",
      iconColor: "text-amber-500",
      timeBlockClass: "bg-amber-100/50",
    },
    DEFAULT: {
      cardClass: "bg-gradient-to-br from-gray-50 to-gray-100",
      accentClass: "bg-gradient-to-r from-gray-500 to-gray-600",
      badgeClass: "bg-gray-100 text-gray-700 ring-1 ring-gray-500/30",
      iconColor: "text-gray-500",
      timeBlockClass: "bg-gray-100/50",
    },
  };

  return configs[status.toUpperCase() as keyof typeof configs] || configs.DEFAULT;
};

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  selectedDay,
  appointments,
}) => {
  if (!selectedDay) return null;

  return (
    <div
      className={`
      fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden
      transition-all duration-300 ease-in-out
      ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
    `}
    >
      <div
        className={`
        fixed bottom-0 left-0 right-0 
        bg-white 
        rounded-t-2xl shadow-2xl
        transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-y-0" : "translate-y-full"}
        max-h-[85vh]
      `}
      >
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 ">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 ">
              {format(selectedDay, "MMMM d, yyyy")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100  rounded-full transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <ScrollArea className="px-4 py-4 h-[calc(85vh-80px)]">
          {appointments.length > 0 ? (
            <div className="space-y-4 pb-4">
              {appointments.map((apt, idx) => {
                const statusConfig = getStatusConfig(apt.status);
                return (
                  <Card
                    key={idx}
                    className={`relative overflow-hidden border-0 shadow-sm transition-all duration-300 ${statusConfig.cardClass}`}
                  >
                    <div
                      className={`absolute top-0 left-0 w-1.5 h-full ${statusConfig.accentClass}`}
                    />
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1 whitespace-normal break-words">
  {apt.appointmentReason}
</h3>

                          <Badge
                            className={`${statusConfig.badgeClass} text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap`}
                          >
                            {apt.status}
                          </Badge>
                        </div>

                        <div
                          className={`${statusConfig.timeBlockClass} p-3 rounded-lg space-y-3`}
                        >
                          <div className="flex items-center text-gray-700">
                            <User
                              className={`w-4 h-4 mr-2 ${statusConfig.iconColor}`}
                            />
                            <span className="text-sm font-medium">
                              {apt.userName}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Clock
                              className={`w-4 h-4 mr-2 ${statusConfig.iconColor}`}
                            />
                            <span className="text-sm font-medium">
                              {format(
                                new Date(`2024-01-01T${apt.startTime}`),
                                "h:mm a"
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(`2024-01-01T${apt.endTime}`),
                                "h:mm a"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Calendar
                              className={`w-4 h-4 mr-2 ${statusConfig.iconColor}`}
                            />
                            <span className="text-sm font-medium">
                              with {apt.adminName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Calendar className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center font-medium">
                No appointments scheduled for this day
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MobileDrawer;
