// 'use client'

// import React, { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import "@/styles/global.css";
// import Navbar from "@/components/navbar/NavBar";
// import Footer from "@/components/footer/Footer"; 
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { ChevronLeft, ChevronRight, Filter } from 'lucide-react'

// export default function SchedulerPage() {
//   const [date, setDate] = useState<Date>(new Date())
//   const [view, setView] = useState("week")

//   const upcomingEvents = [
//     { name: "Meet the person by name ABC", time: "9:30 a.m" },
//     { name: "Meet the person by name ABC", time: "9:30 a.m" },
//     { name: "Meet the person by name ABC", time: "9:30 a.m" },
//     { name: "Meet the person by name ABC", time: "9:30 a.m" },
//     { name: "Meet the person by name ABC", time: "9:30 a.m" },
//     { name: "Meet the person by name ABC", time: "9:30 a.m" },
//     { name: "Meet the person by name ABC", time: "9:30 a.m" },
//   ]

//   const appointments = [
//     {
//       date: "20 MAR 2024",
//       details: { name: "Alice smith", phone: "+91 01234567891" },
//       urgency: "Urgent",
//     },
//     {
//       date: "20 MAR 2024",
//       details: { name: "Alice smith", phone: "+91 01234567891" },
//       urgency: "Semi Urgent",
//     },
//     {
//       date: "20 MAR 2024",
//       details: { name: "Alice smith", phone: "+91 01234567891" },
//       urgency: "Non-Urgent",
//     },
//     {
//       date: "20 MAR 2024",
//       details: { name: "Alice smith", phone: "+91 01234567891" },
//       urgency: "Semi Urgent",
//     },
//     {
//       date: "20 MAR 2024",
//       details: { name: "Alice smith", phone: "+91 01234567891" },
//       urgency: "Semi Urgent",
//     },
//   ]

//   const renderWeekView = () => {
//     const startOfWeek = new Date(date);
//     startOfWeek.setDate(date.getDate() - date.getDay()); // Set to Sunday of the current week

//     const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
//       const day = new Date(startOfWeek);
//       day.setDate(startOfWeek.getDate() + i);
//       return day;
//     });

//     const timeSlots = Array.from({ length: 10 }, (_, i) => i + 9); // Create time slots from 9 AM to 6 PM

//     return (
//       <div className="grid grid-cols-7 gap-2">
//         {daysOfWeek.map((day, index) => (
//           <div key={index} className="border p-2">
//             <div className="font-semibold text-center mb-2 text-sm">{day.toDateString()}</div>
//             <div className="grid grid-rows-10 gap-0">
//               {timeSlots.map((time, timeIndex) => (
//                 <div key={timeIndex} className="flex justify-between items-center border-t text-sm">
//                   <span className="px-1">{time}:00</span>
//                   <span className="flex-1 border-l"></span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderMonthView = () => {
//     const startOfMonth = new Date(date);
//     startOfMonth.setDate(1); // Set to the first day of the current month
//     startOfMonth.setMonth(date.getMonth(), 1); // Make sure it's the correct month

//     // Get the first day of the month to find the start of the first week
//     const firstDayOfMonth = new Date(startOfMonth);
//     const firstDayOfWeek = firstDayOfMonth.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, etc.)

//     // Create an array of weeks for the current month
//     const weeksInMonth = Array.from({ length: 4 }, (_, weekIndex) => {
//       const startOfWeek = new Date(firstDayOfMonth);
//       startOfWeek.setDate(firstDayOfMonth.getDate() + weekIndex * 7 - firstDayOfWeek); // Adjust to get the correct start of each week
//       return Array.from({ length: 7 }, (_, dayIndex) => {
//         const day = new Date(startOfWeek);
//         day.setDate(startOfWeek.getDate() + dayIndex); // Fill the days for the week
//         return day;
//       });
//     });

//     return (
//       <div className="grid grid-cols-4 gap-2">
//         {weeksInMonth.map((week, weekIndex) => (
//           <div key={weekIndex} className="border p-2">
//             <div className="font-semibold text-center mb-2 text-sm">Week {weekIndex + 1}</div>
//             <div className="grid grid-rows-7 gap-0">
//               {week.map((day, dayIndex) => (
//                 <div key={dayIndex} className="flex justify-between items-center border-t text-sm">
//                   <span className="px-1">{day.toDateString()}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-200">
//       <Navbar />
//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Appointments</h1>
        
//         <div className="grid grid-cols-12 gap-6">
//           {/* Calendar and Upcoming Events */}
//           <div className="col-span-12 md:col-span-3 space-y-6">
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <Calendar
//                 mode="single"
//                 selected={date}
//                 onSelect={(date) => date && setDate(date)}
//                 className="rounded-md"
//               />
//             </div>

