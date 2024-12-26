import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InlineLoader from "@/components/ui/inlineLoader";
import { Appointment } from "@/lib/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAppointmentByAdmin } from "@/service/appointment/getAppointmentByAdmin";
import { Calendar, Clock, Search, User,  CalendarDays } from "lucide-react";

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

  const getStatusColor = (status: string) => {
    const statusColors = {
      CONFIRMED: "bg-emerald-100 text-emerald-800",
      CANCELLED: "bg-red-100 text-red-800",
      REQUESTED: "bg-amber-100 text-amber-800",
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.appointmentReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.adminName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-4 border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{appointment.userName}</div>
          </div>
          <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">{appointment.appointmentReason}</p>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {appointment.date}
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {appointment.startTime} - {appointment.endTime}
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            Admin: {appointment.adminName}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <InlineLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
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

        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-white rounded-t-xl p-4">
            <div className="flex flex-col gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-10 bg-gray-50 border-gray-200 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {["ALL", "REQUESTED", "CONFIRMED", "CANCELLED"].map((status) => (
                  <Button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    variant={statusFilter === status ? "default" : "outline"}
                    className={`text-sm flex-1 sm:flex-none ${
                      statusFilter === status 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            {filteredAppointments.length > 0 ? (
              <div>
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Client</TableHead>
                        <TableHead className="font-semibold">Reason</TableHead>
                        <TableHead className="font-semibold">Admin</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Date & Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => (
                        <TableRow 
                          key={appointment.appointmentId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{appointment.userName}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate text-gray-600">{appointment.appointmentReason}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-600">{appointment.adminName}</div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                {appointment.startTime} - {appointment.endTime}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No appointments found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AllAppointments;