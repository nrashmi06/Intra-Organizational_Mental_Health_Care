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

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "CANCELLED":
      return "bg-red-50 text-red-600 ring-1 ring-red-500/20";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20";
    case "PENDING":
      return "bg-amber-50 text-amber-600 ring-1 ring-amber-500/20";
    default:
      return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
  }
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
            <div className="sticky top-0 bg-whitepx-6 py-4 border-b border-gray-200  z-10">
              <h3 className="text-xl font-semibold text-white">
                {format(selectedDay, "MMMM d, yyyy")}
              </h3>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-4 py-2">
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map((apt, idx) => (
                      <Card
                        key={idx}
                        className="relative overflow-hidden hover:shadow-md transition-all duration-200"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-teal-500" />
                        <CardContent className="p-4 pl-5">
                          {/* Status Badge - Top Right */}
                          <div className="flex justify-end mb-3">
                            <Badge
                              className={`${getStatusColor(
                                apt.status
                              )} text-xs font-medium px-2.5 py-0.5 rounded-full`}
                              color="teal"
                            >
                              {apt.status}
                            </Badge>
                          </div>

                          {/* Reason Section */}
                          <h3 className="text-base relative  font-semibold text-black mb-3 line-clamp-2">
                            <span>{apt.appointmentReason}</span>
                          </h3>

                          {/* Time Section */}
                          <div className="flex items-center text-sm text-gray-600  mb-3 bg-gray-50 p-2 rounded">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                            <span>
                              {format(
                                new Date(`2024-01-01T${apt.startTime}`),
                                "h:mm a"
                              )}{" "}
                              -
                              {format(
                                new Date(`2024-01-01T${apt.endTime}`),
                                "h:mm a"
                              )}
                            </span>
                          </div>

                          {/* Bottom Info Section */}
                          <div className="flex items-center justify-between text-sm text-gray-500  pt-2 border-t border-gray-100 ">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">
                                {apt.userName}
                              </span>
                            </div>
                            <span className="text-gray-400">
                              with {apt.adminName}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500  text-center">
                      No appointments scheduled for this day
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <Calendar className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              Select a day to view appointments
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
