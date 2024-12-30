'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DailySchedule from '@/components/dashboard/schedule/DailySchedule'
import WeeklySchedule from '@/components/dashboard/schedule/WeeklySchedule'
import MonthlySchedule from '@/components/dashboard/schedule/MonthlySchedule'
import { useEffect, useState } from 'react'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DatePicker from '@/components/dashboard/schedule/DatePicker'
import { getAppointmentsByFilter } from '@/service/appointment/getAppointmentsByFilter'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const SchedulePage = () => {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date>(new Date());
  
  const appointments = useSelector((state: RootState) => state.appointments.appointments);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token || !userId) {
        console.error("No auth token or user ID found.");
        return;
      }

      try {
        await dispatch(
          getAppointmentsByFilter({
            timeFilter: 'ALL', // You might want to make this dynamic based on selected tab
            status: 'ALL',
            page: 0,
            size: 100, // Adjust size as needed
            userId,
          })
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [token, dispatch, userId]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  return (
    <div className="flex-1 p-2">
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="day" className="space-y-4">
          <div className="flex items-center gap-4">
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>

            <DatePicker 
              date={date} 
              onDateChange={handleDateSelect} 
              className="w-[240px] justify-start text-left font-normal" 
            />
          </div>

          {/* Day Schedule Tab */}
          <TabsContent value="day" className="space-y-4 text-teal-800 dark:text-teal-300">
            <DailySchedule appointments={appointments} date={date}/>
          </TabsContent>

          {/* Week Schedule Tab */}
          <TabsContent value="week" className="space-y-4">
            <WeeklySchedule appointments={appointments} date={date}/>
          </TabsContent>

          {/* Month Schedule Tab */}
          <TabsContent value="month" className="space-y-4">
            <MonthlySchedule appointments={appointments} date={date} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

SchedulePage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default SchedulePage;