import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { ListenerApplication } from "@/lib/types";

interface EditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationData: ListenerApplication;
  onEdit: (data: any) => void;
}

export const EditApplicationModal: React.FC<EditApplicationModalProps> = ({
  isOpen,
  onClose,
  applicationData,
  onEdit,
}) => {
  const [formData, setFormData] = useState<ListenerApplication>(applicationData);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (file: File | null) => file && setImageFile(file);
  const handleRemoveImage = () => setImageFile(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit({ ...formData, image: imageFile });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            Edit Application
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};