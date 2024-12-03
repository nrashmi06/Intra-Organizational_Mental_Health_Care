import React, { useState, useEffect } from "react";
import { Pencil, Phone, Mail, GraduationCap, Save, X } from "lucide-react";
import Navbar from "@/components/navbar/navbar4";
import "@/styles/global.css";
import Image from "next/image";
import { createAdminProfile } from "@/service/adminProfile/CreateAdminProfile";
import { fetchAdminProfile } from "@/service/adminProfile/GetAdminProfile";
import { updateAdminProfile } from "@/service/adminProfile/UpdateAdminProfile";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

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
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-300 to-blue-300">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex-1">
        {isCreating || isEditing ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              {isCreating ? "Create Your Profile" : "Edit Your Profile"}
            </h2>
            <div className="space-y-4">
              <InputField
                label="Full Name"
                name="fullName"
                value={profile?.fullName || ""}
                onChange={handleInputChange}
              />
              <TextAreaField
                label="About You"
                name="adminNotes"
                value={profile?.adminNotes || ""}
                onChange={handleInputChange}
              />
              <InputField
                label="Qualifications"
                name="qualifications"
                value={profile?.qualifications || ""}
                onChange={handleInputChange}
              />
              <InputField
                label="Contact Number"
                name="contactNumber"
                value={profile?.contactNumber || ""}
                onChange={handleInputChange}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={profile?.email || ""}
                onChange={handleInputChange}
              />
              <FileInputField
                label="Profile Picture"
                onChange={handleFileChange}
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded shadow"
              >
                Save
              </button>
            </div>
          </div>
        ) : profile ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{profile.fullName}</h2>
              {profile.profilePictureUrl && (
                <Image
                  src={profile.profilePictureUrl}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full mb-4"
                />
              )}
              <p className="text-gray-700 mb-2">
                <GraduationCap className="inline-block mr-2" />
                {profile.qualifications}
              </p>
              <p className="text-gray-700 mb-2">
                <Phone className="inline-block mr-2" />
                {profile.contactNumber}
              </p>
              <p className="text-gray-700 mb-2">
                <Mail className="inline-block mr-2" />
                {profile.email}
              </p>
              <p className="text-gray-700">{profile.adminNotes}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded shadow"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
}) => (
  <div>
    <label className="block text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded p-2"
    />
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => (
  <div>
    <label className="block text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded p-2"
    />
  </div>
);

const FileInputField = ({
  label,
  onChange,
}: {
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => (
  <div>
    <label className="block text-gray-700">{label}</label>
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="w-full border rounded p-2"
    />
  </div>
);
