'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppointmentRequests } from '@/components/dashboard/appointments/AppointmentRequests'
import { AllAppointments } from '@/components/dashboard/appointments/AllAppointments'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

const AppointmentPage = () => {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Tabs defaultValue="requests" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="requests">Appointment Requests</TabsTrigger>
                    <TabsTrigger value="all">All Appointments</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
                </TabsList>
                <TabsContent value="requests" className="space-y-4">
                    <AppointmentRequests />
                </TabsContent>
                <TabsContent value="all" className="space-y-4">
                    <AllAppointments />
                </TabsContent>
            </Tabs>
        </div>
    )
}

AppointmentPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default AppointmentPage;
