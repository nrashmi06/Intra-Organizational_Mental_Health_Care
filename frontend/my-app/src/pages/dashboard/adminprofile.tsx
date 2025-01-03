import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createAdminProfile } from "@/service/adminProfile/CreateAdminProfile";
import { fetchAdminProfile } from "@/service/adminProfile/GetAdminProfile";
import { updateAdminProfile } from "@/service/adminProfile/UpdateAdminProfile";
import { RootState } from "@/store";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import "react-quill/dist/quill.snow.css";
import ProfileCard from "@/components/dashboard/admin/ProfileCard";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export interface AdminProfile {
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePicture?: File | null;
  profilePictureUrl?: string;
  totalAppointments?: number;
  lastAppointmentDate?: string; // Use `string` for ISO format if working with JSON APIs.
  totalBlogsPublished?: number;
  totalLikesReceived?: number;
  totalViewsReceived?: number;
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
      const { profilePicture = null, ...profileData } = profile;
      if (isCreating) {
        const createdProfile = await createAdminProfile(
          { ...profileData, profilePicture },
          token
        );
        setProfile(createdProfile);
        setIsCreating(false);
      } else {
        await updateAdminProfile(
          { ...profile, profilePicture: profile.profilePicture ?? null },
          token
        );
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-yellow-50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-100/20 via-teal-100/20 to-yellow-100/20 opacity-50 pointer-events-none"></div>
      <main className="container mx-auto px-4 py-12 relative z-10">
        {isCreating || isEditing ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-teal-100/50 overflow-hidden max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-6 flex items-center justify-between">
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
                <label className="block text-teal-700 font-semibold mb-2">
                  About You
                </label>

                <ReactQuill
                  value={profile?.adminNotes || ""}
                  onChange={handleQuillChange}
                  className="min-h-[120px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="space-y-2">
                <label className="block text-teal-700 font-semibold mb-2">
                  Profile Picture
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:bg-teal-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg hover:file:bg-teal-700"
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="px-6 py-3 text-teal-700 border-teal-700 hover:bg-teal-700 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600"
                >
                  Save Profile
                </Button>
              </div>
            </div>
          </div>
        ) : profile ? (
          <ProfileCard profile={profile} setIsEditing={setIsEditing} />
        ) : null}
      </main>
    </div>
  );
}

const Field = ({ label, ...props }: { label: string; [key: string]: any }) => (
  <div>
    <label className="block text-teal-700 font-semibold mb-2">{label}</label>
    <Input
      {...props}
      className="focus:ring-2 focus:ring-lime-500 focus:border-transparent"
    />
  </div>
);

AdminProfile.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
