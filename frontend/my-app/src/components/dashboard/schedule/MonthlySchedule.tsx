import { Appointment } from "@/lib/types";
import { format, parseISO } from "date-fns";


const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        CONFIRMED: '#4CAF50',
        CANCELED: '#F44336',
        REQUESTED: '#FFA726',
        DEFAULT: '#9E9E9E'
    };
    return colors[status] || colors.DEFAULT;
    };

// MonthlySchedule.tsx - Updated monthly view
const MonthlySchedule: React.FC<{ appointments: Appointment[]; date?: Date }> = ({
  appointments,
  date = new Date()
}) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();

  const weeks = Math.ceil((totalDays + startDay) / 7);
  const days = Array.from({ length: weeks * 7 }, (_, i) => {
    const day = new Date(startOfMonth);
    day.setDate(1 - startDay + i);
    return day;
  });

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => {
      const aptDate = parseISO(apt.date);
      return aptDate.toDateString() === day.toDateString();
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
        
        {days.map((day, i) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = day.getMonth() === date.getMonth();
          
          return (
            <div
              key={i}
              className={`min-h-[120px] p-2 bg-white ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              <div className="font-medium text-sm">{format(day, 'd')}</div>
              <div className="mt-1 space-y-1">
                {dayAppointments.map((apt, idx) => (
                  <div
                    key={idx}
                    className="text-xs p-1 rounded truncate"
                    style={{ backgroundColor: getStatusColor(apt.status) + '40' }}
                  >
                    {format(parseISO(`2024-01-01T${apt.startTime}`), 'h:mm a')} -{' '}
                    {apt.appointmentReason}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlySchedule;