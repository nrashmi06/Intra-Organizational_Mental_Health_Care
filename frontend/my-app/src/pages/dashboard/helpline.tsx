import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import '@/styles/global.css';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Component = () => {
  const [helplines, setHelplines] = useState<any[]>([]); // State to store the fetched helplines
  const [shouldRefetch, setShouldRefetch] = useState(false); // State to track refetch trigger

  const token = useSelector((state: RootState) => state.auth.accessToken);

  // Fetch all helplines on component mount or when shouldRefetch or token changes
  useEffect(() => {
    const fetchHelplines = async () => {
      try {
        const response = await fetch('/api/helplines', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        setHelplines(data); // Store helplines in state
      } catch (error) {
        console.error("Failed to fetch helplines:", error);
      }
    };

    fetchHelplines();
  }, [shouldRefetch, token]); // Rerun useEffect when shouldRefetch or token changes

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 mb-4">
        <div className="flex justify-between items-center mx-auto px-4">
          <h1 className="text-2xl font-bold py-8">
            View Helpline Numbers
          </h1>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Country Code</TableHead>
                <TableHead>Emergency Type</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {helplines.length === 0 ? (
                <TableRow>
                  <TableCell>
                    <div className="text-center text-gray-500">No helplines found</div>
                  </TableCell>
                </TableRow>
              ) : (
                helplines.map((helpline: any) => (
                  <TableRow key={helpline.helplineId}>
                    <TableCell>{helpline.name}</TableCell>
                    <TableCell>{helpline.phoneNumber}</TableCell>
                    <TableCell>{helpline.countryCode}</TableCell>
                    <TableCell>{helpline.emergencyType}</TableCell>
                    <TableCell>{helpline.priority}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

Component.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Component;
