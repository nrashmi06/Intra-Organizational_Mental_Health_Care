import {
  Pencil,
  Trash2,
  Calendar,
  Phone,
  GraduationCap,
  UserCircle,
  Hash,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Building2,
} from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar2";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListenerApplication } from "@/lib/types";
import { EditApplicationModal } from "./EditApplicationModal";

interface ApplicationDetailsProps {
  applicationData: ListenerApplication;
  onEdit: (data: any) => void;
  onDelete: () => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  applicationData,
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleEdit = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <div className="relative mb-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Application Details
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <p>
                      Submitted on{" "}
                      {new Date(
                        applicationData.submissionDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="border-2 hover:bg-blue-50 hover:border-blue-200 transition-all"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onDelete}
                    className="border-2 hover:bg-red-50 hover:border-red-200 text-red-600 transition-all"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
            <div
              className={`px-6 py-4 border-t ${
                applicationData.applicationStatus === "APPROVED"
                  ? "bg-green-50 border-green-100"
                  : applicationData.applicationStatus === "PENDING"
                  ? "bg-yellow-50 border-yellow-100"
                  : "bg-red-50 border-red-100"
              }`}
            >
              <div className="flex items-center gap-2">
                {applicationData.applicationStatus === "APPROVED" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : applicationData.applicationStatus === "PENDING" ? (
                  <Clock className="h-5 w-5 text-yellow-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium text-gray-800">
                  Status: {applicationData.applicationStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCircle className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: <UserCircle className="h-5 w-5" />,
                    label: "Full Name",
                    value: applicationData.fullName,
                  },
                  {
                    icon: <Building2 className="h-5 w-5" />,
                    label: "Branch",
                    value: applicationData.branch,
                  },
                  {
                    icon: <GraduationCap className="h-5 w-5" />,
                    label: "Semester",
                    value: applicationData.semester,
                  },
                  {
                    icon: <Hash className="h-5 w-5" />,
                    label: "USN",
                    value: applicationData.usn,
                  },
                  {
                    icon: <Phone className="h-5 w-5" />,
                    label: "Phone Number",
                    value: applicationData.phoneNumber,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-100 hover:border-purple-100 hover:bg-purple-50/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-purple-600">{item.icon}</div>
                      <div>
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="font-medium text-gray-900">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-7 space-y-1">
            {applicationData.certificateUrl && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Certificate
                  </h2>
                </div>
                <div className="relative h-72 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={applicationData.certificateUrl}
                    alt="Certificate"
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Reason for Applying
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {applicationData.reasonForApplying}
              </p>
            </div>
          </div>
        </div>

        <EditApplicationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          applicationData={applicationData}
          onEdit={onEdit}
        />
      </main>
    </div>
  );
};

export default ApplicationDetails;