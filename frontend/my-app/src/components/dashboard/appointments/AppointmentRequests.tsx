import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import InlineLoader from "@/components/ui/inlineLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAppointmentsByFilter } from "@/service/appointment/getAppointmentsByFilter";
import {
  Search,
  XCircle,
} from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Button } from "@/components/ui/button";
import AppointmentDetailView from "@/components/dashboard/AppointmentDetailView";
import StatusInputComponent from "@/components/dashboard/appointments/MessageRequestBox";
import updateAppointmentStatus from "@/service/appointment/updateAppointmentStatus";
import { Appointment } from "@/lib/types";
import Pagination from "@/components/ui/PaginationComponent";
import AppointmentRequestCard from "./AppointmentRequestCard";

export function AppointmentRequests() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter] = useState("REQUESTED");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [timeFilter] = useState("UPCOMING");
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isReject, setReject] = useState(false);
  const [status, setStatus] = useState("");

  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  );
  const totalElements = useSelector(
    (state: RootState) => state.appointments.page?.totalElements
  );
  const totalPages = useSelector(
    (state: RootState) => state.appointments.page?.totalPages ?? 0
  );
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const handleAccept = async (appointment: Appointment) => {
    try {
      setReject(false);
      setSelectedAppointment(appointment);
      await updateAppointmentStatus(
        token,
        appointment.appointmentId,
        "CONFIRMED",
        token
      );
      fetchAppointments();
    } catch (error) {
      console.error("Error accepting appointment:", error);
    }
  };

  const handleReject = async (appointment: Appointment) => {
    try {
      await setStatus("CANCELLED");
      await setReject(true);
      await setSelectedAppointment(appointment);
      setShowPopUp(true);
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };

  const handleView = (appointment: Appointment) => {
    setReject(false);
    setSelectedAppointment(appointment);
    setShowPopUp(true);
  };

  const closePopUp = () => {
    setShowPopUp(false);
    setSelectedAppointment(null);
    setReject(false);
    fetchAppointments();
  };

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

  useEffect(() => {
    fetchAppointments();
  }, [token, dispatch, statusFilter, currentPage,pageSize,timeFilter,userId,]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 sm:p-8">
      <div className=" space-y-4 sm:space-y-6">
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
            <div className="bg-amber-400 rounded-full px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">
                  {totalElements} Pending
                </span>
              </div>
            </div>
          </div>
        </div>

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

          {loading ? (
            <div className="flex justify-center py-8">
              <InlineLoader />
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAppointments.map((appointment: Appointment) => (
                <AppointmentRequestCard
                  key={appointment.appointmentId}
                  appointment={appointment}
                  onView={handleView}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
              <div className="col-span-full flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
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

      {showPopUp && selectedAppointment && !isReject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-[80%] max-w-[800px] h-auto max-h-[80vh] overflow-y-auto">
            <Button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={closePopUp}
            >
              <XCircle className="w-6 h-6" />
            </Button>
            <AppointmentDetailView
              appointmentId={selectedAppointment.appointmentId}
              token={token}
            />
          </div>
        </div>
      )}

      {showPopUp && selectedAppointment && isReject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg relative w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] max-w-lg max-h-[80vh] overflow-hidden">
            <Button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={closePopUp}
            >
              <XCircle className="w-6 h-6" />
            </Button>
            <StatusInputComponent
              appointmentId={selectedAppointment.appointmentId}
              token={token}
              status={status === "CONFIRMED" ? "CONFIRMED" : "CANCELLED"}
              closePopUp={closePopUp}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentRequests;
