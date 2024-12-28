'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DailySchedule from '@/components/dashboard/schedule/DailySchedule'
import WeeklySchedule from '@/components/dashboard/schedule/WeeklySchedule'
import MonthlySchedule from '@/components/dashboard/schedule/MonthlySchedule'
import { Appointment } from '@/lib/types'
import { useEffect, useState } from 'react'
import {getAdminUpcomingAppointmentsForAdmin} from '@/service/appointment/getAdminUpcomingAppointmentsForAdmin'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const SchedulePage = () => {

  const [appointments,setAppointments] = useState<Appointment[]>([]); // You can directly provide appointments data if needed
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAdminUpcomingAppointmentsForAdmin(token);
        setAppointments(response); // Update state with fetched appointments
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, [token]);
  return (
    <div className="flex-1 p-2">
      <Tabs defaultValue="day" className="space-y-4">
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger> {/* Corrected the value */}
          <TabsTrigger value="week">Week</TabsTrigger>
        </TabsList>
        
        {/* Day Schedule Tab */}
        <TabsContent value="day" className="space-y-4 text-teal-800 dark:text-teal-300">
          <DailySchedule appointments={appointments} date={new Date()}/>
        </TabsContent>
        
        {/* Month Schedule Tab */}
        <TabsContent value="month" className="space-y-4"> {/* Corrected the value */}
          <MonthlySchedule appointments={appointments} date={new Date()} />
        </TabsContent>
        
        {/* Week Schedule Tab */}
        <TabsContent value="week" className="space-y-4">
          <WeeklySchedule appointments={appointments} date={new Date()}/> {/* Assuming WeeklySchedule takes similar props */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

SchedulePage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default SchedulePage;
