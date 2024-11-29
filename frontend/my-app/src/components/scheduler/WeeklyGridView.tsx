import React from 'react';

// Define the Appointment type
interface Appointment {
  date: string | Date; // The date of the appointment, can be a string or Date object
  title: string; // Title of the appointment
  patient: string; // Patient's name
  color?: string; // Optional color for the appointment (e.g., for styling)
}

// Define the props type for the WeeklyGridView component
interface WeeklyGridViewProps {
  appointments: Appointment[]; // Array of Appointment objects
  date: Date; // The current date passed to determine the current week
}

// Create time slots from 9:00 AM to 5:00 PM
const timeSlots = Array.from({ length: 9 }, (_, i) => {
  const hour = i + 9; // Start from 9 AM
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${suffix}`;
});

const WeeklyGridView: React.FC<WeeklyGridViewProps> = ({ appointments, date = new Date() }) => {
  if (!date) {
    console.error('Invalid date prop:', date);
    return <div>Error: Date is not provided.</div>;
  }

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  // Calculate the start of the week (Sunday) for the given date
  const startOfWeek = new Date(date);
  const startDay = startOfWeek.getDate() - startOfWeek.getDay(); // Adjust to Sunday of the week

  // Derive the weekdays dynamically based on the start of the week
  const derivedWeekDays = Array.from({ length: 7 }, (_, i) => {
    const day = startDay + i; // Calculate each day of the week
    const dayDate = new Date(currentYear, currentMonth, day);
    const weekdayName = dayDate.toLocaleString('en-US', { weekday: 'long' }); // Get the weekday name (e.g., Monday)
    return {
      name: weekdayName,
      date: dayDate,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-8">
        <div className="p-2"></div>
        {derivedWeekDays.map((day, index) => (
          <div
            key={index}
            className="p-2 text-center font-semibold bg-gray-100 border border-gray-200"
          >
            {day.name}
            <br />
            <span className="text-xs">{day.date.getDate()}</span> {/* Show the date number */}
          </div>
        ))}
      </div>

      {/* Time slots grid */}
      <div className="grid grid-cols-8 divide-x">
        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            {/* Time Column */}
            <div className="p-2 text-right font-medium text-gray-500 border border-gray-200">{time}</div>

            {/* Appointment Cells */}
            {derivedWeekDays.map((day) => {
              // Filter appointments that match the current day and time slot
              const slotAppointments = appointments.filter((apt) => {
                const appointmentDate = new Date(apt.date);
                const appointmentDay = appointmentDate.toLocaleString('en-US', { weekday: 'long' });

                // Check if the appointment is on the same day
                if (appointmentDay === day.name) {
                  // Calculate appointment time in 12-hour format (e.g., 9:00 AM)
                  const appointmentTime = `${appointmentDate.getHours() % 12 === 0 ? 12 : appointmentDate.getHours() % 12}:00 ${appointmentDate.getHours() >= 12 ? "PM" : "AM"}`;

                  // Check if the appointment time matches the slot time
                  return appointmentTime === time;
                }
                return false;
              });

              return (
                <div key={`${day.name}-${time}`} className="p-2 relative border border-gray-200 h-auto flex flex-col gap-2">
                  {slotAppointments.length === 0 ? (
                    <span className="text-xs text-gray-400">No appointments</span>
                  ) : (
                    slotAppointments.map((apt, idx) => (
                      <div key={idx} className={`${apt.color || 'bg-gray-200'} text-sm p-2 rounded shadow`}>
                        <strong>{apt.title}</strong>
                        <br />
                        <span className="text-xs">{apt.patient}</span>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeeklyGridView;
