import React, { useState } from "react";

const TimeSlot: React.FC<{
  slot: { startTime: string; endTime: string; isAvailable: boolean; timeSlotId: string; date: string };
  onClick: () => void;
}> = ({ slot, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div
      className={`relative p-6 rounded-lg shadow-lg transition-all cursor-pointer flex flex-col items-center space-y-3 ${
        isSelected
          ? "bg-gradient-to-r from-purple-200 to-pink-200 text-white"
          : isHovered
          ? "bg-gray-50 border-2 border-gray-300"
          : "bg-white border border-gray-200"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setIsSelected(true);
        onClick();

        // Reset the selected state after 3 seconds
        setTimeout(() => {
          setIsSelected(false);
        }, 200);
      }}
    >
      {/* Date Section */}
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-500">{slot.date}</p>
      </div>

      {/* Time Section */}
      <div className="text-center">
        <p className="text-xl font-bold">
          {slot.startTime} - {slot.endTime}
        </p>
      </div>

      {/* Availability Status */}
      <div
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          slot.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {slot.isAvailable ? "Available" : "Booked"}
      </div>

      {/* Subtle Shadow Effect */}
      <div
        className={`absolute inset-0 rounded-lg ${
          isSelected ? "shadow-[0_4px_15px_rgba(128,0,128,0.3)]" : ""
        }`}
      ></div>
    </div>
  );
};

export default TimeSlot;
