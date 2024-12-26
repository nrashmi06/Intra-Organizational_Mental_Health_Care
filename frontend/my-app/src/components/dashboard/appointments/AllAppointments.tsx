import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Loading from "@/components/ui/loading"; // Replace with your Loader component
import { Appointment } from "@/lib/types"; // Import the Appointment interface
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAppointmentByAdmin } from "@/service/appointment/getAppointmentByAdmin";

export function AllAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
    const token = useSelector((state: RootState) => state.auth.accessToken);
  // Function to fetch appointments
  const fetchAppointments = async (token: string) => {
    try {
      const response = await getAppointmentByAdmin(token);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchAppointments(token);
    } else {
      console.error("No auth token found.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading /> {/* A spinner or loader for visual feedback */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">All Appointments</h1>
      {appointments.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Appointment ID</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Admin Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.appointmentId}>
                <TableCell>{appointment.appointmentId}</TableCell>
                <TableCell>{appointment.appointmentReason}</TableCell>
                <TableCell>{appointment.userName}</TableCell>
                <TableCell>{appointment.adminName}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.startTime}</TableCell>
                <TableCell>{appointment.endTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center">
          <p className="text-gray-500">No appointments found.</p>
        </div>
      )}
    </div>
  );
}
