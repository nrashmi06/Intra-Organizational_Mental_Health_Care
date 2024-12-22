import React, { useState, useEffect } from "react";
import { Pencil, Phone, Mail, Book, Save, X } from "lucide-react";
import "@/styles/global.css";
import Image from "next/image";
import { createAdminProfile } from "@/service/adminProfile/CreateAdminProfile";
import { fetchAdminProfile } from "@/service/adminProfile/GetAdminProfile";
import { updateAdminProfile } from "@/service/adminProfile/UpdateAdminProfile";
import { RootState } from "@/store";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ReactQuill from "react-quill";
import { Button } from "@/components/ui/button";
import "react-quill/dist/quill.snow.css";

interface AdminProfile {
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePicture?: File | null;
  profilePictureUrl?: string;
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const userID = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleQuillChange = (value: string) => {
    setProfile((prev) => (prev ? { ...prev, adminNotes: value } : null));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setProfile((prev) =>
        prev ? { ...prev, profilePicture: files[0] } : null
      );
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      const { profilePictureUrl, profilePicture = null, ...profileData } = profile;
      if (isCreating) {
        const createdProfile = await createAdminProfile({ ...profileData, profilePicture }, token);
        setProfile(createdProfile);
        setIsCreating(false);
      } else {
        await updateAdminProfile({ ...profile, profilePicture: profile.profilePicture ?? null }, token);
        await fetchProfile();
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  const fetchProfile = async () => {
    try {
      const fetchedProfile = await fetchAdminProfile(token);
      if (fetchedProfile) {
        setProfile(fetchedProfile);
      } else {
        setIsCreating(true);
        setProfile({
          fullName: "",
          adminNotes: "",
          qualifications: "",
          contactNumber: "",
          email: "",
          profilePicture: null,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsCreating(true);
      setProfile({
        fullName: "",
        adminNotes: "",
        qualifications: "",
        contactNumber: "",
        email: "",
        profilePicture: null,
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userID, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 via-purple-100/20 to-pink-100/20 opacity-50 pointer-events-none"></div>
      <main className="container mx-auto px-4 py-12 relative z-10">
        {isCreating || isEditing ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100/50 overflow-hidden max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">
                {isCreating ? "Create Your Profile" : "Edit Your Profile"}
              </h2>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCancel}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Field 
                  label="Full Name" 
                  name="fullName" 
                  value={profile?.fullName || ""} 
                  onChange={handleInputChange} 
                />
                <Field 
                  label="Qualifications" 
                  name="qualifications" 
                  value={profile?.qualifications || ""} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field 
                  label="Contact Number" 
                  name="contactNumber" 
                  value={profile?.contactNumber || ""} 
                  onChange={handleInputChange} 
                />
                <Field 
                  label="Email" 
                  name="email" 
                  type="email" 
                  value={profile?.email || ""} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <label className="block text-purple-700 font-semibold mb-2">About You</label>
                <ReactQuill
                  value={profile?.adminNotes || ""}
                  onChange={handleQuillChange}
                  className="min-h-[120px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-purple-700 font-semibold mb-2">Profile Picture</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:bg-purple-100 file:text-purple-700 file:border-0 file:px-4 file:py-2 file:rounded-lg hover:file:bg-purple-200"
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="px-6 py-3"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  Save Profile
                </Button>
              </div>
            </div>
          </div>
        ) : profile ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100/50 overflow-hidden max-w-4xl mx-auto">
            <div className="p-8 space-y-6">
              <div className="flex items-center space-x-6 mb-6">
                {profile.profilePictureUrl && (
                  <Image
                    src={profile.profilePictureUrl}
                    alt="Profile Picture"
                    width={150}
                    height={150}
                    className="rounded-full border-4 border-purple-200 shadow-lg object-cover"
                  />
                )}
                <div>
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-2">
                    {profile.fullName}
                  </h2>
                  <p className="text-gray-600 text-lg flex items-center">
                    <Book className="mr-2 text-purple-500" />
                    {profile.qualifications}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-xl shadow-md">
                  <div className="flex items-center text-purple-600 mb-2">
                    <Phone className="mr-3" />
                    <span className="font-semibold">Contact Number</span>
                  </div>
                  <p className="text-gray-700">{profile.contactNumber}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl shadow-md">
                  <div className="flex items-center text-blue-600 mb-2">
                    <Mail className="mr-3" />
                    <span className="font-semibold">Email Address</span>
                  </div>
                  <p className="text-gray-700">{profile.email}</p>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl shadow-md">
                <div className="flex items-center text-indigo-600 mb-2">
                  <Book className="mr-3" />
                  <span className="font-semibold">About Me</span>
                </div>
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: profile.adminNotes }}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 flex items-center"
                >
                  <Pencil className="mr-2" /> Edit Profile
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-purple-600 text-2xl">
              Loading Profile...
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const Field = ({ label, ...props }: { label: string; [key: string]: any }) => (
  <div>
    <label className="block text-purple-700 font-semibold mb-2">{label}</label>
    <Input 
      {...props} 
      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    />
  </div>
);

AdminProfile.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
