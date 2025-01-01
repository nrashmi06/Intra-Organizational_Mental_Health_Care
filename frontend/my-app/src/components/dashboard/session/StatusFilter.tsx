import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFilterProps {
  value: "COMPLETED" | "ONGOING";
  onChange: (value: "COMPLETED" | "ONGOING") => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  return (
    <div className="mb-1">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-40 h-10">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="ONGOING">Ongoing</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusFilter;
