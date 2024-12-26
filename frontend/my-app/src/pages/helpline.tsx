import { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar1 from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { getAllHelplines } from '@/service/emergency/GetEmergencyHelpline';
import '@/styles/global.css';

interface Helpline {
  helplineId: string;
  name: string;
  phoneNumber: string;
  countryCode: string;
  emergencyType: string;
  priority: number;
}

export default function Component() {
  const [helplines, setHelplines] = useState<Helpline[]>([]); // State to store the fetched helplines
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const role = useSelector((state: RootState) => state.auth.role);

  // Fetch all helplines on component mount or when token changes
  useEffect(() => {
    const fetchHelplines = async () => {
      try {
        const data = await getAllHelplines(token); // Get helplines data
        setHelplines(data); // Store helplines in state
      } catch (error) {
        console.error("Failed to fetch helplines:", error);
      }
    };

    fetchHelplines();
  }, [token]); // Rerun useEffect when token changes

  return (
    <div className="min-h-screen bg-white">
      <Navbar1 />
      <main className="container mx-auto px-4 mb-4">
        <div className="flex justify-between items-center mx-auto px-4">
          <h1 className="text-4xl font-bold text-white py-4">
            Asking for help is always
            <br />a good idea
          </h1>
          {role !== 'ADMIN' && (
            <Lightbulb className="h-24 w-24 text-yellow-300" />
          )}
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
                  <TableCell colSpan={5}>
                    <div className="text-center text-gray-500">No helplines found</div>
                  </TableCell>
                </TableRow>
              ) : (
                helplines.map((helpline) => (
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

      <Footer />
    </div>
  );
}
