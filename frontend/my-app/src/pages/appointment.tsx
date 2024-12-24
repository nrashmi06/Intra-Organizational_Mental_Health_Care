import React, { useState, useEffect } from 'react';
import { InfoIcon } from 'lucide-react';
import Navbar from "@/components/navbar/Navbar2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useSelector } from 'react-redux';
import { fetchAdmins } from '@/service/adminProfile/getAllAdmin';
import { RootState } from '@/store';
import axios from 'axios';
import createAppointment from '@/service/appointment/createAppointment';
import fetchTimeSlots from '@/service/timeslot/fetchTimeSlotsTrue';

export default function BookAppointment() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [admins, setAdmins] = useState<{ adminId: string; fullName: string }[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<Time[]>([]);
  const [formData, setFormData] = useState({
    adminId: "",
    timeSlotId: "",
    fullName: "",
    severityLevel: "",
    phoneNumber: "",
    appointmentReason: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };
  const token = useSelector((state: RootState) => state.auth.accessToken);

  interface Slot {
    timeSlotId: number;
    date: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }

  interface Time {
    id: number;
    time: string;
  }

  // Fetch admins data
  useEffect(() => {
    async function loadAdmins() {
      if (!token) return;
      try {
        const response = await fetchAdmins(token);
        setAdmins(response);
      } catch (err) {
        console.error('Error fetching admins:', err);
      }
    }
    loadAdmins();
  }, [token]);

  // Fetch available slots
  useEffect(() => {
    const fetchSlots = async () => {
      if (admins.length === 0 || !token) return; // Avoid fetching if no admins or token

      const adminId = admins[0]?.adminId; // Take the first admin's ID
      const startDate = new Date().toISOString().split('T')[0];
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      const endDate = oneMonthLater.toISOString().split('T')[0];
      const isAvailable = true;

      try {
        const timeSlots = await fetchTimeSlots(adminId, startDate, endDate, isAvailable, token);
        setAvailableSlots(timeSlots);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching time slots:', error.response?.data || error.message);
        } else {
          if (error instanceof Error) {
            console.error('Error fetching time slots:', error.message);
          } else {
            console.error('Error fetching time slots:', error);
          }
        }
      }
    };

    fetchSlots();
  }, [admins, token]);

  // Get unique dates from available slots
  const uniqueDates = [...new Set(availableSlots.map((slot: Slot) => slot.date))];

// Update available times when a date is selected
const handleDateSelect = (date: string) => {
  setSelectedDate(date);
  const timesForDate = availableSlots
    .filter(slot => slot.date === date && slot.isAvailable)
    .map(slot => ({
      id: slot.timeSlotId,
      time: `${slot.startTime.slice(0, 5)} - ${slot.endTime.slice(0, 5)}`
    }));
  setAvailableTimes(timesForDate);
};

// Update formData when time is selected
const handleTimeSelect = (timeSlotId: string) => {
  setFormData((prevFormData) => ({
    ...prevFormData,
    timeSlotId, // Set the selected timeSlotId
  }));
};


const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();
  console.log("Form Data before submit:", formData); // Debug log

  // Check if timeSlotId is not null or undefined
  if (!formData.timeSlotId) {
    console.error("Error: timeSlotId is missing");
    return;
  }

  try {
    const response = createAppointment(token, formData);
    console.log('Appointment created:', response);
  } catch (err) {
    console.error('Error creating appointment:', err);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-4xl backdrop-blur-sm bg-white/80 shadow-xl rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle>Book an Appointment</CardTitle>
            <p className="text-gray-600">Fill out the details below to schedule your appointment</p>
          </CardHeader>
          <CardContent className="p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Full Name"
                    className="h-12 text-lg rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    type="tel"
                    placeholder="Phone Number"
                    className="h-12 text-lg rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Admin</Label>
                <Select
                  value={formData.adminId}
                  onValueChange={(value) => handleInputChange('adminId', value)}
                >
                  <SelectTrigger className="h-12 text-lg rounded-xl border-gray-200 bg-white">
                    <SelectValue placeholder="Choose an admin" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96 overflow-y-auto">
                    <ScrollArea className="h-full">
                      {admins.map((admin) => (
                        <SelectItem key={admin.adminId} value={admin.adminId.toString()}>
                          {admin.fullName}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Date</Label>
                <Select onValueChange={handleDateSelect}>
                  <SelectTrigger className="h-12 text-lg rounded-xl border-gray-200 bg-white">
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96 overflow-y-auto">
                    <ScrollArea className="h-full">
                      {uniqueDates.map((date) => (
                        <SelectItem key={date} value={date}>
                          {new Date(date).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Time</Label>
                <Select disabled={!selectedDate} onValueChange={handleTimeSelect}>
                  <SelectTrigger className="h-12 text-lg rounded-xl border-gray-200 bg-white">
                    <SelectValue placeholder={selectedDate ? "Select time" : "Select date first"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-96 overflow-y-auto">
                    <ScrollArea className="h-full">
                      {availableTimes.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id.toString()}>
                          {slot.time}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              
              <div className="space-y-3">
              <div className="flex space-x-2">
                  <Label className="text-sm font-medium text-gray-700">Reason for Appointment</Label>
                  <div className="relative">
                    <InfoIcon
                      className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      aria-label="Additional information about appointment reason"
                    />
                    {showTooltip && (
                      <div className="absolute z-50 w-64 p-3 bg-white text-sm text-gray-600 rounded-lg shadow-lg border border-gray-100 left-full top-1/2 transform -translate-y-1/2 ml-2">
                        <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-100" />
                        <div className="relative">
                          Please provide details about why you're seeking an appointment to help us better assist you.
                        </div>
                      </div>
                    )}
                  </div>
                </div>                
                <Input
                  value={formData.appointmentReason}
                  onChange={(e) => handleInputChange('appointmentReason', e.target.value)}
                  placeholder="Please describe the reason for your appointment..."
                  className="min-h-[120px] py-2 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-200 hover:border-purple-400 focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Priority</Label>
                <Select
                  value={formData.severityLevel}
                  onValueChange={(value) => handleInputChange('severityLevel', value)}
                >
                  <SelectTrigger className="h-12 text-lg rounded-xl border-gray-200 bg-white">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-md rounded-md">
                    <SelectItem value="LOW">Low Priority</SelectItem>
                    <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                    <SelectItem value="HIGH">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox required id="terms" className="rounded border-gray-300" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/t&c" className="text-purple-600 hover:text-purple-800 font-medium">
                    Terms of Service and Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Book Appointment
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-8 text-center text-red-500 font-medium text-lg">
          If you are in urgent need of help, please dial 100 for immediate assistance.
        </p>
      </main>
    </div>
  );
}


