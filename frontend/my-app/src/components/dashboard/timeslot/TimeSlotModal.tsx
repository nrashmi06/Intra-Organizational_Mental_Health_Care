import React from "react";
import { Button } from "@/components/ui/button";
import { X, Clock, Trash2 } from "lucide-react";
import { TimeSelector } from "./TimeSelector";

interface TimeSlotModalProps {
  selectedSlot: any;
  newStartTime: string;
  setNewStartTime: (time: string) => void;
  newEndTime: string;
  setNewEndTime: (time: string) => void;
  setIsModalOpen: (open: boolean) => void;
  handleUpdateTimeSlot: (id: string, startTime: string, endTime: string) => void;
  handleDeleteTimeSlot: (id: string) => void;
}

const TimeSlotModal: React.FC<TimeSlotModalProps> = ({
  selectedSlot,
  newStartTime,
  setNewStartTime,
  newEndTime,
  setNewEndTime,
  setIsModalOpen,
  handleUpdateTimeSlot,
  handleDeleteTimeSlot,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Manage Time Slot
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <TimeSelector
                selectedTime={newStartTime}
                onChange={setNewStartTime}
                label="Start Time"
              />
            </div>

            <div className="space-y-2">
              <TimeSelector
                selectedTime={newEndTime}
                onChange={setNewEndTime}
                label="End Time"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            
            <Button
              onClick={() => {
                handleUpdateTimeSlot(selectedSlot.timeSlotId, newStartTime, newEndTime);
                setIsModalOpen(false);
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/20 transition-all duration-200"
            >
              Update Time Slot
            </Button>
            
            <Button
              onClick={() => {
                handleDeleteTimeSlot(selectedSlot.timeSlotId);
                setIsModalOpen(false);
              }}
              variant="outline"
              className="w-full sm:w-auto border-red-200 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:hover:bg-red-900/40 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotModal;