// AllAppointments.tsx

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InlineLoader from "@/components/ui/inlineLoader";
import { Appointment } from "@/lib/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAppointmentByAdmin } from "@/service/appointment/getAppointmentByAdmin";
import { CalendarDays, Search } from "lucide-react";
import AppointmentCard from "./AppointmentCard"; // Import AppointmentCard

export function AllAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const token = useSelector((state: RootState) => state.auth.accessToken);

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
  }, [token]);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointmentReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.adminName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime(); // Sorting appointments in chronological order
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <InlineLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Appointments</h1>
            <p className="text-sm sm:text-base text-gray-500">View and manage all appointment records</p>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-medium">{appointments.length} Total</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="relative w-full mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search appointments..."
              className="pl-10 bg-gray-50 border-gray-200 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {["ALL", "REQUESTED", "CONFIRMED", "CANCELLED"].map((status) => (
              <Button
                key={status}
                onClick={() => setStatusFilter(status)}
                variant={statusFilter === status ? "default" : "outline"}
                className={`text-sm flex-1 sm:flex-none ${
                  statusFilter === status ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {sortedAppointments.length > 0 ? (
              sortedAppointments.map((appointment) => (
                <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-semibold text-gray-900">No appointments found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllAppointments;
