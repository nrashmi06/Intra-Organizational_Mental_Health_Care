import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Label } from "@/components/ui/label";
  import { FormData } from "@/lib/types";
  
  interface PrioritySelectProps {
    formData: FormData;
    handleInputChange: (field: keyof FormData, value: string) => void;
  }

  export const PrioritySelect = ({ formData, handleInputChange }: PrioritySelectProps) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Priority</Label>
      <Select
        value={formData.severityLevel}
        onValueChange={(value) => handleInputChange('severityLevel', value)}
      >
        <SelectTrigger className="h-12 text-lg rounded-xl border-gray-200 bg-white">
          <SelectValue placeholder="Select priority level" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-md rounded-md">
          <SelectItem value="LOW">Low Priority</SelectItem>
          <SelectItem value="MEDIUM">Medium Priority</SelectItem>
          <SelectItem value="HIGH">High Priority</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );