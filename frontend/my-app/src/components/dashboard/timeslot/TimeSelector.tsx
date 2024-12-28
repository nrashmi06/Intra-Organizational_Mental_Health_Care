import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type TimeSelectorProps = {
  selectedTime: string;
  onChange: (time: string) => void;
  label: string;
};

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  onChange,
  label,
}) => {
  // Generate hours (5-22) and minutes (0-59)
  const hours: number[] = Array.from({ length: 18 }, (_, i) => i + 5);
  const minutes: number[] = Array.from({ length: 60 }, (_, i) => i);

  const [selectedHour, setSelectedHour] = useState<number>(
    selectedTime ? parseInt(selectedTime.split(':')[0]) : hours[0]
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    selectedTime ? parseInt(selectedTime.split(':')[1]) : 0
  );

  // Dropdown visibility states
  const [hoursOpen, setHoursOpen] = useState(false);
  const [minutesOpen, setMinutesOpen] = useState(false);

  // Refs for click outside handling
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  const handleTimeChange = (hour: number, minute: number): void => {
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    const newTime = `${formattedHour}:${formattedMinute}`;
    onChange(newTime);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hoursRef.current && !hoursRef.current.contains(event.target as Node)) {
        setHoursOpen(false);
      }
      if (minutesRef.current && !minutesRef.current.contains(event.target as Node)) {
        setMinutesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Custom dropdown component
  const Dropdown = ({ 
    values, 
    selected, 
    onSelect, 
    isOpen, 
    setIsOpen, 
    ref 
  }: { 
    values: number[], 
    selected: number, 
    onSelect: (val: number) => void, 
    isOpen: boolean, 
    setIsOpen: (open: boolean) => void,
    ref: React.RefObject<HTMLDivElement>
  }) => (
    <div ref={ref} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 
                   bg-white border border-gray-200 rounded-lg cursor-pointer
                   hover:border-gray-300 transition-all duration-200
                   shadow-sm hover:shadow"
      >
        <span className="text-base font-medium text-gray-700">
          {selected.toString().padStart(2, '0')}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 
                     ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 
        rounded-lg shadow-lg overflow-hidden">
<div className="max-h-[144px] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-gray-300 scrollbar-track-gray-100">
{values.map((value) => (
<div
key={value}
onClick={() => {
  onSelect(value);
  setIsOpen(false);
}}
className={`px-4 py-2 cursor-pointer text-base
           ${selected === value 
             ? 'bg-gray-100 text-gray-900 font-medium' 
             : 'text-gray-700 hover:bg-gray-50'
           } transition-colors duration-150`}
>
{value.toString().padStart(2, '0')}
</div>
))}
</div>
</div>

      )}
    </div>
  );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <Dropdown
          values={hours}
          selected={selectedHour}
          onSelect={(hour) => {
            setSelectedHour(hour);
            handleTimeChange(hour, selectedMinute);
          }}
          isOpen={hoursOpen}
          setIsOpen={setHoursOpen}
          ref={hoursRef}
        />

        <span className="text-xl font-medium text-gray-500">:</span>

        <Dropdown
          values={minutes}
          selected={selectedMinute}
          onSelect={(minute) => {
            setSelectedMinute(minute);
            handleTimeChange(selectedHour, minute);
          }}
          isOpen={minutesOpen}
          setIsOpen={setMinutesOpen}
          ref={minutesRef}
        />
      </div>
    </div>
  );
};