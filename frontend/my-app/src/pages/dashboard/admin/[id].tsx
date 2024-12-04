// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { getAdminByUserID } from "@/service/adminProfile/getAdminByUserID";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// interface AdminDetails {
//   adminId: number;
//   userId: number;
//   fullName: string;
//   adminNotes: string;
//   qualifications: string;
//   contactNumber: string;
//   email: string;
//   profilePictureUrl: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const AdminProfilePage: React.FC = () => {
//   const router = useRouter();
//   const userId = Number(router.query.userId); // Extract and convert userId from the URL
//   const token = useSelector((state: RootState) => state.auth.accessToken); // Get token from Redux store

//   const [adminDetails, setAdminDetails] = useState<AdminDetails | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (userId && token) {
//       fetchAdminDetails();
//     }
//   }, [userId, token]);

//   const fetchAdminDetails = async () => {
//     setLoading(true);
//     setError(null);
//     console.log("Fetching admin details for userId:", userId);
//     try {
//       const data = await getAdminByUserID(userId, token);
//       setAdminDetails(data);
//     } catch (error) {
//       setError("Failed to fetch admin details. Please try again.");
//       console.log("Error fetching admin details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-red-500">{error}</p>
//         <Button onClick={fetchAdminDetails}>Retry</Button>
//       </div>
//     );
//   }

//   if (!adminDetails) {
//     return null;
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen p-8">
//       <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
//         <div className="flex items-center mb-6">
//           <h1>Hello</h1>
//           <Image
//             src={adminDetails.profilePictureUrl}
//             alt={adminDetails.fullName}
//             className="h-32 w-32 rounded-full border border-gray-300 shadow-sm mr-6"
//           />
//           <div>
//             <h1 className="text-2xl font-bold">{adminDetails.fullName}</h1>
//             <p className="text-gray-600">{adminDetails.email}</p>
//             <p className="text-gray-600">
//               Contact: {adminDetails.contactNumber}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h2 className="text-lg font-semibold">Admin Notes</h2>
//             <p className="text-gray-700">{adminDetails.adminNotes}</p>
//           </div>

//           <div>
//             <h2 className="text-lg font-semibold">Qualifications</h2>
//             <p className="text-gray-700">{adminDetails.qualifications}</p>
//           </div>
//         </div>

//         <div className="mt-6">
//           <h2 className="text-lg font-semibold">Timestamps</h2>
//           <p className="text-gray-600">
//             Created At: {new Date(adminDetails.createdAt).toLocaleString()}
//           </p>
//           <p className="text-gray-600">
//             Updated At: {new Date(adminDetails.updatedAt).toLocaleString()}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProfilePage;
// pages/dashboard/admin/[id].tsx
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { getAdminByUserID } from "@/service/adminProfile/getAdminByUserID";

// export default function AdminProfile() {
//   const router = useRouter();
//   const { id } = router.query; // Get id from URL
//   const token = useSelector((state: RootState) => state.auth.accessToken);
//   const [adminDetails, setAdminDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Debug logs
//   console.log("Component rendered with:", {
//     id: id,
//     token: token ? "exists" : "missing",
//     query: router.query,
//   });

//   useEffect(() => {
//     console.log("useEffect triggered");
//     // Wait for router to be ready and have query parameters
//     if (!router.isReady) return;

//     // Ensure id exists and is not an array
//     const userId = typeof id === "string" ? parseInt(id) : null;

//     if (userId && token) {
//       console.log("Conditions met, fetching admin details");
//       fetchAdminDetails(userId);
//     } else {
//       console.log("Missing requirements:", { userId, hasToken: !!token });
//     }
//   }, [router.isReady, id, token]);

//   const fetchAdminDetails = async (userId: number) => {
//     setLoading(true);
//     setError(null);
//     console.log("Fetching admin details for userId:", userId);

//     try {
//       const data = await getAdminByUserID(userId, token);
//       console.log("Received admin details:", data);
//       setAdminDetails(data);
//     } catch (error) {
//       setError("Failed to fetch admin details. Please try again.");
//       console.error("Error fetching admin details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!router.isReady) {
//     return <div>Loading router...</div>;
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p>Loading admin details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-red-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       {adminDetails ? (
//         <div>
//           <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>
//           <pre>{JSON.stringify(adminDetails, null, 2)}</pre>
//         </div>
//       ) : (
//         <div>No admin details found</div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getAdminByUserID } from "@/service/adminProfile/getAdminByUserID";
import { User, Mail, Phone, FileText, Calendar, Award } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar2";

interface AdminDetails {
  adminId: number;
  userId: number;
  fullName: string;
  adminNotes: string;
  qualifications: string;
  contactNumber: string;
  email: string;
  profilePictureUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProfile() {
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
      const data = await getAdminByUserID(userId, token);
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
    <div>
      <Navbar />
      <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl mx-auto my-8">
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
