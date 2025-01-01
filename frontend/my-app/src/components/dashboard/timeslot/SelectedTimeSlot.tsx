// components/timeslot/SelectedTimeSlots.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import  Badge  from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface TimeSlot {
  startTime: string;
  endTime: string;
  date: string;
  isAvailable: boolean;
}

interface SelectedTimeSlotsProps {
  selectedSlots: TimeSlot[];
  onSlotSelection: (slot: TimeSlot) => void;
  onConfirmSlots: () => void;
  onClearSlots: () => void;
}

export const SelectedTimeSlots = ({
  selectedSlots,
  onSlotSelection,
  onConfirmSlots,
  onClearSlots
}: SelectedTimeSlotsProps) => {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Selected Time Slots
            </span>
            <Badge variant="secondary">
              {selectedSlots.length} 
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No time slots selected
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedSlots.map((slot, index) => (
                <div
                  key={index}
                  className="p-4 bg-teal-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onSlotSelection(slot)}
                >
                  <div>{slot.startTime} - {slot.endTime}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                onClick={onConfirmSlots}
                className="w-full bg-gradient-to-r from-teal-800 to-green-800 hover:from-teal-900 hover:to-green-900 transition-all"
              >
                Confirm Selected Slots
              </Button>
              <Button
                onClick={onClearSlots}
                variant="outline"
                className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50"
              >
                Clear All Selected Time Slots
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};