import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InlineLoader from "@/components/ui/inlineLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAppointmentsByFilter } from "@/service/appointment/getAppointmentsByFilter";
import { CalendarDays, Search } from "lucide-react";
import AppointmentCard from "./AppointmentCard";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import Pagination from "@/components/ui/PaginationComponent";

export function AllAppointments() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState("UPCOMING");

  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  );
  const totalElements = useSelector(
    (state: RootState) => state.appointments.page?.totalElements
  );
  const totalPages = useSelector(
    (state: RootState) => state.appointments.page?.totalPages
  );
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const timeFilterOptions = [
    { value: "PAST", label: "Past" },
    { value: "UPCOMING", label: "Upcoming" },
  ];

  const filteredAppointments = useMemo(() => {
    if (!searchTerm.trim()) return appointments;

    const searchLower = searchTerm.toLowerCase().trim();
    return appointments.filter((appointment) => {
      const searchableFields = [
        appointment.userName,
        appointment.appointmentReason,
        appointment.adminName,
        appointment.status,
      ].filter(Boolean);

      return searchableFields.some((field) =>
        String(field).toLowerCase().includes(searchLower)
      );
    });
  }, [appointments, searchTerm]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token || !userId) {
        console.error("No auth token or user ID found.");
        return;
      }

      setLoading(true);
      try {
        const backendPage = currentPage - 1;
        await dispatch(
          getAppointmentsByFilter({
            timeFilter,
            status: statusFilter,
            page: backendPage,
            size: pageSize,
            userId,
          })
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, dispatch, statusFilter, currentPage, pageSize, timeFilter, userId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Appointments
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              View and manage all appointment records
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-medium">
                  {totalElements} Total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or reason..."
                className="pl-10 bg-gray-50 border-gray-200 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="border rounded-md p-2"
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {timeFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="border rounded-md p-2"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {["ALL", "REQUESTED", "CONFIRMED", "CANCELLED"].map((status) => (
              <Button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
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

          {/* Appointments List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <InlineLoader />
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.appointmentId}
                  appointment={appointment}
                />
              ))}
              
              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages || 1}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold text-gray-900">
                No appointments found
              </h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllAppointments;