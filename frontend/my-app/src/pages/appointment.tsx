import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import { fetchAdmins } from "@/service/adminProfile/getAllAdmin";
import { RootState } from "@/store";
import createAppointment from "@/service/appointment/createAppointment";
import fetchTimeSlots from "@/service/timeslot/fetchTimeSlotsTrue";
import router from "next/router";
import { PersonalInfo } from "@/components/bookAppointments/PersonalInfo";
import { AdminSelect } from "@/components/bookAppointments/AdminSelect";
import AppointmentReason from "@/components/bookAppointments/AppointmentReason";
import { DateTimeSelect } from "@/components/bookAppointments/DateTimeSelect";
import { PrioritySelect } from "@/components/bookAppointments/PrioritySelect";
import { FormData, Slot } from "@/lib/types";
import SuccessMessage from "@/components/bookAppointments/SuccessMessage";
import TermsModal from "@/components/terms/TermsAndConditionModal";
export default function BookAppointment() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<
    { id: number; time: string }[]
  >([]);
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  useEffect(() => {
    async function loadAdmins() {
      if (!token) {
        router.push("/signin");
        return;
      }
      try {
        const response = await fetchAdmins(token);
        setAdmins(response as any[]);
      } catch (err) {
        console.error("Error fetching admins:", err);
      }
    }
    loadAdmins();
  }, [token]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedAdminId || !token) return;
      const startDate = new Date().toISOString().split("T")[0];
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      const endDate = oneMonthLater.toISOString().split("T")[0];
      const isAvailable = true;
      try {
        const timeSlots = await fetchTimeSlots(
          selectedAdminId.toString(),
          startDate,
          endDate,
          isAvailable,
          token
        );
        setAvailableSlots(timeSlots);
      } catch (error) {
          console.error("Error fetching time slots:", error)
      }
    };

    fetchSlots();
  }, [selectedAdminId, token]);

  const uniqueDates = [
    ...new Set(availableSlots.map((slot: Slot) => slot.date)),
  ];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const timesForDate = availableSlots
      .filter((slot) => slot.date === date && slot.isAvailable)
      .map((slot) => ({
        id: slot.timeSlotId,
        time: `${slot.startTime.slice(0, 5)} - ${slot.endTime.slice(0, 5)}`,
      }));
    setAvailableTimes(timesForDate);
  };

  const handleTimeSelect = (timeSlotId: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      timeSlotId,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.timeSlotId) {
      console.error("Error: timeSlotId is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createAppointment(token, formData);

      if (response === 409) {
        alert("Error: Appointment already exists");
        router.push("/");
        return;
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/");
      }, 3000);
    } catch (err) {
      console.error("Error creating appointment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-4xl backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle>Book an Appointment</CardTitle>
            <p className="text-gray-600">
              Fill out the details below to schedule your appointment
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <PersonalInfo
                formData={formData}
                handleInputChange={handleInputChange}
              />
              <AppointmentReason
                formData={formData}
                handleInputChange={handleInputChange}
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
              />
              {admins.length > 0 ? (
                <AdminSelect
                  admins={admins}
                  onAdminSelect={(value: string) => {
                    setSelectedAdminId(value);
                    handleInputChange("adminId", value);
                  }}
                />
              ) : (
                <div>No admins available</div>
              )}
              <DateTimeSelect
                uniqueDates={uniqueDates}
                selectedDate={selectedDate}
                availableTimes={availableTimes}
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
              />
              <PrioritySelect
                formData={formData}
                handleInputChange={handleInputChange}
              />

              <div className="flex items-center space-x-3">
                <Checkbox
                  required
                  id="terms"
                  className="rounded border-gray-300"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <button
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsTermsModalOpen(true);
                    }}
                    className="text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Terms of Service 
                  </button>
                </label>
              </div>
              <TermsModal 
                isOpen={isTermsModalOpen} 
                onClose={() => setIsTermsModalOpen(false)} 
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-red-500 font-medium text-lg">
          If you are in urgent need of help, please dial 100 for immediate
          assistance.
        </p>
      </main>
      <SuccessMessage show={showSuccess} />
    </div>
  );
}