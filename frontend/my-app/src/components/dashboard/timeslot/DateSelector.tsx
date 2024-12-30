import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface DateSelectorProps {
  id: string;
  label: string;
  value: string;
  onChange: (date: string) => void;
  accentColor: 'teal' | 'lime';
}

export const DateSelector = ({ id, label, value, onChange, accentColor }: DateSelectorProps) => {
  const colorClasses = {
    teal: {
      hover: 'group-hover:text-teal-700',
      icon: 'text-teal-600',
      focus: 'focus:ring-teal-500 focus:border-teal-500 hover:border-teal-400'
    },
    lime: {
      hover: 'group-hover:text-lime-700',
      icon: 'text-lime-600',
      focus: 'focus:ring-lime-500 focus:border-lime-500 hover:border-lime-400'
    }
  };

  return (
    <div className="space-y-3 group">
      <Label 
        htmlFor={id} 
        className={`flex items-center gap-2 text-base font-medium ${colorClasses[accentColor].hover} transition-colors`}
      >
        <Calendar className={`w-5 h-5 ${colorClasses[accentColor].icon}`} />
        {label}
      </Label>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border-2 rounded-lg p-3 focus:ring-2 ${colorClasses[accentColor].focus} transition-all duration-200`}
      />
    </div>
  );
};