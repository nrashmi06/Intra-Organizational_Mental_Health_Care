import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import "@/styles/global.css";
import { createAdminProfile, } from "@/service/adminProfile/CreateAdminProfile";
import { RootState } from "@/store";
import { useSelector} from "react-redux";


interface AdminProfile {
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePicture: File | null; // File type for profile picture
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfile>({
    fullName: "John Doe",
    adminNotes: "Specialist in mental health.",
    qualifications: "PhD in Clinical Psychology",
    contactNumber: "1234567890",
    email: "johndoe@example.com",
    profilePicture: null, // Initial profile picture
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setProfile((prev) => ({ ...prev, profilePicture: files[0] }));
    }
  };

  const token = useSelector((state: RootState) => state.auth.accessToken);
  const handleSave = async () => {
    try {
      const response= await createAdminProfile(profile, token);
  
      // Update profile with response data
      setProfile((prev) => ({
        ...prev,
        profilePicture: prev.profilePicture, // Preserve the existing profile picture
      }));
  
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving profile:", error.message);
      } else {
        console.error("Error saving profile:", error);
      }
    }
  };
  

  const handleCancel = () => {
    setIsEditing(false); // Exit edit mode without saving
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Counselor Profile</h1>
          <Pencil
            className="h-6 w-6 cursor-pointer text-gray-500"
            onClick={() => setIsEditing(true)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="bg-gray-200">
              <CardContent className="p-6 flex flex-col items-center">
                {profile.profilePicture ? (
                  <img
                    src={URL.createObjectURL(profile.profilePicture)}
                    alt="Profile"
                    className="w-32 h-32 rounded-lg mb-4 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-400">No photo</span>
                  </div>
                )}
                {isEditing ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4"
                  />
                ) : null}
                <h2 className="text-xl font-semibold">{profile.fullName}</h2>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About Counselor</h2>
                {isEditing ? (
                  <textarea
                    name="adminNotes"
                    value={profile.adminNotes}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-700">{profile.adminNotes}</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium">Qualifications:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="qualifications"
                        value={profile.qualifications}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                      />
                    ) : (
                      <p>{profile.qualifications}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Contact Number:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="contactNumber"
                        value={profile.contactNumber}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                      />
                    ) : (
                      <p>{profile.contactNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email:</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                      />
                    ) : (
                      <p>{profile.email}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
