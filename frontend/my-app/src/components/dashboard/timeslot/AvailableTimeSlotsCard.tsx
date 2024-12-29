import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import GroupedTimeSlots from "./GroupedTimeSlots";
import TimeSlotModal from "./TimeSlotModal";

type AvailableTimeSlotsCardProps = {
  groupedSlots: any;
  handleUpdateTimeSlot: (id: string, startTime: string, endTime: string) => void;
  handleDeleteTimeSlot: (id: string) => void;
  setRefreshKey: (keyUpdater: (prev: number) => number) => void; // Updated type
};

const AvailableTimeSlotsCard: React.FC<AvailableTimeSlotsCardProps> = ({
  groupedSlots,
  handleUpdateTimeSlot,
  handleDeleteTimeSlot,
  setRefreshKey,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-left">
            <Calendar className="w-6 h-6" />
            Available Time Slots
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <GroupedTimeSlots
          groupedSlots={groupedSlots}
          setSelectedSlot={(slot) => {
            setSelectedSlot(slot);
            setNewStartTime(slot.startTime);
            setNewEndTime(slot.endTime);
            setIsModalOpen(true);
          }}
        />
        {isModalOpen && selectedSlot && (
          <TimeSlotModal
            selectedSlot={selectedSlot}
            newStartTime={newStartTime}
            setNewStartTime={setNewStartTime}
            newEndTime={newEndTime}
            setNewEndTime={setNewEndTime}
            setIsModalOpen={setIsModalOpen}
            handleUpdateTimeSlot={(id, startTime, endTime) => {
              handleUpdateTimeSlot(id, startTime, endTime);
              setRefreshKey((prev) => prev + 1); // Trigger re-fetch or re-render
            }}
            handleDeleteTimeSlot={(id) => {
              handleDeleteTimeSlot(id);
              setRefreshKey((prev) => prev + 1); // Trigger re-fetch or re-render
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableTimeSlotsCard;
