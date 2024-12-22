import {
  X,
  Calendar,
  User,
  GraduationCap,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "../../ui/badge";
import Link from "next/link";
import { ListenerApplication } from "@/lib/types";
import { approveListener } from "@/service/listener/approveListener";
import { RootState } from "@/store";
import router from "next/router";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const ApplicationStatusBadge = ({
  status,
}: {
  status: ListenerApplication["applicationStatus"];
}) => {
  const statusVariants = {
    APPROVED: "bg-green-600",
    REJECTED: "bg-red-600",
    PENDING: "bg-yellow-600",
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

const ApplicationModal: React.FC<{
  data: ListenerApplication;
  handleClose: () => void;
  action?: string;
  setSuccessMessage?: (message: string | null) => void;
}> = ({ data, handleClose, action, setSuccessMessage }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const handleStatusChange = async (
    applicationId: string,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    try {
      const response = await approveListener(
        applicationId,
        accessToken,
        newStatus
      );
      if (response?.status === 200) {
        const message = `Listener status updated to ${newStatus}`;
        setSuccessMessage?.(message);
        setTimeout(() => {
          setSuccessMessage?.(null);
          router.reload();
        }, 2000);
      } else {
        console.error(
          `Error updating listener status to ${newStatus}:`,
          response
        );
      }
    } catch (error) {
      console.error(`Error updating listener status to ${newStatus}:`, error);
    }
  };
  const renderActionButton = () => {
    if (!action) return null;

    if (action === "REJECTED") {
      return (
        <button
          onClick={() => handleStatusChange(data.applicationId, "APPROVED")}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Approve Listener
        </button>
      );
    }

    if (action === "APPROVED") {
      return (
        <button
          onClick={() => handleStatusChange(data.applicationId, "REJECTED")}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Reject Listener
        </button>
      );
    } else {
      return (
        <div className="flex gap-4">
          <Button
            onClick={() => handleStatusChange(data.applicationId, "APPROVED")}
            className="bg-green-600 flex items-center"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve Listener
          </Button>
          <Button
            onClick={() => handleStatusChange(data.applicationId, "REJECTED")}
            className="bg-red-600 flex items-center"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject Listener
          </Button>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
          <Card className="w-full">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>
                Listener Application Details
                <ApplicationStatusBadge status={data.applicationStatus} />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Rest of the JSX remains exactly the same, just replace 'application' with 'data' */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Full Name:</span>
                    <span className="ml-2">{data.fullName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Phone Number:</span>
                    <span className="ml-2">{data.phoneNumber}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Branch:</span>
                    <span className="ml-2">{data.branch}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Semester:</span>
                    <span className="ml-2">{data.semester}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">USN:</span>
                    <span className="ml-2">{data.usn}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-start">
                  <FileText className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                  <div>
                    <span className="font-semibold block mb-1">
                      Reason for Applying:
                    </span>
                    <p
                      className="text-gray-700 overflow-auto max-h-32 scrollbar-thin scrollbar-thumb-gray-400"
                      style={{ maxHeight: "8rem" }}
                    >
                      {data.reasonForApplying}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="font-semibold">Submission Date:</span>
                  <span className="ml-2">
                    {formatDate(data.submissionDate)}
                  </span>
                </div>

                {data.reviewedBy && (
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Reviewed By:</span>
                    <span className="ml-2">{data.reviewedBy}</span>
                  </div>
                )}

                {data.reviewedAt && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Review Date:</span>
                    <span className="ml-2">{formatDate(data.reviewedAt)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                {data.certificateUrl && (
                  <Link
                    href={data.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    View Certificate
                  </Link>
                )}
                {action && (
                  <div className="flex justify-end">{renderActionButton()}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
