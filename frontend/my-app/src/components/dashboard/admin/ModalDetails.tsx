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
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchAdminProfile } from "@/service/adminProfile/GetAdminProfile";
import { AdminDetails } from "@/lib/types";
import Image from "next/image";

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
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center border-b pb-4">
            Admin Details
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-64">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : !adminDetails ? (
            <div className="text-center p-4">No details available.</div>
          ) : (
            <>
              <div className="flex items-center space-x-6">
                {adminDetails.profilePictureUrl ? (
                  <Image
                    src={adminDetails.profilePictureUrl}
                    alt={adminDetails.fullName}
                    height={400}
                    width={400}
                    className="w-24 h-24 rounded-full border-2 border-gray object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold ">
                    {adminDetails.fullName}
                  </h1>
                  <p className="text-sm flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> {adminDetails.email}
                  </p>
                </div>
              </div>
              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Contact className="w-5 h-5 mr-2 text-blue-600" />
                    Contact Information
                  </h2>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      {adminDetails.contactNumber || "Not provided"}
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      {adminDetails.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Qualifications
                  </h2>
                  <p className="text-gray-700">
                    {adminDetails.qualifications || "No qualifications listed"}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Admin Notes
                </h2>
                <div className="max-h-32 overflow-y-auto">
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: adminDetails.adminNotes,
                    }}
                  />
                </div>
              </div>
              <div className="p-6 bg-gray-100 grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Created At
                  </h3>
                  <p className="text-gray-600">
                    {formatDate(adminDetails.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Last Updated
                  </h3>
                  <p className="text-gray-600">
                    {formatDate(adminDetails.updatedAt)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetails;
