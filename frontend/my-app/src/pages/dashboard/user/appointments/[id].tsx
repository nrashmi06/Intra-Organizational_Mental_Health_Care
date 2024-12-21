import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Eye } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AppointmentDetailView from "@/components/dashboard/user/AppointmentDetailView";
import StackNavbar from "@/components/ui/stackNavbar";
import { Appointment } from "@/lib/types";
import { getAppointmentsByUserId } from "@/service/user/GetAppointmentsByUserId";

const UserAppointments = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id as string, 10);
      if (!isNaN(parsedId)) {
        setUserId(parsedId);
        fetchAppointments(parsedId);
      }
    }
  }, [id]);

  const fetchAppointments = async (userId: number) => {
    try {
      const response = await getAppointmentsByUserId(userId, token);
      if (response?.ok) {
        const appointmentData: Appointment[] = await response.json();
        console.log("Data issssssssssssssss:", appointmentData);
        setAppointments(appointmentData);
      } else {
        console.error("Failed to fetch appointments:", response?.statusText);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleDetailView = (appointmentId: number) => {
    setSelectedAppointment(appointmentId);
  };

  const stackItems = [
    { label: "User Dashboard", href: "/dashboard/user" },
    { label: "User Appointments", href: `/dashboard/user/appointments/${id}` },
  ];

  return (
    <>
      <StackNavbar items={stackItems} />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto p-4">
          {userId && (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="bg-white shadow-sm rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-700">
                      {appointment.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Appointment ID: {appointment.appointmentId}
                    </p>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">User:</span>{" "}
                      {appointment.userName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Admin:</span>{" "}
                      {appointment.adminName}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        appointment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                    <button
                      onClick={() => handleDetailView(appointment.appointmentId)}
                      className="text-purple-600 hover:text-purple-800 transition-colors"
                      title="View Appointment Details"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!userId && (
            <p className="text-gray-500">Loading user information...</p>
          )}
        </div>
        <div className="w-2/3 bg-gray-100">
          <AppointmentDetailView
            appointmentId={selectedAppointment}
            token={token}
          />
        </div>
      </div>
    </>
  );
};

UserAppointments.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default UserAppointments;
