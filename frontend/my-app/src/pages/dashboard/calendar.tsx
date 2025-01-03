import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailySchedule from "@/components/dashboard/schedule/DailySchedule";
import WeeklySchedule from "@/components/dashboard/schedule/WeeklySchedule";
import MonthlySchedule from "@/components/dashboard/schedule/MonthlySchedule";
import { useEffect, useState } from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DatePicker from "@/components/dashboard/schedule/DatePicker";
import { getAppointmentByDate } from "@/service/appointment/getAppointmentByDate";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { format } from "date-fns";

const SchedulePage = () => {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date>(new Date());

  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  );
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!token) {
      console.error("No auth token found.");
      return;
    }

    // Calculate the start and end dates for the selected month
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const fetchAppointments = async () => {
      try {
        await dispatch(
          getAppointmentByDate(
            format(startOfMonth, "yyyy-MM-dd"),
            format(endOfMonth, "yyyy-MM-dd"),
            0, 
            100 // Size
          )
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [date, token, dispatch]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  return (
    <div className="flex-1 p-2">
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="day" className="w-full space-y-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <TabsList className="h-9">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>

            <DatePicker
              date={date}
              onDateChange={handleDateSelect}
              className="sm:w-[240px] px-0 flex items-center justify-center"
            />
          </div>

          <TabsContent
            value="day"
            className="space-y-4 text-teal-800 dark:text-teal-300"
          >
            <DailySchedule appointments={appointments} date={date} />
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            <WeeklySchedule appointments={appointments} date={date} />
          </TabsContent>

          <TabsContent value="month" className="space-y-4">
            <MonthlySchedule appointments={appointments} date={date} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

SchedulePage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default SchedulePage;
