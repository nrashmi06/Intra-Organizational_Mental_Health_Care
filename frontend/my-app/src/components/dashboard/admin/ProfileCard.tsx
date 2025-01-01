import React from "react";
import {
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Book,
  ThumbsUp,
  Eye,
  Pencil,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AdminProfile } from "@/pages/dashboard/adminprofile";

const ProfileCard = ({
  profile,
  setIsEditing,
}: {
  profile: AdminProfile;
  setIsEditing: (arg0: boolean) => void;
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-teal-100/50 overflow-hidden max-w-4xl mx-auto">
      <div className="p-8 space-y-6">
        <div className="flex flex-col md:flex-row space-y-6 items-center md:space-x-6 mb-6">
          {profile.profilePictureUrl && (
            <Image
              src={profile.profilePictureUrl}
              alt="Profile Picture"
              width={250}
              height={250}
              className="rounded-full border-4 border-teal-600 shadow-lg object-cover"
            />
          )}
          <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-lime-500 mb-2">
              {profile.fullName}
            </h2>
            <p className="text-gray-600 text-lg flex items-center">
              <Book className="mr-2 text-teal-700" />
              {profile.qualifications}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-teal-50 p-4 rounded-xl shadow-md">
            <div className="flex items-center text-teal-600 mb-2">
              <Phone className="mr-3" />
              <span className="font-semibold">Contact Number</span>
            </div>
            <p className="text-gray-900">{profile.contactNumber}</p>
          </div>
          <div className="bg-lime-50 p-4 rounded-xl shadow-md">
            <div className="flex items-center text-lime-600 mb-2">
              <Mail className="mr-3" />
              <span className="font-semibold">Email Address</span>
            </div>
            <p className="text-gray-900">{profile.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-4 rounded-xl shadow-md">
            <div className="flex items-center text-emerald-600 mb-2">
              <Calendar className="mr-3" />
              <span className="font-semibold">Appointment</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-gray-900 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-cyan-600" />
                {profile.lastAppointmentDate
                  ? new Date(profile.lastAppointmentDate).toLocaleDateString()
                  : "No appointments yet"}
              </span>
              <div className="flex items-center">
                <CalendarCheck className="w-4 h-4 mr-2 text-cyan-600" />
                <span>{profile.totalAppointments || 0} Total</span>
              </div>
            </div>
          </div>
          <div className="bg-cyan-50 p-4 rounded-xl shadow-md">
            <div className="flex items-center text-cyan-600 mb-2">
              <BookOpen className="mr-3" />
              <span className="font-semibold">Blog Statistics</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-cyan-600" />
                <span>{profile.totalBlogsPublished || 0} Posts</span>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-2 text-cyan-600" />
                <span>{profile.totalLikesReceived || 0} Likes</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2 text-cyan-600" />
                <span>{profile.totalViewsReceived || 0} Views</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-xl shadow-md">
          <div className="flex items-center text-lime-600 mb-2">
            <Book className="mr-3" />
            <span className="font-semibold">About Me</span>
          </div>
          <div
            className="text-gray-900"
            dangerouslySetInnerHTML={{ __html: profile.adminNotes }}
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-lime-500 hover:from-teal-700 hover:to-lime-600 flex items-center"
          >
            <Pencil className="mr-2" /> Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
