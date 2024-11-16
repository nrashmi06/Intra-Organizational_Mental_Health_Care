import React, { useState } from 'react';

type CalendarProps = {
  selected?: Date;
  onSelect?: (date: Date) => void;
  mode?: 'single';
};

export function Calendar({ selected, onSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selected || new Date());

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    if (onSelect) {
      onSelect(date);
    }
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      if (date.getMonth() !== month) break;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`p-2 rounded ${
            selected && selected.toDateString() === date.toDateString()
              ? 'bg-blue-500 text-white'
              : today.toDateString() === date.toDateString()
              ? 'bg-gray-200'
              : ''
          }`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-lg font-bold text-center">
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h3>
      <div className="grid grid-cols-7 gap-1 mt-4">{renderDays()}</div>
    </div>
  );
}
