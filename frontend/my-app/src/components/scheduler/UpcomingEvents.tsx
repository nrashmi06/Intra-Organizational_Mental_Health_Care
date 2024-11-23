import React from 'react';

const UpcomingEvents = ({ appointments }: any) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <h2 className="font-semibold mb-4">Upcoming Events</h2>
    <div className="space-y-3">
      {appointments.map((event: any, index: number) => (
        <div key={index} className="flex justify-between items-center text-sm">
          <span className="text-gray-700">{event.title}</span>
          <span className="text-gray-500">{event.time}</span>
        </div>
      ))}
    </div>
  </div>
);

export default UpcomingEvents;
