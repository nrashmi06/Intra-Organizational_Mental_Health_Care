import { Appointment } from "@/lib/types";
import { parseISO } from "date-fns";

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    CONFIRMED: 'rgba(0, 151, 33, 0.55)',
    CANCELLED: 'rgba(218, 11, 11, 0.4)',
    REQUESTED: 'rgba(255, 191, 0, 0.4)',
    DEFAULT: '#9E9E9E'
  };
  return colors[status] || colors.DEFAULT;
};

export const getAppointmentsForDay = (appointments: Appointment[], day: Date) => {
  return appointments.filter(apt => {
    const aptDate = parseISO(apt.date);
    return aptDate.toDateString() === day.toDateString();
  });
};