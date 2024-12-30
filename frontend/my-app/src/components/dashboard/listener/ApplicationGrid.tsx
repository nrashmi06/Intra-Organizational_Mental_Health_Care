import { Application } from "@/lib/types";
import { ApplicationCard } from "./ApplicationCard";
import InlineLoader from "@/components/ui/inlineLoader";

interface ApplicationsGridProps {
  loading: boolean;
  applications: Application[];
  statusFilter: string;
  onViewDetails: (applicationId: number) => void;
  getStatusColor: (status: string) => string;
}

export function ApplicationsGrid({
  loading,
  applications,
  statusFilter,
  onViewDetails,
  getStatusColor,
}: ApplicationsGridProps) {
  if (loading) {
    return <InlineLoader />;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-500">No applications found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:min-h-[400]">
      {applications.map((application) => (
        <ApplicationCard
          key={application.applicationId}
          application={application}
          statusFilter={statusFilter}
          onViewDetails={onViewDetails}
          getStatusColor={getStatusColor}
        />
      ))}
    </div>
  );
}
