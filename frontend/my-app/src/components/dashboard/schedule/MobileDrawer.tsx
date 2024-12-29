import React from 'react';
import { format } from "date-fns";
import { Appointment } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { X, Clock, User, Calendar } from "lucide-react";
import Badge  from "@/components/ui/badge";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  selectedDay,
  appointments
}) => {
  if (!selectedDay) return null;

  return (
    <div className={`
      fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden
      transition-all duration-300 ease-in-out
      ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <div className={`
        fixed bottom-0 left-0 right-0 
        bg-white dark:bg-gray-900
        rounded-t-2xl shadow-2xl
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        max-h-[85vh]
      `}>
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {format(selectedDay, 'MMMM d, yyyy')}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <ScrollArea className="px-6 py-4 h-[calc(85vh-80px)]">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((apt, idx) => (
                <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {apt.appointmentReason}
                        </h3>
                        <Badge 
                        className={`${getStatusColor(apt.status)} px-3 py-1 rounded-full `}
                        color='teal'
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
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Calendar className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-center">
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