import React from "react";

const TimeSlot: React.FC<{
  slot: { startTime: string; endTime: string; isAvailable: boolean; timeSlotId: string };
  onClick: () => void;
}> = ({ slot, onClick }) => {
  const isSelected = false; 
  return (
    <div
      className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer ${
        isSelected
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          : "bg-white hover:bg-gray-50 border-2 border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="text-center">
        <p className="font-medium">
          {slot.startTime} - {slot.endTime}
        </p>
        <p className={`text-sm ${slot.isAvailable ? "text-green-500" : "text-red-500"}`}>
          {slot.isAvailable ? "Available" : "Booked"}
        </p>
      </div>
    </div>
  );
};

export default TimeSlot;
