import { Pencil, Trash2, Calendar, Phone, GraduationCap, UserCircle, Hash } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar2";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ListenerApplication } from "@/lib/types";

interface ApplicationDetailsProps {
  applicationData: ListenerApplication;
  onEdit: (data: any) => void;
  onDelete: () => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  applicationData,
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<ListenerApplication>(applicationData);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleEdit = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleImageUpload = (file: File | null) => file && setImageFile(file);
  const handleRemoveImage = () => setImageFile(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit({ ...formData, image: imageFile });
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 px-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-500">Submitted on {new Date(applicationData.submissionDate).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" onClick={onDelete} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {/* Left Column - Personal Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <UserCircle className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{applicationData.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Branch</p>
                  <p className="font-medium">{applicationData.branch}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Semester</p>
                  <p className="font-medium">{applicationData.semester}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">USN</p>
                  <p className="font-medium">{applicationData.usn}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{applicationData.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Application Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Application Status</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                  ${applicationData.applicationStatus === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                    applicationData.applicationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {applicationData.applicationStatus}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Reason for Applying</p>
                <p className="bg-gray-50 p-4 rounded-lg text-gray-700">
                  {applicationData.reasonForApplying}
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Section - Full Width */}
          {applicationData.certificateUrl && (
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Uploaded Certificate</h2>
              <div className="relative w-full h-64">
                <Image
                  src={applicationData.certificateUrl}
                  alt="Certificate"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Edit Application</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor="branch">Branch</Label>
                  <input
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor="semester">Semester</Label>
                  <input
                    id="semester"
                    name="semester"
                    type="number"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor="usn">USN</Label>
                  <input
                    id="usn"
                    name="usn"
                    value={formData.usn}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="reasonForApplying">Reason for Applying</Label>
                  <textarea
                    id="reasonForApplying"
                    name="reasonForApplying"
                    value={formData.reasonForApplying}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="image">Update Certificate</Label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                  {imageFile && (
                    <div className="relative mt-4">
                      <Image
                        src={URL.createObjectURL(imageFile)}
                        alt="Selected"
                        width={1000}
                        height={1000}
                        className="w-full max-h-96 object-cover rounded-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-span-2 flex justify-end gap-4">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApplicationDetails;