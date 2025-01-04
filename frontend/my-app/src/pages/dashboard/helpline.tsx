import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { createEmergencyHelpline } from '@/service/emergency/CreateEmergencyHelpline';
import { getAllHelplines } from '@/service/emergency/GetEmergencyHelpline';
import { deleteEmergencyHelpline } from '@/service/emergency/DeleteEmergencyHelpline';
import { updateEmergencyHelpline } from '@/service/emergency/UpdateEmergencyHelpline';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Helpline } from '@/lib/types';

const Component = () => {
  const [isModalOpen, setModalOpen] = useState(false); // Modal state
  const [newHelpline, setNewHelpline] = useState<Helpline>({
    name: '',
    phoneNumber: '',
    countryCode: '',
    emergencyType: '',
    priority: 0
  });

  const userRole = useSelector((state: RootState) => state.auth.role);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const helplines = useSelector((state: RootState) => state.emergency.helplines); // Access helplines directly from Redux store
  const dispatch = useAppDispatch(); 

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedHelplineId, setSelectedHelplineId] = useState<string | null>(null);

  const handleEditHelpline = (helpline: any) => {
    setNewHelpline(helpline);
    setSelectedHelplineId(helpline.helplineId); 
    setIsUpdateMode(true);
    setModalOpen(true); 
  };

  const handleUpdateSubmit = async () => {
    if (!selectedHelplineId) return;

    try {
      await updateEmergencyHelpline(selectedHelplineId, token, newHelpline); 
      setModalOpen(false); 
      setIsUpdateMode(false);
      dispatch(getAllHelplines()); 
    } catch (error) {
      console.error("Failed to update helpline:", error);
    }
  };

  const handleAddHelpline = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleDeleteHelpline = async (helplineId: string) => {
    try {
      await deleteEmergencyHelpline(helplineId, token); 
      dispatch(getAllHelplines()); 
    } catch (error) {
      console.error("Failed to delete helpline:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHelpline({ ...newHelpline, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await createEmergencyHelpline(newHelpline, token);
      setModalOpen(false);
      dispatch(getAllHelplines());
    } catch (error) {
      console.error("Failed to create helpline:", error);
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(getAllHelplines()); 
    }
  }, [token, dispatch]);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 mb-4">
        <div className="flex justify-between items-center mx-auto px-4">
          <h1 className="text-2xl font-bold py-8">
            Add Helpline Number
          </h1>
          <div>
            <Button onClick={handleAddHelpline}>
              <Plus className="h-10 w-10 text-yellow-300" />
            </Button>
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
                {userRole === 'ADMIN' && <TableHead>Action</TableHead>}
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
                    {userRole === 'ADMIN' && (
                      <TableCell>
                        <div className="flex justify-around">
                          <Trash2
                            className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
                            onClick={() => handleDeleteHelpline(helpline.helplineId)}
                          />
                          <Pencil
                            className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-700"
                            onClick={() => handleEditHelpline(helpline)}
                          />
                        </div>
                      </TableCell>
                    )}
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
            <h2 className="text-2xl font-bold mb-4">{isUpdateMode ? 'Update Helpline' : 'Add New Helpline'}</h2>
            <form>
              {[{ label: "Name", name: "name" },
                { label: "Phone Number", name: "phoneNumber" },
                { label: "Country Code", name: "countryCode" },
                { label: "Emergency Type", name: "emergencyType" },
                { label: "Priority", name: "priority", type: "number" }]
                .map(({ label, name, type = "text" }) => (
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
                <Button type="button" onClick={isUpdateMode ? handleUpdateSubmit : handleSubmit}>
                  {isUpdateMode ? 'Update' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

Component.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default Component;
