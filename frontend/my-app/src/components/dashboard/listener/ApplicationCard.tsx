import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Application } from "@/lib/types";

interface ApplicationCardProps {
  application: Application;
  statusFilter: string;
  onViewDetails: (applicationId: number) => void;
  getStatusColor: (status: string) => string;
}

export function ApplicationCard({
  application,
  statusFilter,
  onViewDetails,
  getStatusColor,
}: ApplicationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg h-min transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Application ID</p>
              <p className="font-semibold">{application.applicationId}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                application.applicationStatus
              )}`}
            >
              {application.applicationStatus.charAt(0).toUpperCase() +
                application.applicationStatus.slice(1).toLowerCase()}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="font-semibold">{application.fullName}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Semester</p>
            <p className="font-semibold">{application.semester}</p>
          </div>

          <Button
            onClick={() => onViewDetails(application.applicationId)}
            className="w-full"
            variant="outline"
          >
            {statusFilter === "PENDING" ? "Review Application" : "View Details"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}