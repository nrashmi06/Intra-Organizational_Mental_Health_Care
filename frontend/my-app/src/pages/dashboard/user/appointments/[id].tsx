import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  User,
  UserCog,
  Calendar,
  Clock,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AppointmentDetailView from "@/components/dashboard/AppointmentDetailView";
import StackNavbar from "@/components/ui/stackNavbar";
import { Appointment } from "@/lib/types";
import { getAppointments } from "@/service/user/GetAppointments";

const UserAppointments = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const parsedId = id as string;
      if (parsedId) {
        setUserId(parsedId);
        fetchAppointments(parsedId);
      }
    }
  }, [id]);

  const fetchAppointments = async (userId: string) => {
    try {
      const response = await getAppointments(token, userId);
      if (response?.status === 200) {
        const appointmentData: Appointment[] = response.data;
        setAppointments(appointmentData);
      } else {
        console.error("Failed to fetch appointments:", response?.statusText);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleDetailView = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setIsMobileMenuOpen(false); // Close mobile menu when viewing details
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stackItems = [
    { label: "User Dashboard", href: "/dashboard/user" },
    { label: "User Appointments", href: `/dashboard/user/appointments/${id}` },
  ];
  if (appointments.length === 0) {
    return (
      <>
        <StackNavbar items={stackItems} />
        <div className="text-gray-500 flex items-center justify-center h-full p-4">
          No appointments found for User ID {id}
        </div>
      </>
    );
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <div
      className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => handleDetailView(appointment.appointmentId)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          #{appointment.appointmentId}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            appointment.status === "CONFIRMED"
              ? "bg-green-100 text-green-800"
              : appointment.status === "REQUESTED"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
        <div className="flex items-center gap-2">
          <User size={18} className="text-blue-600 shrink-0" />
          <span className="text-sm text-gray-600">{appointment.userName}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserCog size={18} className="text-purple-600 shrink-0" />
          <span className="text-sm text-gray-600">{appointment.adminName}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-500 shrink-0" />
          <span className="text-sm text-gray-600">
            {formatDate(appointment.date)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-gray-500 shrink-0" />
          <span className="text-sm text-gray-600">
            {formatTime(appointment.startTime)} -{" "}
            {formatTime(appointment.endTime)}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <MessageSquare size={18} className="text-gray-500 mt-1 shrink-0" />
        <p className="text-sm text-gray-600">{appointment.appointmentReason}</p>
      </div>

      <button
        className="w-full mt-4 text-center py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors text-sm font-medium"
        onClick={() => handleDetailView(appointment.appointmentId)}
      >
        View Details
      </button>
    </div>
  );

  return (
    <>
      <StackNavbar items={stackItems} />

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-16 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-full shadow-md"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Appointments List Section */}
        <div
          className={`w-full lg:w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto 
                     fixed lg:relative z-40 transition-transform duration-300 ease-in-out
                     ${
                       isMobileMenuOpen
                         ? "translate-x-0"
                         : "-translate-x-full lg:translate-x-0"
                     }
                     h-[calc(100vh-64px)] lg:h-auto`}
        >
          {userId && (
            <div className="space-y-4 p-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.appointmentId}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
          {!userId && (
            <p className="text-gray-500 p-4">Loading user information...</p>
          )}
        </div>

        {/* Appointment Detail View Section */}
        <div className="w-full lg:w-2/3 bg-gray-100 min-h-[calc(100vh-64px)]">
          {selectedAppointment ? (
            <AppointmentDetailView
              appointmentId={selectedAppointment}
              token={token}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 p-4 text-center">
              Select an appointment to view details
            </div>
          )}
        </div>
      </div>
    </>
  );
};

UserAppointments.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default UserAppointments;
