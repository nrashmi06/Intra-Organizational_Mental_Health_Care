import React, { useEffect, useState } from "react";
import {
  User,
  Calendar,
  Mail,
  X,
  Award,
  FileText,
  Phone,
  Contact,
  BookOpen,
  ThumbsUp,
  Eye,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchAdminProfile } from "@/service/adminProfile/GetAdminProfile";
import { AdminDetails } from "@/lib/types";
import Image from "next/image";
import InlineLoader from "@/components/ui/inlineLoader";

interface DetailsProps {
  userId: string;
  handleClose: () => void;
  statusFilter?: string;
  setSuccessMessage?: (message: string | null) => void;
}

const ModalDetails: React.FC<DetailsProps> = ({ userId, handleClose }) => {
  const [adminDetails, setAdmin] = useState<AdminDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAdminProfile(token, userId);
        setAdmin(data);
      } catch (error) {
        setError("Error fetching admin details." + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ImagePreviewModal = () => {
    if (!showImagePreview || !adminDetails?.profilePictureUrl) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80">
        <div className="relative max-w-2xl max-h-[90vh] p-2">
          <button
            onClick={() => setShowImagePreview(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-[400px] h-[400px]">
            <Image
              src={adminDetails.profilePictureUrl}
              alt={adminDetails.fullName}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-[9999]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
          <div className="flex-none p-3 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Admin Details</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <InlineLoader height="h-60" />
            ) : error ? (
              <div className="flex items-center justify-center h-60 text-red-500 text-center">
                {error}
              </div>
            ) : !adminDetails ? (
              <div className="flex items-center justify-center h-60 text-center">
                No details available.
              </div>
            ) : (
              <>
                <ImagePreviewModal />
                <div className="space-y-4 p-4">
                  {/* Profile Header */}
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    {adminDetails.profilePictureUrl ? (
                      <div className="relative">
                        <Image
                          src={adminDetails.profilePictureUrl}
                          alt={adminDetails.fullName}
                          height={64}
                          width={64}
                          className="rounded-full border-2 border-gray-200 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setShowImagePreview(true)}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-xl font-semibold">
                        {adminDetails.fullName}
                      </h1>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {adminDetails.email}
                      </p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h2 className="text-lg font-semibold mb-3 flex items-center text-blue-600">
                        <Contact className="w-5 h-5 mr-2" />
                        Contact Information
                      </h2>
                      <div className="space-y-2">
                        <p className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          {adminDetails.contactNumber || "Not provided"}
                        </p>
                        <p className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          {adminDetails.email}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h2 className="text-lg font-semibold mb-3 flex items-center text-blue-600">
                        <Award className="w-5 h-5 mr-2" />
                        Qualifications
                      </h2>
                      <p className="text-sm text-gray-700">
                        {adminDetails.qualifications || "No qualifications listed"}
                      </p>
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h2 className="text-lg font-semibold mb-3 flex items-center text-blue-600">
                        <Calendar className="w-5 h-5 mr-2" />
                        Appointments
                      </h2>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          Total: {adminDetails.totalAppointments}
                        </p>
                        <p className="text-sm text-gray-700">
                          Last: {formatDate(adminDetails.lastAppointmentDate)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h2 className="text-lg font-semibold mb-3 flex items-center text-blue-600">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Blog Statistics
                      </h2>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          Published: {adminDetails.totalBlogsPublished}
                        </p>
                        <div className="flex items-center space-x-4">
                          <p className="text-sm text-gray-700 flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {adminDetails.totalLikesReceived}
                          </p>
                          <p className="text-sm text-gray-700 flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {adminDetails.totalViewsReceived}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h2 className="text-lg font-semibold mb-3 flex items-center text-blue-600">
                        <FileText className="w-5 h-5 mr-2" />
                        Admin Notes
                      </h2>
                      <div className="max-h-32 overflow-y-auto text-sm">
                        <div
                          className="text-gray-700 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: adminDetails.adminNotes,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm font-semibold flex items-center text-blue-600 mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Created At
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(adminDetails.createdAt)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm font-semibold flex items-center text-blue-600 mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last Updated
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(adminDetails.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetails;