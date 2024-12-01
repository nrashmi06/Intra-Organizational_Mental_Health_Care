import { useState, useEffect } from 'react';
import { Lightbulb, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { createEmergencyHelpline } from '@/service/emergency/CreateEmergencyHelpline';
import { getAllHelplines } from '@/service/emergency/GetEmergencyHelpline';

export default function Component() {
  const [isModalOpen, setModalOpen] = useState(false); // Modal state
  const [newHelpline, setNewHelpline] = useState({
    name: '',
    phoneNumber: '',
    countryCode: '',
    emergencyType: '',
    priority: 1,
  });

  interface Helpline {
    helplineId: string;
    name: string;
    phoneNumber: string;
    countryCode: string;
    emergencyType: string;
    priority: number;
  }

  const [helplines, setHelplines] = useState<Helpline[]>([]); // State to store the fetched helplines
  
  const userRole = useSelector((state: RootState) => state.auth.role);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  // Handle modal open/close
  const handleAddHelpline = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHelpline({ ...newHelpline, [name]: value });
  };

  const handleSubmit = () => {
    // Call the createEmergencyHelpline function
    createEmergencyHelpline(newHelpline, token);
    setModalOpen(false); // Close modal after submission
  };

  // Fetch all helplines on component mount
  useEffect(() => {
    const fetchHelplines = async () => {
      const data = await getAllHelplines(token); // Get helplines data
      setHelplines(data); // Store helplines in state
    };

    fetchHelplines();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-purple-600">
      <Navbar />
      <main className="container mx-auto px-4 mb-4">
        <div className="flex justify-between items-center mx-auto px-4">
          <h1 className="text-4xl font-bold text-white py-4">
            Asking for help is always
            <br />a good idea
          </h1>
          <div>
            {userRole !== 'ADMIN' ? (
              <Lightbulb className="h-24 w-24 text-yellow-300" />
            ) : (
              <Button onClick={handleAddHelpline}>
                <Plus className="h-10 w-10 text-yellow-300" />
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
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

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add New Helpline</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newHelpline.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={newHelpline.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Country Code
                </label>
                <input
                  type="text"
                  name="countryCode"
                  value={newHelpline.countryCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Emergency Type
                </label>
                <input
                  type="text"
                  name="emergencyType"
                  value={newHelpline.emergencyType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <input
                  type="number"
                  name="priority"
                  value={newHelpline.priority}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCloseModal} className="mr-2">
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
