import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import GroupedTimeSlots from "./GroupedTimeSlots";
import TimeSlotModal from "./TimeSlotModal";
import { Button } from "@/components/ui/button";

type AvailableTimeSlotsCardProps = {
  groupedSlots: any;
  handleUpdateTimeSlot: (id: string, startTime: string, endTime: string) => void;
  handleDeleteTimeSlot: (id: string) => void;
  setRefreshKey: (keyUpdater: (prev: number) => number) => void;
  setIsAvailable: (isAvailable: boolean) => void;
};

const AvailableTimeSlotsCard: React.FC<AvailableTimeSlotsCardProps> = ({
  groupedSlots,
  handleUpdateTimeSlot,
  handleDeleteTimeSlot,
  setRefreshKey,
  setIsAvailable,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className="border-none bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
      <CardHeader className="border-b pb-4 space-y-4">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold text-gray-800">Time Slots</span>
          </div>

          <div className="flex w-full sm:w-auto gap-1 bg-white p-1.5 rounded-xl shadow-sm border">
            <Button
              onClick={() => setIsAvailable(false)}
              variant="ghost"
              size="sm"
              className={`flex-1 sm:flex-none rounded-lg text-sm font-medium transition-all duration-300 ${
                groupedSlots?.isAvailable === false
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-lime-700 hover:text-white"
              }`}
            >
              Booked
            </Button>
            <Button
              onClick={() => setIsAvailable(true)}
              variant="ghost"
              size="sm"
              className={`flex-1 sm:flex-none rounded-lg text-sm font-medium transition-all duration-300 ${
                groupedSlots?.isAvailable === true
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-lime-700 hover:text-white"
              }`}
            >
              Available
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
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
              setRefreshKey((prev) => prev + 1);
            }}
            handleDeleteTimeSlot={(id) => {
              handleDeleteTimeSlot(id);
              setRefreshKey((prev) => prev + 1);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableTimeSlotsCard;