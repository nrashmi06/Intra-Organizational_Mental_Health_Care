import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/ScrollArea";

interface DateTimeSelectProps {
  uniqueDates: string[];
  selectedDate: string | null;
  availableTimes: { id: number; time: string }[];
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
}

export const DateTimeSelect: React.FC<DateTimeSelectProps> = ({ 
  uniqueDates, 
  selectedDate, 
  availableTimes, 
  onDateSelect, 
  onTimeSelect 
}) => (
  <>
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Select Date</Label>
      <Select onValueChange={onDateSelect}>
        <SelectTrigger className="h-12 text-sm rounded-xl border-gray-200 bg-white">
          <SelectValue placeholder="Select date" />
        </SelectTrigger>
        <SelectContent className="max-h-96 overflow-y-auto bg-white">
          <ScrollArea className="h-full">
            {uniqueDates.map((date) => (
              <SelectItem key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Select Time</Label>
      <Select disabled={!selectedDate} onValueChange={onTimeSelect}>
        <SelectTrigger className="h-12 text-sm rounded-xl border-gray-200 bg-white">
          <SelectValue placeholder={selectedDate ? "Select time" : "Select date first"} />
        </SelectTrigger>
        <SelectContent className="max-h-96 overflow-y-auto bg-white">
          <ScrollArea className="h-full">
            {availableTimes.map((slot) => (
              <SelectItem key={slot.id} value={slot.id.toString()}>
                {slot.time}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  </>
);