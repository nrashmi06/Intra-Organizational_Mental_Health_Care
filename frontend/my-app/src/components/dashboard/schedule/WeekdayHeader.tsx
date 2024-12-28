import React from 'react';

export const WeekdayHeader: React.FC = () => (
  <div className="grid grid-cols-7 bg-gray-50">
    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
      <div key={day} className="p-4 text-center font-medium text-gray-600">
        <span className="hidden md:inline">{day}</span>
        <span className="md:hidden">{day.charAt(0)}</span>
      </div>
    ))}
  </div>
);