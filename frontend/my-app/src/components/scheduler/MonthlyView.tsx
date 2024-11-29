import React from 'react';

// Define the Appointment type
interface Appointment {
  date: string | Date; // The date of the appointment, can be a string or Date object
  title: string; // Title of the appointment
  color?: string; // Optional color code for styling
}

// Define the props type for the MonthlyView component
interface MonthlyViewProps {
  appointments: Appointment[]; // Array of Appointment objects
  date: Date; // Date object representing the selected month and year
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ appointments, date }) => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  // Calculate the first day of the month and the number of days in the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const numDaysInMonth = lastDayOfMonth.getDate();

  // Create an array to represent all days of the month
  const daysInMonth = Array.from({ length: numDaysInMonth }, (_, i) => i + 1);

  // Weekday names for displaying
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Function to get appointments for a specific day
  const getAppointmentsForDay = (day: number): Appointment[] => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate.getDate() === day && aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Month View</h2>
      <div className="grid grid-cols-7 gap-4">
        {/* Render the weekdays header */}
        {weekDays.map((day, index) => (
          <div key={index} className="font-semibold text-center text-gray-700">
            {day}
          </div>
        ))}

        {/* Render empty cells for the days before the 1st */}
        {Array.from({ length: firstDayOfMonth.getDay() }).map((_, idx) => (
          <div key={idx}></div>
        ))}

        {/* Render the days of the month */}
        {daysInMonth.map((day) => {
          const appointmentsForDay = getAppointmentsForDay(day);
          const dayOfWeek = new Date(currentYear, currentMonth, day).getDay(); // Get the day of the week (0-6)
          return (
            <div key={day} className="relative border p-2 rounded-lg">
              <div className="font-semibold text-center text-gray-800">{day}</div>
              <div className="text-center text-sm text-gray-500">{weekDays[dayOfWeek]}</div>

              {/* Display appointments for the day */}
              {appointmentsForDay.length > 0 ? (
                <div className="mt-2">
                  {appointmentsForDay.map((apt, idx) => (
                    <div
                      key={idx}
                      className={`mt-1 p-1 rounded-md text-xs text-gray-700 ${apt.color || 'bg-gray-200'}`}
                    >
                      <strong>{apt.title}</strong> - {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400">No appointments</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyView;
