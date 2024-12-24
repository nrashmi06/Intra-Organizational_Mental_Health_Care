import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getAdminUpcomingAppointmentsByStatus } from '@/service/appointment/getAdminUpcomingAppointmentsByStatus';
import { RootState } from '@/store';
import React, {  useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Appointment } from '@/lib/types';

function appointmentsPage() {

  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);

  useEffect(() => {
    handleGetAppointments();
    }, [token]);

  const handleGetAppointments = async () => {
    try{
        const response = await getAdminUpcomingAppointmentsByStatus(token, 'CONFIRMED');
        if(response){
            setAppointments(response);
            console.log("Appointments :",appointments);
        }
    }
    catch(err){
        console.log(err);
    }


  return (
    <div>appointments</div>
  )
}
};

appointmentsPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;
export default appointmentsPage;