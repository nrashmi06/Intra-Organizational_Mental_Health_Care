import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { GetByApproval } from "@/service/listener/getByStatus";
import { fetchApplication } from "@/service/listener/fetchApplication";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ListenerDetailsForAdmin from "@/components/dashboard/listener/ModalApplication";
import { ListenerApplication } from "@/lib/types";
import InlineLoader from "@/components/ui/inlineLoader";
import Pagination3 from "@/components/ui/pagination3";

export function ListenerApplicationsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState<ListenerApplication[]>([]);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [applicationModal, setApplicationModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ListenerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  const fetchListenersByStatus = useCallback(
    async (status: "PENDING" | "APPROVED" | "REJECTED") => {
      try {
        setLoading(true);
        const response = await GetByApproval(accessToken, status);
        
        // Handle null response
        if (!response) {
          setApplications([]);
          setLoading(false);
          return;
        }

        setApplications(response.data || []); // Ensure we always set an array
        setStatusFilter(status);
      } catch (error) {
        console.error("Error fetching listeners:", error);
        setApplications([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    fetchListenersByStatus("PENDING");
  }, [fetchListenersByStatus]);

  const handleFilterChange = (status: string) => {
    setSearchQuery(""); // Reset search when changing filters
    setCurrentPage(1); // Reset pagination
    setStatusFilter(status);
    fetchListenersByStatus(status as "PENDING" | "APPROVED" | "REJECTED");
  };

  const handleApplicationModal = async (applicationId: string) => {
    try {
      const applicationData = await fetchApplication(accessToken, applicationId);
      setSelectedApplication(applicationData);
      setApplicationModal(true);
    } catch (err) {
      console.error("Error fetching application details:", err);
    }
  };

  // Only filter if we have applications
  const filteredApplications = applications.length > 0 
    ? applications.filter((application) => {
        const matchesSearch =
          application.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          application.applicationId.toString().toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "PENDING" ||
          application.applicationStatus === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  // Only paginate if we have filtered results
  const paginatedApplications = filteredApplications.length > 0
    ? filteredApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Render loading state
  if (loading) {
    return <InlineLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No applications found</p>
        </div>
      ) : paginatedApplications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No matching applications found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:min-h-[400]">
          {paginatedApplications.map((application) => (
            <Card
              key={application.applicationId}
              className="overflow-hidden hover:shadow-lg h-min transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">
                        Application ID
                      </p>
                      <p className="font-semibold">
                        {application.applicationId}
                      </p>
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
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p className="font-semibold">{application.fullName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      Semester
                    </p>
                    <p className="font-semibold">{application.semester}</p>
                  </div>

                  <Button
                    onClick={() => handleApplicationModal(application.applicationId)}
                    className="w-full"
                    variant="outline"
                  >
                    {statusFilter === "PENDING"
                      ? "Review Application"
                      : "View Details"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Only show pagination if we have applications */}
      {applications.length > 0 && filteredApplications.length > 0 && (
        <Pagination3
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          filteredElements={filteredApplications}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Modal */}
      {applicationModal && selectedApplication && (
        <ListenerDetailsForAdmin
          data={selectedApplication}
          handleClose={() => {
            setApplicationModal(false);
            setSelectedApplication(null);
          }}
          action={statusFilter}
          setSuccessMessage={setSuccessMessage}
        />
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all scale-in-center">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Success!</h3>
              <p className="text-gray-600">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}