//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <h2 className="font-semibold mb-4">Upcoming Events</h2>
//               <div className="space-y-3">
//                 {upcomingEvents.map((event, index) => (
//                   <div key={index} className="flex justify-between items-center text-sm">
//                     <span className="text-gray-700">{event.name}</span>
//                     <span className="text-gray-500">{event.time}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Weekly Calendar View */}
//           <div className="col-span-12 md:col-span-9">
//             <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center gap-4">
//                   <Button variant="outline">Today</Button>
//                   <Button variant="outline">Back</Button>
//                   <Button variant="outline">Next</Button>
//                   <span className="text-sm text-gray-600">20 March 2024 - 20 April 2024</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant={view === "month" ? "default" : "outline"}
//                     onClick={() => setView("month")}
//                   >
//                     Month
//                   </Button>
//                   <Button
//                     variant={view === "week" ? "default" : "outline"}
//                     onClick={() => setView("week")}
//                   >
//                     Week
//                   </Button>
//                   <Button
//                     variant={view === "day" ? "default" : "outline"}
//                     onClick={() => setView("day")}
//                   >
//                     Day
//                   </Button>
//                 </div>
//               </div>

//               {/* Render the view here */}
//               {view === "week" && renderWeekView()}
//               {view === "month" && renderMonthView()}
//             </div>

//             {/* Appointment List */}
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <div className="flex justify-between items-center mb-6">
//                 <Tabs defaultValue="pending" className="w-full">
//                   <TabsList>
//                     <TabsTrigger value="pending">Pending 6</TabsTrigger>
//                     <TabsTrigger value="history">History</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="pending">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Appointment</TableHead>
//                           <TableHead>Urgency</TableHead>
//                           <TableHead>Details</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {appointments.map((appt, index) => (
//                           <TableRow key={index}>
//                             <TableCell>{appt.date}</TableCell>
//                             <TableCell>{appt.urgency}</TableCell>
//                             <TableCell>
//                               <div>{appt.details.name}</div>
//                               <div>{appt.details.phone}</div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TabsContent>
//                 </Tabs>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import "@/styles/global.css";
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SchedulerPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState("week")

  const appointments = [
    {
      date: "20 MAR 2024",
      details: { name: "Alice Smith", phone: "+91 01234567891" },
      urgency: "Urgent",
    },
    {
      date: "20 MAR 2024",
      details: { name: "John Doe", phone: "+91 01234567892" },
      urgency: "Non-Urgent",
    },
    // More appointments...
  ]

  const renderWeekView = () => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Set to Sunday of the current week

    const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    const timeSlots = Array.from({ length: 10 }, (_, i) => i + 9); // Create time slots from 9 AM to 6 PM

    return (
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="border p-2">
            <div className="font-semibold text-center mb-2 text-sm">{day.toDateString()}</div>
            <div className="grid grid-rows-10 gap-0">
              {timeSlots.map((time, timeIndex) => (
                <div key={timeIndex} className="flex justify-between items-center border-t text-sm">
                  <span className="px-1">{time}:00</span>
                  <span className="flex-1 border-l"></span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const startOfMonth = new Date(date);
    startOfMonth.setDate(1); // Set to the first day of the current month
    startOfMonth.setMonth(date.getMonth(), 1); // Make sure it's the correct month

    const firstDayOfMonth = new Date(startOfMonth);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, etc.)

    const weeksInMonth = Array.from({ length: 4 }, (_, weekIndex) => {
      const startOfWeek = new Date(firstDayOfMonth);
      startOfWeek.setDate(firstDayOfMonth.getDate() + weekIndex * 7 - firstDayOfWeek); 
      return Array.from({ length: 7 }, (_, dayIndex) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + dayIndex); 
        return day;
      });
    });

    return (
      <div className="grid grid-cols-4 gap-2">
        {weeksInMonth.map((week, weekIndex) => (
          <div key={weekIndex} className="border p-2">
            <div className="font-semibold text-center mb-2 text-sm">Week {weekIndex + 1}</div>
            <div className="grid grid-rows-7 gap-0">
              {week.map((day, dayIndex) => (
                <div key={dayIndex} className="flex justify-between items-center border-t text-sm">
                  <span className="px-1">{day.toDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const timeSlots = Array.from({ length: 10 }, (_, i) => i + 9); // Time slots from 9 AM to 6 PM

    return (
      <div className="grid grid-cols-1 gap-2">
        <div className="border p-2">
          <div className="font-semibold text-center mb-2 text-sm">{date.toDateString()}</div>
          <div className="grid grid-rows-10 gap-0">
            {timeSlots.map((time, timeIndex) => (
              <div key={timeIndex} className="flex justify-between items-center border-t text-sm">
                <span className="px-1">{time}:00</span>
                <span className="flex-1 border-l"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-200">
      <Navbar />
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
                {appointments.map((event, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{event.details.name}</span>
                    <span className="text-gray-500">{event.details.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Views */}
          <div className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline">Today</Button>
                  <Button variant="outline">Back</Button>
                  <Button variant="outline">Next</Button>
                  <span className="text-sm text-gray-600">{date.toDateString()}</span>
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

              {/* Render the view here */}
              {view === "week" && renderWeekView()}
              {view === "month" && renderMonthView()}
              {view === "day" && renderDayView()}
            </div>

            {/* Appointment List */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appt, index) => (
                    <TableRow key={index}>
                      <TableCell>{appt.date}</TableCell>
                      <TableCell>{appt.urgency}</TableCell>
                      <TableCell>
                        <div>{appt.details.name}</div>
                        <div>{appt.details.phone}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
