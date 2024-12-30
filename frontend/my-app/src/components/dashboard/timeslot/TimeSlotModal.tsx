import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TimeSlotModal: React.FC<{
  selectedSlot: any;
  newStartTime: string;
  setNewStartTime: (time: string) => void;
  newEndTime: string;
  setNewEndTime: (time: string) => void;
  setIsModalOpen: (open: boolean) => void;
  handleUpdateTimeSlot: (id: string, startTime: string, endTime: string) => void;
  handleDeleteTimeSlot: (id: string) => void;
}> = ({
  selectedSlot,
  newStartTime,
  setNewStartTime,
  newEndTime,
  setNewEndTime,
  setIsModalOpen,
  handleUpdateTimeSlot,
  handleDeleteTimeSlot,
}) => (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-10">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-xl font-semibold mb-4">Manage Time Slot</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="updateStartTime">Start Time</Label>
          <Input
            id="updateStartTime"
            type="time"
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="updateEndTime">End Time</Label>
          <Input
            id="updateEndTime"
            type="time"
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <Button onClick={() => setIsModalOpen(false)} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleUpdateTimeSlot(selectedSlot.timeSlotId, newStartTime, newEndTime);
            setIsModalOpen(false); // Close modal after update
          }}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all"
        >
          Update
        </Button>
        <Button
          onClick={() => {
            handleDeleteTimeSlot(selectedSlot.timeSlotId);
            setIsModalOpen(false); // Close modal after delete
          }}
          variant="outline"
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
);

export default TimeSlotModal;
