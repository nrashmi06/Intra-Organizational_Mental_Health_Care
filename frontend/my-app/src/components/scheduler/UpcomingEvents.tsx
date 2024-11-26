import React from 'react';

// Define the Event type
interface Event {
  title: string; // The title of the event
  time: string;  // The time of the event, in string format (e.g., '10:00 AM')
}

// Define the props type for the UpcomingEvents component
interface UpcomingEventsProps {
  appointments: Event[]; // Array of Event objects
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ appointments }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <h2 className="font-semibold mb-4">Upcoming Events</h2>
    <div className="space-y-3">
      {appointments.map((event, index) => (
        <div key={index} className="flex justify-between items-center text-sm">
          <span className="text-gray-700">{event.title}</span>
          <span className="text-gray-500">{event.time}</span>
        </div>
      ))}
    </div>
  </div>
);

export default UpcomingEvents;
