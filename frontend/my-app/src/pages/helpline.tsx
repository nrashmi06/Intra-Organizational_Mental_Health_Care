import { useState, useEffect } from 'react';
import { Lightbulb, Plus , Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { createEmergencyHelpline } from '@/service/emergency/CreateEmergencyHelpline';
import { getAllHelplines } from '@/service/emergency/GetEmergencyHelpline';
import '@/styles/global.css';
import { deleteEmergencyHelpline } from '@/service/emergency/DeleteEmergencyHelpline';

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
  const [shouldRefetch, setShouldRefetch] = useState(false); // State to track refetch trigger

  const userRole = useSelector((state: RootState) => state.auth.role);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleAddHelpline = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);


  const handleDeleteHelpline = async (helplineId: string) => {
    try {
      await deleteEmergencyHelpline(helplineId, token); // Call delete API
      setShouldRefetch((prev) => !prev); // Trigger refetch to update the table
    } catch (error) {
      console.error("Failed to delete helpline:", error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHelpline({ ...newHelpline, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await createEmergencyHelpline(newHelpline, token); // Call the createEmergencyHelpline function
      setModalOpen(false); // Close modal after submission
      setShouldRefetch((prev) => !prev); // Trigger refetch
    } catch (error) {
      console.error("Failed to create helpline:", error);
    }
  };

  // Fetch all helplines on component mount or when shouldRefetch changes
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
  }, [shouldRefetch]); // Rerun useEffect when shouldRefetch changes

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
                <TableHead>Phone Number</TableHead>
                <TableHead>Country Code</TableHead>
                <TableHead>Emergency Type</TableHead>
                <TableHead>Priority</TableHead>
                {
                  userRole === 'ADMIN' && (
                    <TableHead>Action</TableHead>
                  )
                }
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
                    {
                      userRole === 'ADMIN' && (
                        <TableCell>
                          <Trash2
                            className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
                            onClick={() => handleDeleteHelpline(helpline.helplineId)} 
                          />
                        </TableCell>
                      )
                    }
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
              {/* Input Fields */}
              {[
                { label: "Name", name: "name" },
                { label: "Phone Number", name: "phoneNumber" },
                { label: "Country Code", name: "countryCode" },
                { label: "Emergency Type", name: "emergencyType" },
                { label: "Priority", name: "priority", type: "number" },
              ].map(({ label, name, type = "text" }) => (
                <div key={name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={(newHelpline as any)[name]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              ))}
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
