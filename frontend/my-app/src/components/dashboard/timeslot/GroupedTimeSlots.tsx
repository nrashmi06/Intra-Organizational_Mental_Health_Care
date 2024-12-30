import React from "react";
import TimeSlot from "./TimeSlots";

const GroupedTimeSlots: React.FC<{
  groupedSlots: { [key: string]: any[] };
  setSelectedSlot: (slot: any) => void;
}> = ({ groupedSlots, setSelectedSlot }) => (
  <div className="space-y-4">
    {Object.entries(groupedSlots)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, slots]) => (
        <div key={date} className="space-y-2">
          <h3 className="font-semibold text-lg">{date}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slots.map((slot: any, index: number) => (
              <TimeSlot key={index} slot={slot} onClick={() => setSelectedSlot(slot)} />
            ))}
          </div>
        </div>
      ))}
  </div>
);

export default GroupedTimeSlots;
