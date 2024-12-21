import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchAdminProfile } from "@/service/adminProfile/GetAdminProfile";
import { User, Mail, Phone, FileText, Calendar, Award } from "lucide-react";
import Image from "next/image";
import { AdminDetails } from "@/lib/types";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

  const AdminProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [adminDetails, setAdminDetails] = useState<AdminDetails>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const userId = typeof id === "string" ? parseInt(id) : null;

    if (userId && token) {
      fetchAdminDetails(userId);
    }
  }, [router.isReady, id, token]);

  const fetchAdminDetails = async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchAdminProfile(token, userId);
      setAdminDetails(data);
    } catch (error) {
      setError("Failed to fetch admin details. Please try again.");
      console.error("Error fetching admin details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!router.isReady) {
    return <div>Loading router...</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading admin details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!adminDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No admin details found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-purple-200 p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center space-x-6">
            {adminDetails.profilePictureUrl ? (
              <Image
                src={adminDetails.profilePictureUrl}
                alt={adminDetails.fullName}
                height={400}
                width={400}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">
                {adminDetails.fullName}
              </h1>
              <p className="text-white/80 text-sm flex items-center">
                <Mail className="w-4 h-4 mr-2" /> {adminDetails.email}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
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
          <p className="text-gray-700">
            {adminDetails.adminNotes || "No additional notes"}
          </p>
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
      </div>
    </div>
  );
}

AdminProfile.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default AdminProfile;
