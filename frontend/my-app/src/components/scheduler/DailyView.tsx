import React from 'react';

const timeSlots = Array.from({ length: 9 }, (_, i) => {
  const hour = i + 9; // Start from 9 AM
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${suffix}`;
});

const DailyView = ({ appointments, date = new Date() }: any) => {
  if (!date) {
    console.error('Invalid date prop:', date);
    return <div>Error: Date is not provided.</div>;
  }

  // Get the date parts (day, month, year)
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const currentDay = date.getDate();

  // Calculate the start of the day and the end of the day
  const startOfDay = new Date(currentYear, currentMonth, currentDay, 9, 0, 0); // 9 AM of the current day
  const endOfDay = new Date(currentYear, currentMonth, currentDay, 17, 0, 0); // 5 PM of the current day

  // Filter appointments for the selected day
  const filteredAppointments = appointments.filter((apt: any) => {
    const appointmentDate = new Date(apt.date);
    return appointmentDate >= startOfDay && appointmentDate <= endOfDay;
  });

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Date Header */}
      <div className="p-4 text-center font-semibold text-xl">
        {date.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </div>

      {/* Time slots grid */}
      <div className="grid grid-cols-8 divide-x">
        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            {/* Time Column */}
            <div className="p-2 text-right font-medium text-gray-500 border border-gray-200">{time}</div>

            {/* Appointment Cells */}
            <div className="p-2 relative border border-gray-200 h-auto flex flex-col gap-2 col-span-7">
              {/* Map through the filtered appointments */}
              {filteredAppointments.map((apt: any, idx: number) => {
                const appointmentDate = new Date(apt.date);
                const appointmentTime = `${appointmentDate.getHours() % 12 === 0 ? 12 : appointmentDate.getHours() % 12}:00 ${appointmentDate.getHours() >= 12 ? 'PM' : 'AM'}`;

                // Check if the appointment matches this time slot
                if (appointmentTime === time) {
                  return (
                    <div key={idx} className={`${apt.color} text-sm p-4 rounded shadow`}>
                      <strong>{apt.title}</strong>
                      <br />
                      <span className="text-xs">{apt.patient}</span>
                    </div>
                  );
                }
                return null; // Return nothing if no appointment matches this time slot
              })}

              {/* If no appointments for this time slot */}
              {filteredAppointments.every((apt: any) => {
                const appointmentDate = new Date(apt.date);
                const appointmentTime = `${appointmentDate.getHours() % 12 === 0 ? 12 : appointmentDate.getHours() % 12}:00 ${appointmentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
                return appointmentTime !== time;
              }) && (
                <span className="text-xs text-gray-400 col-span-7">No appointments</span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DailyView;
