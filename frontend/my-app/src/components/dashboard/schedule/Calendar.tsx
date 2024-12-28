import { Appointment } from "@/lib/types";
import { parseISO } from "date-fns";

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    CONFIRMED: '#4CAF50',
    CANCELED: '#F44336',
    REQUESTED: '#FFA726',
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