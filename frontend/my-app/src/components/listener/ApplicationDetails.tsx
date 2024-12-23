import { Pencil, Trash2 } from "lucide-react";
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
  const [formData, setFormData] =
    useState<ListenerApplication>(applicationData);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      return;
    }
    setImageFile(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = { ...formData, image: imageFile };
    onEdit(updatedData);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-purple-200">
      <Navbar />
      <main className="container mx-auto px-8 py-16">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">My Application</h1>
            <div className="flex space-x-5">
              <Pencil
                className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={handleEdit}
              />
              <Trash2
                className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
                onClick={onDelete}
              />
            </div>
          </div>
          <div className="space-y-4">
            <p>
              <strong>Full Name:</strong> {applicationData.fullName}
            </p>
            <p>
              <strong>Branch:</strong> {applicationData.branch}
            </p>
            <p>
              <strong>Semester:</strong> {applicationData.semester}
            </p>
            <p>
              <strong>USN:</strong> {applicationData.usn}
            </p>
            <p>
              <strong>Phone Number:</strong> {applicationData.phoneNumber}
            </p>
            <p>
              <strong>Reason for Applying:</strong>{" "}
              {applicationData.reasonForApplying}
            </p>
            <p>
              <strong>Application Status:</strong>{" "}
              {applicationData.applicationStatus}
            </p>
            <p>
              <strong>Submission Date:</strong>{" "}
              {new Date(applicationData.submissionDate).toLocaleString()}
            </p>
            {applicationData.certificateUrl && (
              <div className="relative w-full max-w-md h-64 mx-auto">
                <Image
                  src={applicationData.certificateUrl}
                  alt="Certificate"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Application</h2>
            <form onSubmit={handleSubmit}>
              {[
                { label: "Full Name", name: "fullName" },
                { label: "Branch", name: "branch" },
                { label: "Semester", name: "semester", type: "number" },
                { label: "USN", name: "usn" },
                { label: "Phone Number", name: "phoneNumber" },
                {
                  label: "Reason for Applying",
                  name: "reasonForApplying",
                  type: "textarea",
                },
              ].map(({ label, name, type = "text" }) => (
                <div key={name} className="mb-4">
                  <Label htmlFor={name}>{label}</Label>
                  {type === "textarea" ? (
                    <textarea
                      id={name}
                      name={name}
                      value={(formData as any)[name]}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  ) : (
                    <input
                      id={name}
                      name={name}
                      type={type}
                      value={(formData as any)[name]}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    />
                  )}
                </div>
              ))}
              <div className="mb-4">
                <Label htmlFor="image">Upload Certificate</Label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e.target.files?.[0] || null)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
                {imageFile && (
                  <div className="relative mt-4">
                    <Image
                      src={URL.createObjectURL(imageFile)}
                      alt="Selected"
                      width={1000}
                      height={1000}
                      className="w-full max-h-96 object-cover rounded-md shadow-md"
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
              <div className="flex justify-end">
                <Button onClick={handleCloseModal} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;
