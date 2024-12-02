import React, { useState, useEffect } from "react";
import { Pencil, Phone, Mail, GraduationCap, Save, X } from "lucide-react";
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";
import "@/styles/global.css";
import Image from "next/image";
import { createAdminProfile } from "@/service/adminProfile/CreateAdminProfile";
import { fetchAdminProfile } from "@/service/adminProfile/GetAdminProfile";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

interface AdminProfile {
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePicture: File | null; // For file upload when creating
  profilePictureUrl?: string;  // For URL when fetching the profile
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfile>({
    fullName: "",
    adminNotes: "",
    qualifications: "",
    contactNumber: "",
    email: "",
    profilePicture: null,
    profilePictureUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const userID = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setProfile((prev) => ({ ...prev, profilePicture: files[0] }));
    }
  };

  const handleSave = async () => {
    try {
      await createAdminProfile(profile, token);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Fetch admin profile on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fetchedProfile = await fetchAdminProfile(token);
        setProfile(fetchedProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [userID, token]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-cyan-500">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Profile Picture Section */}
          <div className="bg-gradient-to-t from-gray-300 to-gray-100 p-6 flex flex-col items-center md:w-1/3">
            {profile.profilePictureUrl ? (
              <Image
                src={profile.profilePictureUrl}
                alt="Profile"
                width={192}
                height={192}
                className="rounded-full object-cover shadow-lg"
              />
            ) : profile.profilePicture ? (
              <Image
                src={URL.createObjectURL(profile.profilePicture)}
                alt="Profile"
                width={192}
                height={192}
                className="rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-gray-400">No photo</span>
              </div>
            )}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-4"
              />
            )}
            <h1 className="mt-4 text-2xl font-semibold text-gray-800">{profile.fullName}</h1>
          </div>

          {/* Profile Details Section */}
          <div className="p-6 flex-1">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Counselor Profile</h2>
              {!isEditing && (
                <Pencil
                  className="h-6 w-6 cursor-pointer text-gray-500"
                  onClick={() => setIsEditing(true)}
                />
              )}
            </div>
            <div className="mt-6 space-y-6">
              {/* About Counselor */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800">About Counselor</h3>
                {isEditing ? (
                  <textarea
                    name="adminNotes"
                    value={profile.adminNotes}
                    onChange={handleInputChange}
                    className="w-full mt-2 border rounded p-2"
                  />
                ) : (
                  <p className="text-gray-700 mt-2">{profile.adminNotes}</p>
                )}
              </div>
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-purple-600 mr-2" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="qualifications"
                        value={profile.qualifications}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                      />
                    ) : (
                      <p>{profile.qualifications}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-purple-600 mr-2" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="contactNumber"
                        value={profile.contactNumber}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                      />
                    ) : (
                      <p>{profile.contactNumber}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-purple-600 mr-2" />
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                      />
                    ) : (
                      <p>{profile.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-400 text-white rounded shadow"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded shadow"
                >
                  <Save className="h-5 w-5 mr-2" />
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
