import React from 'react';
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
    case 'CANCELLED':
      return 'bg-red-100 text-red-700';
    case 'COMPLETED':
      return 'bg-green-100 text-green-700';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const SidePanel: React.FC<SidePanelProps> = ({ 
  selectedDay, 
  appointments 
}) => {
  return (
    <div className="hidden md:block w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-full">
      <div className="h-full flex flex-col">
        {selectedDay ? (
          <>
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {format(selectedDay, 'MMMM d, yyyy')}
              </h3>
            </div>
            
            <ScrollArea className="flex-1 p-6">
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt, idx) => (
                    <Card 
                      key={idx} 
                      className="border-0 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {apt.appointmentReason}
                            </h3>
                            <Badge 
                              className={`${getStatusColor(apt.status)} px-3 py-1 rounded-full `}
                              color='green'
                            >
                              {apt.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <User className="w-4 h-4 mr-2" />
                              <span className="text-sm">{apt.userName}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <Clock className="w-4 h-4 mr-2" />
                              <span className="text-sm">
                                {format(new Date(`2024-01-01T${apt.startTime}`), 'h:mm a')} - 
                                {format(new Date(`2024-01-01T${apt.endTime}`), 'h:mm a')}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="text-sm">with {apt.adminName}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    No appointments scheduled for this day
                  </p>
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <Calendar className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Select a day to view appointments
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;