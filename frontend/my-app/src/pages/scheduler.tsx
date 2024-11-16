'use client'

import React,{ useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import "@/styles/global.css";
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react'

export default function SchedulerPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState("week")

  const upcomingEvents = [
    { name: "Meet the person by name ABC", time: "9:30 a.m" },
    { name: "Meet the person by name ABC", time: "9:30 a.m" },
    { name: "Meet the person by name ABC", time: "9:30 a.m" },
    { name: "Meet the person by name ABC", time: "9:30 a.m" },
    { name: "Meet the person by name ABC", time: "9:30 a.m" },
    { name: "Meet the person by name ABC", time: "9:30 a.m" },
    { name: "Meet the person by name ABC", time: "9:30 a.m" },
  ]

  const appointments = [
    {
      date: "20 MAR 2024",
      details: { name: "Alice smith", phone: "+91 01234567891" },
      urgency: "Urgent",
    },
    {
      date: "20 MAR 2024",
      details: { name: "Alice smith", phone: "+91 01234567891" },
      urgency: "Semi Urgent",
    },
    {
      date: "20 MAR 2024",
      details: { name: "Alice smith", phone: "+91 01234567891" },
      urgency: "Non-Urgent",
    },
    {
      date: "20 MAR 2024",
      details: { name: "Alice smith", phone: "+91 01234567891" },
      urgency: "Semi Urgent",
    },
    {
      date: "20 MAR 2024",
      details: { name: "Alice smith", phone: "+91 01234567891" },
      urgency: "Semi Urgent",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-200">
     <Navbar />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Appointments</h1>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Calendar and Upcoming Events */}
          <div className="col-span-12 md:col-span-3 space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md"
              />
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{event.name}</span>
                    <span className="text-gray-500">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Calendar View */}
          <div className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline">Today</Button>
                  <Button variant="outline">Back</Button>
                  <Button variant="outline">Next</Button>
                  <span className="text-sm text-gray-600">20 March 2024 - 20 April 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={view === "month" ? "default" : "outline"}
                    onClick={() => setView("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={view === "week" ? "default" : "outline"}
                    onClick={() => setView("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={view === "day" ? "default" : "outline"}
                    onClick={() => setView("day")}
                  >
                    Day
                  </Button>
                </div>
              </div>

              <div className="min-h-[400px] border rounded-lg">
                {/* Calendar grid would go here */}
              </div>
            </div>

            {/* Appointment List */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList>
                    <TabsTrigger value="pending">Pending 6</TabsTrigger>
                    <TabsTrigger value="history">History 6</TabsTrigger>
                  </TabsList>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                  <TabsContent value="pending">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Preferred time</TableHead>
                          <TableHead>Appointment Time</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Urgency</TableHead>
                          <TableHead>User Profile</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appointment, index) => (
                          <TableRow key={index}>
                            <TableCell>{appointment.date}</TableCell>
                            <TableCell>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="9am">9:00 AM</SelectItem>
                                  <SelectItem value="10am">10:00 AM</SelectItem>
                                  <SelectItem value="11am">11:00 AM</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                                {appointment.details.name}
                                <br />
                                {appointment.details.phone}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                appointment.urgency === "Urgent" ? "bg-red-100 text-red-800" :
                                appointment.urgency === "Semi Urgent" ? "bg-blue-100 text-blue-800" :
                                "bg-green-100 text-green-800"
                              }`}>
                                {appointment.urgency}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">View</Button>
                            </TableCell>
                            <TableCell>
                              <Button size="sm">Confirm</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">1 - 5 of 10</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Page</span>
                        <Button variant="outline" size="sm">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}