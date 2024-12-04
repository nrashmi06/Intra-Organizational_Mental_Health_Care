import Badge from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Phone,
  User,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  X,
} from "lucide-react";

export interface ListenerApplication {
  applicationId: number;
  fullName: string;
  branch: string;
  semester: number;
  usn: string;
  phoneNumber: string;
  certificateUrl: string;
  applicationStatus: "APPROVED" | "REJECTED" | "PENDING";
  reasonForApplying: string;
  submissionDate: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

const ApplicationStatusBadge = ({
  status,
}: {
  status: ListenerApplication["applicationStatus"];
}) => {
  const statusVariants = {
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    PENDING: "bg-yellow-100 text-yellow-800",
  };

  const statusIcons = {
    APPROVED: <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />,
    REJECTED: <XCircle className="w-4 h-4 mr-2 text-red-600" />,
    PENDING: <Clock className="w-4 h-4 mr-2 text-yellow-600" />,
  };

  return (
    <div className="flex items-center">
      {statusIcons[status]}
      <Badge className={statusVariants[status]}>{status}</Badge>
    </div>
  );
};

const ListenerApplicationDetails: React.FC<{
  application: ListenerApplication;
  handleModalClose: () => void;
}> = ({ application, handleModalClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Modal Rendering */}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
          {/* Close Button */}
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>

          <Card className="w-full">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>
                Listener Application Details
                <ApplicationStatusBadge
                  status={application.applicationStatus}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Personal Information */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Full Name:</span>
                    <span className="ml-2">{application.fullName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Phone Number:</span>
                    <span className="ml-2">{application.phoneNumber}</span>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Branch:</span>
                    <span className="ml-2">{application.branch}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Semester:</span>
                    <span className="ml-2">{application.semester}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">USN:</span>
                    <span className="ml-2">{application.usn}</span>
                  </div>
                </div>
              </div>

              {/* Reason for Applying */}
              <div className="border-t pt-4">
                <div className="flex items-start">
                  <FileText className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                  <div>
                    <span className="font-semibold block mb-1">
                      Reason for Applying:
                    </span>
                    <p className="text-gray-700">
                      {application.reasonForApplying}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission and Review Details */}
              <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-semibold">Submission Date:</span>
                  <span className="ml-2">
                    {formatDate(application.submissionDate)}
                  </span>
                </div>

                {application.reviewedBy && (
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Reviewed By:</span>
                    <span className="ml-2">{application.reviewedBy}</span>
                  </div>
                )}

                {application.reviewedAt && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Review Date:</span>
                    <span className="ml-2">
                      {formatDate(application.reviewedAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Certificate Link */}
              {application.certificateUrl && (
                <div className="border-t pt-4 text-center">
                  <a
                    href={application.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    View Application
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListenerApplicationDetails;
